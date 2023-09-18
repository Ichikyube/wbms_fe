import React, { useState } from 'react';

const TimeSpanInput = ({ onChange }) => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const handleHoursChange = (e) => {
    const newHours = parseInt(e.target.value);
    setHours(newHours);
    onChange(newHours * 60 + minutes);
  };

  const handleMinutesChange = (e) => {
    const newMinutes = parseInt(e.target.value);
    setMinutes(newMinutes);
    onChange(hours * 60 + newMinutes);
  };

  return (
    <div>
      <input
        type="number"
        value={hours}
        onChange={handleHoursChange}
        min="0"
        placeholder="Hours"
      />
      <span>hours</span>
      <input
        type="number"
        value={minutes}
        onChange={handleMinutesChange}
        min="0"
        max="59"
        placeholder="Minutes"
      />
      <span>minutes</span>
    </div>
  );
};

export default TimeSpanInput;
