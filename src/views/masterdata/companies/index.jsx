import { useState, useEffect, useRef, useCallback } from "react";
import {
  Grid,
  Paper,
  Button,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import Tab from "@mui/material/Tab";
import { TabList, TabPanel, TabContext } from "@mui/lab";
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
import * as CompaniesAPI from "../../../api/companiesApi";
import * as ProvinceAPI from "../../../api/provinceApi";
import * as CitiesAPI from "../../../api/citiesApi";
import FilterTable from "../../../components/filterTable";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SyncIcon from "@mui/icons-material/Sync";
import CreateCompanies from "../../../views/masterdata/companies/createCompanies";
import EditCompanies from "../../../views/masterdata/companies/editCompanies";
import ViewCompanies from "../../../views/masterdata/companies/viewCompanies";
import Swal from "sweetalert2";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RangeSelectionModule,
  RowGroupingModule,
  RichSelectModule,
]);

const Companies = () => {
  console.clear();
  const gridRef = useRef();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState(null);
  const [dtProvinces, setDtProvinces] = useState([]);
  const [dtCities, setDtCities] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Mengambil data provinsi dari API
  useEffect(() => {
    // Mengambil data provinsi dari API
    ProvinceAPI.getAll()
      .then((res) => {
        setDtProvinces(res.data.province.records);
      })
      .catch((error) => {
        console.error("Error fetching provinces:", error);
      });

    // Mengambil data Cities dari API
    CitiesAPI.getAll()
      .then((res) => {
        setDtCities(res.data.city.records);
      })
      .catch((error) => {
        console.error("Error fetching cities:", error);
      });

    // ...
  }, []);

  const fetcher = () =>
    CompaniesAPI.getAll().then((res) => res.data.company.records);

  const syncSemai = () => CompaniesAPI.syncSemai();

  // search

  const [searchQuery, setSearchQuery] = useState("");

  const { data: dtCompany } = useSWR(
    searchQuery ? `companies?name_like=${searchQuery}` : "companies",
    fetcher,
    { refreshInterval: 1000 }
  );

  //filter
  const updateGridData = useCallback((companies) => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.setRowData(companies);
    }
  }, []);

  useEffect(() => {
    if (dtCompany) {
      const filteredData = dtCompany.filter((company) => {
        const companyData = Object.values(company).join(" ").toLowerCase();
        return companyData.includes(searchQuery.toLowerCase());
      });
      updateGridData(filteredData);
    }
  }, [searchQuery, dtCompany, updateGridData]);

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
        CompaniesAPI.deleteById(id)
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

  //open create dialog
  useEffect(() => {}, [isOpen]);

  const [columnDefs, setColumnDefs] = useState([
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
      headerName: "Code",
      field: "code",
      filter: true,
      sortable: true,
      hide: false,
      flex: 2,
    },
    {
      headerName: "Code Sap",
      field: "codeSap",
      filter: true,
      sortable: true,
      hide: false,
      flex: 2,
    },
    {
      headerName: "Nama",
      field: "name",
      filter: true,
      sortable: true,
      hide: false,
      flex: 3,
    },

    {
      headerName: "Short Name",
      field: "shortName",
      filter: true,
      sortable: true,
      hide: false,
      flex: 2,
    },
    {
      headerName: "Contact Name",
      field: "contactName",
      filter: true,
      sortable: true,
      hide: false,
      flex: 2,
    },

    {
      headerName: "Phone",
      field: "phone",
      filter: true,
      sortable: true,
      hide: false,
      flex: 2,
    },

    {
      headerName: "Email",
      field: "contactEmail",
      filter: true,
      sortable: true,
      hide: false,
      flex: 2,
    },
    {
      field: "refType",
      headerName: "Source Data",
      sortable: true,
      flex: 2,
      valueFormatter: (params) => {
        const refType = params.value;
        if (refType === 0) {
          return "Data Wbms";
        } else if (refType === 1) {
          return "Data E-Dispatch";
        } else if (refType === 2) {
          return "Data E-Lhp";
        } else {
          return "";
        }
      },
    },
    {
      headerName: "Action",
      field: "id",
      sortable: true,
      cellRenderer: (params) => {
        if (params.data.refType === 0) {
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
                  setSelectedCompanies(params.data);
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
                  setSelectedCompanies(params.data);
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
        } else {
          return (
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
                setSelectedCompanies(params.data);
                setIsViewOpen(true);
              }}
            >
              <VisibilityOutlinedIcon sx={{ fontSize: "20px" }} />
            </Box>
          );
        }
      },
    },
  ]);

  const [value, setValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [filteredDataRefType0, setFilteredDataRefType0] = useState([]);
  const [filteredDataRefType1, setFilteredDataRefType1] = useState([]);
  const [filteredDataRefType2, setFilteredDataRefType2] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);

    let newFilteredData = [];

    if (newValue === "") {
      newFilteredData = dtCompany;
    } else {
      newFilteredData = dtCompany.filter(
        (company) => company.refType === parseInt(newValue)
      );
    }

    //untuk di tabnya
    setColumnDefs((prevDefs) => {
      const newDefs = [...prevDefs];
      const actionColumn = newDefs.find((column) => column.field === "id");
      if (actionColumn) {
        actionColumn.hide = !newValue; // Mengatur hide menjadi true jika tidak ada filter refType yang aktif
      }
      return newDefs;
    });

    setFilteredData(newFilteredData);
  };

  useEffect(() => {
    const refreshData = setInterval(() => {
      if (dtCompany) {
        const filteredData = dtCompany.filter((company) => {
          const companyData = Object.values(company).join(" ").toLowerCase();
          return companyData.includes(searchQuery.toLowerCase());
        });
        setFilteredData(filteredData);

        const filteredDataRefType0 = filteredData.filter(
          (company) => company.refType === 0
        );
        setFilteredDataRefType0(filteredDataRefType0);

        const filteredDataRefType1 = filteredData.filter(
          (company) => company.refType === 1
        );
        setFilteredDataRefType1(filteredDataRefType1);

        const filteredDataRefType2 = filteredData.filter(
          (company) => company.refType === 2
        );
        setFilteredDataRefType2(filteredDataRefType2);

        let newFilteredData = [];

        if (value === "") {
          newFilteredData = filteredData;
        } else {
          newFilteredData = filteredData.filter(
            (company) => company.refType === parseInt(value)
          );
        }

        setColumnDefs((prevDefs) => {
          const newDefs = [...prevDefs];
          const actionColumn = newDefs.find((column) => column.field === "id");
          if (actionColumn) {
            actionColumn.hide = !value; // Mengatur hide menjadi true jika tidak ada filter refType yang aktif
          }
          return newDefs;
        });

        setFilteredData(newFilteredData);
      }
    }, 500); // Refresh interval setiap 500ms

    return () => {
      clearInterval(refreshData); // Membersihkan interval saat komponen tidak lagi digunakan
    };
  }, [searchQuery, dtCompany, value]);

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <TabContext value={value}>
            <Paper
              elevation={1}
              sx={{
                mt: 2,
                pt: 1,
                width: "96%",
                marginLeft: "37px",
                borderTop: "5px solid #000",
                borderRadius: "10px 10px 0px 0px",
              }}
            >
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab label="all" value="" />
                <Tab label="wbms" value="0" />
                <Tab label="e-dispatch" value="1" />
                <Tab label="e-lhp" value="2" />
              </TabList>
            </Paper>

            <TabPanel value="">
              <Paper
                sx={{ p: 3, mx: 1, borderRadius: "10px 10px 10px 10px", mb: 3 }}
              >
                <div style={{ marginBottom: "10px" }}>
                  <Box display="flex">
                    <Typography fontSize="20px">Data Company</Typography>
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
                          const filteredData = dtCompany.filter((Company) =>
                            Company.name
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
                <FilterTable
                  name={"Company"}
                  fetcher={fetcher}
                  colDefs={columnDefs}
                  gridRef={gridRef}
                  rowData={filteredData}
                />
              </Paper>
            </TabPanel>
            <TabPanel value="0">
              <Paper
                sx={{ p: 3, mx: 1, borderRadius: "10px 10px 10px 10px", mb: 3 }}
              >
                <div style={{ marginBottom: "10px" }}>
                  <Box display="flex">
                    <Typography fontSize="20px">Data Company Wbms</Typography>
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
                          gridRef.current.api.setRowData(filteredDataRefType0);
                        }}
                      >
                        <SearchIcon sx={{ mr: "3px", fontSize: "19px" }} />
                      </IconButton>
                    </Box>
                  </Box>
                </div>
                <FilterTable
                  name={"Company Wbms"}
                  fetcher={fetcher}
                  colDefs={columnDefs}
                  gridRef={gridRef}
                  rowData={filteredDataRefType0}
                />
              </Paper>
            </TabPanel>
            <TabPanel value="1">
              <Paper
                sx={{ p: 3, mx: 1, borderRadius: "10px 10px 10px 10px", mb: 3 }}
              >
                <div style={{ marginBottom: "10px" }}>
                  <Box display="flex">
                    <Typography fontSize="20px">
                      Data Company E-Dispatch
                    </Typography>
                    <Box display="flex" ml="auto">
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: green[800],
                          fontSize: "12px",
                          padding: "7px 10px",
                          color: "white",
                        }}
                        onClick={syncSemai}
                      >
                        <SyncIcon sx={{ mr: "5px", fontSize: "16px" }} />
                        Sync
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
                          gridRef.current.api.setRowData(filteredDataRefType1);
                        }}
                      >
                        <SearchIcon sx={{ mr: "3px", fontSize: "19px" }} />
                      </IconButton>
                    </Box>
                  </Box>
                </div>
                <FilterTable
                  name={"Company E-Dispatch"}
                  fetcher={fetcher}
                  colDefs={columnDefs}
                  gridRef={gridRef}
                  rowData={filteredDataRefType1}
                />
              </Paper>
            </TabPanel>
            <TabPanel value="2">
              <Paper
                sx={{ p: 3, mx: 1, borderRadius: "10px 10px 10px 10px", mb: 3 }}
              >
                <div style={{ marginBottom: "10px" }}>
                  <Box display="flex">
                    <Typography fontSize="20px">Data Company E-LHP</Typography>
                    <Box display="flex" ml="auto">
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: green[800],
                          fontSize: "12px",
                          padding: "7px 10px",
                          color: "white",
                        }}
                      >
                        <SyncIcon sx={{ mr: "5px", fontSize: "16px" }} />
                        Sync
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
                          gridRef.current.api.setRowData(filteredDataRefType2);
                        }}
                      >
                        <SearchIcon sx={{ mr: "3px", fontSize: "19px" }} />
                      </IconButton>
                    </Box>
                  </Box>
                </div>
                <FilterTable
                  name={"Company E-LHP"}
                  fetcher={fetcher}
                  colDefs={columnDefs}
                  gridRef={gridRef}
                  rowData={filteredDataRefType2}
                />
              </Paper>
            </TabPanel>
          </TabContext>
        </Grid>
      </Grid>

      {/* Create */}
      <CreateCompanies
        isOpen={isOpen}
        onClose={setIsOpen}
        dtProvinces={dtProvinces}
        dtCities={dtCities}
      />

      {/* edit */}
      <EditCompanies
        isEditOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        dtProvinces={dtProvinces}
        dtCities={dtCities}
        dtCompanies={selectedCompanies}
      />

      {/* View */}
      <ViewCompanies
        isViewOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        dtProvinces={dtProvinces}
        dtCities={dtCities}
        dtCompanies={selectedCompanies}
      />
    </>
  );
};

export default Companies;
