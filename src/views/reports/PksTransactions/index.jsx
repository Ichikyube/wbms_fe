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
  Autocomplete,
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
import * as ProductAPI from "../../../api/productsApi";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useNavigate } from "react-router-dom";
import Config from "../../../configs";
import * as TransactionAPI from "../../../api/transactionApi";
import * as TransportVehicleAPI from "../../../api/transportvehicleApi";
import * as transporterCompany from "../../../api/companiesApi";

import PageHeader from "../../../components/PageHeader";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RangeSelectionModule,
  RowGroupingModule,
  RichSelectModule,
]);

const tType = 1;

const ReportPksTransactions = () => {
  // console.clear();
  const navigate = useNavigate();
  const statusFormatter = (params) => {
    return Config.PKS_PROGRESS_STATUS[params.value];
  };

  const gridRef = useRef();

  const [dttransporterCompany, setDtCompany] = useState([]);
  const [dtProduct, setDtProduct] = useState([]);
  const [dtTransportVehicle, setDtTransportVehicle] = useState([]);
  useEffect(() => {
    transporterCompany.getAll().then((res) => {
      setDtCompany(res.data.company.records);
    });

    ProductAPI.getAll().then((res) => {
      setDtProduct(res.data.product.records);
    });

    TransportVehicleAPI.getAll().then((res) => {
      setDtTransportVehicle(res.data.transportVehicle.records);
    });
  }, []);

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
        progressStatus: { notIn: [1, 20, 21, 22] },
      },
      orderBy: { bonTripNo: "desc" },
    }).then((res) => res.records);

  const { data: dtTransactions } = useSWR("transaction", fetcher, {
    refreshInterval: 1000,
  });

  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedPlateNo, setSelectedPlateNo] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  const Product = (event) => {
    setSelectedProduct(event.target.value);
  };

  const Plateno = (event) => {
    setSelectedPlateNo(event.target.value);
  };
  const Vendor = (event) => {
    setSelectedVendor(event.target.value);
  };

  const StartDate = (date) => {
    setSelectedStartDate(date);
  };

  const EndDate = (date) => {
    setSelectedEndDate(date);
  };

  const filteredTransactions = useMemo(() => {
    let filteredData = dtTransactions || [];

    if (selectedProduct !== "") {
      filteredData = filteredData.filter(
        (transaction) =>
          transaction.productName.toLowerCase() ===
          selectedProduct.toLowerCase()
      );
    }

    if (selectedVendor !== "") {
      filteredData = filteredData.filter(
        (transaction) =>
          transaction.transporterCompanyName.toLowerCase() ===
          selectedVendor.toLowerCase()
      );
    }

    if (selectedPlateNo !== "") {
      filteredData = filteredData.filter(
        (transaction) =>
          transaction.transportVehiclePlateNo.toLowerCase() ===
          selectedPlateNo.toLowerCase()
      );
    }

    if (selectedStartDate !== null && selectedEndDate !== null) {
      filteredData = filteredData.filter((transaction) => {
        const transactionDate = dayjs(transaction.originWeighOutTimestamp);
        const startDate = dayjs(selectedStartDate).startOf("day");
        const endDate = dayjs(selectedEndDate).endOf("day");

        return transactionDate.isBetween(startDate, endDate, "day", "[]");
      });
    }

    return filteredData;
  }, [
    dtTransactions,
    selectedProduct,
    selectedVendor,
    selectedPlateNo,
    selectedStartDate,
    selectedEndDate,
  ]);

  const today = dayjs();

  useEffect(() => {
    setSelectedStartDate(today);
    setSelectedEndDate(today);

    // console.clear();

    return () => {
      // console.clear();
    };
  }, []);

  return (
    <>
      <PageHeader
        title="Report Transaksi PKS"
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
                      onChange={StartDate}
                      renderInput={(props) => <TextField {...props} />}
                      ampm={false}
                    />
                  </DemoItem>
                  <DemoItem label="Sampai Tanggal">
                    <DatePicker
                      className="custom-datetimepicker"
                      maxDate={today}
                      value={selectedEndDate}
                      onChange={EndDate}
                      renderInput={(props) => <TextField {...props} />}
                      ampm={false}
                    />
                  </DemoItem>
                </LocalizationProvider>

                <FormControl
                  sx={{ mt: "auto", mr: 1.5, minWidth: 150 }}
                  size="small"
                >
                  <Select
                    value={selectedProduct}
                    onChange={Product}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    sx={{
                      color: selectedProduct === "" ? "gray" : "black",
                      fontSize: "15px",
                    }}
                  >
                    <MenuItem value="">Pilih Semua</MenuItem>
                    <MenuItem value="" hidden>
                      Pilih Product
                    </MenuItem>
                    {dtProduct.map((item) => (
                      <MenuItem key={item.id} value={item.name}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl
                  sx={{ mt: "auto", mr: 1.5, minWidth: 150 }}
                  size="small"
                >
                  <Select
                    value={selectedPlateNo} // Gunakan selectedPlateNo sebagai nilai value
                    onChange={Plateno} // Gunakan Plateno sebagai handler perubahan
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    sx={{
                      color: selectedPlateNo === "" ? "gray" : "black",
                      fontSize: "15px",
                    }}
                  >
                    <MenuItem value="">Pilih Semua</MenuItem>
                    <MenuItem value="" hidden>
                      Pilih No Pol
                    </MenuItem>
                    {dtTransportVehicle.map((item) => (
                      <MenuItem key={item.id} value={item.plateNo}>
                        {item.plateNo}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ mt: "auto", minWidth: 150 }} size="small">
                  <Select
                    value={selectedVendor}
                    onChange={Vendor}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    sx={{
                      color: selectedVendor === "" ? "gray" : "black",
                      fontSize: "15px",
                    }}
                  >
                    <MenuItem value="">Pilih Semua</MenuItem>
                    <MenuItem value="" hidden>
                      Pilih Vendor
                    </MenuItem>
                    {dttransporterCompany.map((item) => (
                      <MenuItem key={item.id} value={item.name}>
                        {item.name}
                      </MenuItem>
                    ))}
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
