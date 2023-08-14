import React, { useState } from "react";
import { Field } from "formik";
import Select from "react-select";
import makeAnimated from "react-select/animated";
const animatedComponents = makeAnimated();

const Checkbox = ({ children, ...props }) => (
  <label style={{ marginRight: "1em" }}>
    <input type="checkbox" {...props} />
    {children}
  </label>
);
const actionOptions = ["read", "create", "update", "delete"];
const SelectBox = ({ name, width, onChange, options, permissionIndex, attrList }) => {
  console.log(attrList);
  return (
    <>
      <Select
        className="basic-single"
        classNamePrefix="select"
        // defaultValue={options[0]}
        isClearable={true}
        isSearchable={true}
        name={name}
        onChange={onChange}
        options={options}
        style={{ flex: 1, width: "50%" }}
      />

      <div
        name={`permissions[${permissionIndex}].grants`}>
        <label>Actions:</label>
        <div>
          {actionOptions.map(
            (actionOption, actionIndex) => (
              <label
                style={{
                  display: "block",
                  width: "100%",
                  marginBottom: "5px",
                }}
                key={actionOption}>
                <Field
                  type="checkbox"
                  name={`permissions[${permissionIndex}].grants.action[${actionIndex}]`}
                  value={actionOption}
                />{" "}
                {actionOption}
                <label
                  style={{
                    display: "block",
                    textAlign: "right",
                    fontSize: "12px",
                    width: "100%",
                  }}>
                  Hide Attributes:
                </label>
                <Select
                  fullWidth
                  name={`permissions[${permissionIndex}].grants.action[${actionIndex}].attributes`}
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  // defaultValue={[
                  //   attrList[4],
                  //   attrList[5],
                  // ]}
                  isMulti
                  options={attrList}
                />
              </label>
            )
          )}
        </div>
      </div>
    </>
  );
};
export default SelectBox;
