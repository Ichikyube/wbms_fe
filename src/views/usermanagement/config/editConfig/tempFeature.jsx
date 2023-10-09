import React, {useState, useEffect} from "react";
// import moment from "moment";
// import { format, addHours, addMinutes } from "date-fns";
import TimeSpanInput from "../../../../components/TimeSpanInput";
import {
  Box,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

export default function TempFeature({dtConfig, setFieldValue, handleChange, values}) {
  const [timeSpan, setTimeSpan] = useState(dtConfig?.lifespan);
  const { hours, minutes } = secondsToHoursAndMinutes(timeSpan);
  const handleTimeSpanChange = (newTimeSpan) => {
    setTimeSpan(newTimeSpan);
    setFieldValue("lifespan", timeSpan)
  };
  function secondsToHoursAndMinutes(seconds) {
    const hours = Math.floor(seconds / 3600); // 3600 seconds in an hour
    const remainingSeconds = seconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60); // 60 seconds in a minute
    return { hours, minutes };
  }

  const formatLifespan = (hours, minutes) => {
    return `${hours} hours ${minutes} minutes`;
  };

  useEffect(() => {
    console.log(formatLifespan(hours, minutes));
  }, [hours, minutes]);
  return (
    <Box
      display="block"
      padding={2}
      paddingBottom={3}
      paddingLeft={3}
      paddingRight={3}
      gap="20px">
      <FormControl
        sx={{
          marginBottom: "8px",
          color: "black",
          fontSize: "16px",
          fontWeight: "bold",
        }}
        component="fieldset">
        <FormLabel
          sx={{
            marginBottom: "8px",
            color: "black",
            fontSize: "16px",
            fontWeight: "bold",
          }}>
          Level of Approval
        </FormLabel>
        <RadioGroup
          row
          aria-label="Level of Approval"
          name="lvlOfApprvl"
          value={values.lvlOfApprvl}
          onChange={handleChange}>
          <FormControlLabel value={1} control={<Radio />} label="lvl 1  " />
          <FormControlLabel value={2} control={<Radio />} label="lvl 2" />
          <FormControlLabel value={3} control={<Radio />} label="lvl 3" />
        </RadioGroup>
      </FormControl>
      <FormControl
        fullWidth
        sx={{
          marginBottom: "8px",
          color: "black",
          fontSize: "16px",
          fontWeight: "bold",
        }}>
        <InputLabel id="demo-simple-select-label">Default State</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          name="defaultVal"
          id="status-default-select"
          value={values.defaultVal === true? "Active":"DISABLED"}
          label="Default State"
          onChange={handleChange}>
          <MenuItem value="ACTIVE">Active</MenuItem>
          <MenuItem default value="DISABLED">
            Disabled
          </MenuItem>
        </Select>
      </FormControl>
      <InputLabel id="demo-simple-select-label">LIFESPAN</InputLabel>
      <TimeSpanInput
        initialHours={hours}
        initialMinutes={minutes}
        onChange={handleTimeSpanChange}
      />

      {/* <Typography>
  Lifespan: {formatLifespan(hours, minutes)}
</Typography> */}
    </Box>
  );
}
