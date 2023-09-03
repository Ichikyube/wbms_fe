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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CancelIcon from "@mui/icons-material/Cancel";
import AddCircleIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import { Formik } from "formik";
import * as yup from "yup";
import { grey } from "@mui/material/colors";
import * as UserApi from "../../../api/usersApi";

const EditUsers = ({ isEditOpen, onClose, dtuser, dtRole }) => {
  const path = process.env.REACT_APP_WBMS_BACKEND_IMG_URL;
  const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
    const {
      id,
      name,
      username,
      nik,
      email,
      file,
      position,
      division,
      phone,
      roleId,
      isLDAPUser,
      role,
    } = values;
    const dto = {
      id,
      name,
      username,
      nik,
      email,
      file,
      position,
      division,
      phone,
      roleId,
      isLDAPUser,
      role,
    };
    try {
      await UserApi.update(dto);
      console.log("Data Berhasil Diperbarui:", dto);
      toast.success("Data Berhasil Diperbarui"); // Tampilkan toast sukses
      // Lakukan tindakan tambahan atau perbarui state sesuai kebutuhan
    } catch (error) {
      console.error("Data Gagal Diperbarui:", error);
      toast.error("Data Gagal Diperbarui: " + error.message); // Tampilkan pesan error spesifik
      // Tangani error atau tampilkan pesan error
    } finally {
      setSubmitting(false);
      resetForm();
      handleResetImage();
      onClose("", false);
    }
  };

  const userSchema = yup.object().shape({
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
    // password: yup
    //   .string()
    //   .required("Kata sandi harus diisi")
    //   .min(8, "Kata sandi minimal terdiri dari 8 karakter")
    //   .max(20, "Kata sandi tidak boleh lebih dari 20 karakter"),
    role: yup.string().required("required"),
  });

  const [image, setImage] = useState(null);
  const [initialImage, setInitialImage] = useState(false);

  const handleResetImage = () => {
    // Menghapus gambar yang baru dipilih saat tombol reset diklik
    setImage(null);
    setInitialImage(true);
  };

  return (
    <Dialog open={isEditOpen} fullWidth maxWidth={"md"}>
      <DialogTitle
        sx={{ color: "black", backgroundColor: "white", fontSize: "28px" }}
      >
        Edit User
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
          initialValues={dtuser}
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
          }) => {
            return (
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

                      {/* Ikon "Add" untuk memilih gambar */}

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

                              // Baca file gambar yang dipilih menggunakan FileReader
                              reader.onloadend = () => {
                                setImage(reader.result); // Simpan hasil pembacaan sebagai state "image"
                                setInitialImage(true); // Set initialImage menjadi true untuk menandakan bahwa ada gambar yang dipilih
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
                        {/* Gambar ditampilkan terlebih dahulu */}
                        {image === null && dtuser.profile.profilePic && (
                          <img
                            src={`${path}${dtuser.profile.profilePic}`}
                            alt="Uploaded Preview"
                            style={{
                              width: "160px",
                              height: "160px",
                            }}
                          />
                        )}

                        {/* Jika gambar baru dipilih melalui input profilePic, gambar yang baru akan ditampilkan */}
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
                      placeholder="Masukkan Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.profile.name}
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
                      placeholder="Masukkan Email"
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
                      placeholder="Masukkan No Telepon"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.profile.phone}
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
                      placeholder="Masukkan Nik"
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
                      placeholder="Masukkan Username"
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
                      Division
                    </FormLabel>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="text"
                      placeholder="Masukkan Division"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.profile.division}
                      name="profile.division"
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
                      placeholder="Masukkan Position"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.profile.position}
                      name="profile.profile.position"
                      error={!!touched.position && !!errors.position}
                      helperText={touched.position && errors.position}
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
                      checked={values.isLDAPUser === true}
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
            );
          }}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default EditUsers;
