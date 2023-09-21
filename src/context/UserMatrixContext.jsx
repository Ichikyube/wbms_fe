import React, { createContext, useContext, useState } from "react";

const UserMatrixContext = createContext({
  backDatedForm: false,
  manualEntryWB: false,
  backdatedTemplate: false,
  editTransaction: false,
  editTransactionFull: false,
});

export const useMatrix = () => {
  return useContext(UserMatrixContext);
};

const UserMatrixContextProvider = ({ children }) => {
  const [backDatedForm, setBackDatedForm] = useState(true);
  const [manualEntryWB, setManualEntryWB] = useState(true);
  const [backdatedTemplate, setBackdatedTemplate] = useState(true);
  const [editTransaction, seteditTransaction] = useState(true);
  const [editTransactionFull, setEditTransactionFull] = useState(true);

  // const { data: groupMap, error, isLoading } = useFetchGroupMappingDataQuery();
  return (
    <UserMatrixContext.Provider
      value={{
        backDatedForm,
        manualEntryWB,
        backdatedTemplate,
        editTransaction,
        editTransactionFull,
      }}>
      {children}
    </UserMatrixContext.Provider>
  );
};

export { UserMatrixContext, UserMatrixContextProvider };
