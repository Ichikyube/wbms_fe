import React from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { Formik } from "formik";
import * as yup from "yup";
import { grey } from "@mui/material/colors";
import * as ProvinceApi from "../../../api/provinceApi";

const EditProvince = ({ isEditOpen, onClose, dtProvince }) => {
  const userSchema = yup.object().shape({
    name: yup.string().required("required"),
  });

  const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await ProvinceApi.update(values);
      console.log("Data Berhasil Diperbarui:", values);
      toast.success("Data Berhasil Diperbarui"); // Tampilkan toast sukses
      // Lakukan tindakan tambahan atau perbarui state sesuai kebutuhan
    } catch (error) {
      console.error("Data Gagal Diperbarui:", error);
      toast.error("Data Gagal Diperbarui: " + error.message); // Tampilkan pesan error spesifik
      // Tangani error atau tampilkan pesan error
    } finally {
      setSubmitting(false);
      resetForm();
      onClose("", false);
    }
  };

  return (
    <Dialog
      open={isEditOpen}
      fullWidth
      maxWidth="md"
      onClose={() => onClose("", false)}
    >
      <DialogTitle
        sx={{ color: "white", backgroundColor: "black", fontSize: "27px" }}
      >
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
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={dtProvince}
          validationSchema={userSchema}
        >
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
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              >
                <FormControl sx={{ gridColumn: "span 4" }}>
                  <FormLabel
                    sx={{
                      marginBottom: "8px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
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
                    error={!!touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                    id="name-input"
                  />
                </FormControl>
                <FormControl sx={{ gridColumn: "span 2" }}>
                  <FormLabel
                    sx={{
                      marginBottom: "8px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Tanggal Mulai
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="date"
                    placeholder="Masukkan Tanggal Mulai..."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.licenseED}
                    name="licenseED"
                    error={!!touched.licenseED && !!errors.licenseED}
                    helperText={touched.licenseED && errors.licenseED}
                  />
                </FormControl>
                <FormControl sx={{ gridColumn: "span 2" }}>
                  <FormLabel
                    sx={{
                      marginBottom: "8px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Tanggal Akhir
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="date"
                    placeholder="Masukkan Tanggal Akhir..."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.licenseED}
                    name="licenseED"
                    error={!!touched.licenseED && !!errors.licenseED}
                    helperText={touched.licenseED && errors.licenseED}
                  />
                </FormControl>
                <FormControl sx={{ gridColumn: "span 4" }}>
                  <FormLabel
                    sx={{
                      marginBottom: "8px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Sites
                  </FormLabel>
                  <Autocomplete
                    multiple
                    options={["Pks4", "Pks3", "Pks1","Pks2", "Pks9", "Pks11","Pks5", "Pks6", "Pks7","Pks10", "Pks12", "Pks15"]}
                    getOptionLabel={(option) => option}
                    value={values.sites}
                    onChange={(event, newValue) => {
                      // Handle changes to the selected values
                      setFieldValue("Sites", newValue);
                    }}
                    onBlur={handleBlur}
                    name="Sites"
                    isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                       
                        error={touched.sites && !!errors.sites}
                      />
                    )}
                    renderValue={(selected) => selected.join(", ")}
                  />
                </FormControl>
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
                  }}
                >
                  Cancel
                </Button>
                <Box ml="auto" mr={3}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      color: "white",
                    }}
                  >
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

export default EditProvince;
