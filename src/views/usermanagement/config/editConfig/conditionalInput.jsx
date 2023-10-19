import React, { useState, useEffect } from "react";
import TempFeature from "./tempFeature";
import TrxPercentages from "./trxPercentage";
import TrxGradingFormula from "./trxGradingFormula";
import TrxTypeCodes from "./trxTypeCodes";
import { NameBonTrip } from "./nameBonTrip";
import { InputNumber } from "mz-react-input-number";
import { Grid, InputAdornment } from "@mui/material";
import { Box } from "@mui/system";

const styles = {
  border: "3px solid #efefef",
  backgroundColor: "#fff",
};

const ConditionalInput = ({
  dtConfig,
  setFieldValue,
  handleChange,
  values,
}) => {
  const [inputValue, setInputValue] = useState(dtConfig.defaultVal);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  let inputComponent;
  if (dtConfig.id === 7) {
    inputComponent = (
      <TrxPercentages
        dtConfig={dtConfig}
        setFieldValue={setFieldValue}
        handleChange={handleChange}
        values={values}
      />
    );
  } else if (dtConfig.id === 18) {
    inputComponent = (
      <TrxTypeCodes
        dtConfig={dtConfig}
        setFieldValue={setFieldValue}
        handleChange={handleChange}
        values={values}
      />
    );
  } else if (dtConfig.id === 26) {
    inputComponent = (
      <NameBonTrip
        dtConfig={dtConfig}
        setFieldValue={setFieldValue}
        handleChange={handleChange}
        values={values}
      />
    );
  } else if (dtConfig.type === "Number") {
    inputComponent = (
      <Box
        marginTop={5}
        display={"flex"}
        flexDirection={"column"}
        width={"25%"}
        xs={12}
        sm={8}
        md={8}>
        <label htmlFor="defaultValue">Value</label>
        <InputNumber
          label="Default Value"
          // min={0}
          // max={100}
          // step={0.1}
          value={inputValue}
          autoFocus={true}
          removeRegex={/[^\-0-9.]*/gi}
          onChangeCallback={handleInputChange}
          inputStyles={styles}
        />
      </Box>
    );
  } else if (dtConfig.type === "Boolean") {
    inputComponent = (
      <TempFeature
        dtConfig={dtConfig}
        setFieldValue={setFieldValue}
        handleChange={handleChange}
        values={values}
      />
    );
  } else if (dtConfig.type === "Function") {
    inputComponent = (
      <TrxGradingFormula
        dtConfig={dtConfig}
        setFieldValue={setFieldValue}
        handleChange={handleChange}
        values={values}
        params={[
          "trxGradingWAJIB: number",
          "originWeighInKg: number",
          "originWeighOutKg: number",
          "adTransactionMILL_ID: string",
        ]}
      />
    );
  } else if (dtConfig.type === "String") {
    inputComponent = (
      <input type="text" value={inputValue} onChange={handleInputChange} />
    );
  }

  useEffect(() => {
    setFieldValue("defaultVal", inputValue);
  }, [inputValue, setFieldValue]);

  return <>{inputComponent}</>;
};

export default ConditionalInput;
