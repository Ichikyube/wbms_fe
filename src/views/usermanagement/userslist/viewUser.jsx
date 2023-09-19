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
  Table,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CancelIcon from "@mui/icons-material/Cancel";
import AddCircleIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import { Formik } from "formik";
import * as yup from "yup";
import { grey } from "@mui/material/colors";
import { format } from "date-fns";

const ViewUsers = ({ isViewOpen, onClose, dtuser, dtRole }) => {
  const path = process.env.REACT_APP_WBMS_BACKEND_IMG_URL;

  return (
    <Dialog open={isViewOpen} fullWidth maxWidth={"lg"}>
      <DialogContent dividers>
        <DialogTitle>
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
        <Formik initialValues={dtuser}>
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
                  gridTemplateColumns="repeat(11, minmax(0, 1fr))"
                >
                  <FormControl sx={{ gridColumn: "span 5" }}>
                    <Box
                      mt={1}
                      mb={2.5}
                      position="relative"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          width: "410px",
                          height: "410px",
                          overflow: "hidden",
                          border: "2px solid #9e9e9e",
                        }}
                      >
                        {/* Gambar ditampilkan terlebih dahulu */}
                        <img
                          src={`${path}${dtuser.profile.profilePic}`}
                          alt="Uploaded Preview"
                          style={{
                            width: "410px",
                            height: "410px",
                          }}
                        />
                      </div>
                    </Box>
                    <Typography
                      fontSize="21px"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontWeight: "bold",
                      }}
                    >
                      <tr>
                        <td>
                          <Box
                            sx={{
                              backgroundColor: "#b9f6ca",
                              border: "1px solid #388e3c",
                              px: 1,
                              py: 0.3,
                              borderRadius: "10px",
                              color: "#388e3c",
                            }}
                          >
                            {values.userRole.name}
                          </Box>
                        </td>
                      </tr>
                    </Typography>
                  </FormControl>
                  <Table striped sx={{ gridColumn: "span 6 " }}>
                    <tbody>
                      <Typography fontSize="20px">
                        <tr>
                          <td height="50" width="150">
                            Username
                          </td>
                          <td width="10">:</td>
                          <td>{values.username}</td>
                        </tr>
                        <tr height="50">
                          <td>Email</td>
                          <td width="10">:</td>
                          <td>{values.email}</td>
                        </tr>
                        <tr height="50">
                          <td>NIK</td>
                          <td width="20">:</td>
                          <td>{values.nik}</td>
                        </tr>
                        <tr height="50">
                          <td>Nama</td>
                          <td width="10">:</td>
                          <td>{values.profile.name}</td>
                        </tr>
                        <tr height="50">
                          <td>No Telepon</td>
                          <td width="10">:</td>
                          <td>{values.profile.phone}</td>
                        </tr>
                        <tr height="50">
                          <td>Division</td>
                          <td width="10">:</td>
                          <td>{values.profile.division}</td>
                        </tr>
                        <tr height="50">
                          <td>Position</td>
                          <td width="10">:</td>
                          <td>{values.profile.position}</td>
                        </tr>
                        <tr height="50">
                          <td>Tanggal Lahir</td>
                          <td width="10">:</td>
                          <td>
                            {format(
                              new Date(values.profile.doB),
                              "dd MMMM yyyy"
                            )}
                          </td>
                        </tr>

                        <tr height="50">
                          <td>Alamat</td>
                          <td width="10">:</td>
                          <td>{values.profile.alamat}</td>
                        </tr>
                        <tr>
                          <td>LDAP User</td>
                          <td width="10">:</td>
                          <td>{values.isLDAPUser ? "YES" : "NO"}</td>
                        </tr>
                      </Typography>
                    </tbody>
                  </Table>
                </Box>
              </form>
            );
          }}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default ViewUsers;