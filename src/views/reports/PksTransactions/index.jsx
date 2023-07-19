import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Grid,
  Paper,
  Button,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Box,
} from "@mui/material";
import dayjs from "dayjs";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Formik } from "formik";
import useSWR from "swr";
import { green } from "@mui/material/colors";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import "ag-grid-enterprise";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { RangeSelectionModule } from "@ag-grid-enterprise/range-selection";
import {
  RowGroupingModule,
  ValuesDropZonePanel,
} from "@ag-grid-enterprise/row-grouping";
import { RichSelectModule } from "@ag-grid-enterprise/rich-select";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { ModuleRegistry } from "@ag-grid-community/core";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

import LocalShippingIcon from "@mui/icons-material/LocalShipping";

import Config from "../../../configs";
import * as TransactionAPI from "../../../api/transactionApi";

import PageHeader from "../../../components/PageHeader";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RangeSelectionModule,
  RowGroupingModule,
  RichSelectModule,
]);

const tType = 1;

const ReportPksTransactions = () => {
  console.clear();
  const statusFormatter = (params) => {
    return Config.PKS_PROGRESS_STATUS[params.value];
  };

  const gridRef = useRef();

  const [columnDefs] = useState([
    {
      headerName: "Bontrip No",
      field: "bonTripNo",
      filter: true,
      sortable: true,
      hide: false,
    },
    { headerName: "No Pol", field: "transportVehiclePlateNo", filter: true },
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
      headerName: "tanggal",
      field: "deliveryDate",
      filter: true,
      sortable: true,
    },
    {
      headerName: "DO No",
      field: "deliveryOrderNo",
      filter: true,
      sortable: true,
    },
    {
      headerName: "Product",
      field: "productName",
      filter: true,
      sortable: true,
    },
    {
      headerName: "WB-IN",
      field: "originWeighInKg",
      maxWidth: 150,
      aggFunc: "sum",
    },
    {
      headerName: "WB-OUT",
      field: "originWeighOutKg",
      maxWidth: 150,
      aggFunc: "sum",
    },
    {
      headerName: "Return WB-IN",
      field: "returnWeighInKg",
      maxWidth: 185,
      aggFunc: "sum",
    },
    {
      headerName: "Return WB-OUT",
      field: "returnWeighOutKg",
      maxWidth: 195,
      aggFunc: "sum",
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
      field: "bonTripNo",
      width: 300,
    }),
    []
  );

  const fetcher = () =>
    TransactionAPI.searchMany({
      where: {
        tType,
      },
      orderBy: { bonTripNo: "desc" },
    }).then((res) => res.records);

  const { data: dtTransactions } = useSWR("transaction", fetcher, {
    refreshInterval: 1000,
  });

  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  const handleChange = (event) => {
    setSelectedProduct(event.target.value);
  };

  const handleChangeStartDate = (date) => {
    setSelectedStartDate(date);
  };

  const handleChangeEndDate = (date) => {
    setSelectedEndDate(date);
  };

  const handleChangeStatus = (event) => {
    setSelectedStatus(event.target.value);
  };

  const filteredTransactions = useMemo(() => {
    let filteredData = dtTransactions;

    if (selectedProduct !== "") {
      filteredData = filteredData.filter(
        (transaction) =>
          transaction.productName.toLowerCase() ===
          selectedProduct.toLowerCase()
      );
    }

    if (selectedStartDate !== null && selectedEndDate !== null) {
      filteredData = filteredData.filter((transaction) => {
        const transactionDate = dayjs(transaction.deliveryDate);
        const startDate = dayjs(selectedStartDate).startOf("day");
        const endDate = dayjs(selectedEndDate).endOf("day");

        return (
          transactionDate.isSame(startDate, "day") ||
          transactionDate.isBetween(startDate, endDate, "day")
        );
      });
    }

    if (selectedStatus !== "") {
      filteredData = filteredData.filter(
        (transaction) =>
          transaction.progressStatus.toLowerCase() ===
          selectedStatus.toLowerCase()
      );
    }

    return filteredData;
  }, [
    dtTransactions,
    selectedProduct,
    selectedStartDate,
    selectedEndDate,
    selectedStatus,
  ]);

  const today = dayjs();

  useEffect(() => {
    console.clear();

    return () => {
      console.clear();
    };
  }, []);

  return (
    <>
      <PageHeader
        title="Report Transaksi PKS4"
        subTitle="Page Description"
        icon={<LocalShippingIcon fontSize="large" />}
      />

      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mx: 1 }}>
            <div style={{ marginBottom: "10px" }}>
              <Box display="flex">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoItem label="Dari Tanggal">
                    <DatePicker
                      className="custom-datetimepicker"
                      maxDate={today}
                      value={selectedStartDate}
                      onChange={handleChangeStartDate}
                      renderInput={(props) => <TextField {...props} />}
                      ampm={false}
                    />
                  </DemoItem>
                  <DemoItem label="Sampai Tanggal">
                    <DatePicker
                      className="custom-datetimepicker"
                      maxDate={today}
                      value={selectedEndDate}
                      onChange={handleChangeEndDate}
                      renderInput={(props) => <TextField {...props} />}
                      ampm={false}
                    />
                  </DemoItem>
                </LocalizationProvider>
                <FormControl sx={{ mt: "auto", minWidth: 150 }} size="small">
                  <Select
                    value={selectedProduct}
                    onChange={handleChange}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    sx={{
                      color: selectedProduct === "" ? "gray" : "black",
                      fontSize: "15px",
                    }}
                  >
                    <MenuItem value="">Pilih Product</MenuItem>
                    <MenuItem value="pko">PKO</MenuItem>
                    <MenuItem value="cpo">CPO</MenuItem>
                    <MenuItem value="tbs">TBS</MenuItem>
                    <MenuItem value="tbs eksternal">TBS Eksternal</MenuItem>
                  </Select>
                </FormControl>
                <FormControl
                  sx={{ ml: "10px", mt: "auto", minWidth: 150 }}
                  size="small"
                >
                  <Select
                    value={selectedStatus}
                    onChange={handleChangeStatus}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    sx={{
                      color: selectedStatus === "" ? "gray" : "inherit",
                      fontSize: "15px",
                    }}
                  >
                    <MenuItem value="">Pilih Status</MenuItem>
                    <MenuItem value="0">TIMBANG MASUK</MenuItem>
                    <MenuItem value="1">LOADING/UNLOADING</MenuItem>
                    <MenuItem value="2">TIMBANG KELUAR</MenuItem>
                    <MenuItem value="3">DATA DISPATCHED</MenuItem>
                  </Select>
                </FormControl>
                <Box ml="auto" mt="auto">
                  <Button
                    sx={{
                      backgroundColor: green[800],
                      fontSize: "11px",
                      fontWeight: "bold",
                      padding: "12px 12px",
                      color: "white",
                    }}
                    onClick={() => {
                      gridRef.current.api.exportDataAsExcel();
                    }}
                  >
                    <FileDownloadOutlinedIcon
                      sx={{ mr: "5px", fontSize: "17px" }}
                    />
                    Export Excel
                  </Button>
                </Box>
              </Box>
            </div>
            <div
              className="ag-theme-alpine"
              style={{ width: "auto", height: "70vh" }}
            >
              <AgGridReact
                ref={gridRef}
                rowData={filteredTransactions} // Row Data for Rows
                columnDefs={columnDefs} // Column Defs for Columns
                defaultColDef={defaultColDef} // Default Column Properties
                animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                rowSelection="multiple" // Options - allows click selection of rows
                rowGroupPanelShow="always"
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
    </>
  );
};

export default ReportPksTransactions;
