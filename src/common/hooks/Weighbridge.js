import { useDispatch, useSelector } from "react-redux";
import { w3cwebsocket } from "websocket";
import moment from "moment";

// import { getEnvInit } from "../configs";
import { useConfig } from "../hooks";
import { appSlice } from "../../slices/app/appSlice";
const { setWb } = appSlice.actions;

let wsClient;
const WBMS_WB_IP = "localhost";
const WBMS_WB_PORT = "9001";
const WBMS_WB_MIN_WEIGHT = 1;
const WBMS_WB_STABLE_PERIOD = 3000;

export const useWeighbridge = () => {
  const dispatch = useDispatch();

  const { wb } = useSelector((state) => state.app);
  const [configs] = useConfig();

  // console.log("Config from weighbridge hook:", configs);

  if (configs?.ENV?.WBMS_WB_IP && !wsClient) {
    wsClient = new w3cwebsocket(`ws://${configs?.ENV?.WBMS_WB_IP}:${configs?.ENV?.WBMS_WB_PORT}/GetWeight`);

    wsClient.onmessage = (message) => {
      const wb = localStorage.getItem("app")
        ? JSON.parse(localStorage.getItem("app"))?.wb
        : {
            weight: -1,
            lastChange: 0,
            isStable: false,
            onProcessing: false,
            canStartScalling: false,
          };

      const curWb = { ...wb };
      curWb.isStable = false;
      curWb.weight = Number.isNaN(+message.data) ? 0 : +message.data;

      // console.log("current wb:", curWb.weight);
      // console.log("last wb:", wb.weight);

      if (curWb.weight !== wb.weight) {
        curWb.lastChange = moment().valueOf();
      } else if (moment().valueOf() - wb.lastChange > WBMS_WB_STABLE_PERIOD) {
        curWb.isStable = true;
      }

      if (curWb.weight === 0 && curWb.isStable && !curWb.onProcessing) curWb.canStartScalling = true;

      dispatch(setWb({ ...curWb }));
    };

    wsClient.onerror = (err) => {
      // alert(`Cannot connect to WB: ${err}`);
      console.log("Error Get Data from Serial Weighbridge:", err);
    };
  }

  const weighbridge = {
    getWeight: () => {
      return wb.weight;
    },
    isStable: () => {
      return wb.isStable;
    },
    isOnProcessing: () => {
      return wb.onProcessing;
    },
  };

  return [weighbridge];
};
