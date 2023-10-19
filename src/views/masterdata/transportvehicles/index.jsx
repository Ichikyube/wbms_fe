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
import Tab from "@mui/material/Tab";
import { TabList, TabPanel, TabContext } from "@mui/lab";

import useSWR from "swr";
import { green, orange, blue, red, indigo } from "@mui/material/colors";
import "ag-grid-enterprise";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { RangeSelectionModule } from "@ag-grid-enterprise/range-selection";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { RichSelectModule } from "@ag-grid-enterprise/rich-select";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { ModuleRegistry } from "@ag-grid-community/core";
import AddBoxOutlinedIcon from "@mui/icons-material/Add";
import SyncIcon from "@mui/icons-material/Sync";
import * as React from "react";
import * as TransportvehiclesAPI from "../../../api/transportvehicleApi";
import * as CompaniesAPI from "../../../api/companiesApi";
import * as ProductAPI from "../../../api/productsApi";
import FilterTable from "../../../components/filterTable";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CreateTransportvehicles from "../../../views/masterdata/transportvehicles/createTransportvehicle";
import EditTransportvehicles from "../../../views/masterdata/transportvehicles/editTransportvehicle";
import ViewTransportvehicles from "../../../views/masterdata/transportvehicles/viewTransportvehicle";
import Swal from "sweetalert2";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RangeSelectionModule,
  RowGroupingModule,
  RichSelectModule,
]);

