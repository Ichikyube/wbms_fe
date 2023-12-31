import React, { Suspense, useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { CContainer, CSpinner } from "@coreui/react";
import { useMatrix } from "../context/UserMatrixContext";
// routes config
import baseRoute, {
  protectedRoute,
  backdateFormRoutes,
  backdateTemplateRoute,
  editTransactionRoute,
} from "../routes";

const AppContent = () => {
  const { backDatedForm, backDatedTemplate, editTransaction } = useMatrix();
  const ConfigList = {
    backDatedForm,
    backDatedTemplate,
    editTransaction,
  };
  const ConfigMap = {
    backDatedForm: backdateFormRoutes,
    backDatedTemplate: backdateTemplateRoute,
    editTransaction: editTransactionRoute,
  };

  const access = Object.keys(JSON.parse(localStorage.getItem("userAccess")));
  
  const routeAccess = protectedRoute.filter((item) =>
    access.includes(item.resource)
  );
  const routesList = baseRoute.concat(routeAccess);
  const [routes, setRoutes] = useState(routesList);
  const newRoutes = useMemo(() => {
    const tempConfigList = Object.keys(ConfigList).filter(
      (key) => ConfigMap[key]
    );
    return tempConfigList.map((key) => ConfigMap[key]).flat();
  }, [ConfigList, ConfigMap]);

  useEffect(() => {
    setRoutes((prevRoutes) => prevRoutes.concat(newRoutes));
  }, []);
  // console.log(routes)
  //hanya user yang melakukan request yang bisa menggunakan temporari konfig.

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
