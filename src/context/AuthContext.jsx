import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "react-toastify";
import {
  setCredentials,
  clearCredentials,
  setConfigs,
  clearConfigs,
  clearSidebar,
} from "./../slices/appSlice";

import {
  useSigninMutation,
  useSignoutMutation,
} from "./../slices/authApiSlice";

const AuthContext = createContext({
  userInfo: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const { userInfo } = useSelector((state) => state.app);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";
  const [toastmssg, setToastmssg] = useState({});
  const [errMsg, setErrMsg] = useState("");

  const dispatch = useDispatch();
  const [signin] = useSigninMutation();
  const [signout] = useSignoutMutation();

  const route = location.pathname;
  const login = async (values) => {
    try {
      const response = await signin(values).unwrap();
      console.log(response);
      if (!response.status) {
        console.log(response.message);
        console.log(response.logs);

        await toast.promise(
          new Promise((resolve) => setTimeout(resolve, 500)),
          {
            error: response.message,
          }
        );
        return;
      }
      // Get the cookie string from the response headers
      console.log("response from signin:", response);
      const at = response?.data?.tokens?.access_token;
      localStorage.setItem("wbms_at", at);
      dispatch(setCredentials({ ...response.data.user }));
      navigate(from, { replace: true });
      // setToastmssg(`Selamat datang ${response.data.user.name}`)
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      toast.error(errMsg);
    }
  };
  const logout = async () => {
    try {
      const response = await signout().unwrap();
      if (!response.status) {
        console.log(response.message);
        console.log(response.logs);
        await toast.promise(
          new Promise((resolve) => setTimeout(resolve, 500)),
          {
            error: response.message,
          }
        );
        return;
      }
      navigate("/");
      setToastmssg(response.message);
      // dispatch(clearSidebar());
      dispatch(clearCredentials());
      dispatch(clearConfigs());
    } catch (err) {
      console.log(err?.data?.message || err.error);
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (toastmssg) toast.success(toastmssg);
    setToastmssg("");
  }, [toastmssg]);
  useEffect(() => {

    if (userInfo && (route === "/signin" || route === "/")) {
      navigate(from);
    } 
  }, [userInfo, route, navigate, from]);

  return (
    <AuthContext.Provider value={{ userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
