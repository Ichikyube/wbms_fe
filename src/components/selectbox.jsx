import React, { useEffect, useState } from "react";
import Select, { components } from "react-select";

const ValueContainer = ({ children, getValue, ...props }) => {
  let maxToShow = 3;
  var length = getValue().length;
  let displayChips = React.Children.toArray(children).slice(0, maxToShow);
  let shouldBadgeShow = length > maxToShow;
  let displayLength = length - maxToShow;

  return (
    <components.ValueContainer {...props}>
      {!props.selectProps.inputValue && displayChips}
      <div className="root">
        {shouldBadgeShow &&
          `+ ${displayLength} item${length !== 1 ? "s" : ""} selected`}
      </div>
    </components.ValueContainer>
  );
};

const SelectBox = (props) => {
  const styles = {
    option: (base, value) => {
      return value ? { ...base } : { display: "none" };
    },
  };

  return (
    <>
      <Select
        isMulti
        fullWidth
        name={props.name}
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        classNamePrefix="select"
        isOptionSelected={true}
        isClearable={false}
        isSearchable={true}
        placeholder={props.placeholder}
        value={props?.value || null}
        options={props.options}
        onChange={props.onChange}
        components={{ ValueContainer }}
        style={{ flex: 1, width: `${props.width}` }}
        styles={styles}
      />
    </>
  );
};
export default SelectBox;
