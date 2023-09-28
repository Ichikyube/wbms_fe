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
import { initialTempConfigState } from "../slices/tempConfigSlice";
const UserMatrixContext = createContext({
  ...initialTempConfigState.tempConfigDt,
});

export const useMatrix = () => {
  return useContext(UserMatrixContext);
};

// const useConditionalState = (initialValue, condition, updateValue) => {


//   useEffect(() => {
//     if (condition && currentTime >= condition.start) {
//       setState(updateValue);
//       // if (currentTime >= WB4.end) backDatedTemplate = WB4.defaultValue;
//       // edit config start:null, end:null, status:disabled, 
//     }
//   }, [condition, currentTime, updateValue]);

//   return [state, setState];
// };

//apabila user yang melakukan request, dan masuk waktu yg diskejulkan maka
const UserMatrixContextProvider = ({ children }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.app);
  const [currentTime, setCurrentTime] = useState(null);
  const [currentHour, setCurrentHour] = useState(null);
  const [currentMinute, setCurrentMinute] = useState(null);

  const tempConfigs = useSelector((state) => state.tempConfigs);
  const configObject = Object.assign({}, ...tempConfigs?.tempConfigDt);
  const {
    manualEntryWB: WB2,
    editTransaction: WB3,
    backDatedTemplate: WB4,
    backDatedForm: WB5,
  } = configObject;
  const [backDatedForm, setBackDatedForm] = useState(WB5 ?? WB5?.defaultVal);
  const [manualEntryWB, setManualEntryWB] = useState(WB2 ?? WB2?.defaultVal);
  const [backDatedTemplate, setBackdatedTemplate] = useState(
    WB4 ?? WB4?.defaultVal
  );
  const [editTransaction, seteditTransaction] = useState(
    WB3 ?? WB3?.defaultVal
  );

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
      setCurrentTime(now);
      setCurrentHour(hours);
      setCurrentMinute(minutes);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (backDatedForm && currentTime >= WB5.start)
    setBackDatedForm(WB5.tempValue);
    // if (currentTime >= WB4.end) backDatedTemplate = WB4.defaultValue;
  }, [backDatedForm, currentTime, WB5]);
  useEffect(() => {
    if (backDatedTemplate && currentTime >= WB4.start)
      setBackdatedTemplate(WB4.tempValue);
    // if (currentTime >= WB4.end) backDatedTemplate = WB4.defaultValue;
  }, [backDatedTemplate, currentTime, WB4]);
  useEffect(() => {
    if (manualEntryWB && currentTime >= WB2.start)
    setManualEntryWB(WB2.tempValue);
    // if (currentTime >= WB4.end) backDatedTemplate = WB4.defaultValue;
  }, [backDatedTemplate, currentTime, WB2]);
  return (
    <UserMatrixContext.Provider
      value={{
        manualEntryWB,
        editTransaction,
        backDatedTemplate,
        backDatedForm,
      }}>
      {children}
    </UserMatrixContext.Provider>
  );
};

export { UserMatrixContext, UserMatrixContextProvider };
