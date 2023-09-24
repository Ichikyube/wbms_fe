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
  const [currentTime, setCurrentTime] = useState(null);
  const [currentHour, setCurrentHour] = useState(null);
  const [currentMinute, setCurrentMinute] = useState(null);

  const {
    manualEntryWB: WB2,
    editTransaction: WB3,
    backdatedTemplate: WB4,
    backDatedForm: WB5,
  } = tempConfigs.tempConfigDt;
  const [backDatedForm, setBackDatedForm] = useState(
    WB5 ? WB5 : WB5?.defaultVal
  );
  const [manualEntryWB, setManualEntryWB] = useState(
    WB2 ? WB2 : WB2?.defaultVal
  );
  const [backdatedTemplate, setBackdatedTemplate] = useState(
    WB4 ? WB4 : WB4?.defaultVal
  );
  const [editTransaction, seteditTransaction] = useState(
    WB3 ? WB3 : WB3?.defaultVal
  );
  console.log(tempConfigs.tempConfigDt);
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
    console.log(currentHour);
  }, [currentHour]);
  useEffect(() => {
    console.log(currentMinute);
  }, [currentMinute]);
  useEffect(() => {
    if (backdatedTemplate && currentTime >= WB4.start)
      setBackdatedTemplate(WB4.tempValue);
    console.log(backdatedTemplate);
    // if (currentTime >= WB4.end) backdatedTemplate = WB4.defaultValue;
  }, [backdatedTemplate, currentTime, WB4]);

  return (
    <UserMatrixContext.Provider
      value={{
        manualEntryWB,
        editTransaction,
        backdatedTemplate,
        backDatedForm,
      }}>
      {children}
    </UserMatrixContext.Provider>
  );
};

export { UserMatrixContext, UserMatrixContextProvider };
