import React from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";

export default function TrxGradingFormula({ dtConfig }) {
  console.log(dtConfig.defaultVal);
  const [code, setCode] = React.useState(dtConfig.defaultVal);
  return (
    <CodeEditor
      value={code}
      language="js"
      placeholder="Please enter JS code."
      onChange={(evn) => setCode(evn.target.value)}
      padding={15}
      style={{
        width: "100%", /* Initial width, can be adjusted based on your layout */
        minWidth:" 100px", /* Set a minimum width to prevent it from becoming too narrow */
        maxWidth: "100%", /* Set a maximum width to prevent it from becoming too wide */
        resize: "auto", /* Disable resizing by the user */
        overflow: "hidden", /* Hide any overflow */
        fontSize: 12,
        backgroundColor: "#f5f5f5",
        fontFamily:
          "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
      }}
    />
  );
}
{
  /* <textarea
value={inputValue}
onChange={handleInputChange}
rows="10"
cols="50"
placeholder="Enter function code here"
/> */
}
