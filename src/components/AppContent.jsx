import React, { Suspense, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { CContainer, CSpinner } from "@coreui/react";
import { useAuth } from "../context/AuthContext";
import { useMatrix } from "../context/UserMatrixContext";
// routes config
import routesList, {
  backdateFormRoutes,
  backdateTemplateRoute,
  editTransactionRoute,
  manualEntryRoutes,
} from "../routes";

const AppContent = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const { backDatedForm, backDatedTemplate, editTransaction, manualEntryWB } =
    useMatrix;

  const ConfigList = {
    backDatedForm,
    backDatedTemplate,
    editTransaction,
    manualEntryWB,
  };
  const ConfigMap = {
    backDatedForm: backdateFormRoutes,
    backDatedTemplate: backdateTemplateRoute,
    editTransaction: editTransactionRoute,
    manualEntryWB: manualEntryRoutes,
  };
  const [routes, setRoutes] = useState(routesList);
  useEffect(() => {
    const tempConfigList = Object.keys(ConfigList).filter(
      (key) => ConfigList[key]
    );

    // Filter the keys in ConfigMap based on tempConfigList
    const includedConfigMap = Object.keys(ConfigMap)
      .filter((key) => tempConfigList.includes(key))
      .reduce((acc, key) => {
        acc[key] = ConfigMap[key];
        return acc;
      }, {});

    // Flatten the values from includedConfigMap into an array
    const newRoutes = Object.values(includedConfigMap).flat();

    // Assuming `routeList` is an existing array of routes
    setRoutes(routesList.concat(newRoutes));
  }, ConfigList);

  //apabila backdate tidak aktif maka filter backdate
  //buat filter disini juga buat route sesuai hak akses
  //role user apa, apakah juga terdaftar sebagai penanggung jawab usermatrix
  //hanya user yang melakukan request yang bisa menggunakan temporari konfig.
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
