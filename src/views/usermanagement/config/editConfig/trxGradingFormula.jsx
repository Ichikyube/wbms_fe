import React, { useEffect, useState } from "react";
import { TextField, Button, Grid } from '@mui/material';
import CodeEditor from "@uiw/react-textarea-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";

export default function TrxGradingFormula({ dtConfig, setFieldValue, values }) {
  const [code, setCode] = React.useState(dtConfig.defaultVal);
  const [parameters, setParameters] = useState([]);
  const handleAddParameter = () => {
    setParameters([...parameters, ""]);
  };
  const handleParameterChange = (index, value) => {
    const updatedParameters = [...parameters];
    updatedParameters[index] = value;
    setParameters(updatedParameters);
  };
  useEffect(() => {
    setFieldValue("defaultVal", code);
  }, [code, setFieldValue]);
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
            width:
              "100%" /* Initial width, can be adjusted based on your layout */,
            minWidth:
              " 100px" /* Set a minimum width to prevent it from becoming too narrow */,
            maxWidth:
              "100%" /* Set a maximum width to prevent it from becoming too wide */,
            resize: "auto" /* Disable resizing by the user */,
            overflow: "hidden" /* Hide any overflow */,
            fontSize: 12,
            backgroundColor: "#f5f5f5",
            fontFamily: '"Fira code", "Fira Mono", monospace', //"ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
          }}
        />
      </Grid>
      {parameters.map((param, index) => (
        <Grid item xs={12} key={index}>
          <TextField
            fullWidth
            label={`Parameter ${index + 1}`}
            value={param}
            onChange={(e) => handleParameterChange(index, e.target.value)}
            required
          />
        </Grid>
      ))}
      <Grid item xs={12}>
        <Button variant="contained" onClick={handleAddParameter}>
          Add Parameter
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" type="submit">
          Create Function
        </Button>
      </Grid>
    </Grid>
  );
}
