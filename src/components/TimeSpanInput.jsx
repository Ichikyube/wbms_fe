import React, { useState } from "react";
import InputNumber from "rc-input-number";
import "./styles/lifespanInput.css";
const TimeSpanInput = ({ onChange, initialHours, initialMinutes }) => {
  const [hours, setHours] = useState(initialHours);
  const [minutes, setMinutes] = useState(initialMinutes);

  const handleHoursChange = (val) => {
    const newHours = parseInt(val);
    setHours(newHours >= 0 ? newHours : 0);
    onChange(newHours * 60 * 60 + minutes * 60);
  };

  const handleMinutesChange = (val) => {
    const newMinutes = parseInt(val);
    setMinutes(newMinutes >= 0 ? newMinutes : 0);
    onChange(hours * 60 * 60 + newMinutes * 60);
  };

  // const calculateTotalSeconds = () => {
  //   return hours * 3600 + minutes * 60;
  // };
  return (
    <div>
      <InputNumber
        value={hours}
        onChange={handleHoursChange}
        min="0"
        max="23"
        name="Hours"
        // disabled={disabled}
        // readOnly={readOnly}
        // keyboard={keyboard}
      />

      <span>hours</span>
      <InputNumber
        value={minutes}
        onChange={handleMinutesChange}
        min="0"
        max="59"
        name="Minutes"
        // placeholder="Hours"
        // disabled={disabled}
        // readOnly={readOnly}
        // keyboard={keyboard}
      />

      <span>minutes</span>
    </div>
  );
};

export default TimeSpanInput;
