import { memo, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarToggler,
} from "@coreui/react";
import { useMatrix } from "../context/UserMatrixContext";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

import { AppSidebarNav } from "./AppSidebarNav";
import { backdateTemplateNav } from "../_nav";
// sidebar nav config
import NavList from "../_nav";

import { setSidebar } from "../slices/appSlice";
import { masterDataList, userManagementList } from "../constants/attributeListObj";

const AppSidebar = () => {
  const { sidebar } = useSelector((state) => state.app);
  const access = Object.keys(JSON.parse(localStorage.getItem("userAccess")));
  const cNav = access.includes("Transaction")?['WB',...access]:access;
  const bNav = masterDataList.some(value => access.includes(value.toLowerCase()))?['Base', 'MD',...cNav]:['Base',...cNav];
  const aNav = ["MD"].some(item=>bNav.includes(item.toLowerCase()))?['ADMIN',...bNav]:[...bNav];

  const { backDatedTemplate } = useMatrix();
  const [tempAdded, setTempAdded] = useState(false);
  // NavList[6].items = NavList[6].items.filter(item => access.includes(item.resource));
  const navList = NavList.filter(item => aNav.includes(item.resource));
  useEffect(() => {
    if (backDatedTemplate && !tempAdded) {
      setTempAdded(true);
      navList[2].items = [...navList[2].items, backdateTemplateNav];
    } else if (!backDatedTemplate && tempAdded) {
      setTempAdded(false);
      navList[2].items = navList[2].items.filter(item => item.name !== "Backdate Template");
    }
  }, [backDatedTemplate, tempAdded]);

  const dispatch = useDispatch();

  return (
    <CSidebar
      position="fixed"
      unfoldable={sidebar?.unfoldable}
      visible={sidebar?.show}
      onVisibleChange={(visible) => {
        dispatch(setSidebar({ show: visible }));
      }}>
      <CSidebarBrand className="d-none d-md-flex" to="/">
        <img
          alt="DSN Logo"
          className="sidebar-brand-full"
          height={64}
          src="assets/logo_white.png"
        />
        <img
          alt="DSN Logo"
          className="sidebar-brand-narrow"
          height={64}
          src="assets/logo_small.png"
        />
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={NavList} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() =>
          dispatch(setSidebar({ unfoldable: !sidebar.unfoldable }))
        }
      />
    </CSidebar>
  );
};

export default memo(AppSidebar);
