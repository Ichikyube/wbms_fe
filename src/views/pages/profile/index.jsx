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
import { useSelector } from "react-redux";

import { Formik } from "formik";
import { red, blue } from "@mui/material/colors";
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
import EditPassword from "../../../views/pages/profile/editPassword";
import * as UsersAPI from "../../../api/usersApi";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RangeSelectionModule,
  RowGroupingModule,
  RichSelectModule,
]);

const Profile = () => {
  const path = process.env.REACT_APP_WBMS_BACKEND_IMG_URL;

  const { userInfo } = useSelector((state) => state.app);

  const [isOpen, setIsOpen] = useState(false);
  const [dtuser, setDtUser] = useState([]);
  const [image, setImage] = useState(null);
  const [initialImage, setInitialImage] = useState(false);
  const [editedData, setEditedData] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file ? URL.createObjectURL(file) : null);
    setInitialImage(false);
  };

  useEffect(() => {
    if (Object.keys(editedData).length > 0) {
      UsersAPI.update(userInfo.id, editedData).then((res) => {
        setDtUser(res.data.user.records);
        setEditedData({}); // Reset editedData setelah berhasil disimpan
      });
    }
  }, [editedData, userInfo.id]);
  console.log(dtuser, "data user");

  const handleFormSubmit = (editedValues) => {
    setEditedData(editedValues); // Simpan perubahan ke dalam editedData
  };

  return (
    <>
      <Typography
        sx={{ fontSize: "25px", fontWeight: "bold", mt: 2, mb: 3, ml: 2 }}
      >
        Profile
      </Typography>
      <Formik onSubmit={handleFormSubmit} initialValues={userInfo}>
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
                        {/* <div
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
                        </div> */}

                        <div
                          style={{
                            width: "250px",
                            height: "250px",
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
                                width: "250px",
                                height: "250px",
                              }}
                            >
                              <img
                                src={`${path}${userInfo.profilePic}`}
                                alt="Uploaded Preview"
                                style={{
                                  width: "250px",
                                  height: "250px",
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
                        sx={{
                          fontSize: "25px",
                          fontWeight: "bold",
                          mb: 1,
                          mt: 5,
                        }}
                      >
                        {userInfo.name}
                      </Typography>
                      <Typography sx={{ fontSize: "18px", mb: 8 }}>
                        {userInfo.role}
                      </Typography>

                      <Button
                        fullwidth
                        type="submit"
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
                          No.Telp
                        </FormLabel>
                        <TextField
                          fullWidth
                          sx={{ backgroundColor: "whitesmoke" }}
                          type="text"
                          placeholder=" No Telephon"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{ readOnly: true }}
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
                          Division
                        </FormLabel>
                        <TextField
                          fullWidth
                          sx={{ backgroundColor: "whitesmoke" }}
                          type="text"
                          placeholder="Division"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{ readOnly: true }}
                          value={values.division}
                          name="division"
                          error={!!touched.division && !!errors.division}
                          helperText={touched.division && errors.division}
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
                          Position
                        </FormLabel>
                        <TextField
                          fullWidth
                          sx={{ backgroundColor: "whitesmoke" }}
                          type="text"
                          placeholder=" Position"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{ readOnly: true }}
                          value={values.position}
                          name="position"
                          error={!!touched.position && !!errors.position}
                          helperText={touched.position && errors.position}
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
                          Alamat
                        </FormLabel>
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          sx={{ backgroundColor: "whitesmoke" }}
                          type="text"
                          placeholder="Alamat....."
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.alamat}
                          inputProps={{ readOnly: true }}
                          name="alamat"
                          error={!!touched.alamat && !!errors.alamat}
                          helperText={touched.alamat && errors.alamat}
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