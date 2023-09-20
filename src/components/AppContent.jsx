import React, { Suspense, useContext, useEffect } from "react";
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { CContainer, CSpinner } from "@coreui/react";
import { useAuth } from "../context/AuthContext";
// routes config
import routesList from "../routes";

const AppContent = () => {
  const routes = routesList.filter(item=>!item.name.includes("Backdate") )
  //apabila backdate tidak aktif maka filter backdate
  //buat filter disini juga buat route sesuai hak akses
  //role user apa, apakah juga terdaftar sebagai penanggung jawab usermatrix
  //hanya user yang melakukan request yang bisa menggunakan temporari konfig.
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  useEffect(() => {
    if (!userInfo) {
      navigate("/signin");
    }
  }, [navigate, userInfo]);

  return (
    <CContainer fluid>
      <Suspense fallback={<CSpinner color="primary" />}>

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
      </Suspense>
    </CContainer>
  );
};

export default React.memo(AppContent);
