import React, { useState } from "react";
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
import { cilMenu } from "@coreui/icons";

import { AppBreadcrumb } from "./index";
import { AppHeaderDropdown } from "./header/index";
import "react-toastify/dist/ReactToastify.css";
import { setSidebar } from "../slices/appSlice";
import NotificationList from "./NotificationList";
import toast, { Toaster } from "react-hot-toast";

const AppHeader = () => {
  const dispatch = useDispatch();
  const { sidebar } = useSelector((state) => state.app);
  const { userInfo } = useSelector((state) => state.app);

  return (
    userInfo && (
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
            <CNavItem>
              <CNavLink to="/profile" component={NavLink}>
                Settings
              </CNavLink>
            </CNavItem>
          </CHeaderNav>
          <CHeaderNav>
            <CNavItem>
              <NotificationList />
            </CNavItem>
          </CHeaderNav>
          <hr
            className="mx-3"
            style={{ height: "15px", borderLeft: "2px solid grey" }}
          />
          <span>
            <strong>{userInfo?.name ? userInfo.name : null}</strong>
          </span>
          <CHeaderNav className="ms-3">
            <AppHeaderDropdown />
          </CHeaderNav>
        </CContainer>
        <CHeaderDivider />
        <CContainer fluid>
          <AppBreadcrumb />
        </CContainer>
      </CHeader>
    )
  );
};

export default AppHeader;
