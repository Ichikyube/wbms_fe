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
import moment from "moment";
const UserMatrixContext = createContext({
  manualEntryWB: false,
  editTransaction: false,
  backDatedTemplate: false,
  backDatedForm: false,
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
  const currentTime = moment().format("HH:mm");

  const {
    manualEntryWB: WB2,
    editTransaction: WB3,
    backDatedTemplate: WB4,
    backDatedForm: WB5,
  } = useSelector((state) => state.tempConfigs);

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
  const startBackDateTemplate = moment(WB4?.start).utc().format("HH:mm");
  const endBackDateTemplate = moment(WB4?.end).utc().format("HH:mm");
  const startEditTransaction = moment(WB3?.start).utc().format("HH:mm");
  const endEditTransaction = moment(WB3?.end).utc().format("HH:mm");
  const startManualEntryWB = moment(WB2?.start).utc().format("HH:mm");
  const endManualEntryWB = moment(WB2?.end).utc().format("HH:mm");
  const startBackDatedForm = moment(WB5?.start).utc().format("HH:mm");
  const endBackDatedForm = moment(WB5?.end).utc().format("HH:mm");

  useEffect(() => {
    if (startBackDatedForm) {
      if (currentTime >= startBackDatedForm) setBackDatedForm(WB5?.tempValue);
      if (currentTime >= endBackDatedForm) {
        setBackDatedForm(WB5?.defaultVal);
        requestEnded(5).unwrap();
      }
    }
  }, [currentTime, WB5, requestEnded]);

  useEffect(() => {
    if (startBackDateTemplate) {
      if (currentTime >= startBackDateTemplate)
        setBackdatedTemplate(WB4?.tempValue);
      if (currentTime >= endBackDateTemplate) {
        setBackdatedTemplate(WB4?.defaultVal);
        requestEnded(4).unwrap();
      }
    }
  }, [currentTime, WB4, requestEnded]);
  useEffect(() => {
    if (startEditTransaction) {
      if (currentTime >= startEditTransaction)
        seteditTransaction(WB3?.tempValue);
      if (currentTime >= endEditTransaction) {
        seteditTransaction(WB3?.defaultVal);
        requestEnded(6).unwrap();
      }
    }
  }, [currentTime, WB3, requestEnded]);
  useEffect(() => {
    if (startManualEntryWB) {
      if (currentTime >= startManualEntryWB) setManualEntryWB(WB2?.tempValue);
      if (currentTime >= endManualEntryWB) {
        setManualEntryWB(WB2?.defaultVal);
        requestEnded(3).unwrap();
      }
    }
  }, [currentTime, WB2, requestEnded]);
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
