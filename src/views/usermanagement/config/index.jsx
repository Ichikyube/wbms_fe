import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  Grid,
  Paper,
  Button,
  Box,
  Stack,
  IconButton,
  Typography,
} from "@mui/material";
import useSWR from "swr";
import { yellow } from "@mui/material/colors";
import LiveHelpOutlinedIcon from "@mui/icons-material/LiveHelpOutlined";
import "ag-grid-enterprise";

import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { RangeSelectionModule } from "@ag-grid-enterprise/range-selection";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { RichSelectModule } from "@ag-grid-enterprise/rich-select";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { ModuleRegistry } from "@ag-grid-community/core";
import * as React from "react";
import * as ConfigAPI from "../../../api/configApi";
import Tables from "../../../components/Tables";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import EditDataConfig from "../../../views/usermanagement/config/editConfig";
import CreateRequestConfig from "../../../views/usermanagement/config/createRequest";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RangeSelectionModule,
  RowGroupingModule,
  RichSelectModule,
]);
const Config = () => {
  // console.clear();
  const gridRef = useRef();
  const { userInfo } = useSelector((state) => state.app);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [showConfig, setShowConfig] = useState();
  const [selectedButton, setSelectedButton] = useState(1);
  const tempConfigsGroup = (item) => item.id >= 3 && item.id <= 6;
  const tbsConfigGroup = (item) => item.id >= 7 && item.id <= 18;
  const eDispatchConfigGroup = (item) => item.id > 18 || item.id < 3;

  const fetcher = () =>
    ConfigAPI.getAll().then((res) => res.data.config.records);
  // search
  const [searchQuery, setSearchQuery] = useState("");
  const { data: dtConfigs } = useSWR(
    searchQuery ? `config?name_like=${searchQuery}` : "config",
    fetcher,
    {
      refreshInterval: 2000,
    }
  );

  //filter
  const updateGridData = useCallback((config) => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.setRowData(config);
    }
  }, []);

  const handleButtonClick = (buttonNumber) => {
    setSelectedButton(buttonNumber);
  };

  useEffect(() => {
    updateGridData(showConfig);
    if (dtConfigs) {
      if (selectedButton === 1) {
        setShowConfig(dtConfigs.filter(tempConfigsGroup));
      } else if (selectedButton === 2) {
        setShowConfig(dtConfigs.filter(tbsConfigGroup));
      } else if (selectedButton === 3) {
        setShowConfig(dtConfigs.filter(eDispatchConfigGroup));
      }
    }
  }, [dtConfigs, selectedButton]);

  useEffect(() => {
    if (showConfig) {
      const filteredData = showConfig.filter((config) => {
        const configData = Object.values(config).join(" ").toLowerCase();
        return configData.includes(searchQuery.toLowerCase());
      });
      updateGridData(filteredData);
    }
  }, [searchQuery, showConfig, updateGridData]);
  const defaultColDef = {
    sortable: true,
    resizable: true,
    floatingFilter: false,
    filter: true,
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
      headerName: " Config Name",
      field: "name",
      filter: true,
      sortable: true,
      hide: false,
      flex: 2,
    },
    {
      headerName: "Description",
      field: "description",
      filter: true,
      sortable: true,
      hide: false,
      flex: 2,
    },
    {
      headerName: "ApprovalLvl",
      field: "lvlOfApprvl",
      filter: true,
      sortable: true,
      hide: false,
      flex: 1,
    },
    {
      headerName: "Status",
      field: "defaultVal",
      filter: true,
      sortable: true,
      hide: false,
      flex: 1,
    },

    {
      headerName: "Active Time",
      filter: true,
      sortable: true,
      hide: false,
      flex: 3,
      cellClass: "grid-cell-centered",
      valueGetter: (params) => {
        const { data } = params;
        if (!data?.start) return "-";
        console.log(params);
        if (data.type !== "Boolean") return "Always";
        const formattedActiveStart = new Date(data?.start).toLocaleString(
          "id-ID"
        );
        const formattedActiveEnd = new Date(data?.end).toLocaleString("id-ID");

        return `${formattedActiveStart} - ${formattedActiveEnd}`;
      },
    },
    {
      headerName: "Action",
      field: "id",
      sortable: true,
      cellRenderer: (params) => {
        return (
          <Box display="flex" justifyContent="center">
            <Box
              display="flex"
              borderRadius="5px"
              justifyContent="center"
              cursor={
                userInfo?.role.toLowerCase().includes("admin") ||
                params.data.type === "Boolean"
                  ? "pointer"
                  : "not-allowed"
              }
              pointer-events={
                userInfo?.role.toLowerCase().includes("admin") ||
                params.data.type === "Boolean"
                  ? "auto"
                  : "none"
              }
              bgcolor={
                userInfo?.role.toLowerCase().includes("admin") ||
                params.data.type === "Boolean"
                  ? yellow[900]
                  : null
              }
              textAlign="center"
              alignItems="center"
              color="white"
              width="25%"
              padding="7px 7px"
              style={{
                textDecoration: "none",
                cursor: "pointer",
              }}
              onClick={() => {
                setSelectedConfig(params.data);
                if (userInfo?.role.toLowerCase().includes("admin"))
                  setIsEditOpen(true);
                else if (params.data.type === "Boolean") setIsRequestOpen(true);
              }}>
              {" "}
              {userInfo?.role.toLowerCase().includes("admin") ? (
                <DriveFileRenameOutlineIcon
                  sx={{ ontSize: "20px", "&:hover": { color: "blue" } }}
                />
              ) : params.data.type === "Boolean" ? (
                <LiveHelpOutlinedIcon sx={{ mr: "3px", fontSize: "19px" }} />
              ) : null}
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
            }}>
            <div style={{ marginBottom: "5px" }}>
              <Box display="flex">
                <Typography fontSize="20px">WBMS Config </Typography>
              </Box>
              <hr sx={{ width: "100%" }} />
              <Box display="flex" pb={1}>
                <Stack spacing={2} direction="row">
                  <Button
                    variant={selectedButton === 1 ? "contained" : "outlined"}
                    onClick={() => handleButtonClick(1)}>
                    Temporary Configs
                  </Button>
                  <Button
                    variant={selectedButton === 2 ? "contained" : "outlined"}
                    onClick={() => handleButtonClick(2)}>
                    TBS Configs
                  </Button>
                  <Button
                    variant={selectedButton === 3 ? "contained" : "outlined"}
                    onClick={() => handleButtonClick(3)}>
                    E-DISPATCH Configs
                  </Button>
                </Stack>
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
                      const filteredData = dtConfigs.filter((config) =>
                        config.name
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
            <div
              className="ag-theme-alpine"
              style={{ width: "auto", height: "70vh" }}>
              <AgGridReact
                ref={gridRef}
                rowData={showConfig} // Row Data for Rows
                columnDefs={columnDefs} // Column Defs for Columns
                defaultColDef={defaultColDef} // Default Column Properties
                animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                rowSelection="multiple" // Options - allows click selection of rows
                // rowGroupPanelShow="always"
                enableRangeSelection="true"
                groupSelectsChildren="true"
                suppressRowClickSelection="true"
                pagination="false"
                paginationAutoPageSize="true"
                groupDefaultExpanded="1"
              />
            </div>
          </Paper>
        </Grid>
      </Grid>
      {isEditOpen && (
        <EditDataConfig
          isEditOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          dtConfig={selectedConfig}
        />
      )}
      {isRequestOpen && (
        <CreateRequestConfig
          isRequestOpen={isRequestOpen}
          onClose={() => setIsRequestOpen(false)}
          dtConfig={selectedConfig}
        />
      )}
    </>
  );
};

export default Config;
