import { Suspense, lazy, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HashRouter, Routes, Route } from "react-router-dom";
import "../scss/style.scss";

import { useWeighbridge } from "../common/hooks";

// Containers
const LayoutGuest = lazy(() => import("../layout/LayoutGuest"));
const DefaultLayout = lazy(() => import("../layout/DefaultLayout"));

// Pages
const Home = lazy(() => import("../views/pages/Home"));
const SignIn = lazy(() => import("../views/pages/Auth/SignIn"));
const Page404 = lazy(() => import("../views/pages/page404/Page404"));
const Page500 = lazy(() => import("../views/pages/page500/Page500"));

const App = () => {
  const [weighbridge] = useWeighbridge();

  const loading = (
    <div className="pt-3 text-center">
      <div className="sk-spinner sk-spinner-pulse"></div>
    </div>
  );

  return (
    <HashRouter>
      <Suspense fallback={loading}>
        <Routes>
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route path="/" element={<LayoutGuest />}>
            <Route
              index={true}
              exact
              path="/"
              name="Home Page"
              element={<Home />}
            />
            <Route path="/home" name="Home Page" element={<Home />} />
            <Route path="/signin" name="Sign In Page" element={<SignIn />} />
          </Route>

          <Route path="*" name="WBMS" element={<DefaultLayout />} />
        </Routes>
        {/* <div>Weight on weighbridge: {weighbridge.getWeight()}</div>
        <div>isStable on weighbridge: {weighbridge.isStable().toString()}</div> */}
      </Suspense>
    </HashRouter>
  );
};

export default App;
