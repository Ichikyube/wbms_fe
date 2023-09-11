import { useState, useEffect, useRef, React } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Checkbox,
  Typography,
  Button,
  Box,
  FormControl,
  IconButton,
  FormLabel,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { Formik } from "formik";
import * as yup from "yup";
import { grey } from "@mui/material/colors";
import * as RoleAPI from "../../../api/roleApi";

const EditRoles = ({ isEditOpen, onClose, dtRole }) => {
  const handleFormSubmit = (values, { setSubmitting, resetForm }) => {
    RoleAPI.update(values)
      .then((res) => {
        console.log("Data Berhasil Disimpan:", res.data);
        toast.success("Data Berhasil Disimpan"); // Tampilkan toast sukses
        // Lakukan tindakan tambahan atau perbarui state sesuai kebutuhan
      })
      .catch((error) => {
        console.error("Data Gagal Disimpan:", error);
        toast.error("Data Gagal Disimpan: " + error.message); // Tampilkan pesan error spesifik
        // Tangani error atau tampilkan pesan error
      })
      .finally(() => {
        setSubmitting(false);
        resetForm();
        onClose("", false);
      });
  };

  const userSchema = yup.object().shape({
    name: yup.string().required("required"),
  });

  return (
    <Dialog open={isEditOpen} fullWidth maxWidth={"md"}>
      <DialogTitle
        sx={{ color: "black", backgroundColor: "white", fontSize: "28px" }}
      >
        Edit Roles
        <IconButton
          sx={{
            color: "black",
            position: "absolute",
            right: "15px",
            top: "20px",
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
          initialValues={dtRole}
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
                paddingBottom={3}
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
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    Role Name
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

                <FormLabel
                  sx={{
                    color: "black",
                    fontSize: "18px",
                    fontWeight: "bold",
                    marginTop: "25px",
                  }}
                >
                  Role Permissions
                </FormLabel>
                <FormControl
                  sx={{
                    gridColumn: "span 4",
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "5px",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}
                >
                  <FormLabel
                    sx={{
                      color: "black",

                      fontSize: "18px",
                    }}
                  >
                    Transaksi PKS
                  </FormLabel>
                  <FormControlLabel
                    sx={{ marginLeft: "auto" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Read
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ marginLeft: "88px", marginRight: "88px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Create/Edit/Delete
                        </Typography>
                      </>
                    }
                  />
                </FormControl>
                <FormControl
                  sx={{
                    gridColumn: "span 4",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}
                >
                  <FormLabel
                    sx={{
                      color: "black",

                      fontSize: "18px",
                    }}
                  >
                    Transaksi T-30
                  </FormLabel>
                  <FormControlLabel
                    sx={{ marginLeft: "auto" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Read
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ marginLeft: "88px", marginRight: "88px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Create/Edit/Delete
                        </Typography>
                      </>
                    }
                  />
                </FormControl>
                <FormControl
                  sx={{
                    gridColumn: "span 4",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}
                >
                  <FormLabel
                    sx={{
                      color: "black",

                      fontSize: "18px",
                    }}
                  >
                    Transaksi Labanan
                  </FormLabel>
                  <FormControlLabel
                    sx={{ marginLeft: "auto" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Read
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ marginLeft: "88px", marginRight: "88px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Create/Edit/Delete
                        </Typography>
                      </>
                    }
                  />
                </FormControl>
                <FormControl
                  sx={{
                    gridColumn: "span 4",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}
                >
                  <FormLabel
                    sx={{
                      color: "black",

                      fontSize: "18px",
                    }}
                  >
                    Report
                  </FormLabel>
                  <FormControlLabel
                    sx={{ marginLeft: "auto" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Read
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ marginLeft: "88px", marginRight: "88px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Create/Edit/Delete
                        </Typography>
                      </>
                    }
                  />
                </FormControl>
                <FormControl
                  sx={{
                    gridColumn: "span 4",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}
                >
                  <FormLabel
                    sx={{
                      color: "black",

                      fontSize: "18px",
                    }}
                  >
                    Master Data
                  </FormLabel>
                  <FormControlLabel
                    sx={{ marginLeft: "auto" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Read
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ marginLeft: "88px", marginRight: "88px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Create/Edit/Delete
                        </Typography>
                      </>
                    }
                  />
                </FormControl>
              </Box>
              <Box display="flex" mt={3} mb={4} justifyContent="center">
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: grey[700],
                    color: "white",
                    textTransform: "none",
                    fontSize: "16px",
                  }}
                  onClick={() => {
                    onClose("", false);
                  }}
                >
                  Cancel
                </Button>
                <Box mr={1} />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    color: "white",
                    textTransform: "none",
                    fontSize: "16px",
                  }}
                >
                  Simpan
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default EditRoles;