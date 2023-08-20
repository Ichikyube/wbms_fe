import "core-js";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import App from "./App";
import store from "./store";
import { AuthProvider } from './components/Auth/context/authProvider';

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>,
);
