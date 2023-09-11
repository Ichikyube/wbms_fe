import React, {
  useMemo,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import useSWR from "swr";
import {
  Grid,
  Paper,
  Button,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import { red, indigo } from "@mui/material/colors";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import "ag-grid-enterprise";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { RangeSelectionModule } from "@ag-grid-enterprise/range-selection";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { RichSelectModule } from "@ag-grid-enterprise/rich-select";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { ModuleRegistry } from "@ag-grid-community/core";
import { useNavigate } from "react-router-dom";
import Config from "../../configs";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import * as TransactionAPI from "../../api/transactionApi";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RangeSelectionModule,
  RowGroupingModule,
  RichSelectModule,
]);

const tType = 1;

const DataTransaction = () => {
  const navigate = useNavigate();
  const statusFormatter = (params) => {
    return Config.PKS_PROGRESS_STATUS[params.value];
  };

  const handleCellClick = (params) => {
    const productName = params.data.productName.toLowerCase();

    if (productName === "cpo" || productName === "pko") {
      toast.warning("Tidak dapat mengedit transaksi CPO atau PKO");
    } else {
      const Id = params.data.id;
      navigate(`/edit-data-Transaction/${Id}`);
    }
  };

  const deleteById = (id, bonTripNo) => {
    Swal.fire({
      title: `Hapus Transaksi !!!`,
      html: `<span style="font-weight: bold; font-size: 28px;">"${bonTripNo}"</span>`,
      icon: "question",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: "#D80B0B",
      cancelButtonColor: "grey",
      cancelButtonText: "Cancel",
      confirmButtonText: "Hapus",
    }).then((result) => {
      if (result.isConfirmed) {
        TransactionAPI.deleteById(id)
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

  const gridRef = useRef();

  const [columnDefs] = useState([
    {
      headerName: "Bontrip No",
      field: "bonTripNo",
      filter: true,
      sortable: true,
      hide: false,
      maxWidth: 170,
      flex: true,
    },
    {
      headerName: "No Pol",
      field: "transportVehiclePlateNo",
      filter: true,
      maxWidth: 130,
      flex: true,
    },
    {
      headerName: "Status",
      field: "progressStatus",
      cellClass: "progressStatus",
      valueFormatter: statusFormatter,
      enableRowGroup: true,
      rowGroup: true,
      hide: true,
    },
    {
      headerName: "DO No",
      field: "deliveryOrderNo",
      filter: true,
      sortable: true,
      maxWidth: 150,
      flex: true,
    },
    {
      headerName: "Product",
      field: "productName",
      filter: true,
      sortable: true,
      maxWidth: 130,
      flex: true,
    },
    { headerName: "WB-IN", field: "originWeighInKg", maxWidth: 125 },
    { headerName: "WB-OUT", field: "originWeighOutKg", maxWidth: 125 },
    { headerName: "Return WB-IN", field: "returnWeighInKg", maxWidth: 145 },
    { headerName: "Return WB-OUT", field: "returnWeighOutKg", maxWidth: 155 },
    {
      headerName: "Action",
      field: "id",
      sortable: true,
      maxWidth: 110,
      cellRenderer: (params) => {
        return (
          <Box display="flex" justifyContent="center">
            <Box
              mr="5px"
              display="flex"
              bgcolor={indigo[700]}
              borderRadius="5px"
              justifyContent="center"
              padding="10px 8px "
              color="white"
              style={{
                textDecoration: "none",
                cursor: "pointer",
              }}
              onClick={() => handleCellClick(params)}
            >
              <BorderColorOutlinedIcon sx={{ fontSize: "20px" }} />
            </Box>
            <Box
              display="flex"
              bgcolor={red[800]}
              borderRadius="5px"
              padding="7px 5px "
              color="white"
              onClick={() => deleteById(params.value, params.data.bonTripNo)}
              style={{
                color: "white",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              <CancelOutlinedIcon sx={{ fontSize: "25px" }} />
            </Box>
          </Box>
        );
      },
    },
  ]);

  const defaultColDef = {
    sortable: true,
    resizable: true,
    floatingFilter: false,
    filter: true,
  };

  // never changes, so we can use useMemo
  const autoGroupColumnDef = useMemo(
    () => ({
      cellRendererParams: {
        suppressCount: true,
        checkbox: true,
      },
      field: "transportVehiclePlateNo",
      width: 230,
    }),
    []
  );

  const [searchQuery, setSearchQuery] = useState("");

  const fetcher = () =>
    TransactionAPI.searchMany({
      where: {
        tType,
        progressStatus: { notIn: [20, 21, 22, 1] },
      },
      orderBy: { bonTripNo: "desc" },
    }).then((res) => res.records);

  const { data: dtTransactions } = useSWR(
    searchQuery ? `transaction?name_like=${searchQuery}` : "transaction",
    fetcher,
    {
      refreshInterval: 1000,
    }
  );

  const updateGridData = useCallback((transaction) => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.setRowData(transaction);
    }
  }, []);

  useEffect(() => {
    if (dtTransactions) {
      const filteredData = dtTransactions.filter((transaction) => {
        const transactionsData = Object.values(transaction)
          .join(" ")
          .toLowerCase();
        return transactionsData.includes(searchQuery.toLowerCase());
      });
      updateGridData(filteredData);
    }
  }, [searchQuery, dtTransactions, updateGridData]);

  return (
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
              <Typography fontSize="20px">Data Transaksi PKS</Typography>
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
                    const filteredData = dtTransactions.filter((transaction) =>
                      transaction.name
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
              rowData={dtTransactions} // Row Data for Rows
              columnDefs={columnDefs} // Column Defs for Columns
              defaultColDef={defaultColDef} // Default Column Properties
              animateRows={true} // Optional - set to 'true' to have rows animate when sorted
              rowSelection="multiple" // Options - allows click selection of rows
              enableRangeSelection="true"
              groupSelectsChildren="true"
              suppressRowClickSelection="true"
              autoGroupColumnDef={autoGroupColumnDef}
              pagination="true"
              paginationAutoPageSize="true"
              groupDefaultExpanded="1"
            />
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DataTransaction;
