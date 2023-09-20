import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserMatrixContextProvider } from "../context/UserMatrixContext";
import {
  AppContent,
  AppSidebar,
  AppFooter,
  AppHeader,
} from "../components/index";

const DefaultLayout = () => {
  return (
    <div>
      <ToastContainer />
      <UserMatrixContextProvider>
        <AppSidebar />
        <div className="wrapper d-flex flex-column min-vh-100 bg-light">
          <AppHeader />
          <div className="body flex-grow-1 px-3">
            <AppContent />
          </div>
          <AppFooter />
        </div>
      </UserMatrixContextProvider>
    </div>
  );
};

export default DefaultLayout;
