import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useFetchActiveConfigsDataQuery,
  useRequestEndedMutation,
} from "../slices/tempConfigSlice";
import { fetchGroupMappingData } from "../slices/groupMappingSlice";
import { initialTempConfigState } from "../slices/tempConfigSlice";
const UserMatrixContext = createContext({
  ...initialTempConfigState,
});

export const useMatrix = () => {
  return useContext(UserMatrixContext);
};

//apabila user yang melakukan request, dan masuk waktu yg diskejulkan maka
const UserMatrixContextProvider = ({ children }) => {
  const {
    data: activeConfigsData,
    isLoading,
    error,
  } = useFetchActiveConfigsDataQuery();
  const [requestEnded] = useRequestEndedMutation();
  const dispatch = useDispatch();
  const [currentTime, setCurrentTime] = useState(null);
  const [currentHour, setCurrentHour] = useState(null);
  const [currentMinute, setCurrentMinute] = useState(null);
  let configObject = {};
  if (activeConfigsData) {
    configObject = Object.assign({}, ...activeConfigsData);
  }

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
    if (backDatedForm && currentTime >= WB5?.start)
      setBackDatedForm(WB5.tempValue);
    if (currentTime >= WB5?.end) {
      setBackDatedForm(WB5.defaultValue);
      requestEnded(5).unwrap();
    }
  }, [backDatedForm, currentTime, WB5, requestEnded]);
  useEffect(() => {
    if (backDatedTemplate && currentTime >= WB4?.start)
      setBackdatedTemplate(WB4.tempValue);
    if (currentTime >= WB4?.end) {
      setBackdatedTemplate(WB4.defaultValue);
      requestEnded(4).unwrap();
    }
  }, [backDatedTemplate, currentTime, WB4, requestEnded]);
  useEffect(() => {
    if (editTransaction && currentTime >= WB3?.start)
      seteditTransaction(WB3.tempValue);
    if (currentTime >= WB3?.end) {
      seteditTransaction(WB3.defaultValue);
      requestEnded(6).unwrap();
    }
  }, [editTransaction, currentTime, WB3, requestEnded]);
  useEffect(() => {
    if (manualEntryWB && currentTime >= WB2?.start)
      setManualEntryWB(WB2.tempValue);
    if (currentTime >= WB2?.end) {
      setManualEntryWB(WB2?.defaultValue);
      requestEnded(3).unwrap();
    }
  }, [manualEntryWB, currentTime, WB2, requestEnded]);
  return (
    <UserMatrixContext.Provider
      value={{
        manualEntryWB,
        editTransaction,
        backDatedTemplate,
        backDatedForm,
      }}>
      {!isLoading && children}
    </UserMatrixContext.Provider>
  );
};

export { UserMatrixContext, UserMatrixContextProvider };
