import { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { w3cwebsocket } from "websocket";
import {
  Button,
  Grid,
  InputAdornment,
  TextField,
  FormControl,
  Typography,
  Paper,
  Box,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { ProgressStatusContext } from "../../../context/ProgressStatusContext";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useForm } from "../../../utils/useForm";
import { setWb, clearWb, setWbTransaction } from "../../../slices/appSlice";
import GetWeightWB from "../../../components/GetWeightWB";
import * as SiteAPI from "../../../api/sitesApi";
import BonTripPrint from "../../../components/BonTripPrint";
import * as TransactionAPI from "../../../api/transactionApi";
import Config from "../../../configs";
import ManualEntryGrid from "../../../components/manualEntryGrid";
import PageHeader from "../../../components/PageHeader";
import * as ProductAPI from "../../../api/productsApi";
import * as CompaniesAPI from "../../../api/companiesApi";
import * as DriverAPI from "../../../api/driverApi";
import * as TransportVehicleAPI from "../../../api/transportvehicleApi";
import * as CustomerAPI from "../../../api/customerApi";
import { getById } from "../../../api/configApi";

const tType = 1;

const PksManualTBSInternalTimbangKeluar = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { values, setValues } = useForm({
    ...TransactionAPI.InitialData,
  });
  const [originWeightNetto, setOriginWeightNetto] = useState(0);
  const [canSubmit, setCanSubmit] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const {
      id,
      bonTripNo,
      productId,
      productName,
      transporterId,
      transporterCompanyName,
      driverId,
      driverName,
      transportVehicleId,
      transportVehiclePlateNo,
      transportVehicleSccModel,
      originSiteId,
      originSiteName,
      originWeighInKg,
      originWeighOutKg,
      deliveryOrderNo,
      progressStatus,
      originWeighInTimestamp,
      originWeighOutTimestamp,
      qtyTbs,
    } = values;

    let updatedProgressStatus = progressStatus;
    let updatedOriginWeighOutTimestamp = originWeighOutTimestamp;

    if (progressStatus === 21) {
      updatedProgressStatus = 4;
      updatedOriginWeighOutTimestamp = moment().toDate();
    }

    const updatedTransaction = {
      id,
      bonTripNo,
      productId,
      productName,
      transporterId,
      transporterCompanyName,
      driverId,
      driverName,
      transportVehicleId,
      transportVehiclePlateNo,
      originSiteId,
      originSiteName,
      transportVehicleSccModel,
      originWeighInKg,
      originWeighOutKg: parseFloat(originWeighOutKg),
      deliveryOrderNo,
      progressStatus: updatedProgressStatus,
      qtyTbs,
      originWeighInTimestamp,
      originWeighOutTimestamp: updatedOriginWeighOutTimestamp,
    };

    try {
      const results = await TransactionAPI.update({ ...updatedTransaction });

      if (!results?.status) {
        toast.error(`Error: ${results?.message}.`);
        return;
      }

      toast.success(`Transaksi Timbang Keluar Berhasil disimpan.`);
      setValues({ ...updatedTransaction });
    } catch (error) {
      toast.error(`Error: ${error.message}.`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataById = await TransactionAPI.getById(id);
        console.log(dataById);
        if (dataById) {
          setValues({
            ...dataById.record,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    // ... (kode useEffect yang sudah ada)

    // Tetapkan nilai awal canSubmit berdasarkan nilai yang sudah ada
    let cSubmit = false;
    if (values.progressStatus === 0) {
      cSubmit = values.originWeighInKg >= Config.ENV.WBMS_WB_MIN_WEIGHT;
    } else if (values.progressStatus === 21) {
      cSubmit = values.originWeighOutKg >= Config.ENV.WBMS_WB_MIN_WEIGHT;
    }
    setCanSubmit(cSubmit);
  }, [values]);

  useEffect(() => {
    // setProgressStatus(Config.PKS_PROGRESS_STATUS[values.progressStatus]);

    if (
      values.originWeighInKg < Config.ENV.WBMS_WB_MIN_WEIGHT ||
      values.originWeighOutKg < Config.ENV.WBMS_WB_MIN_WEIGHT
    ) {
      setOriginWeightNetto(0);
    } else {
      let total =
        Math.abs(values.originWeighInKg - values.originWeighOutKg) -
        values.potonganWajib -
        values.potonganLain;
      setOriginWeightNetto(total);
    }
  }, [values]);

  const validateForm = () => {
    return values.originWeighOutKg >= Config.ENV.WBMS_WB_MIN_WEIGHT;
  };

  const handleClose = () => {
    // setProgressStatus("-");
    // setWbPksTransaction(null);

    navigate("/pks-transaction");
  };
  const [dtCompany, setDtCompany] = useState([]);
  const [dtProduct, setDtProduct] = useState([]);
  const [dtDriver, setDtDriver] = useState([]);
  const [dtTransportVehicle, setDtTransportVehicle] = useState([]);
  const [dtCustomer, setDtCustomer] = useState([]);
  const [dtSite, setDtSite] = useState([]);

  useEffect(() => {
    CompaniesAPI.getAll().then((res) => {
      setDtCompany(res.data.company.records);
    });

    ProductAPI.getAll().then((res) => {
      setDtProduct(res.data.product.records);
    });
    DriverAPI.getAll().then((res) => {
      setDtDriver(res.data.driver.records);
    });

    TransportVehicleAPI.getAll().then((res) => {
      setDtTransportVehicle(res.data.transportVehicle.records);
    });

    CustomerAPI.getAll().then((res) => {
      setDtCustomer(res.data.customer.records);
    });
    SiteAPI.getAll().then((res) => {
      setDtSite(res.data.site.records);
    });
  }, []);

  return (
    <>
      <PageHeader
        title="Transaksi PKS4"
        subTitle="Page Description"
        sx={{ mb: 2 }}
        icon={<LocalShippingIcon fontSize="large" />}
      />

      <Grid container spacing={3}>
        <Grid item xs={1.8}>
          <Paper elevation={2} sx={{ p: 2 }}>
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
              value={"Timbang Keluar"}
            />
          </Paper>
        </Grid>
        <Grid item xs={10.2}>
          <Paper elevation={1} sx={{ p: 3, px: 5 }}>
            <Box
              display="grid"
              gap="20px"
              gridTemplateColumns="repeat(15, minmax(0, 1fr))"
            >
              <FormControl sx={{ gridColumn: "span 4" }}>
                <TextField
                  variant="outlined" // Variasi TextField dengan style "outlined"
                  size="small" // Ukuran TextField kecil
                  fullWidth // TextField akan memiliki lebar penuh
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    mb: 2, // Margin bawah dengan jarak 2 unit
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px", // Set radius border untuk bagian input
                    },
                  }}
                  label={
                    <>
                      <Typography
                        sx={{
                          bgcolor: "white", // Background color teks label
                          px: 1, // Padding horizontal teks label 1 unit
                        }}
                      >
                        Nomor BON Trip
                      </Typography>
                    </>
                  }
                  name="bonTripNo" // Nama properti/form field untuk data Nomor BON Trip
                  value={values?.bonTripNo || ""} // Nilai data Nomor BON Trip yang diambil dari state 'values'
                />

                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="Masukkan No. DO/NPB"
                  sx={{
                    my: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                    },
                  }}
                  label={
                    <>
                      <Typography
                        sx={{
                          bgcolor: "white",
                          px: 1.5,
                        }}
                      >
                        No. DO/NPB
                      </Typography>
                    </>
                  }
                  name="deliveryOrderNo"
                  value={values.deliveryOrderNo}
                  onChange={handleChange}
                />
                <FormControl variant="outlined" size="small" sx={{ my: 2 }}>
                  <InputLabel
                    id="select-label"
                    shrink
                    sx={{ bgcolor: "white", px: 1 }}
                  >
                    Nomor Polisi
                  </InputLabel>
                  <Select
                    labelId="select-label"
                    id="select"
                    onChange={(event) => {
                      const { name, value } = event.target;
                      const selectedNopol = dtTransportVehicle.find(
                        (item) => item.id === value
                      );
                      setValues((prevValues) => ({
                        ...prevValues,
                        [name]: value,
                        transportVehiclePlateNo: selectedNopol
                          ? selectedNopol.plateNo
                          : "",
                        transportVehicleSccModel: selectedNopol
                          ? selectedNopol.sccModel
                          : "",
                      }));
                    }}
                    name="transportVehicleId"
                    value={values.transportVehicleId || ""}
                    displayEmpty
                    sx={{
                      borderRadius: "10px",
                    }}
                  >
                    <MenuItem value="" disabled>
                      -- Pilih Kendaraan --
                    </MenuItem>
                    {dtTransportVehicle.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.plateNo}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl variant="outlined" size="small" sx={{ my: 2 }}>
                  <InputLabel
                    id="select-label"
                    shrink
                    sx={{ bgcolor: "white", px: 1 }}
                  >
                    Nama Supir
                  </InputLabel>
                  <Select
                    labelId="select-label"
                    id="select"
                    onChange={(event) => {
                      const { name, value } = event.target;
                      const selectedDriver = dtDriver.find(
                        (item) => item.id === value
                      );
                      setValues((prevValues) => ({
                        ...prevValues,
                        [name]: value,
                        driverName: selectedDriver ? selectedDriver.name : "",
                      }));
                    }}
                    name="driverId"
                    value={values.driverId || ""}
                    displayEmpty
                    sx={{
                      borderRadius: "10px",
                    }}
                  >
                    <MenuItem value="" disabled>
                      -- Pilih Supir --
                    </MenuItem>
                    {dtDriver.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl variant="outlined" size="small" sx={{ my: 2 }}>
                  <InputLabel
                    id="select-label"
                    shrink
                    sx={{ bgcolor: "white", px: 1 }}
                  >
                    Nama Vendor
                  </InputLabel>
                  <Select
                    labelId="select-label"
                    id="select"
                    onChange={(event) => {
                      const { name, value } = event.target;
                      const selectedVendor = dtCompany.find(
                        (item) => item.id === value
                      );
                      setValues((prevValues) => ({
                        ...prevValues,
                        [name]: value,
                        transporterCompanyName: selectedVendor
                          ? selectedVendor.name
                          : "",
                      }));
                    }}
                    name="transporterId"
                    value={values.transporterId || ""}
                    displayEmpty
                    sx={{
                      borderRadius: "10px",
                    }}
                  >
                    <MenuItem value="" disabled>
                      -- Pilih Vendor --
                    </MenuItem>
                    {dtCompany.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{
                    my: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                    },
                  }}
                  InputLabelProps={{
                    shrink: true,
                    readOnly: true,
                  }}
                  label={
                    <>
                      <Typography
                        sx={{
                          bgcolor: "white",
                          px: 1,
                        }}
                      >
                        Sertifikasi Tipe Truk
                      </Typography>
                    </>
                  }
                  name="transportVehicleSccModel"
                  value={values.transportVehicleSccModel || "-"}
                />

                {/* <FormControl variant="outlined" size="small" sx={{ my: 2 }}>
                  <InputLabel
                    id="select-label"
                    shrink
                    sx={{ bgcolor: "white", px: 1 }}
                  >
                    Customer
                  </InputLabel>
                  <Select
                    labelId="select-label"
                    id="select"
                    onChange={handleChange}
                    name="customer"
                    value={values.customer || ""}
                    displayEmpty
                    sx={{
                      borderRadius: "10px",
                    
                    }}
                  >
                    <MenuItem value="" disabled>
                      -- Pilih Customer --
                    </MenuItem>
                    {dtCustomer.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl> */}
                <FormControl variant="outlined" size="small" sx={{ my: 2 }}>
                  <InputLabel
                    id="select-label"
                    shrink
                    sx={{ bgcolor: "white", px: 1 }}
                  >
                    Jenis Barang
                  </InputLabel>
                  <Select
                    labelId="select-label"
                    id="select"
                    sx={{
                      borderRadius: "10px",
                    }}
                    onChange={(event) => {
                      const { name, value } = event.target;
                      const selectedProduct = dtProduct.find(
                        (item) => item.id === value
                      );
                      setValues((prevValues) => ({
                        ...prevValues,
                        [name]: value,
                        productName: selectedProduct
                          ? selectedProduct.name
                          : "",
                      }));
                    }}
                    name="productId"
                    value={values.productId || ""}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      -- Pilih Barang --
                    </MenuItem>
                    {dtProduct.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl variant="outlined" size="small" sx={{ my: 2 }}>
                  <InputLabel
                    id="select-label"
                    shrink
                    sx={{ bgcolor: "white", px: 1 }}
                  >
                    Asal
                  </InputLabel>
                  <Select
                    labelId="select-label"
                    id="select"
                    sx={{
                      borderRadius: "10px",
                    }}
                    onChange={(event) => {
                      const { name, value } = event.target;
                      const selectedSite = dtSite.find(
                        (item) => item.id === value
                      );
                      setValues((prevValues) => ({
                        ...prevValues,
                        [name]: value,
                        originSiteName: selectedSite ? selectedSite.name : "",
                      }));
                    }}
                    name="originSiteId"
                    value={values.originSiteId || ""}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      -- Pilih Asal--
                    </MenuItem>
                    {dtSite.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="Masukkan Jumlah Janjang"
                  sx={{
                    my: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                    },
                  }}
                  label={
                    <>
                      <Typography
                        sx={{
                          bgcolor: "white",
                          px: 1.5,
                        }}
                      >
                        Qty TBS
                      </Typography>
                    </>
                  }
                  name="qtyTbs"
                  value={values.qtyTbs}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl sx={{ gridColumn: "span 4" }}>
                {/* {values.progressStatus === 0 && (
                  <GetWeightWB
                    handleSubmit={(weightWb) => {
                      setValues((prev) => ({
                        ...prev,
                        originWeighInKg: weightWb,
                      }));
                    }}
                  />
                )}
                {/* {values.progressStatus === 2 && (
                  <GetWeightWB
                    handleSubmit={(weightWb) => {
                      setValues((prev) => ({
                        ...prev,
                        originWeighOutKg: weightWb,
                      }));
                    }}
                  />
                )} */}

                <TextField
                  type="number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                    },
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">kg</InputAdornment>
                    ),
                  }}
                  label={
                    <Typography
                      sx={{
                        bgcolor: "white",
                        px: 1,
                      }}
                    >
                      Weight IN
                    </Typography>
                  }
                  name="originWeighInKg"
                  value={values.originWeighInKg || 0}
                />
                <TextField
                  type="number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{
                    my: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">kg</InputAdornment>
                    ),
                  }}
                  label={
                    <Typography
                      sx={{
                        bgcolor: "white",
                        px: 1,
                      }}
                    >
                      Weight OUT
                    </Typography>
                  }
                  name="originWeighOutKg"
                  value={values.originWeighOutKg}
                  onChange={handleChange}
                />
                <TextField
                  type="number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{
                    my: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">kg</InputAdornment>
                    ),
                  }}
                  label={
                    <Typography
                      sx={{
                        bgcolor: "white",
                        px: 1,
                      }}
                    >
                      Potongan Wajib Vendor
                    </Typography>
                  }
                  name="potonganWajib"
                  value={values.potonganWajib || 0}
                />
                <TextField
                  type="number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{
                    my: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">kg</InputAdornment>
                    ),
                  }}
                  label={
                    <Typography
                      sx={{
                        bgcolor: "white",
                        px: 1,
                      }}
                    >
                      Potongan Lainnya
                    </Typography>
                  }
                  name="potonganLain"
                  value={values.potonganLain || 0}
                />
                <TextField
                  type="number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    my: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">kg</InputAdornment>
                    ),
                  }}
                  label={
                    <Typography
                      sx={{
                        bgcolor: "white",
                        px: 1,
                      }}
                    >
                      TOTAL
                    </Typography>
                  }
                  //   name="originWeightNetto"
                  value={originWeightNetto}
                />

                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={handleSubmit}
                  disabled={!canSubmit || !validateForm()}
                >
                  Simpan
                </Button>
                <BonTripPrint
                  dtTrans={{ ...values }}
                  isDisable={values.progressStatus !== 4}
                />
                <Button
                  variant="contained"
                  sx={{ my: 1 }}
                  fullWidth
                  onClick={handleClose}
                >
                  Tutup
                </Button>
              </FormControl>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mt: 1 }}>
            <ManualEntryGrid tType={tType} />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default PksManualTBSInternalTimbangKeluar;
