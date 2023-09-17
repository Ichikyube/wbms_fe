import React, { createContext, useState } from "react";
import { useFetchGroupMappingDataQuery } from "../slices/groupMappingSlice";

const UserMatrixContext = createContext();
const UserMatrixContextProvider = ({ children }) => {
  const { data, error, isLoading } = useFetchGroupMappingDataQuery();
  const [sharedValue, setSharedValue] = useState("Initial Value");

  return (
    <UserMatrixContext.Provider value={{ sharedValue, setSharedValue }}>
      {children}
    </UserMatrixContext.Provider>
  );
};

export { UserMatrixContext, UserMatrixContextProvider };
