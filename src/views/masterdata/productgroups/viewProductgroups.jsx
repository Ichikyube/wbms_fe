import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Box,
  FormControl,
  IconButton,
  FormLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Formik } from "formik";

const ViewProductgroups = ({ isViewOpen, onClose, dtProductgroup }) => {
  return (
    <Dialog
      open={isViewOpen}
      fullWidth
      maxWidth="md"
      onClose={() => onClose("", false)}
    >
      <DialogTitle
        sx={{ color: "white", backgroundColor: "black", fontSize: "27px" }}
      >
        Detail Data Product Group
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

      <Formik initialValues={dtProductgroup}>
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <DialogContent dividers>
              <Box
                display="grid"
                padding={2}
                paddingBottom={2}
                paddingLeft={3}
                paddingRight={3}
                gap="20px"
                gridTemplateColumns="repeat(8, minmax(0, 1fr))"
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
                    inputProps={{ readOnly: true }}
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Nama"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.name}
                    name="name"
                    error={!!touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                  />
                  <FormLabel
                    sx={{
                      marginBottom: "8px",
                      marginTop: "23px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    ShortDesc
                  </FormLabel>
                  <TextField
                    fullWidth
                    inputProps={{ readOnly: true }}
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan shortDesc"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.shortDesc}
                    name="shortDesc"
                    error={!!touched.shortDesc && !!errors.shortDesc}
                    helperText={touched.shortDesc && errors.shortDesc}
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
                    Deskripsi
                  </FormLabel>
                  <TextField
                    fullWidth
                    multiline
                    inputProps={{ readOnly: true }}
                    rows={6}
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Deskripsi...."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.description}
                    name="description"
                    error={touched.description && !!errors.description}
                    helperText={touched.description && errors.description}
                  />
                </FormControl>
              </Box>
            </DialogContent>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};

export default ViewProductgroups;
