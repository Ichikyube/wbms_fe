import { useState, useEffect, useRef, useCallback } from "react";
import {
  Grid,
  Paper,
  Button,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import useSWR from "swr";
import { orange, blue, red, indigo, green } from "@mui/material/colors";
import "ag-grid-enterprise";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { RangeSelectionModule } from "@ag-grid-enterprise/range-selection";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { RichSelectModule } from "@ag-grid-enterprise/rich-select";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { ModuleRegistry } from "@ag-grid-community/core";
import AddIcon from "@mui/icons-material/Add";
import * as React from "react";
import * as UsersAPI from "../../../api/usersApi";

import Tables from "../../../components/Tables";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CreateUsers from "../../../views/usermanagement/userslist/createUser";
import EditUsers from "../../../views/usermanagement/userslist/editUser";
import Swal from "sweetalert2";
import * as RolesAPI from "../../../api/roleApi";
import { useParams } from "react-router-dom";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RangeSelectionModule,
  RowGroupingModule,
  RichSelectModule,
]);

const ViewRole = () => {
  // console.clear();
  const gridRef = useRef();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { id } = useParams();
  const [role, setRole] = useState(null);

  const fetcher = () => UsersAPI.getAll().then((res) => res.data.user.records);

  useEffect(() => {
    RolesAPI.getById(id)
      .then((res) => {
        setRole(res);
      })
      .catch((error) => {
        console.error("Error fetching role data:", error);
      });
  }, [id]);

  // search

  const [searchQuery, setSearchQuery] = useState("");

  const { data: dtUser } = useSWR(
    searchQuery ? `user?name_like=${searchQuery}` : "user",
    fetcher
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

  // delete
  const deleteById = (id, name) => {
    Swal.fire({
      title: `Yakin Ingin Menghapus?`,
      html: `<span style="font-weight: bold; font-size: 28px;">"${name}"</span>`,
      icon: "question",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: "#D80B0B",
      cancelButtonColor: "grey",
      cancelButtonText: "Cancel",
      confirmButtonText: "Hapus",
    }).then((result) => {
      if (result.isConfirmed) {
        UsersAPI.deleteById(id)
          .then((res) => {
            console.log("Data berhasil dihapus:", res.data);
            toast.success("Data berhasil dihapus"); // Tampilkan toast sukses
            // Lakukan tindakan tambahan atau perbarui state sesuai kebutuhan
          })
          .catch((error) => {
            console.error("Data Gagal dihapus:", error);
            toast.error("Data Gagal dihapus"); // Tampilkan toast error
            // Tangani error atau tampilkan pesan error
          });
      }
    });
  };

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

    {
      headerName: "Action",
      field: "id",
      sortable: true,
      cellRenderer: (params) => {
        return (
          <Box display="flex" justifyContent="center">
            <Box
              width="25%"
              display="flex"
              m="0 3px"
              bgcolor={orange[600]}
              borderRadius="5px"
              justifyContent="center"
              padding="10px 10px"
              color="white"
              style={{
                textDecoration: "none",
                cursor: "pointer",
              }}
              onClick={() => {
                setSelectedUser(params.data);
                setIsEditOpen(true);
              }}
            >
              <BorderColorOutlinedIcon sx={{ fontSize: "20px" }} />
            </Box>

            <Box
              width="25%"
              display="flex"
              m="0 3px"
              bgcolor={red[800]}
              borderRadius="5px"
              padding="10px 10px"
              justifyContent="center"
              color="white"
              onClick={() => deleteById(params.value, params.data.name)}
              style={{
                color: "white",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              <DeleteOutlineOutlinedIcon sx={{ fontSize: "20px" }} />
            </Box>
          </Box>
        );
      },
    },
  ]);

  return (
    <>
      <Grid container spacing={2} pl={8} pr={8}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              mb: 5,
              mx: 2,
              mt: 2,
              borderTop: "5px solid #000",
              borderRadius: "10px 10px 10px 10px",
            }}
          >
            <div
              className="ag-theme-alpine"
              style={{ width: "auto", height: "29vh" }}
            >
              <h4 ml={3}>{role.name}</h4>
              <br />
              <h6 sx={{ fontSize: "15px", fontWeight: "bold", color: "grey" }}>
                Total users with this role: 5
              </h6>
              <br />
              <Typography
                sx={{
                  fontSize: "15px",
                  color: "gray",
                  display: "flex",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                {role.description}
              </Typography>
            </div>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={9}>
          <Paper
            sx={{
              p: 3,
              mb: 5,
              mt: 2,
              borderTop: "5px solid #000",
              borderRadius: "10px 10px 10px 10px",
            }}
          >
            <div style={{ marginBottom: "5px" }}>
              <Box display="flex">
                <Typography fontSize="20px">Users </Typography>
                <Box display="flex" ml="auto">
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: blue[800],
                      fontSize: "12px",
                      padding: "8px 8px",
                      fontWeight: "bold",
                      color: "white",
                      marginLeft: "8px",
                      textTransform: "none",
                    }}
                    onClick={() => {
                      setIsOpen(true);
                    }}
                  >
                    <AddIcon sx={{ mr: "5px", fontSize: "19px" }} />
                    Tambah User
                  </Button>
                </Box>
              </Box>
              <hr sx={{ width: "100%" }} />
              <Box display="flex" pb={1}>
                <Box
                  display="flex"
                  borderRadius="5px"
                  ml="auto"
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

      {/* Create */}
      <CreateUsers isOpen={isOpen} onClose={setIsOpen} />

      {/* edit */}
      <EditUsers
        isEditOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        dtuser={selectedUser}
      />
    </>
  );
};

export default ViewRole;
