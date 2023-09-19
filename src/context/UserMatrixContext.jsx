import React, { createContext, useState } from "react";
import { useFetchGroupMappingDataQuery } from "../slices/groupMappingSlice";

const UserMatrixContext = createContext();
const UserMatrixContextProvider = ({ children }) => {
  // const { data: groupMap, error, isLoading } = useFetchGroupMappingDataQuery();
  const [sharedValue, setSharedValue] = useState("Initial Value");
  return (
    <UserMatrixContext.Provider value={{ sharedValue }}>
      {children}
    </UserMatrixContext.Provider>
  );
};

export { UserMatrixContext, UserMatrixContextProvider };
