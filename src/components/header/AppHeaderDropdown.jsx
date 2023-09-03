import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { clearCredentials, clearConfigs, clearSidebar } from "../../slices/appSlice";
import { useSignoutMutation } from "../../slices/authApiSlice";

import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import Avatar from "@mui/material/Avatar";
import { deepOrange } from "@mui/material/colors";
import {
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from "@coreui/react";

import { LinkContainer } from "react-router-bootstrap";
import AuthContext from "../../components/Auth/context/authProvider";
import { useContext } from "react";

const AppHeaderDropdown = () => {
  const { userInfo } = useSelector((state) => state.app);
  const [signout] = useSignoutMutation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignout = async () => {

    try {
      const response = await signout().unwrap();

      if (!response.status) {
        console.log(response.message);
        console.log(response.logs);

        toast.error(response.message);

        return;
      }
      toast.success(response.message);
      dispatch(clearCredentials());
      dispatch(clearConfigs());
      dispatch(clearSidebar());
      localStorage.clear();
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <Avatar sx={{ bgcolor: deepOrange[500] }}>N</Avatar>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">
          Account{" "}
          <strong>{userInfo?.profile ? userInfo.profile.name : null}</strong>
        </CDropdownHeader>

        <LinkContainer to="/profile">
          <CDropdownItem id="username">
            <FaUserCircle className="me-2" />
            Profile
          </CDropdownItem>
        </LinkContainer>

        <CDropdownDivider />
        <CDropdownItem href="#" onClick={handleSignout}>
          <FaSignOutAlt className="me-2" />
          Sign Out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;
