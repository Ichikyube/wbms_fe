import { React, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Box,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Formik } from "formik";

const ViewCities = ({ isViewOpen, onClose, dtCity }) => {
  return (
    <Dialog
      open={isViewOpen}
      fullWidth
      maxWidth="sm"
      onClose={() => onClose("", false)}
    >
      <DialogTitle
        sx={{ color: "white", backgroundColor: "black", fontSize: "27px" }}
      >
        Detail Data City
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
        <Formik initialValues={dtCity}>
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
                      marginBottom: "8px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Name
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Masukkan Name...."
                    inputProps={{ readOnly: true }}
                    type="text"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.name}
                    name="name"
                    error={!!touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                  />
                </FormControl>
                <FormControl sx={{ gridColumn: "span 4" }}>
                  <FormLabel
                    sx={{
                      color: "black",
                      marginBottom: "8px",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Province
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Pilih Province"
                    inputProps={{ readOnly: true }}
                    type="text"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.province.name}
                    name="provinceId"
                    error={!!touched.provinceId && !!errors.provinceId}
                    helperText={touched.provinceId && errors.provinceId}
                  />
                </FormControl>
              </Box>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCities;
