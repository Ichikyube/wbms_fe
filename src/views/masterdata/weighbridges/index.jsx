import React, { useState, useEffect, useRef, useCallback } from "react";
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
import { orange, blue, red, indigo } from "@mui/material/colors";
import "ag-grid-enterprise";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { RangeSelectionModule } from "@ag-grid-enterprise/range-selection";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { RichSelectModule } from "@ag-grid-enterprise/rich-select";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ModuleRegistry } from "@ag-grid-community/core";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Swal from "sweetalert2";
import * as WeighbridgesAPI from "../../../api/weighbridgesApi";
import * as SiteAPI from "../../../api/sitesApi";
import Tables from "../../../components/Tables";
import CreateWeighbridges from "../../../views/masterdata/weighbridges/createWeighbridges";
import ViewWeighbridges from "../../../views/masterdata/weighbridges/viewWeighbridges";
import EditWeighbridges from "../../../views/masterdata/weighbridges/editWeighbridges";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RangeSelectionModule,
  RowGroupingModule,
  RichSelectModule,
]);

const Weighbridges = () => {
  const gridRef = useRef();

  const [isOpen, setIsOpen] = useState(false);
  const [dtSites, setDtSites] = useState([]);
  const [selectedWeighbridges, setSelectedWeighbridges] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const fetcher = () =>
    WeighbridgesAPI.getAll().then((res) => res.data.weighbridge.records);

  // search

  const [searchQuery, setSearchQuery] = useState("");

  const { data: dtWeighbridges } = useSWR(
    searchQuery ? `Weighbridges?name_like=${searchQuery}` : "Weighbridges",
    fetcher,
    { refreshInterval: 1000 }
  );

  const updateGridData = useCallback((Weighbridges) => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.setRowData(Weighbridges);
    }
  }, []);

  useEffect(() => {
    if (dtWeighbridges) {
      const filteredData = dtWeighbridges.filter((weighbridges) => {
        const weighbridgesData = Object.values(weighbridges)
          .join(" ")
          .toLowerCase();
        return weighbridgesData.includes(searchQuery.toLowerCase());
      });
      updateGridData(filteredData);
    }
  }, [searchQuery, dtWeighbridges, updateGridData]);

  useEffect(() => {
    SiteAPI.getAll().then((res) => {
      setDtSites(res.data.site.records);
    });
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
        WeighbridgesAPI.deleteById(id)
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
      field: "code",
      headerName: "Code",
      sortable: true,
      flex: 2,
    },

    {
      headerName: "Nama",
      field: "name",
      sortable: true,
      hide: false,
      flex: 3,
    },
    {
      headerName: "Site",
      field: "siteId",
      sortable: true,
      hide: false,
      flex: 2,
      valueFormatter: (params) => {
        const siteId = params.value;
        const site = dtSites.find((item) => item.id === siteId);
        return site ? site.name : "";
      },
    },

    {
      headerName: "Aksi",
      field: "id",
      sortable: true,
      cellRenderer: (params) => {
        return (
          <Box display="flex" justifyContent="center">
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
                setSelectedWeighbridges(params.data);
                setIsViewOpen(true);
              }}
            >
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
                setSelectedWeighbridges(params.data);
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
              onClick={() => deleteById(params.value, params.data.name)} // Menambahkan onClick handler
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
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mx: 1 }}>
            <div style={{ marginBottom: "10px" }}>
              <Box display="flex">
                <Typography fontSize="20px">Data Weighbridge</Typography>
                <Box display="flex" ml="auto">
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: blue[800],
                      fontSize: "11px",
                      padding: "8px 8px",
                      fontWeight: "bold",
                      color: "white",
                      marginLeft: "8px",
                    }}
                    onClick={() => {
                      setIsOpen(true);
                    }}
                  >
                    <AddBoxOutlinedIcon sx={{ mr: "5px", fontSize: "16px" }} />
                    Tambah Data
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
                      const filteredData = dtWeighbridges.filter(
                        (Weighbridges) =>
                          Weighbridges.name
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
              name={"Weighbridges"}
              fetcher={fetcher}
              colDefs={columnDefs}
              gridRef={gridRef}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* create */}
      <CreateWeighbridges
        isOpen={isOpen}
        onClose={setIsOpen}
        dtSites={dtSites}
      />

      {/* Edit */}
      <EditWeighbridges
        isEditOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        dtSites={dtSites}
        dtWeighbridges={selectedWeighbridges}
      />

      {/* View */}
      <ViewWeighbridges
        isViewOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        dtSites={dtSites}
        dtWeighbridges={selectedWeighbridges}
      />
    </>
  );
};

export default Weighbridges;
