import { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Box,
  IconButton,
  Button,
} from "@mui/material";
import { red } from "@mui/material/colors";
import CloseIcon from "@mui/icons-material/Close";
import useSWR from "swr";
import "ag-grid-enterprise";
import { useNavigate } from "react-router-dom";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import * as React from "react";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import * as CompaniesAPI from "../../api/companiesApi";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component

const FilterDataCompany = ({
  onClose,
  isFilterData,
  selectedTransporter,
  onTransporterChange,
}) => {
  //   console.clear();
  const gridRef = useRef();
  const navigate = useNavigate();

  const fetcher = () =>
    CompaniesAPI.getAll().then((res) => res.data.company.records);

  // search

  const [searchQuery, setSearchQuery] = useState("");

  const { data: dtCompany } = useSWR(
    searchQuery ? `companies?name_like=${searchQuery}` : "companies",
    fetcher,
    { refreshInterval: 1000 }
  );

  const updateGridData = useCallback((company) => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.setRowData(company);
    }
  }, []);

  useEffect(() => {
    if (dtCompany) {
      const filteredData = dtCompany.filter((company) => {
        const companysData = Object.values(company).join(" ").toLowerCase();
        return companysData.includes(searchQuery.toLowerCase());
      });
      updateGridData(filteredData);
    }
  }, [searchQuery, dtCompany, updateGridData]);

  const handleCellClick = (params) => {
    const dataCompany = {
      Id: params.data.id,
      Name: params.data.name,
      Code: params.data.codeVendor,
    };
    onClose("", false);
    // Mengirimkan data perusahaan yang dipilih ke TimbangKeluar untuk diperbarui
    onTransporterChange(dataCompany);
  };
  // const handleSave = () => {
  //   if (selectedRowData) {
  //     onClose("", false);
  //     setTransporter(selectedRowData);
  //   } else {
  //     console.error("Tidak ada baris yang dipilih.");
  //   }
  // };

  const handleCancel = () => {
    // Mengatur nilai transporter kembali ke nilai awal atau kosong saat tombol "Batal" ditekan
    onClose("", false);
    onTransporterChange({ Id: "", Name: "", Code: "" });
  };

  const [columnDefs] = useState([
    {
      headerName: "Code",
      field: "codeVendor",
      filter: true,
      sortable: true,
      hide: false,
      flex: 1,

      cellStyle: { cursor: "pointer" },
    },

    {
      headerName: "Nama",
      field: "name",
      filter: true,
      sortable: true,
      hide: false,
      flex: 3,

      cellStyle: { cursor: "pointer" },
    },
    {
      headerName: "Tipe",
      field: "tipe",
      filter: true,
      sortable: true,
      hide: false,
      flex: 1,

      cellStyle: { cursor: "pointer" },
    },

    {
      headerName: "Short Name",
      field: "shortName",
      filter: true,
      sortable: true,
      hide: false,
      flex: 1,

      cellStyle: { cursor: "pointer" },
    },
  ]);

  return (
    <Dialog open={isFilterData} fullWidth maxWidth="md">
      <DialogTitle
        sx={{ color: "black", backgroundColor: "white", fontSize: "18px" }}>
        Pencarian Data
        <IconButton
          sx={{
            color: "black",
            position: "absolute",
            right: "15px",
            top: "10px",
          }}
          onClick={() => {
            onClose("", false);
          }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box display="flex">
          <Box borderRadius="5px" ml="auto" border="solid grey 1px">
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
                const filteredData = dtCompany.filter((company) =>
                  company.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
                gridRef.current.api.setRowData(filteredData);
              }}>
              <SearchIcon sx={{ mr: "3px", fontSize: "19px" }} />
            </IconButton>
          </Box>
        </Box>

        <Paper sx={{ p: 2, mt: 1 }}>
          <div
            className="ag-theme-alpine"
            style={{ width: "auto", height: "50vh" }}>
            <AgGridReact
              ref={gridRef}
              rowData={dtCompany}
              columnDefs={columnDefs}
              animateRows={true}
              onCellClicked={handleCellClick}
            />
          </div>
        </Paper>
        <Box display="flex">
          <Box ml="auto" mt={2}>
            <Button
              variant="contained"
              color="grey"
              sx={{
                backgroundColor: red[700],
                color: "white",
              }}
              onClick={handleCancel}>
              Batal
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default FilterDataCompany;
