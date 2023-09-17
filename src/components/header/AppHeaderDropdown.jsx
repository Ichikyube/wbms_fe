import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import Avatar from "@mui/material/Avatar";
import {
  CButton,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from "@coreui/react";

import { LinkContainer } from "react-router-bootstrap";
import { useAuth } from "../../context/AuthContext";

const AppHeaderDropdown = () => {
  const path = process.env.REACT_APP_WBMS_BACKEND_IMG_URL;
  const { userInfo, logout } = useAuth();

  const handleSignout = () => {
    localStorage.clear();
    logout();
  };

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <Avatar>
          <img
            src={`${path}${userInfo.profilePic}`}
            alt="Uploaded Preview"
            style={{
              width: "40px",
              height: "40px",
            }}
          />
        </Avatar>
        <span style={{position:"absolute", top:"32px"}}><strong>{userInfo?.name ? userInfo.name : null}</strong></span>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">
          Account

        </CDropdownHeader>

        <LinkContainer to="/profile">
          <CDropdownItem id="username">
            <FaUserCircle className="me-2" />
            Profile
          </CDropdownItem>
        </LinkContainer>

        <CDropdownDivider />
        <CDropdownItem>
          <CButton
            color="white"
            // size="md"
            // variant="outline"
            onClick={handleSignout}>
            <FaSignOutAlt className="me-2" />
            Sign Out
          </CButton>
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;
