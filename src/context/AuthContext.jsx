import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchConfigsData } from "../slices/tempConfigSlice";
import { toast } from "react-toastify";
import {
  setCredentials,
  clearCredentials,
  setConfigs,
  clearConfigs,
  clearSidebar,
} from "./../slices/appSlice";
import { getEnvInit } from "../configs";

import {
  useSigninMutation,
  useSignoutMutation,
} from "./../slices/authApiSlice";

const AuthContext = createContext({
  isAuth: false,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const { userInfo } = useSelector((state) => state.app);
  const token = localStorage.getItem("wbms_at");
  const isAuth = userInfo && token;
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
      const { status, message, logs, data } = response || {};
      if (!status) {
        console.log(message);
        console.log(logs);
        await toast.promise(Promise.resolve(), { error: message });
        return;
      }
      setIsLoading(true);


      (async () => {
        await dispatch(fetchConfigsData());
        await getEnvInit().then((result) => {
          dispatch(setConfigs({ ...result }));
        });
      })();
      setIsLoading(false);
      dispatch(setCredentials({ ...response?.data.user }));
      // Get the cookie string from the response headers
      // console.log("response from signin:", response);
      const at = data.tokens?.access_token;
      const rt = data.tokens?.refresh_token;
      localStorage.setItem("wbms_at", at);
      document.cookie = "rt=" + rt + ";SameSite=Lax";
      
      navigate(from, { replace: true });
      // setToastmssg(`Selamat datang ${response?.data.user.name}`)
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
      if (!response?.status) {
        console.log(response?.message);
        console.log(response?.logs);
        await toast.promise(
          new Promise((resolve) => setTimeout(resolve, 500)),
          {
            error: response?.message,
          }
        );
        return;
      }
      (() => {
        dispatch(clearSidebar());
        dispatch(clearCredentials());
        dispatch(clearConfigs());
        navigate("/");
      })();
      localStorage.clear();
      setToastmssg(response?.message);
    } catch (err) {
      console.log(err?.data?.message || err.error);
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (toastmssg) toast.success(toastmssg);
    setToastmssg("");
  }, [toastmssg]);
  // useEffect(() => {
  //   if (!userInfo) {
  //     navigate("/signin");
  //   }
  // }, [navigate, userInfo]);
  useEffect(() => {
    if (userInfo && (route === "/signin" || route === "/")) {
      navigate(from);
    }
  }, [userInfo, route, navigate, from]);

  return (
    <AuthContext.Provider value={{ isAuth, login, logout }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}
