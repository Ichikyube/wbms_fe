import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  setGroup,
  toggleSelectionMode,
} from "../../../slices/selectionModeSlice";
import {
  addPJ1,
  removePJ1,
  clearSelectedPJ1,
} from "../../../slices/selectedPJ1Slice";
import {
  addPJ2,
  removePJ2,
  clearSelectedPJ2,
} from "../../../slices/selectedPJ2Slice";
import {
  addPJ3,
  removePJ3,
  clearSelectedPJ3,
} from "../../../slices/selectedPJ3Slice";
import {
  addUser,
  removeUser,
  clearSelectedUsers,
} from "../../../slices/selectedUsersSlice";

import {setGroupMapping} from "../../../slices/groupMappingSlice";
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
import {
  orange,
  blue,
  red,
  indigo,
  green,
  teal,
  lightBlue,
} from "@mui/material/colors";
import "ag-grid-enterprise";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { RangeSelectionModule } from "@ag-grid-enterprise/range-selection";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { RichSelectModule } from "@ag-grid-enterprise/rich-select";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { ModuleRegistry } from "@ag-grid-community/core";
import AddIcon from "@mui/icons-material/Add";
import FaceIcon from "@mui/icons-material/Face";
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
import ViewUsers from "../../../views/usermanagement/userslist/viewUser";
import Swal from "sweetalert2";
import * as RoleAPI from "../../../api/roleApi";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RangeSelectionModule,
  RowGroupingModule,
  RichSelectModule,
]);

