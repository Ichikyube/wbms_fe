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
import { orange, green, blue, red, indigo } from "@mui/material/colors";
import "ag-grid-enterprise";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { RangeSelectionModule } from "@ag-grid-enterprise/range-selection";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { RichSelectModule } from "@ag-grid-enterprise/rich-select";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ModuleRegistry } from "@ag-grid-community/core";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import SyncIcon from "@mui/icons-material/Sync";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Swal from "sweetalert2";
import * as CustomerGroupAPI from "../../../api/customergroupApi";
import * as CustomerTypeAPI from "../../../api/customertypesApi";
import * as CustomersAPI from "../../../api/customerApi";
import * as CitiesAPI from "../../../api/citiesApi";
import Tables from "../../../components/Tables";
import CreateCustomers from "../../../views/masterdata/customers/createCustomers";
import ViewCustomers from "../../../views/masterdata/customers/viewCustomers";
import EditCustomers from "../../../views/masterdata/customers/editCustomers";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RangeSelectionModule,
  RowGroupingModule,
  RichSelectModule,
]);

const Customers = () => {
  console.clear();
  const gridRef = useRef();

  const [isOpen, setIsOpen] = useState(false);
  const [dtCustomertypes, setDtCustomertypes] = useState([]);
  const [dtCustomergroups, setDtCustomergroups] = useState([]);
  const [dtCities, setDtCities] = useState([]);

  const [selectedCustomers, setSelectedCustomers] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const fetcher = () =>
    CustomersAPI.getAll().then((res) => res.data.customer.records);

  useEffect(() => {
    CustomerTypeAPI.getAll()
      .then((res) => {
        setDtCustomertypes(res.data.customerType.records);
      })
      .catch((error) => {
        console.error("Error fetching customertype:", error);
      });

    CustomerGroupAPI.getAll()
      .then((res) => {
        setDtCustomergroups(res.data.customerGroups.records);
      })
      .catch((error) => {
        console.error("Error fetching customergroup:", error);
      });

    CitiesAPI.getAll()
      .then((res) => {
        setDtCities(res.data.city.records);
      })
      .catch((error) => {
        console.error("Error fetching city:", error);
      });
  }, []);

  // search

  const [searchQuery, setSearchQuery] = useState("");

  const { data: dtCustomers } = useSWR(
    searchQuery ? `customers?name_like=${searchQuery}` : "customers",
    fetcher
  );

  const updateGridData = useCallback((customers) => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.setRowData(customers);
    }
  }, []);

  useEffect(() => {
    if (dtCustomers) {
      const filteredData = dtCustomers.filter((customers) => {
        const customersData = Object.values(customers).join(" ").toLowerCase();
        return customersData.includes(searchQuery.toLowerCase());
      });
      updateGridData(filteredData);
    }
  }, [searchQuery, dtCustomers, updateGridData]);

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
        CustomersAPI.deleteById(id)
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
      flex: 2,
      valueGetter: (params) => params.node.rowIndex + 1,
    },

    {
      headerName: "Code",
      field: "code",
      filter: true,
      sortable: true,
      hide: false,
      flex: 3,
    },
    {
      headerName: "SAP Code",
      field: "codeSap",
      filter: true,
      sortable: true,
      hide: false,
      flex: 3,
    },
    {
      headerName: "Nama",
      field: "name",
      filter: true,
      sortable: true,
      hide: false,
      flex: true,
    },
    {
      headerName: "ShortName",
      field: "shortName",
      filter: true,
      sortable: true,
      hide: false,
      flex: 3,
    },
    {
      headerName: "Phone",
      field: "phone",
      filter: true,
      sortable: true,
      hide: false,
      flex: 3,
    },
    {
      headerName: "Contact Name",
      field: "contactName",
      filter: true,
      sortable: true,
      hide: false,
      flex: 3,
    },
    {
      headerName: "Email",
      field: "contactEmail",
      filter: true,
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
                setSelectedCustomers(params.data);
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
                setSelectedCustomers(params.data);
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
                <Typography fontSize="20px">Data Customer</Typography>
                <Box display="flex" ml="auto">
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: green[800],
                      fontSize: "11px",
                      fontWeight: "bold",
                      padding: "8px 8px",
                      color: "white",
                      marginLeft: "3px",
                    }}
                  >
                    <SyncIcon sx={{ mr: "5px", fontSize: "16px" }} />
                    Sync
                  </Button>
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
                      const filteredData = dtCustomers.filter((customers) =>
                        customers.name
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
              name={"Customers"}
              fetcher={fetcher}
              colDefs={columnDefs}
              gridRef={gridRef}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* create */}
      <CreateCustomers
        isOpen={isOpen}
        onClose={setIsOpen}
        dtCustomertypes={dtCustomertypes}
        dtCustomergroups={dtCustomergroups}
        dtCities={dtCities}
      />

      {/* View */}
      <EditCustomers
        isEditOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        dtCustomertypes={dtCustomertypes}
        dtCustomergroups={dtCustomergroups}
        dtCities={dtCities}
        dtCustomers={selectedCustomers}
      />

      {/* view */}
      <ViewCustomers
        isViewOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        dtCustomertypes={dtCustomertypes}
        dtCustomergroups={dtCustomergroups}
        dtCities={dtCities}
        dtCustomers={selectedCustomers}
      />
    </>
  );
};

export default Customers;
