import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchActiveConfigsData } from "../slices/tempConfigSlice";
import { fetchGroupMappingData } from "../slices/groupMappingSlice";

const UserMatrixContext = createContext({
  backDatedForm: false,
  manualEntryWB: false,
  backdatedTemplate: false,
  editTransaction: false,
});

export const useMatrix = () => {
  return useContext(UserMatrixContext);
};
//apabila user yang melakukan request, dan masuk waktu yg diskejulkan maka
const UserMatrixContextProvider = ({ children }) => {
  const dispatch = useDispatch();

  const tempConfigs = useSelector((state) => state.tempConfigs);
  const [currentHour, setCurrentHour] = useState(null);
  const [currentMinute, setCurrentMinute] = useState(null);
  console.log(tempConfigs);

  // configState.forEach(config => {
  //   state[config] = configsByKey[config]?.value || state[config];
  // });
  // const initialState =
  // const configsByKey = _.keyBy(tempConfigs, "name");
  // const configState = payload.map((config) => config.name);

  // configState.forEach(config => {
  //   state[config] = configsByKey[config]?.value || state[config];
  // });'zeroLock', value: '0', start: null, end: null

  // const {
  //   backDatedForm: WB2,
  //   manualEntryWB: WB3,
  //   backdatedTemplate: WB4,
  //   editTransaction: WB5,
  // } = tempConfigs.tempConfigDt;
  // const [backDatedFormConfig, setBackDatedForm] = useState(WB2);
  // const [manualEntryWBConfig, setManualEntryWB] = useState(WB3);
  // const [backdatedTemplateConfig, setBackdatedTemplate] = useState(WB4);
  // const [editTransactionConfig, seteditTransaction] = useState(WB5);

  const configCallback = useCallback(() => {
    dispatch(fetchGroupMappingData());
    dispatch(fetchActiveConfigsData());
  }, [dispatch]);

  useEffect(() => {
    configCallback();
  }, [configCallback]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      setCurrentHour(hours);
      setCurrentMinute(minutes);
    }, 1000);

    // Clear the interval on component unmount
    return () => clearInterval(interval);
  }, []); 

  useEffect(() => {
    console.log(currentHour);
  }, [currentHour]);
  useEffect(() => {
    console.log(currentMinute);
  }, [currentMinute]);
  // useEffect(() => {
  //   if(tempConfigs){
  //     const configsNames = tempConfigs.map(obj => obj.name);
  //     const configState = tempConfigs.map((config) => config.defaultVal);
  //   }
  // }, [tempConfigs])



  //   if (backDatedForm)
  //   backDatedForm =
  //     currentHour >= backDatedFormConfig.start
  //       ? backDatedFormConfig.value
  //       : backDatedFormConfig.defaultValue;
  // if (currentTime >= backDatedFormConfig.end)
  //   backDatedForm.value = backDatedFormConfig.defaultValue;
  return (
    <UserMatrixContext.Provider value={{}}>
      {children}
    </UserMatrixContext.Provider>
  );
};

export { UserMatrixContext, UserMatrixContextProvider };
