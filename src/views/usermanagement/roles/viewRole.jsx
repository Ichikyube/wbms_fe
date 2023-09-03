import { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Button,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
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
import { useQuery } from "react-query";
import Tables from "../../../components/Tables";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Swal from "sweetalert2";
import * as RolesAPI from "../../../api/roleApi";
import { useParams } from "react-router-dom";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component


ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RangeSelectionModule,
  RowGroupingModule,
  RichSelectModule,
]);

const ViewRole = ({dtRole, onClose, isViewOpen}) => {
  // console.clear();
  const gridRef = useRef();
  const role = dtRole
  console.log(role)
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const updateGridData = useCallback((user) => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.setRowData(user);
    }
  }, []);

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
    <Dialog open={isViewOpen} fullWidth maxWidth={"lg"}>
      <DialogTitle
        sx={{ color: "black", backgroundColor: "white", fontSize: "28px" }}
      >
        View Roles
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
                Total users with this role: {role.users.length}
              </h6>
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
          <div className="ag-theme-alpine" style={{ width: "auto", height: "70vh" }}>
            <AgGridReact
              ref={gridRef}
              rowData={role.users} // Row Data for Rows
              columnDefs={columnDefs} // Column Defs for Columns
              animateRows={true} // Optional - set to 'true' to have rows animate when sorted
              rowSelection="multiple" // Options - allows click selection of rows
              // rowGroupPanelShow="always"
              enableRangeSelection="true"
              groupSelectsChildren="true"
              suppressRowClickSelection="true"
              pagination="true"
              paginationAutoPageSize="true"
              groupDefaultExpanded="1"
            />
          </div>
          </Paper>
        </Grid>
      </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ViewRole;
