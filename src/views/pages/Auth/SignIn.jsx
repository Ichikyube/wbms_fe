import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Form,
  Button,
  Row,
  Col,
  Container,
  CardGroup,
  Card,
  InputGroup,
  Image,
} from "react-bootstrap";

import FormContainer from "../../../components/FormContainer";

import { useSigninMutation } from "../../../slices/authApiSlice";
import { setCredentials } from "../../../slices/appSlice";

import { FaUser, FaLock } from "react-icons/fa";

const initialValues = { username: "", password: "" };

const SignIn = () => {
  const { userInfo } = useSelector((state) => state.app);
  const [signin, { isLoading }] = useSigninMutation();

  const [values, setValues] = useState(initialValues);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await signin(values).unwrap();

      console.log("signin");
      console.log(res);

      if (!res.status) {
        console.log(res.message);
        console.log(res.logs);

        toast.error(res.message);

        return;
      }

      dispatch(setCredentials({ ...res.data.user }));

      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
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

  useEffect(() => {
    if (userInfo) navigate("/dashboard");

    return () => {};
  }, [navigate, userInfo]);

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
              placeholder="Masukkan Username"
              autoComplete="username"
              value={values.username}
              onChange={(e) => handleInputChange(e)}
              style={{ fontSize: "23px", height: "55px" }}
            />
          </InputGroup>
          <InputGroup className="mb-4">
            <InputGroup.Text>
              <FaLock />
            </InputGroup.Text>
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              autoComplete="password"
              value={values.password}
              onChange={(e) => handleInputChange(e)}
              style={{ fontSize: "23px", height: "55px" }}
            />
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
