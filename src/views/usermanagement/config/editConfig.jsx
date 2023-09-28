import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  IconButton,
  InputLabel,
  Autocomplete,
  MenuItem,
  Select,
  Switch,
  FormGroup,
  Checkbox,
  Slider,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { format, addHours, addMinutes } from "date-fns";
import * as yup from "yup";
import { blue, grey } from "@mui/material/colors";
import * as ConfigApi from "../../../api/configApi";
import moment from "moment";
import TimeSpanInput from "../../../components/TimeSpanInput";


const EditConfig = ({ isEditOpen, onClose, dtConfig }) => {
  const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
    values.lifespan = timeSpan;

    try {
      await ConfigApi.update(values);
      toast.success("Data Berhasil Diperbarui");
      // Lakukan tindakan tambahan atau perbarui state sesuai kebutuhan
    } catch (error) {
      console.error("Data Gagal Diperbarui:", error);
      toast.error("Data Gagal Diperbarui: " + error.message);
      // Tangani error atau tampilkan pesan error
    } finally {
      setSubmitting(false);
      resetForm();
      onClose("", false);
    }
  };
  const [timeSpan, setTimeSpan] = useState(dtConfig?.lifespan);
  const { hours, minutes } = secondsToHoursAndMinutes(timeSpan);
  const handleTimeSpanChange = (newTimeSpan) => {
    setTimeSpan(newTimeSpan);
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
    console.log(timeSpan)

  }, [timeSpan])
  return (
    <Dialog
      open={isEditOpen}
      fullWidth
      maxWidth="md"
      onClose={() => onClose("", false)}>
      <DialogTitle
        sx={{ color: "white", backgroundColor: "black", fontSize: "27px" }}>
        Edit Data Config
        <IconButton
          sx={{
            color: "white",
            position: "absolute",
            right: "10px",
            top: "15px",
          }}
          onClick={() => {
            onClose("", false);
          }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Formik onSubmit={handleFormSubmit} initialValues={dtConfig}>
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                padding={2}
                paddingBottom={3}
                paddingLeft={3}
                paddingRight={3}
                gap="20px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))">
                <FormControl sx={{ gridColumn: "span 4" }}>
                  <FormLabel
                    sx={{
                      marginBottom: "8px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}>
                    Config Name
                  </FormLabel>

                  <TextField
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Nama...."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    name="name"
                    inputProps={{ readOnly: true }}
                    sx={{ backgroundColor: "whitesmoke" }}
                    error={!!touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                    id="name-input"
                  />
                </FormControl>
              </Box>
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
                    <FormControlLabel
                      value={1}
                      control={<Radio />}
                      label="lvl 1  "
                    />
                    <FormControlLabel
                      value={2}
                      control={<Radio />}
                      label="lvl 2"
                    />
                    <FormControlLabel
                      value={3}
                      control={<Radio />}
                      label="lvl 3"
                    />
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
                  <InputLabel id="demo-simple-select-label">
                    Default State
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    name="defaultVal"
                    id="status-default-select"
                    value={values.defaultVal}
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
              <Box display="flex" mt={2} ml={3}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: grey[700],
                    color: "white",
                  }}
                  onClick={() => {
                    onClose("", false);
                  }}>
                  Cancel
                </Button>
                <Box ml="auto" mr={3}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      color: "white",
                    }}>
                    Simpan
                  </Button>
                </Box>
              </Box>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default EditConfig;