const TransportVehicles = () => {
  console.clear();
  const gridRef = useRef();

  const [isOpen, setIsOpen] = useState(false);
  const [dtCompanies, setDtCompanies] = useState([]);
  const [dtProduct, setDtProduct] = useState([]);
  const [selectedTransportvehicles, setSelectedTransportvehicles] =
    useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const fetcher = () =>
    TransportvehiclesAPI.getAll().then(
      (res) => res.data.transportVehicle.records
    );
  const syncSemai = () => TransportvehiclesAPI.syncSemai();

  // search

  const [searchQuery, setSearchQuery] = useState("");

  const { data: dtTransportvehicle } = useSWR(
    searchQuery
      ? `Transportvehicle?name_like=${searchQuery}`
      : "Transportvehicle",
    fetcher
  );

  const updateGridData = useCallback((Transportvehicle) => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.setRowData(Transportvehicle);
    }
  }, []);

  useEffect(() => {
    if (dtTransportvehicle) {
      const filteredData = dtTransportvehicle.filter((Transportvehicle) => {
        const TransportvehicleData = Object.values(Transportvehicle)
          .join(" ")
          .toLowerCase();
        return TransportvehicleData.includes(searchQuery.toLowerCase());
      });
      updateGridData(filteredData);
    }
  }, [searchQuery, dtTransportvehicle, updateGridData]);

  useEffect(() => {
    CompaniesAPI.getAll().then((res) => {
      setDtCompanies(res.data.company.records);
    });

    ProductAPI.getAll().then((res) => {
      setDtProduct(res.data.product.records);
    });
  }, []);

  useEffect(() => {}, [isOpen]);

  // delete
  const deleteById = (id, plateNo) => {
    Swal.fire({
      title: `Yakin Ingin Menghapus?`,
      html: `<span style="font-weight: bold; font-size: 28px;">"${plateNo}"</span>`,
      icon: "question",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: "#D80B0B",
      cancelButtonColor: "grey",
      cancelButtonText: "Cancel",
      confirmButtonText: "Hapus",
    }).then((result) => {
      if (result.isConfirmed) {
        TransportvehiclesAPI.deleteById(id)
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
      field: "plateNo",
      sortable: true,
      headerName: "Plat No",
      flex: 2,
    },
    {
      headerName: "Company",
      field: "companyName",
      sortable: true,
      hide: false,
      flex: true,
    },

    {
      headerName: "Capacity",
      field: "capacity",
      filter: true,
      sortable: true,
      hide: false,
      flex: 2,
    },
    {
      headerName: "License ED",
      field: "licenseED",
      filter: true,
      sortable: true,
      hide: false,
      flex: true,
      valueFormatter: (params) => {
        const dateObj = new Date(params.value);
        const formattedDate = `${dateObj.getDate()} ${new Intl.DateTimeFormat(
          "id-ID",
          { month: "long" }
        ).format(dateObj)} ${dateObj.getFullYear()}`;
        return formattedDate;
      },
    },

    {
      headerName: "Notes",
      field: "notes",
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
      headerName: "Aksi",
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
                  setSelectedTransportvehicles(params.data);
                  setIsViewOpen(true);
                }}>
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
                  setSelectedTransportvehicles(params.data);
                  setIsEditOpen(true);
                }}>
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
                onClick={() => deleteById(params.value, params.data.plateNo)}
                style={{
                  color: "white",
                  textDecoration: "none",
                  cursor: "pointer",
                }}>
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
                setSelectedTransportvehicles(params.data);
                setIsViewOpen(true);
              }}>
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
      newFilteredData = dtTransportvehicle;
    } else {
      newFilteredData = dtTransportvehicle.filter(
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

  // useEffect(() => {
  //   const refreshData = setInterval(() => {
  //     if (dtTransportvehicle) {
  //       const filteredData = dtTransportvehicle.filter((transportvehicle) => {
  //         const transportvehicleData = Object.values(transportvehicle)
  //           .join(" ")
  //           .toLowerCase();
  //         return transportvehicleData.includes(searchQuery.toLowerCase());
  //       });
  //       setFilteredData(filteredData);

  //       const filteredDataRefType0 = filteredData.filter(
  //         (transportvehicle) => transportvehicle.refType === 0
  //       );
  //       setFilteredDataRefType0(filteredDataRefType0);

  //       const filteredDataRefType1 = filteredData.filter(
  //         (transportvehicle) => transportvehicle.refType === 1
  //       );
  //       setFilteredDataRefType1(filteredDataRefType1);

  //       const filteredDataRefType2 = filteredData.filter(
  //         (transportvehicle) => transportvehicle.refType === 2
  //       );
  //       setFilteredDataRefType2(filteredDataRefType2);

  //       let newFilteredData = [];

  //       if (value === "") {
  //         newFilteredData = filteredData;
  //       } else {
  //         newFilteredData = filteredData.filter(
  //           (transportvehicle) => transportvehicle.refType === parseInt(value)
  //         );
  //       }

  //       setColumnDefs((prevDefs) => {
  //         const newDefs = [...prevDefs];
  //         const actionColumn = newDefs.find((column) => column.field === "id");
  //         if (actionColumn) {
  //           actionColumn.hide = !value; // Mengatur hide menjadi true jika tidak ada filter refType yang aktif
  //         }
  //         return newDefs;
  //       });

  //       setFilteredData(newFilteredData);
  //     }
  //   }, 1000); // Refresh interval setiap 500ms

  //   return () => {
  //     clearInterval(refreshData); // Membersihkan interval saat komponen tidak lagi digunakan
  //   };
  // }, [searchQuery, dtTransportvehicle, value]);

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
              }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example">
                <Tab label="all" value="" />
                <Tab label="wbms" value="0" />
                <Tab label="e-dispatch" value="1" />
                <Tab label="e-lhp" value="2" />
              </TabList>
            </Paper>
            <TabPanel value="">
              <Paper
                sx={{
                  p: 3,
                  mx: 1,
                  borderRadius: "10px 10px 10px 10px",
                  mb: 3,
                }}>
                <div style={{ marginBottom: "10px" }}>
                  <Box display="flex">
                    <Typography fontSize="20px">
                      Data Transport Vehicle
                    </Typography>
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
                        }}>
                        <AddBoxOutlinedIcon
                          sx={{ mr: "5px", fontSize: "16px" }}
                        />
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
                          const filteredData = dtTransportvehicle.filter(
                            (Transportvehicle) =>
                              Transportvehicle.name
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
                <FilterTable
                  name={"TransportVehicle"}
                  fetcher={fetcher}
                  colDefs={columnDefs}
                  gridRef={gridRef}
                  rowData={filteredData}
                />
              </Paper>
            </TabPanel>
            <TabPanel value="0">
              <Paper
                sx={{
                  p: 3,
                  mx: 1,
                  borderRadius: "10px 10px 10px 10px",
                  mb: 3,
                }}>
                <div style={{ marginBottom: "10px" }}>
                  <Box display="flex">
                    <Typography fontSize="20px">
                      Data Transpor Vehicle Wbms
                    </Typography>
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
                        }}>
                        <AddBoxOutlinedIcon
                          sx={{ mr: "5px", fontSize: "16px" }}
                        />
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
                          gridRef.current.api.setRowData(filteredDataRefType0);
                        }}>
                        <SearchIcon sx={{ mr: "3px", fontSize: "19px" }} />
                      </IconButton>
                    </Box>
                  </Box>
                </div>
                <FilterTable
                  name={"TransportVehicle Wbms"}
                  fetcher={fetcher}
                  colDefs={columnDefs}
                  gridRef={gridRef}
                  rowData={filteredDataRefType0}
                />
              </Paper>
            </TabPanel>
            <TabPanel value="1">
              <Paper
                sx={{
                  p: 3,
                  mx: 1,
                  borderRadius: "10px 10px 10px 10px",
                  mb: 3,
                }}>
                <div style={{ marginBottom: "10px" }}>
                  <Box display="flex">
                    <Typography fontSize="20px">
                      Data Transport Vehicle E-Dispatch
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
                        onClick={syncSemai}>
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
                          gridRef.current.api.setRowData(filteredDataRefType1);
                        }}>
                        <SearchIcon sx={{ mr: "3px", fontSize: "19px" }} />
                      </IconButton>
                    </Box>
                  </Box>
                </div>
                <FilterTable
                  name={"TransportVehicle E-Dispatch"}
                  fetcher={fetcher}
                  colDefs={columnDefs}
                  gridRef={gridRef}
                  rowData={filteredDataRefType1}
                />
              </Paper>
            </TabPanel>
            <TabPanel value="2">
              <Paper
                sx={{
                  p: 3,
                  mx: 1,
                  borderRadius: "10px 10px 10px 10px",
                  mb: 3,
                }}>
                <div style={{ marginBottom: "10px" }}>
                  <Box display="flex">
                    <Typography fontSize="20px">
                      Data Transport Vehicle E-LHP
                    </Typography>
                    <Box display="flex" ml="auto">
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: green[800],
                          fontSize: "12px",
                          padding: "7px 10px",
                          color: "white",
                        }}>
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
                          gridRef.current.api.setRowData(filteredDataRefType2);
                        }}>
                        <SearchIcon sx={{ mr: "3px", fontSize: "19px" }} />
                      </IconButton>
                    </Box>
                  </Box>
                </div>
                <FilterTable
                  name={"TransportVehicle E-LHP"}
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
      <CreateTransportvehicles
        isOpen={isOpen}
        onClose={setIsOpen}
        dtCompanies={dtCompanies}
        dtProduct={dtProduct}
      />

      {/* edit */}
      <EditTransportvehicles
        isEditOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        dtCompanies={dtCompanies}
        dtProduct={dtProduct}
        dtTransportvehicle={selectedTransportvehicles}
      />

      {/* view */}
      <ViewTransportvehicles
        isViewOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        dtCompanies={dtCompanies}
        dtProduct={dtProduct}
        dtTransportvehicle={selectedTransportvehicles}
      />
    </>
  );
};

export default TransportVehicles;
