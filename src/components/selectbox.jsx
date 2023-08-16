import React, { useRef, useEffect, useState } from "react";
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

const SelectBox = (props) => {
  const styles = {
    option: (base, value) => {
      return value ? { ...base } : { display: "none" };
    },
  };
  const [len, setLen] = useState("");
  const [opts, setOpts] = useState([]);
    // isOptionSelected sees previous props.value after onChange
  const valueRef = useRef(props.value);
  valueRef.current = props.value;

  const selectAllOption = {
    value: "<SELECT_ALL>",
    label: "All",
  };

  useEffect(() => {
    setOpts(props.options);
  }, [props.options]);

  useEffect(() => {
    setLen(props.length);
    return () => {
      setLen("");
    };
  }, [props.length]);

  const isSelectAllSelected = () => valueRef.current?.length === len;

  const isOptionSelected = (option) =>
    valueRef.current?.some(({ value }) => value === option.value) ||
    isSelectAllSelected();

  const getOptions = () => [selectAllOption, ...opts];

  const getValue = () =>
    isSelectAllSelected() ? [selectAllOption] : props.value;

  const onChange = (newValue, actionMeta) => {
    const { action, option, removedValue } = actionMeta;

    if (action === "select-option" && option.value === selectAllOption.value) {
      props.onChange(opts, actionMeta);
    } else if (
      (action === "deselect-option" &&
        option.value === selectAllOption.value) ||
      (action === "remove-value" &&
        removedValue.value === selectAllOption.value)
    ) {
      props.onChange([], actionMeta);
    } else if (
      actionMeta.action === "deselect-option" &&
      isSelectAllSelected()
    ) {
      props.onChange(
        opts.filter(({ value }) => value !== option.value),
        actionMeta
      );
    } else {
      props.onChange(newValue || [], actionMeta);
    }
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
        // defaultValue={[
        //   opts[len-3],
        //   opts[len-4],
        //   opts[len-5],
        // ]}
        isOptionSelected={isOptionSelected}
        isClearable={true}
        isSearchable={true}
        options={getOptions()}
        value={getValue()}
        onChange={onChange}
        components={{ ValueContainer }}
        style={{ flex: 1, width: "50%" }}
        styles={styles}
        width={props.width}
      />
    </>
  );
};
export default SelectBox;
