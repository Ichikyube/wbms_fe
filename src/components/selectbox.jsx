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
  const [len, setLen] = useState("");
  const [opts, setOpts] = useState([]);
  useEffect(() => {
    if (props.length) {
      setLen(props.length);
    }
  }, [props.length]);

  useEffect(() => {
    if (props.options) {
      setOpts(props.options);
    }
  }, [props.options]);
  const [selectedValues, setselectedValues] = useState(props.defaultValue);

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
          isClearable={true}
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
