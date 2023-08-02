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
import { yellow } from "@mui/material/colors";
import "ag-grid-enterprise";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { RangeSelectionModule } from "@ag-grid-enterprise/range-selection";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { RichSelectModule } from "@ag-grid-enterprise/rich-select";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { ModuleRegistry } from "@ag-grid-community/core";
import * as React from "react";
import * as ConfigAPI from "../../../api/provinceApi";

import Tables from "../../../components/Tables";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import EditDataConfig from "../../../views/usermanagement/config/editConfig";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import Swal from "sweetalert2";

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
    ConfigAPI.getAll().then((res) => res.data.province.records);

  // search

  const [searchQuery, setSearchQuery] = useState("");

  const { data: dtConfig } = useSWR(
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
    if (dtConfig) {
      const filteredData = dtConfig.filter((config) => {
        const configData = Object.values(config).join(" ").toLowerCase();
        return configData.includes(searchQuery.toLowerCase());
      });
      updateGridData(filteredData);
    }
  }, [searchQuery, dtConfig, updateGridData]);

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
      flex: 3,
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
      field: "activeTime",
      filter: true,
      sortable: true,
      hide: false,
      flex: 3,
    },
    {
      headerName: "Site",
      field: "site",
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
              bgcolor={yellow[900]}
              borderRadius="50%"
              justifyContent="center"
              padding="10px 10px"
              color="white"
              style={{
                textDecoration: "none",
                cursor: "pointer",
              }}
              onClick={() => {
                setSelectedConfig(params.data);
                setIsEditOpen(true);
              }}
            >
              <DriveFileRenameOutlineIcon sx={{ fontSize: "20px" }} />
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
                      const filteredData = dtConfig.filter((config) =>
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
              name={"config"}
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
        dtProvince={selectedConfig}
      />
    </>
  );
};

export default Config;
