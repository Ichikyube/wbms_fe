import React from "react";
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

// const Checkbox = ({ children, ...props }) => (
//   <label style={{ marginRight: "1em" }}>
//     <input type="checkbox" {...props} />
//     {children}
//   </label>
// );

const SelectBox = ({
  name,
  width,
  onChange,
  options,
  values,
  defaultValues,
}) => {
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
        name={name}
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        classNamePrefix="select"
        defaultValue={defaultValues}
        value={values}
        isClearable={true}
        isSearchable={true}
        onChange={onChange}
        options={options}
        components={{ ValueContainer }}
        style={{ flex: 1, width: "50%" }}
        styles={styles}
        width={width}
      />
    </>
  );
};
export default SelectBox;
