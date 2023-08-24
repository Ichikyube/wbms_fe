import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  FormControl,
  FormLabel,
  IconButton,
  InputLabel,
  Autocomplete,
  TextareaAutosize,
} from "@mui/material";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { format, addDays, addHours } from "date-fns";
import { Formik } from "formik";
import * as yup from "yup";
import { blue, grey } from "@mui/material/colors";
import * as ConfigApi from "../../../api/configsApi";
import moment from "moment";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ReactRRuleGenerator from "../../../components/ReactRRuleGenerator";


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
  const [isCopied, setIsCopied] = useState(false);
  const [rrule, setRrule] = useState(
    "DTSTART:20190301T230000Z\nFREQ=YEARLY;BYMONTH=1;BYMONTHDAY=1"
  );

  const handleChange = (newRRule) => {
    setRrule(newRRule);
    setIsCopied(false);
  };

  const handleCopy = () => {
    setIsCopied(true);
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

  return (
    /*
    for SetConfig
    Set lvlOfApproval
    depend on the level, add approver selector. Use input selector with autocomplete username or name
    Set defaultValue. Use data type selector, depend on the data type input, bring the match input defaultValue component
    Set timeSpan with Hours and Minutes input
    Set repeatable checkbox
    Abort status
    */
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
              <div>
                <div className="app container">
                  <ReactRRuleGenerator
                    onChange={handleChange}
                    value={rrule}
                    config={{
                      hideStart: false,
                    }}
                  />
                </div>

                <hr className="mt-5 mb-5" />

                <div className="container">
                  <h5>
                    <strong>Example handling</strong>
                  </h5>

                  <div className="px-3 pt-3 border rounded">
                    <div className="form-group row d-flex align-items-sm-center">
                      <div className="col-sm-2 text-sm-right">
                        <span className="col-form-label">
                          <strong>RRule</strong>
                        </span>
                      </div>

                      <div className="col-sm-8">
                        <StyledTextarea
                          aria-label="minimum height"
                          minRows={3}
                          placeholder="Minimum 3 rows"
                          className={`form-control rrule ${
                            isCopied ? "rrule-copied" : "rrule-not-copied"
                          }`}
                          value={rrule}
                          readOnly
                        />
                      </div>

                      <div className="col-sm-2">
                        <CopyToClipboard text={rrule} onCopy={handleCopy}>
                          <button
                            aria-label="Copy generated RRule"
                            className={`btn ${
                              isCopied ? "btn-secondary" : "btn-primary"
                            } float-right`}>
                            {isCopied ? "Copied" : "Copy"}
                          </button>
                        </CopyToClipboard>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="mt-5 mb-5" />
              </div>
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
