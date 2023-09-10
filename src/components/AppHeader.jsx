import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Navbar, Image } from "react-bootstrap";
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilBell, cilEnvelopeOpen, cilList, cilMenu } from "@coreui/icons";

import { AppBreadcrumb } from "./index";
import { AppHeaderDropdown } from "./header/index";
import { logo } from "../assets/brand/logo";

import { deepOrange, deepPurple } from "@mui/material/colors";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setSidebar } from "../slices/appSlice";
import NotificationList from "./NotificationList";

const AppHeader = () => {
  const dispatch = useDispatch();
  const { sidebar } = useSelector((state) => state.app);
  // const sidebarShow = useSelector((state) => state.sidebarShow);

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch(setSidebar({ show: !sidebar.show }))}>
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          {/* <CIcon icon={logo} height={48} alt="Logo" /> */}
          <Image height={48} src="assets/dsn.png" />
          <Navbar.Brand> WBMS</Navbar.Brand>
        </CHeaderBrand>
        <CHeaderNav className="d-none d-md-flex me-auto">
          <CNavItem>
            <CNavLink to="/dashboard" component={NavLink}>
              Dashboard
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink to="/pks-transaction" component={NavLink}>
              Transaksi WB
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        
        <CHeaderNav>
          <CNavItem>
              <NotificationList />
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav className="ms-3">
          {/* <ToastContainer position="top-right" autoClose={3000} />{" "} */}
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider />
      <CContainer fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  );
};

export default AppHeader;
