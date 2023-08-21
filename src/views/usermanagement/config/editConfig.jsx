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
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { format, addDays, addHours } from "date-fns";
import { Formik } from "formik";
import * as yup from "yup";
import { grey } from "@mui/material/colors";
import * as ConfigApi from "../../../api/configsApi";
import moment from "moment";

const EditConfig = ({ isEditOpen, onClose, dtConfig }) => {
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
          initialValues={dtConfig}
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
                    inputProps={{ readOnly: true }}
                    sx={{ backgroundColor: "whitesmoke" }}
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
                    type="datetime-local"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      if (
                        !values.end ||
                        new Date(e.target.value) <= new Date(values.end)
                      ) {
                        setFieldValue("status", "PENDING");
                      }
                    }}
                    value={
                      values.start
                        ? format(new Date(values.start), "yyyy-MM-dd'T'HH:mm")
                        : ""
                    }
                    name="start"
                    error={!!touched.start && !!errors.start}
                    helperText={touched.start && errors.start}
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
                    type="datetime-local"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={
                      values.end
                        ? format(new Date(values.end), "yyyy-MM-dd'T'HH:mm")
                        : ""
                    }
                    name="end"
                    error={!!touched.end && !!errors.end}
                    helperText={touched.end && errors.end}
                    // Nonaktifkan pilihan tanggal yang lebih dari 24 jam dari tanggal mulai
                    inputProps={{
                      max: format(
                        addDays(new Date(values.start), 1),
                        "yyyy-MM-dd'T'HH:mm"
                      ),
                      min: format(
                        addDays(new Date(values.start), 1),
                        "yyyy-MM-dd'T'HH:mm"
                      ),
                    }}
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

export default EditConfig;