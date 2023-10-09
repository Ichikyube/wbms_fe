import { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Button,
  Box,
  Chip,
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

const ViewRole = ({ dtRole, onClose, isViewOpen }) => {
  console.clear();
  const gridRef = useRef();
  const role = dtRole;

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
  ]);
  const [showGrants, setShowGrants] = useState(null);
  const toggleGrants = (index) => {
    setShowGrants(index === showGrants ? null : index);
  };
  return (
    <Dialog open={isViewOpen} fullWidth maxWidth>
      <DialogTitle
        sx={{ color: "black", backgroundColor: "white", fontSize: "28px" }}>
        <pre>
          View Role <strong>{role.name}</strong>
        </pre>
        <IconButton
          sx={{
            color: "black",
            position: "absolute",
            right: "15px",
            top: "20px",
          }}
          onClick={() => {
            onClose("", false);
          }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2} px={2}>
          <Grid item xs={12} sm={6} md={4} lg={4}>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                mb: 5,
                mx: 2,
                mt: 2,
                borderTop: "5px solid #000",
                borderRadius: "10px 10px 10px 10px",
              }}>
              <div
                className="ag-theme-alpine"
                style={{ width: "auto", height: "auto" }}>
                <h5>{role.description}</h5>
                <br />
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                  }}>
                  {role.permissions.map((permission, index) => (
                    <div style={{ position: "relative" }}>
                      <Chip
                        key={index}
                        label={permission.resource}
                        variant="outlined"
                        color="primary"
                        style={{ margin: "4px", position: "static" }}
                        onClick={(e, showGrants) => toggleGrants(index)}
                      />
                      {showGrants === index && (
                        <Box
                          sx={{
                            border: 1,
                            p: 1,
                            bgcolor: "background.paper",
                            position: "absolute",
                            zIndex: 1,
                          }}>
                          <h6>{permission.resource}</h6>
                          <ul>
                            {permission.grants.map((grant, index) => (
                              <li key={index}>
                                {grant.action}:{grant.possession}
                              </li>
                            ))}
                          </ul>
                        </Box>
                      )}
                    </div>
                  ))}
                </Box>
              </div>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={8}>
            <Paper
              sx={{
                p: 3,
                mb: 5,
                mt: 2,
                borderTop: "5px solid #000",
                borderRadius: "10px 10px 10px 10px",
              }}>
              <h6
                sx={{
                  fontSize: "15px",
                  fontWeight: "bold",
                  color: "grey",
                }}>
                Total users with this role: {role.users.length}
              </h6>
              <div
                className="ag-theme-alpine"
                style={{ width: "auto", height: "70vh" }}>
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
