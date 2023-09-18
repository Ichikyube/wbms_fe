import { useRef, useState, useEffect } from "react";

import { Form, Button, Row, InputGroup, Image } from "react-bootstrap";
import Cookies from "js-cookie";
import FormContainer from "../../../components/FormContainer";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FaUser, FaLock } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
const initialValues = { username: "", password: "" };

const SignIn = () => {
  const userRef = useRef();
  const {login} = useAuth();
  const [values, setValues] = useState(initialValues);


  useEffect(() => {
    userRef.current.focus();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    login(values);
  };

  const handleInputChange = (e, type = 1) => {
    const { value, name } = e.target;

    if (type === 1) {
      setValues((prev) => {
        return { ...prev, [name]: value };
      });
    } else if (type === 2) {
      setValues((prev) => {
        prev.jsonData = { ...prev.jsonData, [name]: value };
        return { ...prev };
      });
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-vh-100 d-flex flex-row align-items-center">
      <FormContainer>
        <Form onSubmit={handleSubmit}>
          <p className="text-center mb-2">
            <Image
              src="assets/dsn.png"
              style={{
                width: "200px",
                height: "100px",
              }}
            />
          </p>
          <p
            className="title text-center mb-4 "
            style={{ fontSize: "48px", fontWeight: "bold" }}
          >
            <span>WBMS </span>Administrator
          </p>
          <InputGroup className="mb-3">
            <InputGroup.Text>
              <FaUser />
            </InputGroup.Text>
            <Form.Control
              name="username"
              ref={userRef}
              placeholder="Masukkan Username"
              autoComplete="username"
              value={values.username}
              onChange={(e) => handleInputChange(e)}
              style={{ fontSize: "23px", height: "55px" }}
              required
            />
          </InputGroup>
          <InputGroup className="mb-4">
            <InputGroup.Text>
              <FaLock />
            </InputGroup.Text>
            <Form.Control
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              autoComplete="password"
              value={values.password}
              onChange={(e) => handleInputChange(e)}
              style={{ fontSize: "23px", height: "55px" }}
              required
            />
            <InputGroup.Text>
              <Button onClick={togglePasswordVisibility} variant="link">
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </Button>
            </InputGroup.Text>
          </InputGroup>
          <Row>
            <Button
              type="submit"
              className="px-4 text-center w-90"
              style={{ fontSize: "20px", fontWeight: "bold" }}
            >
              LOGIN
            </Button>
          </Row>
        </Form>
      </FormContainer>
    </div>
  );
};

export default SignIn;
