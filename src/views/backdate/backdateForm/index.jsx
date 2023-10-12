import { useState, useEffect, useRef, useCallback } from "react";
import useSWR from "swr";
import {
  Grid,
  Typography,
  Paper,
  Box,
  TextField,
  FormControl,
  Autocomplete,
  InputLabel,
  InputBase,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { toast } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";
import "react-toastify/dist/ReactToastify.css";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useForm } from "../../../utils/useForm";
import * as TransactionAPI from "../../../api/transactionApi";
import PageHeader from "../../../components/PageHeader";
import ManualEntryGrid from "../../../components/TransactionGrid";
import { useConfig } from "../../../common/hooks";
import TBS from "./backdateFormTbs";
import OTHERS from "./backdateFormOthers";
import FilterDataCompany from "../../PksManualEntry/filterDtCompany";
// import CpoPko from "../../PksManualEntry/manualentryCpoPko/BackdateForm";
import * as ProductAPI from "../../../api/productsApi";
import * as TransportVehicleAPI from "../../../api/transportvehicleApi";
import * as CompaniesAPI from "../../../api/companiesApi";
import moment from "moment";

const typeSite = 1;

const BackdateForm = () => {
  const gridRef = useRef();
  const { values, setValues } = useForm({
    ...TransactionAPI.InitialData,
  });

  const [Transporter, setTransporter] = useState({
    Id: "",
    Name: "",
    Code: "",
  });

  const handleTransporterChange = (newTransporter) => {
    setTransporter(newTransporter);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((preValues) => ({
      ...preValues,
      [name]: value,
    }));
  };

  const [isFilterData, setIsFilterData] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [dtCompany, setDtCompany] = useState([]);
  const [dtProduct, setDtProduct] = useState([]);

  useEffect(() => {
    ProductAPI.getAll().then((res) => {
      setDtProduct(res.data.product.records);
    });

    CompaniesAPI.getAll().then((res) => {
      setDtCompany(res.data.company.records);
    });
  }, []);

  const [searchQuery, setSearchQuery] = useState("");

  const fetcher = () =>
    TransactionAPI.searchMany({
      where: {
        typeSite,
        progressStatus: { notIn: [4, 9, 14] },
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
    <>
      <PageHeader
        title="Transaksi PKS"
        subTitle="Page Description"
        sx={{ mb: 2 }}
        icon={<LocalShippingIcon fontSize="large" />}
      />

      <Grid container spacing={3}>
        <Grid item xs={2}>
          <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
            <TextField
              variant="outlined"
              inputProps={{
                style: {
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "18px",
                },
              }}
              size="large"
              label={
                <>
                  <Typography
                    sx={{
                      bgcolor: "white",
                      px: 1,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "30px",
                      },
                    }}
                  >
                    STATUS PROSES
                  </Typography>
                </>
              }
              fullWidth
              multiline
              value={"Timbang Masuk"}
            />
          </Paper>
          <Paper elevation={2} sx={{ p: 2, px: 2 }}>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="Masukkan No.Pol"
              sx={{
                mb: 2,
              }}
              label={
                <>
                  <Typography
                    sx={{
                      bgcolor: "white",
                      px: 1.5,
                    }}
                  >
                    Nomor Polisi
                  </Typography>
                </>
              }
              name="transportVehiclePlateNo"
              value={values.transportVehiclePlateNo}
              onChange={handleChange}
            />
            <TextField
              variant="outlined"
              size="small"
              type="text"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ fontWeight: "bold" }}>
                    <SearchIcon sx={{ fontSize: "18px" }} />
                  </InputAdornment>
                ),
              }}
              placeholder="Cari cust/vendor..."
              sx={{
                my: 2,
              }}
              label={
                <>
                  <Typography
                    sx={{
                      bgcolor: "white",
                      px: 1.5,
                    }}
                  >
                    Cust/Vendor transport
                  </Typography>
                </>
              }
              // name="Name"
              value={Transporter.Code}
              onClick={() => {
                setIsFilterData(true);
              }}
            />
            <FormControl
              fullWidth
              variant="outlined"
              size="small"
              sx={{ mt: 2 }}
            >
              <InputLabel
                id="select-label"
                shrink
                sx={{ bgcolor: "white", px: 1 }}
              >
                Nama Product
              </InputLabel>
              <Autocomplete
                id="select-label"
                options={dtProduct.filter(
                  (option) =>
                    !["cpo", "pko"].includes(option.name.toLowerCase())
                )}
                getOptionLabel={(option) => option.name}
                value={selectedProduct}
                onChange={(event, newValue) => {
                  const selectedValue = newValue
                    ? newValue
                    : { id: "", name: "" };
                  setValues((preValues) => ({
                    ...preValues,
                    productId: selectedValue.id,
                    productName: selectedValue.name,
                  }));
                  setSelectedProduct(selectedValue);
                  setSelectedOption(
                    newValue?.name.toLowerCase().includes("tbs")
                      ? "Tbs"
                      : "Others"
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="-- Pilih Barang --"
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            </FormControl>
          </Paper>
        </Grid>
        <Grid item xs={10}>
          <Paper elevation={1} sx={{ p: 3, px: 4 }}>
            <Box
              display="grid"
              gap="20px"
              gridTemplateColumns="repeat(15, minmax(0, 1fr))"
            >
              {/* TBS */}

              {selectedOption === "Tbs" && (
                <TBS
                  ProductId={values?.productId}
                  ProductName={values?.productName}
                  TransporterId={Transporter.Id}
                  TransporterCompanyName={Transporter.Name}
                  TransporterCompanyCode={Transporter.Code}
                  PlateNo={values.transportVehiclePlateNo}
                />
              )}

              {/* OTHERS */}

              {selectedOption === "Others" && (
                <OTHERS
                  ProductId={values?.productId}
                  ProductName={values?.productName}
                  TransporterId={Transporter.Id}
                  TransporterCompanyName={Transporter.Name}
                  TransporterCompanyCode={Transporter.Code}
                  PlateNo={values.transportVehiclePlateNo}
                />
              )}
              {isFilterData && (
                <FilterDataCompany
                  isFilterData={isFilterData}
                  onClose={() => setIsFilterData(false)}
                  selectedTransporter={Transporter} // Mengirimkan transporter ke FilterDataCompany
                  onTransporterChange={handleTransporterChange}
                />
              )}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
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

          <Paper sx={{ p: 2, mt: 1 }}>
            <ManualEntryGrid gridRef={gridRef} fetcher={fetcher} />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default BackdateForm;