const UsersList = () => {
  // console.clear();
  const gridRef = useRef();

  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const selectionMode = useSelector((state) => state.selectionMode);
  const selectedUsers = useSelector((state) => state.selectedUsers);
  const selectedPJ1 = useSelector((state) => state.selectedPJ1);
  const selectedPJ2 = useSelector((state) => state.selectedPJ2);
  const selectedPJ3 = useSelector((state) => state.selectedPJ3);
  const groupMap = useSelector((state) => state.groupMapping);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [dtRole, setDtRole] = useState([]);

  const fetcher = () => UsersAPI.getAll().then((res) => res.data.user.records);

  useEffect(() => {
    RoleAPI.getAll().then((res) => {
      setDtRole(res);
    });
  }, []);

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
  // Define an enum for the groups
  const Group = {
    PJ1: "PJ1",
    PJ2: "PJ2",
    PJ3: "PJ3",
  };
  const groupMapping = {};
  useEffect(() => {
    selectedPJ1.forEach((userId) => {
      groupMapping[userId] = "PJ1";
    });
    selectedPJ2.forEach((userId) => {
      groupMapping[userId] = "PJ2";
    });
    selectedPJ3.forEach((userId) => {
      groupMapping[userId] = "PJ3";
    });
    dispatch(setGroupMapping(groupMapping));
  }, [selectedPJ1, selectedPJ2, selectedPJ3, dispatch])
  
  const handleUserClick = (userId) => {
    // if (selectedUsers.includes(userId)) {
    //   dispatch(removeUser(userId));
    // } else {
    //   dispatch(addUser(userId));
    if (selectedPJ1.includes(userId)) {
      dispatch(removePJ1(userId));
    } else if(selectedPJ2.includes(userId)) {
      dispatch(removePJ2(userId));
    } else if(selectedPJ3.includes(userId)) {
      dispatch(removePJ3(userId));
    } else {
      // Add the user to the selected group based on the enum
      switch (selectionMode.group) {
        case Group.PJ1:
          dispatch(addPJ1(userId));
          break;
        case Group.PJ2:
          dispatch(addPJ2(userId));
          break;
        case Group.PJ3:
          dispatch(addPJ3(userId));
          break;
        default:
          break;
      }
    }
  };
  const getCellBackgroundColor = (params) => {
    const userId = params.data.id;
  
    if (selectedPJ1.includes(userId)) {
      return "magenta";
    } else if (selectedPJ2.includes(userId)) {
      return "purple";
    } else if (selectedPJ3.includes(userId)) {
      return "indigo";
    }
  
    return "none";
  };
  const cellRenderer = (params) => (
    <Box display="flex" justifyContent="center">
      {selectionMode.active && (
        <Box
          width="25%"
          display="flex"
          m="0 3px"
          bgcolor={indigo[700]}
          borderRadius="5px"
          padding="10px 10px"
          justifyContent="center"
          color="white"
          onClick={() => handleUserClick(params.data.id)}
          style={{
            background: getCellBackgroundColor(params),
            textDecoration: "none",
            cursor: "pointer",
          }}>
          <FaceIcon
            sx={{
              color: "white",
              fontSize: "20px",
              "&:hover": { color: "blue" },
            }}
          />
        </Box>
      )}

      <Box
        width="25%"
        display="flex"
        m="0 3px"
        bgcolor={indigo[700]}
        borderRadius="5px"
        padding="10px 10px"
        justifyContent="center"
        color="white"
        style={{
          textDecoration: "none",
          cursor: "pointer",
        }}
        onClick={() => {
          setSelectedUser(params.data);
          setIsViewOpen(true);
        }}>
        <VisibilityOutlinedIcon sx={{ fontSize: "20px" }} />
      </Box>
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
        }}>
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
        }}>
        <DeleteOutlineOutlinedIcon sx={{ fontSize: "20px" }} />
      </Box>
    </Box>
  );
  const valueGetter = (params) => {

    return `${params.node.rowIndex + 1} [${groupMap[params.data.id]?groupMap[params.data.id] : ""}]`;
  }
    

  const [columnDefs] = useState([
    {
      headerName: "No",
      field: "no",
      filter: true,
      sortable: true,
      hide: false,
      flex: 2,
      valueGetter,
    },

    {
      headerName: "Nama",
      field: "username",
      filter: true,
      sortable: true,
      hide: false,
      flex: 3,
    },
    {
      headerName: "NPK",
      field: "nik",
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
      cellRenderer: cellRenderer,
    },
  ]);
  const updatedColDefs = columnDefs.map((colDef) => {
    if (colDef.valueGetter) {
      colDef.valueGetter = valueGetter;
    }
    if (colDef.cellRenderer) {
      colDef.cellRenderer = cellRenderer;
    }
    return colDef;
  });
  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              mx: 3,
              mb: 5,
              mt: 2,
              borderTop: "5px solid #000",
              borderRadius: "10px 10px 10px 10px",
            }}>
            <div style={{ marginBottom: "5px" }}>
              <Box display="flex">
                <Typography fontSize="20px">Users List</Typography>
                <Box display="flex" ml="auto">
                  {selectionMode.active && (
                    <>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "magenta",
                          fontSize: "12px",
                          padding: "8px 8px",
                          fontWeight: "bold",
                          color: "white",
                          marginLeft: "8px",
                          textTransform: "none",
                        }}
                        onClick={() => dispatch(setGroup("PJ1"))}>
                        Tunjuk PJ1
                      </Button>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "purple",
                          fontSize: "12px",
                          padding: "8px 8px",
                          fontWeight: "bold",
                          color: "white",
                          marginLeft: "8px",
                          textTransform: "none",
                        }}
                        onClick={() => dispatch(setGroup("PJ2"))}>
                        Tunjuk PJ2
                      </Button>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "indigo",
                          fontSize: "12px",
                          padding: "8px 8px",
                          fontWeight: "bold",
                          color: "white",
                          marginLeft: "8px",
                          textTransform: "none",
                        }}
                        onClick={() => dispatch(setGroup("PJ3"))}>
                        Tunjuk PJ3
                      </Button>
                      {/* <Button
                        variant="contained"
                        sx={{
                          backgroundColor: teal[300],
                          "&:hover": { backgroundColor: teal[100] },
                          fontSize: "12px",
                          padding: "8px 8px",
                          fontWeight: "bold",
                          color: "white",
                          marginLeft: "8px",
                          textTransform: "none",
                        }}
                        onClick={() => setPilihPJ(false)}>
                        Selesai Memilih
                      </Button> */}
                    </>
                  )}
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: blue,
                      "&:hover": { backgroundColor: lightBlue[500] },
                      fontSize: "12px",
                      padding: "8px 8px",
                      fontWeight: "bold",
                      color: "white",
                      marginLeft: "8px",
                      textTransform: "none",
                    }}
                    onClick={() => {
                      dispatch(toggleSelectionMode());
                    }}>
                    {selectionMode.active ? "Selesai Memilih" : "Pilih PJ"}
                  </Button>
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
                    }}>
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
                  border="solid grey 1px">
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
                        User.profile.name
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                      );
                      gridRef.current.api.setRowData(filteredData);
                    }}>
                    <SearchIcon sx={{ mr: "3px", fontSize: "19px" }} />
                  </IconButton>
                </Box>
              </Box>
            </div>
            <Tables
              name={"user"}
              fetcher={fetcher}
              colDefs={updatedColDefs}
              gridRef={gridRef}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Create */}
      <CreateUsers isOpen={isOpen} onClose={setIsOpen} dtRole={dtRole} />

      {/* edit */}
      <EditUsers
        isEditOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        dtuser={selectedUser}
        dtRole={dtRole}
      />
      <ViewUsers
        isViewOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        dtuser={selectedUser}
        dtRole={dtRole}
      />
    </>
  );
};

export default UsersList;
