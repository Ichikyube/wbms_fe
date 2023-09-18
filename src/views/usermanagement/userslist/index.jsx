import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import {
  useSaveGroupMappingMutation,
  addPJ1,
  addPJ2,
  addPJ3,
  removeUser,
  fetchGroupMappingData,
} from "../../../slices/groupMappingSlice";
import {
  setGroup,
  toggleSelectionMode,
} from "../../../slices/selectionModeSlice";

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
import Badge from "@mui/material/Badge";

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
  const { userInfo } = useSelector((state) => state.app);
  const selectionMode = useSelector((state) => state.selectionMode);
  const groupMap = useSelector((state) => state.groupMapping);
  const [saveGroupMapping] = useSaveGroupMappingMutation();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [dtRole, setDtRole] = useState([]);

  const fetcher = () => UsersAPI.getAll().then((res) => res.data.user.records);

  useEffect(() => {
    RoleAPI.getAll().then((res) => {
      console.log(res)
      setDtRole(res.data.roles.records);
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

  const handleUserClick = (userId) => {
    console.log(Object.keys(groupMap));
    if (Object.keys(groupMap).includes(userId)) {
      dispatch(removeUser(userId));
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

    if (groupMap[userId] === "PJ1") {
      return "magenta";
    } else if (groupMap[userId] === "PJ2") {
      return "purple";
    } else if (groupMap[userId] === "PJ3") {
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
      {(userInfo?.role === "adminIT" || userInfo?.role === "admin_HC") && (
        <>
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
        </>
      )}
    </Box>
  );
  const valueGetter = (params) => {
    return `${params.node.rowIndex + 1}   ${
      groupMap[params.data.id] ? "[" + groupMap[params.data.id] + "]" : ""
    }`;
  };
  const staffcolumn = [
    {
      headerName: "No",
      field: "no",
      filter: true,
      sortable: true,
      hide: false,
      flex: 1,
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
  ];
  const [columnDefs] = useState(
    userInfo?.role === "adminIT" || userInfo?.role === "admin_HC"
      ? [
          ...staffcolumn,
          {
            headerName: "Action",
            field: "id",
            sortable: true,
            cellRenderer,
          },
        ]
      : staffcolumn
  );
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
                          "&:hover": { backgroundColor: "deepPink" },
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
                          "&:hover": { backgroundColor: "plum" },
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
                          "&:hover": { backgroundColor: "dodgerBlue" },
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
                    </>
                  )}

                  {/* * tetapi apabila ada perbedaan, maka tampilkan daftar userMatrix approval berdasarkan group levelnya pada sweet alert dengan pertanyaan "apakah daftarnya sudah sesuai?".
                   * Apabila memilih yes, daftar akan disimpan dalam database, jika tidak maka muncul pertanyaan "apakah masih ingin memilih atau kembali pada pilihan sebelumnya".
                   * @returns ketika selesai memilih akan muncul alert berisi daftar user yg terdaftar sebagai approver level berapa
                   */}
                  {(userInfo?.role === "adminIT" ||
                    userInfo?.role === "admin_HC") && (
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
                        if (selectionMode.active) {
                          const selectedUser = JSON.stringify(groupMap);
                          const lastselected = localStorage.getItem("groupMap");

                          if (_.isEqual(selectedUser, lastselected)) {
                            //Ketika selesai memilih jika pilihan sama dengan daftar pada grupmap, maka tutup feature
                            console.log("Tidak ada perubahan");
                            return dispatch(toggleSelectionMode());
                          } else {
                            const groupLevel = Object.entries(groupMap).reduce(
                              (acc, [userId, groupName]) => {
                                if (!acc[groupName]) {
                                  acc[groupName] = [];
                                }
                                acc[groupName].push(
                                  dtUser.find((user) => user.id === userId)
                                    .username
                                );

                                return acc;
                              },
                              {}
                            );
                            const { PJ1, PJ2, PJ3 } = JSON.parse(
                              JSON.stringify(groupLevel)
                            );

                            console.log(PJ2);
                            Swal.fire({
                              title: `PJ LVL 1 = ${PJ1},\n PJ LVL 2 = ${PJ2},\n PJ LVL 3 = ${PJ3}.\n  Apakah daftarnya sudah sesuai?`,
                              icon: "question",
                              showCancelButton: true,
                              confirmButtonText: "Yes",
                              cancelButtonText: "No",
                            }).then((result) => {
                              if (result.isConfirmed) {
                                console.log(
                                  "Daftar disimpan dalam database:",
                                  groupLevel
                                );
                                saveGroupMapping({ groupMap });
                                dispatch(fetchGroupMappingData());
                                dispatch(toggleSelectionMode());
                              } else if (
                                result.dismiss === Swal.DismissReason.cancel
                              ) {
                                Swal.fire({
                                  title:
                                    "Apakah masih ingin memilih atau kembali pada pilihan sebelumnya?",
                                  icon: "question",
                                  showCancelButton: true,
                                  confirmButtonText: "Masih ingin memilih",
                                  cancelButtonText:
                                    "Kembali pada pilihan sebelumnya",
                                }).then((choiceResult) => {
                                  if (choiceResult.isConfirmed) {
                                    // Kode untuk membiarkan user melanjutkan memilih
                                  } else if (
                                    choiceResult.dismiss ===
                                    Swal.DismissReason.cancel
                                  ) {
                                    console.log(
                                      "Kembali pada pilihan sebelumnya"
                                    );
                                    // Kode untuk mengatur kembali pada pilihan sebelumnya
                                  }
                                });
                              }
                            });
                          }
                        } else dispatch(toggleSelectionMode());
                      }}>
                      {selectionMode.active ? "Selesai Memilih" : "Pilih PJ"}
                    </Button>
                  )}
                  {(userInfo?.role === "adminIT" ||
                    userInfo?.role === "admin_HC") && (
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
                  )}
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
