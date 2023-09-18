import { useState, useEffect, useRef, useCallback } from "react";
import {
  Grid,
  Paper,
  Button,
  Box,
  IconButton,
  Typography,
  Chip,
} from "@mui/material";
import { toast } from "react-toastify";
import useSWR from "swr";
import {
  red,
  blue,
  green,
  yellow,
  purple,
  indigo,
  pink,
  teal,
  cyan,
  lime,
  orange,
  deepOrange,
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
import * as React from "react";
import * as RoleAPI from "../../../api/roleApi";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Swal from "sweetalert2";
import ViewPermissions from "../../usermanagement/Permissions/viewPermissions";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RangeSelectionModule,
  RowGroupingModule,
  RichSelectModule,
]);

const Permissions = () => {
  console.clear();
  const gridRef = useRef();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const fetcher = () => RoleAPI.getAll().then((res) => res.data.roles.records);

  // search

  const [searchQuery, setSearchQuery] = useState("");

  const { data: Permissions } = useSWR(
    searchQuery ? `permissions?name_like=${searchQuery}` : "permissions",
    fetcher,
    { refreshInterval: 1000 }
  );

  //filter
  const updateGridData = useCallback((permissions) => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.setRowData(permissions);
    }
  }, []);

  useEffect(() => {
    if (Permissions) {
      const filteredData = Permissions.filter((permissions) => {
        const provinceData = Object.values(permissions).join(" ").toLowerCase();
        return provinceData.includes(searchQuery.toLowerCase());
      });
      updateGridData(filteredData);
    }
  }, [searchQuery, Permissions, updateGridData]);

  const permissionColors = [
    red[900],
    blue[900],
    green[900],
    yellow[900],
    purple[900],
    indigo[900],
    pink[900],
    lime[900],
    orange[900],
    deepOrange[900],
    cyan[900],
    teal[900],
  ];

  const permissionBgColors = [
    red[50],
    blue[50],
    green[50],
    yellow[50],
    purple[50],
    indigo[50],
    pink[50],
    lime[50],
    orange[50],
    deepOrange[50],
    cyan[50],
    teal[50],
  ];

  const [columnDefs] = useState([
    {
      headerName: "No",
      field: "no",
      filter: true,
      sortable: true,
      hide: false,
      resizable: true,
      flex: 1,
      valueGetter: (params) => params.node.rowIndex + 1,
    },
    {
      headerName: "Nama",
      field: "name",
      filter: true,
      sortable: true,
      hide: false,
      resizable: true,
      flex: 1,
    },
    {
      headerName: "Permissions",
      field: "permissions",
      filter: true,
      sortable: true,
      hide: false,
      resizable: true,
      flex: 8,
      cellRenderer: (params) => {
        return (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {params.value.map((permission, index) => (
              <div style={{ position: "relative" }} key={index}>
                <Chip
                  label={permission.resource}
                  style={{
                    margin: "4px",
                    fontWeight: "bold",
                    position: "static",
                    backgroundColor:
                      permissionBgColors[index % permissionBgColors.length],
                    color: permissionColors[index % permissionColors.length],
                  }}
                />
              </div>
            ))}
          </Box>
        );
      },
    },

    {
      headerName: "Action",
      field: "id",
      sortable: true,
      flex: 1,
      cellRenderer: (params) => {
        return (
          <Box display="flex" justifyContent="center">
            <Box
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
                setSelectedPermissions(params.data);
                setIsViewOpen(true);
              }}
            >
              <VisibilityOutlinedIcon sx={{ fontSize: "20px" }} />
            </Box>
          </Box>
        );
      },
    },
  ]);

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
            }}
          >
            <div style={{ marginBottom: "5px" }}>
              <Box display="flex">
                <Typography fontSize="20px">Permission List</Typography>
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
                      const filteredData = Permissions.filter((permissions) =>
                        permissions.name
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

            <div
              className="ag-theme-alpine"
              style={{ width: "auto", height: "70vh" }}
            >
              <AgGridReact
                ref={gridRef}
                rowData={Permissions}
                columnDefs={columnDefs}
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

      {/* View */}
      {isViewOpen && (
        <ViewPermissions
          isViewOpen={isViewOpen}
          onClose={() => setIsViewOpen(false)}
          Permissions={selectedPermissions}
        />
      )}
    </>
  );
};

export default Permissions;
