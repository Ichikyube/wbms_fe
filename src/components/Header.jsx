import { useSelector, useDispatch } from "react-redux";
// import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { toast } from "react-toastify";

import { clearCredentials } from "../slices/appSlice";
import { useSignoutMutation } from "../slices/authApiSlice";
import Cookies from "js-cookie";
import { FaSignInAlt } from "react-icons/fa";


const Header = () => {

  return (
    <header>
      <Navbar
        bg="dark"
        data-bs-theme="dark"
        expand="lg"
        fixed="top"
        collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>Weighbridge Management System</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          {/* <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <>
                <LinkContainer to="/signin">
                  <Nav.Link>
                    <FaSignInAlt /> Sign In
                  </Nav.Link>
                </LinkContainer>
              </>
            </Nav>
          </Navbar.Collapse> */}
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
