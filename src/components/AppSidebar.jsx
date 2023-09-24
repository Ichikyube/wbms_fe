import { memo, useEffect } from "react";
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

const AppSidebar = () => {
  const { sidebar } = useSelector((state) => state.app);
  const { backDatedTemplate } = useSelector((state) => state.tempConfigs);
  const navSet = new Set(NavList);
  /**
 * Jembatan Timbang
    PKS
    R ead(Report), Create(Transaction), Edit(Transaction), Delete(Transaction)

    T30
     Read(Report), Create(Transaction), Edit(Transaction), Delete(Transaction)

    Labanan
      Read(Report), Create(Transaction), Edit(Transaction), Delete(Transaction)


    MasterData
      Read, Create, Edit, Delete

    User 
      Create, Edit, Delete

    Role
      Create, Edit, Delete

    Config
    E dit, Read, Create Request
 */

  useEffect(() => {
    if (backDatedTemplate)
      NavList[2].items = [...NavList[2].items, backdateTemplateNav];
  }, [backDatedTemplate]);

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
