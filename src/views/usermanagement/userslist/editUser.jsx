import { useState, useEffect, useRef, React } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Select,
  MenuItem,
  Typography,
  Button,
  Box,
  FormControl,
  IconButton,
  FormLabel,
  TextField,
  Radio,
  Checkbox,
  RadioGroup,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CancelIcon from "@mui/icons-material/Cancel";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { toast } from "react-toastify";
import { Formik } from "formik";
import * as yup from "yup";
import { grey } from "@mui/material/colors";
import * as UserApi from "../../../api/usersApi";

const CreateUsers = ({ isEditOpen, onClose, dtuser }) => {
  // Create
  const handleFormSubmit = (values, { setSubmitting, resetForm }) => {
    UserApi.create(values)
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
    username: yup.string().required("required"),
    nik: yup.string().required("required").min(16, "Minimal 16 karakter"),
    email: yup
      .string()
      .email("Enter a valid email")
      .required("Email is required"),
    division: yup.string().required("required"),
    position: yup.string().required("required"),
    phone: yup.string().required("required"),
    password: yup
      .string()
      .required("Kata sandi harus diisi")
      .min(8, "Kata sandi minimal terdiri dari 8 karakter")
      .max(20, "Kata sandi tidak boleh lebih dari 20 karakter"),
    role: yup.string().required("required"),
  });

  const [image, setImage] = useState(null);
  const [initialImage, setInitialImage] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file ? URL.createObjectURL(file) : null);
    setInitialImage(false);
  };

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
                          onChange={handleImageChange}
                          value={values.file}
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
                      {image === null && dtuser.file && (
                        <img
                        src={`http://localhost:6005/images/${dtuser.file}`}
                          alt="Uploaded Preview"
                          style={{
                            width: "160px",
                            height: "160px",
                          }}
                        />
                      )}

                      {/* Jika gambar baru dipilih melalui input file, gambar yang baru akan ditampilkan */}
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
                      {/* Jika gambar baru tidak dipilih dan tidak ada gambar yang diunggah sebelumnya, maka tampilkan gambar */}
                      {image === null && !initialImage && dtuser.file && (
                        <img
                          src={`http://localhost:6005/img/${dtuser.file}`}
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
                    placeholder="Masukkan Name"
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
                    Nik
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
                    Password
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="password"
                    placeholder="Masukkan Password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    name="password"
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
                    placeholder="Masukkan Division"
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
                    placeholder="Masukkan Position"
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
                      color: "black",
                      marginBottom: "8px",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    Role id
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan roleId"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.roleId}
                    name="roleId"
                    error={!!touched.roleId && !!errors.roleId}
                    helperText={touched.roleId && errors.roleId}
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
                    Role
                  </FormLabel>
                  <TextField
                    fullWth
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan role"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.role}
                    name="role"
                    error={!!touched.role && !!errors.role}
                    helperText={touched.role && errors.role}
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
                    isLDAPUser
                  </FormLabel>
                  {/* <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.isLDAPUser}
                        onChange={handleChange}
                        name="isLDAPUser"
                      />
                    }
                  /> */}
                  <Select
                    fullWidth
                    value={values.isLDAPUser}
                    name="isLDAPUser"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      -- LDAP User --
                    </MenuItem>
                    <MenuItem value={true}>YES</MenuItem>
                    <MenuItem value={false}>NO</MenuItem>
                  </Select>
                </FormControl>

                <FormControl
                  sx={{
                    gridColumn: "span 4",
                  }}
                >
                  <FormLabel
                    sx={{
                      color: "black",
                      marginBottom: "23px",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    Role
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                  >
                    <FormControlLabel
                      sx={{
                        "& .MuiSvgIcon-root": {
                          fontSize: 30,
                        },
                      }}
                      value="administrator"
                      control={<Radio />}
                      label={
                        <>
                          <Typography
                            sx={{
                              fontSize: "18px",
                              fontWeight: "bold",
                            }}
                          >
                            Administrator
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: "16px",
                              color: "grey",
                            }}
                          >
                            Administrator bertanggung jawab untuk membuat akun
                            pengguna baru dalam sistem. Administrator juga
                            bertugas memberikan atau mengatur hak akses dan izin
                            pengguna
                          </Typography>
                        </>
                      }
                    />
                    <hr />
                    <FormControlLabel
                      value="mill head"
                      control={<Radio />}
                      sx={{
                        "& .MuiSvgIcon-root": {
                          fontSize: 30,
                        },
                      }}
                      label={
                        <>
                          <Typography
                            sx={{
                              fontSize: "18px",
                              fontWeight: "bold",
                            }}
                          >
                            Mill Head
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: "16px",
                              color: "grey",
                            }}
                          >
                            Mill Head dapat memiliki akses untuk memantau dan
                            mengawasi proses produksi di pabrik . Ini termasuk
                            melihat data dan laporan produksi, mendapatkan
                            informasi terkini tentang progres produksi.
                          </Typography>
                        </>
                      }
                    />
                    <hr />
                    <FormControlLabel
                      value="manager"
                      control={<Radio />}
                      sx={{
                        "& .MuiSvgIcon-root": {
                          fontSize: 30,
                        },
                      }}
                      label={
                        <>
                          <Typography
                            sx={{
                              fontSize: "18px",
                              fontWeight: "bold",
                            }}
                          >
                            Manager
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: "16px",
                              color: "grey",
                            }}
                          >
                            Manager dapat memiliki hak akses untuk mengelola dan
                            mengawasi proses produksi di pabrik. Ini meliputi
                            memantau kinerja produksi, mengidentifikasi masalah
                            operasional.
                          </Typography>
                        </>
                      }
                    />
                    <hr />
                    <FormControlLabel
                      value="supervisor"
                      control={<Radio />}
                      sx={{
                        "& .MuiSvgIcon-root": {
                          fontSize: 30,
                        },
                      }}
                      label={
                        <>
                          <Typography
                            sx={{
                              fontSize: "18px",
                              fontWeight: "bold",
                            }}
                          >
                            Supervisor
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: "16px",
                              color: "grey",
                            }}
                          >
                            Supervisor dapat memiliki hak akses untuk mengawasi
                            staf dan operator. mengatur jadwal kerja, dan
                            memastikan bahwa tugas-tugas dilaksanakan dengan
                            tepat.
                          </Typography>
                        </>
                      }
                    />
                    <hr />
                    <FormControlLabel
                      value="staff"
                      control={<Radio />}
                      sx={{
                        "& .MuiSvgIcon-root": {
                          fontSize: 30,
                        },
                      }}
                      label={
                        <>
                          <Typography
                            sx={{
                              fontSize: "18px",
                              fontWeight: "bold",
                            }}
                          >
                            Staff
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: "16px",
                              color: "grey",
                            }}
                          >
                            Staff atau Operator dapat memiliki hak akses
                            melakukan proses penimbangan kelapa sawit,
                            memastikan kualitas produk, dan melaksanakan
                            tugas-tugas sesuai dengan prosedur yang ditetapkan.
                          </Typography>
                        </>
                      }
                    />
                  </RadioGroup>
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
