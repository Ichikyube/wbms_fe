import { useState, useEffect, useRef, React, useCallback } from "react";
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
  Grid,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import useSWR from "swr";
import { orange, blue, red, indigo, green } from "@mui/material/colors";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { Formik } from "formik";
import * as yup from "yup";
import AddIcon from "@mui/icons-material/Add";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CreateUsers from "../../../views/usermanagement/userslist/createUser";
import EditUsers from "../../../views/usermanagement/userslist/editUser";
import Swal from "sweetalert2";
import * as RolesAPI from "../../../api/roleApi";
import * as UsersAPI from "../../../api/usersApi";
import { useQuery } from "react-query";
import Tables from "../../../components/Tables";

const EditRoles = ({ isViewOpen, onClose, dtRole }) => {
  const gridRef = useRef();

  const fetcher = () => UsersAPI.getAll().then((res) => res.data.user.records);
  // search

  const [searchQuery, setSearchQuery] = useState("");

  const { data: dtUser } = useSWR(
    searchQuery ? `user?name_like=${searchQuery}` : "user",
    fetcher,
    { refreshInterval: 1000 }
  );

  //filter
  const updateGridData = useCallback((user) => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.setRowData(user);
    }
  }, []);

  useEffect(() => {
    if (dtUser) {
      const filteredData = dtUser.filter((user) => {
        const userData = Object.values(user).join(" ").toLowerCase();
        return userData.includes(searchQuery.toLowerCase());
      });
      updateGridData(filteredData);
    }
  }, [searchQuery, dtUser, updateGridData]);

  const [columnDefs] = useState([
    {
      headerName: "No",
      field: "no",
      filter: true,
      sortable: true,
      hide: false,
      flex: 1,
      valueGetter: (params) => params.node.rowIndex + 1,
    },

    {
      headerName: "Nama",
      field: "name",
      filter: true,
      sortable: true,
      hide: false,
      flex: 3,
    },
    {
      headerName: "Role",
      field: "role",
      filter: true,
      sortable: true,
      hide: false,
      flex: 3,
    },
    {
      headerName: "Email",
      field: "email",
      filter: true,
      sortable: true,
      hide: false,
      flex: 3,
    },
  ]);
  return (
    <Dialog open={isViewOpen} fullWidth maxWidth="xl">
      <DialogContent dividers>
        <IconButton
          sx={{
            color: "black",
            position: "absolute",
            right: "10px",
            top: "10px",
          }}
          onClick={() => {
            onClose("", false);
          }}
        >
          <CloseIcon sx={{ fontSize: "25px" }} />
        </IconButton>
        <Formik initialValues={dtRole}>
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2} pl={3} pr={5}>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 3,

                      mt: 2,
                      borderTop: "5px solid #000",
                      borderRadius: "10px 10px 10px 10px",
                    }}
                  >
                    <div
                      className="ag-theme-alpine"
                      style={{ width: "auto", height: "29vh" }}
                    >
                      <h4 ml={3}>{values.name}</h4>
                      <br />
                      <h6
                        sx={{
                          fontSize: "15px",
                          fontWeight: "bold",
                          color: "grey",
                        }}
                      >
                        Total users with this role: 5
                      </h6>
                    </div>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={9}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 3,
                      mb: 2,
                      mt: 2,
                      borderTop: "5px solid #000",
                      borderRadius: "10px 10px 10px 10px",
                    }}
                  >
                    <div style={{ marginBottom: "5px" }}>
                      <Box display="flex">
                        <Typography fontSize="20px">Users </Typography>

                        <Box
                          display="flex"
                          borderRadius="5px"
                          ml="auto"
                          mb={2}
                          border="solid grey 1px"
                        >
                          <InputBase
                            sx={{ ml: 2, flex: 2, fontSize: "13px" }}
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />

                          <IconButton
                            type="button"
                            sx={{ p: 1 }}
                            onClick={() => {
                              const filteredData = dtUser.filter((User) =>
                                User.name
                                  .toLowerCase()
                                  .includes(searchQuery.toLowerCase())
                              );
                              gridRef.current.api.setRowData(filteredData);
                            }}
                          >
                            <SearchIcon sx={{ mr: "3px", fontSize: "19px" }} />
                          </IconButton>
                        </Box>
                      </Box>
                    </div>
                    <Tables
                      name={"user"}
                      fetcher={fetcher}
                      colDefs={columnDefs}
                      gridRef={gridRef}
                    />
                  </Paper>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default EditRoles;
