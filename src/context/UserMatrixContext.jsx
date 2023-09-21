import React, { createContext, useContext, useState } from "react";
import { useGetActiveConfigsTodayQuery } from "../slices/requestConfigsSlice";

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
  const { data, error, isLoading } = useGetActiveConfigsTodayQuery();
  const [backDatedForm, setBackDatedForm] = useState(true);
  const [manualEntryWB, setManualEntryWB] = useState(true);
  const [backdatedTemplate, setBackdatedTemplate] = useState(true);
  const [editTransaction, seteditTransaction] = useState(true);
  if(data)  console.log(data)
  return (
    <UserMatrixContext.Provider
      value={{
        backDatedForm,
        manualEntryWB,
        backdatedTemplate,
        editTransaction,
      }}>
      {children}
    </UserMatrixContext.Provider>
  );
};

export { UserMatrixContext, UserMatrixContextProvider };
