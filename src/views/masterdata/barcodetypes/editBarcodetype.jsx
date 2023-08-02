import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  FormControl,
  IconButton,
  FormLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { Formik } from "formik";
import * as yup from "yup";
import { grey } from "@mui/material/colors";
import * as BarcodeTypesAPI from "../../../api/barcodetypeApi";

const EditBarcodetypes = ({ isEditOpen, onClose, dtBarcodeTypes }) => {
  const userSchema = yup.object().shape({
    name: yup.string().required("required"),
    shortDesc: yup.string().required("required"),
  });

  // Edit
  const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await BarcodeTypesAPI.update(values);
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
      maxWidth="sm"
      onClose={() => onClose("", false)}
    >
      <DialogTitle
        sx={{ color: "white", backgroundColor: "black", fontSize: "27px" }}
      >
        Edit Data Barcode Type
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
          initialValues={dtBarcodeTypes}
          validationSchema={userSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                padding={2}
                paddingBottom={2}
                paddingLeft={3}
                paddingRight={3}
                gap="20px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              >
                <FormControl sx={{ gridColumn: "span 4" }}>
                  <FormLabel
                    sx={{
                      color: "black",
                      marginBottom: "8px",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Nama
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Nama"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    name="name"
                    error={!!touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
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
                    Short Deskripsi
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Short Deskripsi"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.shortDesc}
                    name="shortDesc"
                    error={!!touched.shortDesc && !!errors.shortDesc}
                    helperText={touched.shortDesc && errors.shortDesc}
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

export default EditBarcodetypes;
