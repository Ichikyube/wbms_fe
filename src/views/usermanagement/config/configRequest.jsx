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
import { useForm } from "../../../utils/useForm";
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
import * as React from "react";
import * as ConfigAPI from "../../../api/configsApi";

import Tables from "../../../components/Tables";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CancelIcon from "@mui/icons-material/CancelOutlined";
import Swal from "sweetalert2";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RangeSelectionModule,
  RowGroupingModule,
  RichSelectModule,
]);

const ConfigRequest = () => {
  // console.clear();
  const gridRef = useRef();

  const [isOpen, setIsOpen] = useState(false);

  const fetcher = () =>
    ConfigAPI.getAll().then((res) => res.data.config.records);

  // search

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const { data: dtConfig } = useSWR(
    searchQuery ? `config?name_like=${searchQuery}` : "config",
    fetcher,
    { refreshInterval: 1000 }
  );

  const updateGridData = useCallback((configData) => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.setRowData(configData);
    }
  }, []);

  useEffect(() => {
    if (dtConfig) {
      const filteredData = dtConfig.filter((config) => {
        const configData = Object.values(config).join(" ").toLowerCase();
        return configData.includes(searchQuery.toLowerCase());
      });
      setFilteredData(filteredData);
    }
  }, [searchQuery, dtConfig]);

  useEffect(() => {
    const refreshData = setInterval(() => {
      if (filteredData.length > 0) {
        const filteredPendingData = filteredData.filter(
          (config) => config.status.toLowerCase() === "pending"
        );
        updateGridData(filteredPendingData);
      }
    }, 500);

    return () => {
      clearInterval(refreshData);
    };
  }, [filteredData]);

  // delete
  const handleDisapprove = async (data, name) => {
    // Tampilkan SweetAlert untuk konfirmasi
    const result = await Swal.fire({
      title: "Pembatalan",
      html: `Apakah Anda yakin ingin batalkan <span style="font-weight: bold; font-size: "30px;"> ${name} ?</span>`,
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });

    // Jika pengguna menekan tombol "Ya", lanjutkan dengan perubahan status
    if (result.isConfirmed) {
      data.status = "REJECTED";
      try {
        await ConfigAPI.update(data);

        toast.success("Config berhasil di batalkan");
      } catch (error) {
        console.error("Config Gagal di batalkan:", error);
        toast.error("Config Gagal di batalkan ");
      }
    }
  };

  const handleApprove = async (data, name) => {
    // Tampilkan SweetAlert untuk konfirmasi
    const result = await Swal.fire({
      title: "Persetujuan",
      html: `Apakah Anda yakin ingin menyetujui <span style="font-weight: bold; font-size: "30px;"> ${name} ?</span> `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });

    // Jika pengguna menekan tombol "Ya", lanjutkan dengan perubahan status
    if (result.isConfirmed) {
      data.status = "APPROVED";
      try {
        await ConfigAPI.update(data);

        toast.success("Config berhasil di setujui");
      } catch (error) {
        console.error("Config Gagal di setujui:", error);
        toast.error("Config Gagal di setujui ");
      }
    }
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
      valueGetter: (params) => {
        const { data } = params;
        const activeStart = new Date(data.start);
        const activeEnd = new Date(data.end);

        const options = {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        };

        const formattedActiveStart = activeStart.toLocaleDateString(
          "en-US",
          options
        );
        const formattedActiveEnd = activeEnd.toLocaleDateString(
          "en-US",
          options
        );

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
              width="25%"
              display="flex"
              m="0 3px"
              bgcolor={green[500]}
              borderRadius="25%"
              justifyContent="center"
              padding="10px 10px"
              color="white"
              style={{
                textDecoration: "none",
                cursor: "pointer",
              }}
              onClick={() => handleApprove(params.data, params.data.name)}
            >
              <TaskAltIcon sx={{ fontSize: "20px" }} />
            </Box>

            <Box
              width="25%"
              display="flex"
              m="0 3px"
              bgcolor={red[500]}
              borderRadius="25%"
              padding="10px 10px"
              justifyContent="center"
              color="white"
              onClick={() => handleDisapprove(params.data, params.data.name)}
              style={{
                color: "white",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              <CancelIcon sx={{ fontSize: "20px" }} />
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
                <Typography fontSize="20px">WBMS Config Request</Typography>
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
              name={"WBMS Config Request"}
              fetcher={fetcher}
              colDefs={columnDefs}
              gridRef={gridRef}
            />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default ConfigRequest;