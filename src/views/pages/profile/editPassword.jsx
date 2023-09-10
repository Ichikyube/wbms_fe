import { useState, React } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Button,
  Box,
  FormControl,
  IconButton,
  FormLabel,
  TextField,
  DialogActions,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { Formik } from "formik";
import * as yup from "yup";
import { grey, red } from "@mui/material/colors";
import * as ProvinceApi from "../../../api/provinceApi";

const EditPassword = ({ isOpen, onClose }) => {
  // Create
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    ProvinceApi.create(values)
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

  const initialValues = {
    password: "",
    passwordNew: "",
    confirmPassword: "",
  };

  const checkoutSchema = yup.object().shape({
    password: yup
      .string()
      .required("Password lama harus diisi")
      .min(6, "Password harus memiliki minimal 6 karakter"),
    passwordNew: yup
      .string()
      .required("Password baru harus diisi")
      .min(6, "Password harus memiliki minimal 6 karakter"),

    confirmPassword: yup
      .string()
      .required("Konfirmasi password harus diisi")
      .oneOf([yup.ref("password"), null], "Password tidak cocok"),
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Dialog open={isOpen} fullWidth maxWidth={"sm"}>
      <DialogTitle
        sx={{ color: "white", backgroundColor: "#c62828", fontSize: "28px" }}
      >
        Ganti Password
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
          <CloseIcon sx={{ fontSize: "30px" }} />
        </IconButton>
      </DialogTitle>

      <Formik
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
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
            <DialogContent dividers>
              <Box
                display="grid"
                p={1}
                pt={3}
                pb={3}
                gap="35px"
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
                    Password Lama
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukan Password ..."
                    value={values.password}
                    onChange={handleChange}
                    name="password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={togglePasswordVisibility}>
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    error={!!touched.password && !!errors.password}
                    helperText={touched.password && errors.password}
                  />
                </FormControl>
                <FormControl sx={{ gridColumn: "span 4" }}>
                  <FormLabel
                    sx={{
                      color: "black",
                      marginBottom: "8px",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    Password Baru
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder="Masukan Password Baru ..."
                    value={values.passwordNew}
                    onChange={handleChange}
                    name="passwordNew"
                    error={!!touched.passwordNew && !!errors.passwordNew}
                    helperText={touched.passwordNew && errors.passwordNew}
                  />
                </FormControl>
                <FormControl sx={{ gridColumn: "span 4" }}>
                  <FormLabel
                    sx={{
                      color: "black",
                      marginBottom: "8px",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    Re-type Password Baru
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder="Confirm Password ..."
                    value={values.confirmPassword}
                    onChange={handleChange}
                    name="confirmPassword"
                    error={
                      !!touched.confirmPassword && !!errors.confirmPassword
                    }
                    helperText={
                      touched.confirmPassword && errors.confirmPassword
                    }
                  />
                </FormControl>
              </Box>
            </DialogContent>
            <Box display flex p={1}>
              <DialogActions>
                <Box mr="auto" ml={4}>
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
                </Box>
                <Box mr={4}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      backgroundColor: red[700],
                      color: "white",
                    }}
                  >
                    Simpan
                  </Button>
                </Box>
              </DialogActions>
            </Box>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};

export default EditPassword;
