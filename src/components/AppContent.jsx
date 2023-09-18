import React, { Suspense, useContext, useEffect } from "react";
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { CContainer, CSpinner } from "@coreui/react";
import { UserMatrixContextProvider } from "../context/UserMatrixContext";
import { useAuth } from "../context/AuthContext";
// routes config
import routes from "../routes";

const AppContent = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  useEffect(() => {
    if (!userInfo) {
      navigate("/signin");
    }
  }, [navigate, userInfo]);

  //role user apa, apakah juga terdaftar sebagai penanggung jawab usermatrix
  //hanya user yang melakukan request yang bisa menggunakan temporari konfig.
  return (
    <CContainer fluid>
      <Suspense fallback={<CSpinner color="primary" />}>
        <UserMatrixContextProvider>
          <Routes>
            {routes.map((route, idx) => {
              return (
                route.element && (
                  <Route
                    key={idx}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    element={<route.element />}
                  />
                )
              );
            })}
            <Route path="/" exact element={<Navigate to="dashboard" replace />} />
          </Routes>
        </UserMatrixContextProvider>
      </Suspense>
    </CContainer>
  );
};

export default React.memo(AppContent);
