import React, { useState } from "react";
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
import { format, addDays, addHours } from "date-fns";
import * as yup from "yup";
import { blue, grey } from "@mui/material/colors";
import * as ConfigApi from "../../../api/configsApi";
import moment from "moment";
import TimeSpanInput from "../../../components/TimeSpanInput";
const StyledTextarea = styled(TextareaAutosize)(
  ({ theme }) => `
  width: 320px;
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 12px;
  border-radius: 12px 12px 0 12px;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
  box-shadow: 0px 2px 2px ${
    theme.palette.mode === "dark" ? grey[900] : grey[50]
  };

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${
      theme.palette.mode === "dark" ? blue[500] : blue[200]
    };
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`
);

const EditConfig = ({ isEditOpen, onClose, dtConfig }) => {
  const [isRepeatable, setIsRepeatable] = useState(false);

  const handleIsRepeatableChange = (event) => {
    setIsRepeatable(event.target.checked);
  };

  const userSchema = yup.object().shape({
    // name: yup.string().required("required"),
  });

  const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
    values.start = moment(values.start).toDate();
    values.end = moment(values.end).toDate();

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
  const [timeSpan, setTimeSpan] = useState(0);

  const handleTimeSpanChange = (newTimeSpan) => {
    setTimeSpan(newTimeSpan);
  };
  /*
    for SetConfig
    Set lvlOfApproval
    depend on the level, add approver selector. Use input selector with autocomplete username or name
    Set defaultValue. Use data type selector, depend on the data type input, bring the match input defaultValue component
    Set timeSpan with Hours and Minutes input
    Set repeatable checkbox
    Abort status
    */
  const formatLifespan = (hours, minutes) => {
    return `${hours} hours ${minutes} minutes`;
  };
  const initialValues = {
    configRequestLifespan: {
      hours: 0,
      minutes: 0,
    },
  };
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
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={dtConfig}
          validationSchema={userSchema}>
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
                    name="status"
                    id="status-default-select"
                    value={values.status}
                    label="Default State"
                    onChange={handleChange}>
                    <MenuItem value="ACTIVE">Active</MenuItem>
                    <MenuItem default value="DISABLED">
                      Disabled
                    </MenuItem>
                  </Select>
                </FormControl>
                <InputLabel id="demo-simple-select-label">LIFESPAN</InputLabel>
                <TimeSpanInput onChange={handleTimeSpanChange} />

                {/* <Typography>
                  Lifespan:{" "}
                  {formatLifespan(
                    initialValues.configRequestLifespan.hours,
                    initialValues.configRequestLifespan.minutes
                  )}
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
