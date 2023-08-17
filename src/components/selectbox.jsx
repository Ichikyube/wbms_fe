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
    if(props.length) {
      setLen(props.length);
    }
  }, [props.length]);

  useEffect(() => {
    if(props.options) {
      setOpts(props.options);
    }
  }, [props.options]);

  return (
    <>
    { opts && opts.length > 0 && (
      <Select
        isMulti
        fullWidth
        name={props.name}
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        classNamePrefix="select"
        defaultValue={[
          opts[len-3],
          opts[len-4],
          opts[len-5],
        ]}
        isOptionSelected={true}
        isClearable={true}
        isSearchable={true}
        options={opts}
        onChange={props.onChange}
        components={{ ValueContainer }}
        style={{ flex: 1, width: `${props.width}` }}
        styles={styles}
      />
      )}
    </>
  );
};
export default SelectBox;
