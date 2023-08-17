// import {
//   FieldPathValue,
//   FieldValues,
//   SetValueConfig,
//   UnpackNestedValue,
//   UseFormWatch,
// } from "react-hook-form";
// import { useEffect } from "react";

// export const usePersistForm = (
//   settings
// ) => {
//   const {
//     watch,
//     setValue,
//     formName,
//     shouldDirty = false,
//     shouldValidate = false,
//     onRestored,
//   } = settings;

//   const currentValue = watch();
//   const getSessionStorage = () => window.sessionStorage;

//   useEffect(() => {
//     const storage = getSessionStorage().getItem(formName);
//     let restoredData: any = {};

//     if (storage) {
//       const storedValues = JSON.parse(storage);

//       for (const [key, value] of Object.entries(storedValues)) {
//         setValue(key, value, { shouldValidate, shouldDirty });
//         restoredData[key] = value;
//       }
//       if (onRestored) onRestored(restoredData);
//     }
//   }, [formName, setValue, shouldValidate, shouldDirty]);

//   useEffect(() => {
//     getSessionStorage().setItem(formName, JSON.stringify(currentValue));
//   });
// };
