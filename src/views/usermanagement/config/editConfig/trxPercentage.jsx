import React, { useState } from "react";
import { InputNumber } from "mz-react-input-number";
import { Grid, InputAdornment } from "@mui/material";

const styles = {
  border: "3px solid #efefef",
  backgroundColor: "#fff",
};
const TrxPercentages = ({dtConfig, setFieldValue}) => {
  let config;
  if(dtConfig)   config= dtConfig?.defaultVal;

  const [inputValues, setInputValues] = useState(JSON.parse(dtConfig.defaultVal));
  const handleInputChange = (fieldName) => (event) => {
    setInputValues({
      ...inputValues,
      [fieldName]: event,
    });
    setFieldValue("defaultVal", inputValues)
  };

  return (
    <Grid container spacing={2}>
      {Object.entries(inputValues).map(([fieldName, value]) => (
        <Grid item xs={12} sm={6} md={4} key={fieldName}>
          <label htmlFor={fieldName}>{fieldName}</label>
          <InputNumber
            label={fieldName}
            min={0}
            max={100}
            step={0.1}
            value={value}
            autoFocus={true}
            removeRegex={/[^\-0-9.]*/gi}
            onChangeCallback={handleInputChange(fieldName)}
            inputStyles={styles}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default TrxPercentages;
