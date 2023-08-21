import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Grid,
  Paper,
  Button,
  FormControl,
  FormLabel,
  TextField,
  Box,
  Typography,
  Tooltip,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Formik } from "formik";
import useSWR from "swr";
import { red, blue } from "@mui/material/colors";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import "ag-grid-enterprise";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { RangeSelectionModule } from "@ag-grid-enterprise/range-selection";
import {
  RowGroupingModule,
  ValuesDropZonePanel,
} from "@ag-grid-enterprise/row-grouping";
import { RichSelectModule } from "@ag-grid-enterprise/rich-select";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { ModuleRegistry } from "@ag-grid-community/core";
import EditIcon from "@mui/icons-material/Edit";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import EditPassword from "../../../views/pages/profile/editPassword";
import * as UsersAPI from "../../../api/usersApi";

import PageHeader from "../../../components/PageHeader";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RangeSelectionModule,
  RowGroupingModule,
  RichSelectModule,
]);

const Profile = () => {
  const path = process.env.REACT_APP_WBMS_BACKEND_IMG_URL;
  const initialValues = {
    name: "",
  };
  const { userInfo } = useSelector((state) => state.app);

  const [isOpen, setIsOpen] = useState(false);
  const [dtuser, setDtUser] = useState([]);
  const [image, setImage] = useState(null);
  const [initialImage, setInitialImage] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file ? URL.createObjectURL(file) : null);
    setInitialImage(false);
  };

  useEffect(() => {
    UsersAPI.getById(userInfo.id).then((res) => {
      setDtUser(res.data.user.records);
    });
  }, [userInfo.id]);
  console.log(dtuser, "data user");
  return (
    <>
      <Typography
        sx={{ fontSize: "25px", fontWeight: "bold", mt: 2, mb: 3, ml: 2 }}
      >
        Profile
      </Typography>
      <Formik initialValues={userInfo}>
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={3}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    mx: 1,
                    borderTop: "5px solid #000",
                    borderRadius: "10px 10px 10px 10px",
                  }}
                >
                  <div
                    className="ag-theme-alpine"
                    style={{ width: "auto", height: "auto" }}
                  >
                    <Box
                      sx={{
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        display: "flex", // Mengatur tampilan secara vertikal
                        flexDirection: "column", // Mengatur tampilan secara vertikal
                      }}
                    >
                      {/* Tambahkan div kontainer untuk mengatur posisi */}
                      <div style={{ position: "relative" }}>
                        <div
                          style={{
                            position: "absolute",
                            top: "55px",
                            right: "10px",
                            cursor: "pointer",
                            zIndex: "1",
                            background: "#fff",
                            padding: "5px",
                            border: "1px solid #9e9e9e",
                            borderRadius: "50%",
                            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                          }}
                        >
                          <Tooltip title="Edit Profile">
                            <label htmlFor="imageInput">
                              <input
                                id="imageInput"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: "none" }}
                              />
                              <EditIcon
                                style={{ fontSize: "24px", color: "#3f51b5" }}
                              />
                            </label>
                          </Tooltip>
                        </div>

                        <div
                          style={{
                            width: "200px",
                            height: "200px",
                            borderRadius: "50%",
                            overflow: "hidden",
                            marginBottom: "15px",
                            marginTop: "47px",
                            border: "2px solid #9e9e9e",
                          }}
                        >
                          {/* Gambar ditampilkan terlebih dahulu */}
                          {image === null && (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "200px",
                                height: "200px",
                              }}
                            >
                              <img
                                src={`${path}${userInfo.profilePic}`}
                                alt="Uploaded Preview"
                                style={{
                                  width: "340px",
                                  height: "340px",
                                }}
                              />
                            </div>
                          )}

                          {/* Jika gambar baru dipilih melalui input file, gambar yang baru akan ditampilkan */}
                          {image && (
                            <div>
                              <img
                                src={image}
                                alt="Uploaded Preview"
                                style={{
                                  width: "200px",
                                  height: "200px",
                                  cursor: "move",
                                  objectFit: "cover",
                                }}
                                id="uploadedImage"
                              />
                            </div>
                          )}

                        </div>
                      </div>

                      <Typography
                        sx={{ fontSize: "24px", fontWeight: "bold", mb: 1 }}
                      >
                        {userInfo.name}
                      </Typography>
                      <Typography sx={{ fontSize: "15px", mb: 4 }}>
                        {userInfo.role}
                      </Typography>

                      <Button
                        fullwidth
                        variant="contained"
                        sx={{
                          backgroundColor: blue[700],
                          fontSize: "13px",
                          fontWeight: "bold",
                          color: "white",
                          width: "100%",
                          mb: 2,
                        }}
                      >
                        Edit Profile
                      </Button>
                      <Button
                        type="submit"
                        fullwidth
                        variant="contained"
                        sx={{
                          backgroundColor: red[700],
                          fontSize: "13px",
                          fontWeight: "bold",
                          color: "white",
                          width: "100%",
                          mb: 1,
                        }}
                        onClick={() => {
                          setIsOpen(true);
                        }}
                      >
                        Ganti Password
                      </Button>
                    </Box>
                  </div>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={9}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    mx: 1,
                    borderTop: "5px solid #000",
                    borderRadius: "10px 10px 10px 10px",
                  }}
                >
                  <div
                    className="ag-theme-alpine"
                    style={{ width: "auto", height: "auto" }}
                  >
                    <Box
                      display="grid"
                      margin={7}
                      my={14.2}
                      width="75%"
                      gap="30px"
                      gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                    >
                      <FormControl
                        sx={{
                          gridColumn: "span 4",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <FormLabel
                          sx={{
                            color: "black",
                            marginBottom: "8px",
                            fontSize: "18px",
                            fontWeight: "bold",
                            width: "15%",
                          }}
                        >
                          Name
                        </FormLabel>
                        <TextField
                          fullWidth
                          sx={{ backgroundColor: "whitesmoke" }}
                          type="text"
                          placeholder=" Name"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.name}
                          name="name"
                          error={!!touched.name && !!errors.name}
                          helperText={touched.name && errors.name}
                        />
                      </FormControl>
                      <FormControl
                        sx={{
                          gridColumn: "span 4",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <FormLabel
                          sx={{
                            color: "black",
                            marginBottom: "8px",
                            fontSize: "18px",
                            fontWeight: "bold",
                            width: "15%",
                          }}
                        >
                          Email
                        </FormLabel>
                        <TextField
                          fullWidth
                          sx={{ backgroundColor: "whitesmoke" }}
                          type="email"
                          placeholder=" Email"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.email}
                          name="email"
                          error={!!touched.email && !!errors.email}
                          helperText={touched.email && errors.email}
                        />
                      </FormControl>
                      <FormControl
                        sx={{
                          gridColumn: "span 4",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <FormLabel
                          sx={{
                            color: "black",
                            marginBottom: "8px",
                            fontSize: "18px",
                            fontWeight: "bold",
                            width: "15%",
                          }}
                        >
                          No.Telp
                        </FormLabel>
                        <TextField
                          fullWidth
                          sx={{ backgroundColor: "whitesmoke" }}
                          type="text"
                          placeholder=" No Telephon"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.phone}
                          name="phone"
                          error={!!touched.phone && !!errors.phone}
                          helperText={touched.phone && errors.phone}
                        />
                      </FormControl>
                      <FormControl
                        sx={{
                          gridColumn: "span 4",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}>
                        <FormLabel
                          sx={{
                            color: "black",
                            marginBottom: "8px",
                            fontSize: "18px",
                            fontWeight: "bold",
                            width: "15%",
                          }}>
                          Alamat
                        </FormLabel>
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          sx={{ backgroundColor: "whitesmoke" }}
                          type="text"
                          placeholder="Alamat"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.alamat}
                          name="alamat"
                          error={!!touched.nik && !!errors.nik}
                          helperText={touched.nik && errors.nik}
                        />
                      </FormControl>
                    </Box>
                  </div>
                </Paper>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
      <EditPassword isOpen={isOpen} onClose={setIsOpen} />
    </>
  );
};

export default Profile;