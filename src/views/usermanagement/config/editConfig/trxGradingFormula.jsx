import React, { useEffect, useState } from "react";
import { Button, Grid } from "@mui/material";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
// import "prismjs/components/prism-clike";
// import "prismjs/components/prism-javascript";
// import "prismjs/themes/prism.css";

export default function TrxGradingFormula({
  dtConfig,
  setFieldValue,
  params,
  values,
}) {
  const [prevParams, prevCode] =
    dtConfig.defaultVal.split("<##FunctionCode##>");
  console.log(prevParams.split(","))
  const [code, setCode] = React.useState(prevCode);
  const [parameters, setParameters] = useState(prevParams.split(","));
  const [generatedFunction, setGeneratedFunction] = useState("");
  const [availableParams, setAvailableParams] = useState(params);
  const [numParams, setNumParams] = useState(0);

  const handleAddParameter = () => {
    const firstAvailableParam = availableParams.find(
      (param) => !parameters.includes(param)
    );
    if (firstAvailableParam) {
      setParameters((prevParameters) => [
        ...prevParameters,
        firstAvailableParam,
      ]);
      setNumParams((prevNumParams) => prevNumParams + 1);
    }
  };
  const handleRemoveParameter = (index) => {
    const updatedParameters = [...parameters];
    updatedParameters.splice(index, 1);
    setParameters(updatedParameters);
    setNumParams((prevNumParams) => prevNumParams - 1);
  };
  const handleParameterChange = (index, value) => {
    setParameters((prevParameters) => {
      const updatedParameters = [...prevParameters];
      updatedParameters[index] = value;
      return updatedParameters;
    });

    setAvailableParams((prevParams) =>
      prevParams.filter((param) => !parameters.includes(param))
    );
  };
  const handleGenerateFunction = () => {
    const parameterString = parameters.join(", ");
    const functionString = `export function ${dtConfig.name}(${parameterString}): number {\n  ${code}\n}`;

    setGeneratedFunction(functionString);
  };
  useEffect(() => {
    const isAllParamsSelected = parameters.length === params.length;
    if (isAllParamsSelected) {
      setAvailableParams([]);
    } else {
      setAvailableParams(params.filter((param) => !parameters.includes(param)));
    }
  }, [parameters, params]);
  useEffect(() => {
    setFieldValue("defaultVal", `${parameters}<##FunctionCode##>${code}`);
  }, [code, setFieldValue, parameters]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <CodeEditor
          value={code}
          language="js"
          placeholder="Please enter JS code."
          data-color-mode="dark"
          highlight={(code) => highlight(code, languages.js)}
          onChange={(evn) => setCode(evn.target.value)}
          padding={15}
          style={{
            width: "100%",
            minWidth: "100px",
            maxWidth: "100%",
            resize: "auto",
            // overflow: "hidden",
            fontSize: 12,
            // backgroundColor: "#f5f5f5",
            fontFamily: '"Fira code", "Fira Mono", monospace',
          }}
        />
      </Grid>
      {parameters.map((param, index) => (
        <Grid item xs={12} key={index}>
          <select
            required
            onChange={(e) => handleParameterChange(index, e.target.value)}
            value={param}
            disabled={!param} // Disable the dropdown if a parameter has already been selected
          >
            <option value="">Select a parameter</option>
            <option
              value="trxGradingPERSEN: number"
              disabled={parameters.includes(params[0])}>
              trxGradingPERSEN: number
            </option>
            <option
              value="originWeighInKg: number"
              disabled={parameters.includes(params[1])}>
              originWeighInKg: number
            </option>
            <option
              value="originWeighOutKg: number"
              disabled={parameters.includes(params[2])}>
              originWeighOutKg: number
            </option>
            <option
              value="qtyTbs: number"
              disabled={parameters.includes(params[3])}>
              qtyTbs: number
            </option>
            <option
              value="weightnetto: number"
              disabled={parameters.includes(params[4])}>
              weightnetto: number
            </option>
            <option
              value="adTransactionMILL_ID: string"
              disabled={parameters.includes(params[5])}>
              adTransactionMILL_ID: string
            </option>
          </select>
          <Button onClick={() => handleRemoveParameter(index)}>Erase</Button>
        </Grid>
      ))}

      <Grid item xs={12}>
        <Button
          style={{ marginRight: "12px" }}
          variant="contained"
          marginRight={5}
          disabled={availableParams.length === 0}
          onClick={handleAddParameter}>
          Add Parameter
        </Button>
        <Button variant="contained" onClick={handleGenerateFunction}>
          Generate Function
        </Button>
      </Grid>
      <Grid item xs={12}>
        {generatedFunction && (
          <>
            <h3>Generated Function:</h3>
            <pre>{generatedFunction}</pre>
          </>
        )}
      </Grid>
    </Grid>
  );
}
