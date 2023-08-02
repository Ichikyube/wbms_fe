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
import { orange, blue, red, indigo } from "@mui/material/colors";
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
import * as MillsAPI from "../../../api/millsApi";
import * as SiteAPI from "../../../api/sitesApi";
import * as CompaniesAPI from "../../../api/companiesApi";
import Tables from "../../../components/Tables";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Swal from "sweetalert2";
import CreateMills from "../../../views/masterdata/mills/createMills";
import EditMills from "../../../views/masterdata/mills/editMills";
import ViewMills from "../../../views/masterdata/mills/viewMills";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RangeSelectionModule,
  RowGroupingModule,
  RichSelectModule,
]);

const Mills = () => {
  console.clear();
  const gridRef = useRef();

  const [isOpen, setIsOpen] = useState(false);
  const [dtSites, setDtSites] = useState([]);
  const [dtCompanies, setDtCompanies] = useState([]);
  const [selectedMills, setSelectedMills] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const fetcher = () => MillsAPI.getAll().then((res) => res.data.mill.records);

  // search

  const [searchQuery, setSearchQuery] = useState("");

  const { data: dtMills } = useSWR(
    searchQuery ? `mills?name_like=${searchQuery}` : "mills",
    fetcher,
    { refreshInterval: 1000 }
  );

  const updateGridData = useCallback((Mills) => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.setRowData(Mills);
    }
  }, []);

  useEffect(() => {
    if (dtMills) {
      const filteredData = dtMills.filter((mill) => {
        const millData = Object.values(mill).join(" ").toLowerCase();
        return millData.includes(searchQuery.toLowerCase());
      });
      updateGridData(filteredData);
    }
  }, [searchQuery, dtMills, updateGridData]);

  useEffect(() => {
    SiteAPI.getAll().then((res) => {
      setDtSites(res.data.site.records);
    });
  }, []);

  useEffect(() => {
    CompaniesAPI.getAll().then((res) => {
      setDtCompanies(res.data.company.records);
    });
  }, []);

  useEffect(() => {}, [isOpen]);

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
        MillsAPI.deleteById(id)
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
                setSelectedMills(params.data);
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
                setSelectedMills(params.data);
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
          <Paper sx={{  p: 3,
              mx: 3,
              mb: 5,
              mt: 2,
              borderTop: "5px solid #000",
              borderRadius: "10px 10px 10px 10px", }}>
            <div style={{ marginBottom: "10px" }}>
              <Box display="flex">
                <Typography fontSize="20px">Data Mill</Typography>
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
                    <AddIcon sx={{ mr: "5px", fontSize: "16px" }} />
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
                      const filteredData = dtCompanies.filter((companies) =>
                        companies.name
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
              name={"mills"}
              fetcher={fetcher}
              colDefs={columnDefs}
              gridRef={gridRef}
            />
          </Paper>
        </Grid>
      </Grid>
      {/* Create */}
      <CreateMills
        isOpen={isOpen}
        onClose={setIsOpen}
        dtSites={dtSites}
        dtCompanies={dtCompanies}
      />
      {/* edit */}
      <EditMills
        isEditOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        dtSites={dtSites}
        dtCompanies={dtCompanies}
        dtMills={selectedMills}
      />
      {/* view */}
      <ViewMills
        isViewOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        dtSites={dtSites}
        dtCompanies={dtCompanies}
        dtMills={selectedMills}
      />
    </>
  );
};

export default Mills;
