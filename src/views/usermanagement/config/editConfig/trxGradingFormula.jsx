import React from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";

export default function TrxGradingFormula({ dtConfig }) {
  const [code, setCode] = React.useState(dtConfig.defaultVal);
  return (
    <CodeEditor
      value={code}
      language="js"
      placeholder="Please enter JS code."
      data-color-mode="dark"
      highlight={(code) => highlight(code, languages.js)}
      onChange={(evn) => setCode(evn.target.value)}
      padding={15}
      style={{
        width: "100%" /* Initial width, can be adjusted based on your layout */,
        minWidth: " 100px" /* Set a minimum width to prevent it from becoming too narrow */,
        maxWidth: "100%" /* Set a maximum width to prevent it from becoming too wide */,
        resize: "auto" /* Disable resizing by the user */,
        overflow: "hidden" /* Hide any overflow */,
        fontSize: 12,
        backgroundColor: "#f5f5f5",
        fontFamily: '"Fira code", "Fira Mono", monospace', //"ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
      }}
    />
  );
}
