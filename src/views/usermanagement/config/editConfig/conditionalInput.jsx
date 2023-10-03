import React, { useState } from "react";
import TempFeature from "./tempFeature";
import TrxPercentages from "./trxPercentage";
import TrxGradingFormula from "./trxGradingFormula";

const ConditionalInput = ({
  dtConfig,
  setFieldValue,
  handleChange,
  values,
}) => {
  const [inputValue, setInputValue] = useState("");

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
  } else if (dtConfig.type === "Number") {
    inputComponent = (
      <input type="number" value={inputValue} onChange={handleInputChange} />
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
      />
    );
  } else if (dtConfig.type === "String") {
    inputComponent = (
      <input type="text" value={inputValue} onChange={handleInputChange} />
    );
  }

  return <div>{inputComponent}</div>;
};

export default ConditionalInput;
