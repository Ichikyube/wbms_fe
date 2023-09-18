import { useState, React } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  Button,
  Box,
  FormControl,
  IconButton,
  FormLabel,
  TextField,
  Tooltip,
  Checkbox,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import CancelIcon from "@mui/icons-material/Cancel";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { toast } from "react-toastify";
import { Formik } from "formik";
import * as yup from "yup";
import { grey } from "@mui/material/colors";
import * as UsersAPI from "../../../api/usersApi";
import moment from "moment";

const CreateUsers = ({ isOpen, onClose, dtRole }) => {
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    values.doB = moment(values.doB).toDate();

    UsersAPI.create(values)
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
        handleResetImage();
        onClose("", false);
      });
  };
  console.log(dtRole)
  const initialValues = {
    name: "",
    username: "",
    nik: "",
    email: "",
    password: "",
    file: "",
    position: "",
    division: "",
    phone: "",
    roleId: "",
    doB: "",
    alamat: "",
    isLDAPUser: false,
  };

  const checkoutSchema = yup.object().shape({
    name: yup.string().required("required"),
    username: yup.string().required("required"),
    nik: yup.string().required("required"),
    email: yup
      .string()
      .email("Enter a valid email")
      .required("Email is required"),
    division: yup.string().required("required"),
    position: yup.string().required("required"),
    phone: yup.string().required("required"),
    doB: yup.date().required("required"),
    alamat: yup.string(),
    roleId: yup.string().required("required"),
    file: yup.mixed().required("Gambar wajib diisi"),
  });

  const [image, setImage] = useState(null);
  const [initialImage, setInitialImage] = useState(false);

  const handleResetImage = () => {
    setImage(null); // Reset state "image" menjadi null untuk menghapus gambar yang dipilih
    setInitialImage(false); // Set initialImage menjadi false karena gambar telah dihapus
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Dialog open={isOpen} fullWidth maxWidth={"md"}>
      <DialogTitle
        sx={{ color: "black", backgroundColor: "white", fontSize: "28px" }}
      >
        Tambah User
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
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit} encType="multipart/form-data">
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
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    Profile
                  </FormLabel>
                  <Box mt={1} mb={1} position="relative">
                    {image && (
                      <label
                        htmlFor="cancelImage"
                        onClick={handleResetImage}
                        style={{
                          position: "absolute",
                          bottom: "-17px",
                          left: "138px",
                          cursor: "pointer",
                          zIndex: "1",
                          background: "#fff",
                          padding: "5px",
                          border: "1px solid #9e9e9e",
                          borderRadius: "50%",
                          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                        }}
                      >
                        <Tooltip title="Cancel Profile">
                          <CancelIcon
                            style={{ fontSize: "24px", color: "#ff0000" }}
                          />
                        </Tooltip>
                      </label>
                    )}

                    <label
                      htmlFor="imageInput"
                      style={{
                        position: "absolute",
                        top: "-17px",
                        left: "140px",
                        cursor: "pointer",
                        zIndex: "1",
                        background: "#fff",
                        padding: "5px",
                        border: "1px solid #9e9e9e",
                        borderRadius: "50%",
                        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      <Tooltip title="Pilih Profile">
                        <input
                          id="imageInput"
                          type="file"
                          accept="image/*"
                          name="file"
                          onChange={(event) => {
                            const selectedFile = event.target.files[0];
                            setFieldValue("file", selectedFile);
                            const reader = new FileReader();

                            reader.onloadend = () => {
                              setImage(reader.result);
                              setInitialImage(true);
                            };

                            if (selectedFile) {
                              reader.readAsDataURL(selectedFile);
                            }
                          }}
                          style={{ display: "none" }}
                        />
                        <AddCircleIcon
                          style={{ fontSize: "24px", color: "#3f51b5" }}
                        />
                      </Tooltip>
                    </label>

                    <div
                      style={{
                        position: "relative",
                        width: "160px",
                        height: "160px",
                        overflow: "hidden",
                        border: "2px solid #9e9e9e",
                      }}
                    >
                      {image === null && (
                        <img
                          src={`../../assets/user.jpg`}
                          alt="Uploaded Preview"
                          style={{
                            width: "160px",
                            height: "160px",
                          }}
                        />
                      )}

                      {image && (
                        <div>
                          <img
                            src={image}
                            alt="Uploaded Preview"
                            style={{
                              width: "160px",
                              height: "160px",
                              cursor: "move",
                            }}
                            id="uploadedImage"
                          />
                        </div>
                      )}

                      {image === null && !initialImage && (
                        <img
                          src={`../../assets/user.jpg`}
                          alt="Uploaded Preview"
                          style={{
                            width: "160px",
                            height: "160px",
                          }}
                        />
                      )}
                    </div>
                  </Box>
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
                    Name
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Nama....."
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
                      color: "black",
                      marginBottom: "8px",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    Email
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="email"
                    placeholder="Masukkan Email....."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    name="email"
                    error={!!touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
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
                    No Telepon
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan No Telepon....."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.phone}
                    name="phone"
                    error={!!touched.phone && !!errors.phone}
                    helperText={touched.phone && errors.phone}
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
                    NPK
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan NPK....."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.nik}
                    name="nik"
                    error={!!touched.nik && !!errors.nik}
                    helperText={touched.nik && errors.nik}
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
                    Username
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Username....."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.username}
                    name="username"
                    error={!!touched.username && !!errors.username}
                    helperText={touched.username && errors.username}
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
                    Password
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
                    Division
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Division....."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.division}
                    name="division"
                    error={!!touched.division && !!errors.division}
                    helperText={touched.division && errors.division}
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
                    Position
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Position....."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.position}
                    name="position"
                    error={!!touched.position && !!errors.position}
                    helperText={touched.position && errors.position}
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
                    Tanggal Lahir
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="date"
                    placeholder="Masukkan Tanggal Lahir..."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.doB}
                    name="doB"
                    error={!!touched.doB && !!errors.doB}
                    helperText={touched.doB && errors.doB}
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
                    Alamat
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    multiline
                    rows={4}
                    placeholder="Masukkan alamat....."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.alamat}
                    name="alamat"
                    error={!!touched.alamat && !!errors.alamat}
                    helperText={touched.alamat && errors.alamat}
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
                    Role
                  </FormLabel>
                  <Select
                    fullWidth
                    name="roleId"
                    value={values.roleId}
                    onChange={(event) => {
                      const { name, value } = event.target;
                      const selectedRole = dtRole.find(
                        (item) => item.id === value
                      );
                      setFieldValue(name, value);
                      setFieldValue(
                        "role",
                        selectedRole ? selectedRole.name : ""
                      );
                    }}
                    displayEmpty
                    sx={{
                      color: MenuItem ? "gray" : "black",
                    }}
                    error={!!touched.roleId && !!errors.roleId}
                    helperText={touched.roleId && errors.roleId}
                  >
                    <MenuItem value="" disabled>
                      -- Pilih Role --
                    </MenuItem>
                    {dtRole.map((item) => {
                      return (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
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
                      fontWeight: "bold",
                    }}
                  >
                    isLDAPUser
                  </FormLabel>
                  <Checkbox
                    checked={values.isLDAPUser}
                    onChange={(event) => {
                      const newValue = event.target.checked ? true : false;
                      setFieldValue("isLDAPUser", newValue);
                    }}
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

export default CreateUsers;
