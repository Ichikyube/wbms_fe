import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Button,
  Box,
  IconButton,
  Typography,
  TextField,
  FormControl,
} from "@mui/material";
import moment from "moment";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { RangeSelectionModule } from "@ag-grid-enterprise/range-selection";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { RichSelectModule } from "@ag-grid-enterprise/rich-select";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ModuleRegistry } from "@ag-grid-community/core";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import * as TransactionAPI from "../../../api/transactionApi";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import Papa from "papaparse";
import EditTemplate from "./editTemplate";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RangeSelectionModule,
  RowGroupingModule,
  RichSelectModule,
]);

const BackdateTemplate = () => {
  const gridRef = useRef();

  const defaultColDef = {
    sortable: true,
    resizable: true,
    floatingFilter: false,
    filter: true,
  };

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

  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [uploadedData, setUploadedData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [editColumnDefs, setEditColumnDefs] = useState([]);

  const handleFormClose = () => {
    setIsEditFormVisible(false);
    setEditFormData({});
  };

  const handleSave = () => {
    TransactionAPI.create(uploadedData)
      .then(() => {
        setIsFileUploaded(true);
        toast.success("Data saved successfully.");
      })
      .catch((error) => {
        console.error("Data Gagal Diperbarui:", error);
        toast.error(error.message);
      });
  };

  const handleDeleteData = (rowId) => {
    Swal.fire({
      title: "Hapus Data ",
      text: "Yakin Ingin Hapus Data Ini ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Perform the delete operation and update the state
        const updatedData = uploadedData.filter((row) => row.id !== rowId);
        setUploadedData(updatedData);
        setIsEditFormVisible(false);
        toast.success("Data Berhasil dihapus.");
      }
    });
  };

  const handleSearch = (value) => {
    console.log("Search Value:", value);
    const filteredData = uploadedData.filter((row) =>
      Object.values(row).join(" ").toLowerCase().includes(value.toLowerCase())
    );
    console.log("Filtered Data:", filteredData);
    gridRef.current.api.setRowData(filteredData);
  };

  const handleRowClick = (params) => {
    setEditFormData(params.data);
    setIsEditFormVisible(true);

    // Set definisi kolom yang sesuai dengan data yang akan diedit
    const dataKeys = Object.keys(params.data);
    const newEditColumnDefs = columnDefs.filter((col) =>
      dataKeys.includes(col.field)
    );
    setEditColumnDefs(newEditColumnDefs);
  };

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const formattedDate = selectedDate.format("YYMMDD");
  const [bonTripNo, setBonTripNo] = useState("");

  // Gunakan useState untuk melacak nomor increment
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const generateBonTripNo = () => {
      // Format nomor increment menjadi 4 digit dengan leading zeros
      const formattedIncrement = String(increment).padStart(4, "0");
      return `P049${formattedDate}${formattedIncrement}`;
    };

    const generatedBonTripNo = generateBonTripNo();
    setBonTripNo(generatedBonTripNo);

    // Tingkatkan nilai increment setiap kali Anda menghasilkan nomor baru
    setIncrement(increment + 0);
  }, [formattedDate]);

  const processUploadedData = (csvData) => {
    setIsFileUploaded(true);
    const headers = Object.keys(csvData[0]);
    const newColumnDefs = headers.map((header) => ({
      headerName: header,
      colId: header,
      field: header,
      filter: true,
      sortable: true,
    }));

    // Tambahkan kolom BontripNo dengan header "BontripNo" ke dalam columnDefs
    newColumnDefs.unshift({
      headerName: "Bontrip No",
      field: "bonTripNo",
      sortable: true,
      filter: true,
    });

    // Generate nomor bonTripNo yang berbeda untuk setiap baris data
    const dataWithId = csvData.map((row, index) => ({
      ...row,
      id: index,
      tType: 1,
      bonTripNo: `P049${formattedDate}${String(increment + index).padStart(
        4,
        "0"
      )}`,
    }));

    setColumnDefs(newColumnDefs);
    setUploadedData(dataWithId);
  };

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
              <Typography fontSize="20px">Backdate Template</Typography>
              <Box display="flex" ml="auto">
                <FormControl
                  sx={{ mt: "auto", mr: 1.5, minWidth: 150 }}
                  size="small"
                >
                  <TextField
                    type="date"
                    variant="outlined"
                    size="small"
                    sx={{
                      mt: "auto",
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    label={
                      <Typography
                        sx={{
                          bgcolor: "white",
                          px: 1,
                        }}
                      >
                        Tanggal BonTripNo
                      </Typography>
                    }
                    value={selectedDate.format("YYYY-MM-DD")}
                    onChange={(e) => {
                      const selectedDate = dayjs(e.target.value);
                      setSelectedDate(selectedDate);
                    }}
                  />
                </FormControl>
                <Button
                  color="success"
                  ml="auto"
                  variant="contained"
                  component="label"
                  sx={{
                    fontSize: "11px",
                    padding: "12px 12px",
                    color: "white",
                    marginLeft: "8px",
                  }}
                >
                  <UploadFileOutlinedIcon
                    sx={{ mr: "5px", fontSize: "17px" }}
                  />
                  Upload CSV
                  <input
                    type="file"
                    accept=".csv"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      Papa.parse(file, {
                        complete: (result) => {
                          processUploadedData(result.data);
                        },
                        header: true,
                      });
                    }}
                  />
                </Button>
              </Box>
            </Box>
            <hr />
            <Box display="flex" pb={1}>
              <Button
                variant="contained"
                sx={{
                  fontSize: "11px",
                  padding: "8px 8px",
                  color: "white",
                  marginLeft: "8px",
                }}
                onClick={handleSave}
                disabled={!isFileUploaded}
              >
                <SaveOutlinedIcon sx={{ mr: "5px", fontSize: "17px" }} />
                Simpan
              </Button>

              <Box
                display="flex"
                borderRadius="5px"
                ml="auto"
                border="solid grey 1px"
              >
                <InputBase
                  sx={{ ml: 2, flex: 2, fontSize: "13px" }}
                  placeholder="Search"
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <IconButton
                  type="button"
                  sx={{ p: 1 }}
                  onClick={() => handleSearch("")}
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
              rowData={uploadedData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              animateRows={true}
              rowSelection="multiple"
              enableRangeSelection="true"
              groupSelectsChildren="true"
              suppressRowClickSelection="true"
              autoGroupColumnDef={autoGroupColumnDef}
              pagination="true"
              paginationAutoPageSize="true"
              groupDefaultExpanded="1"
              onRowClicked={handleRowClick}
            />
          </div>
          {isEditFormVisible && (
            <div>
              <EditTemplate
                data={editFormData}
                columnDefs={editColumnDefs}
                onSave={(editedData) => {
                  const updatedData = [...uploadedData];
                  const rowIndex = updatedData.findIndex(
                    (row) => row.id === editFormData.id
                  );
                  if (rowIndex !== -1) {
                    updatedData[rowIndex] = editedData;
                    setUploadedData(updatedData);
                  }

                  setIsEditFormVisible(false);
                }}
                onCancel={handleFormClose}
                onDelete={handleDeleteData}
              />
            </div>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default BackdateTemplate;
