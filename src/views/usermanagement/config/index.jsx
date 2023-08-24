import { useState, useEffect, useRef, useCallback } from "react";
import {
  Grid,
  Paper,
  Button,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import useSWR from "swr";
import { blue, yellow } from "@mui/material/colors";
import "ag-grid-enterprise";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { RangeSelectionModule } from "@ag-grid-enterprise/range-selection";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { RichSelectModule } from "@ag-grid-enterprise/rich-select";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { ModuleRegistry } from "@ag-grid-community/core";
import * as React from "react";
import * as ConfigAPI from "../../../api/configsApi";
import * as SiteAPI from "../../../api/sitesApi";
import Tables from "../../../components/Tables";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import EditDataConfig from "../../../views/usermanagement/config/editConfig";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import Swal from "sweetalert2";
import './style.css';
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RangeSelectionModule,
  RowGroupingModule,
  RichSelectModule,
]);
const Config = () => {
  console.clear();
  const gridRef = useRef();
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const fetcher = () =>
    ConfigAPI.getAll().then((res) => res.data.config.records);

  // search
  const [searchQuery, setSearchQuery] = useState("");

  const { data: dtConfigs } = useSWR(
    searchQuery ? `config?name_like=${searchQuery}` : "config",
    fetcher,
    { refreshInterval: 1000 }
  );

  //filter
  const updateGridData = useCallback((config) => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.setRowData(config);
    }
  }, []);

  useEffect(() => {
    if (dtConfigs) {
      const filteredData = dtConfigs.filter((config) => {
        const configData = Object.values(config).join(" ").toLowerCase();
        return configData.includes(searchQuery.toLowerCase());
      });
      updateGridData(filteredData);
    }
  }, [searchQuery, dtConfigs, updateGridData]);

  // {
  //   "name": "string",
  //   "value": "string",
  //   "type": "string",
  //   "status": "ACTIVE",
  //   "activeStart": "2023-08-06T09:53:03.504Z",
  //   "activeEnd": "2023-08-06T09:53:03.504Z",
  //   "siteId": "string"
  // }
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
      headerName: "Lvl of Approval",
      field: "lvlOfApprvl",
      filter: true,
      sortable: true,
      hide: false,
      flex: 1,
    },
    {
      headerName: "Status",
      field: "status",
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
        if(data.status == "ACTIVE") return "Always"
        else if(data.status === "DISABLED") return "-"
        // const activeStart = new Date(data.start);
        // const activeEnd = new Date(data.end);
    
        // const options = {
        //   year: 'numeric',
        //   month: '2-digit',
        //   day: '2-digit',
        //   hour: '2-digit',
        //   minute: '2-digit',
        //   second: '2-digit'
        // };
        
        // const formattedActiveStart = activeStart.toLocaleDateString('en-US', options);
        // const formattedActiveEnd = activeEnd.toLocaleDateString('en-US', options);
    
        // return `${formattedActiveStart} - ${formattedActiveEnd}`;
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
              bgcolor={yellow[900]}
              borderRadius="15%"
              justifyContent="center"
              textAlign="center"
              alignItems="center"
              padding="0px 5px"
              color="white"
              style={{
                textDecoration: "none",
                cursor: "pointer",
              }}
              onClick={() => {
                setSelectedConfig(params.data);
                setIsEditOpen(true);
              }}
            > Request Edit
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
                <Typography fontSize="20px">WBMS Config </Typography>
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
                      const filteredData = dtConfigs.filter((config) =>
                        config.name
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
              name={"configs"}
              fetcher={fetcher}
              colDefs={columnDefs}
              gridRef={gridRef}
            />
          </Paper>
        </Grid>
      </Grid>
      <EditDataConfig
        isEditOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        dtConfig={selectedConfig}
      />
    </>
  );
};

export default Config;