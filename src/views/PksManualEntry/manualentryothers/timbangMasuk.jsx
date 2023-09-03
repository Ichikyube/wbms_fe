import { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
import WeightWB from "../../../components/weightWB";

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
import { getEnvInit } from "../../../configs";

let wsClient;
const tType = 1;

const PksManualOthersTimbangMasuk = (props) => {
  // console.clear();
  const { isDisabled } = props;
  const { wb, configs } = useSelector((state) => state.app);

  const dispatch = useDispatch();

  useEffect(() => {
    (async () =>
      await getEnvInit().then((result) => {
        // ENV = result;
        // console.log(configs);

        if (!wsClient) {
          wsClient = new w3cwebsocket(
            `ws://${result.WBMS_WB_IP}:${result.WBMS_WB_PORT}/GetWeight`
          );

          wsClient.onmessage = (message) => {
            const curWb = { ...wb };
            curWb.isStable = false;
            curWb.weight = Number.isNaN(+message.data) ? 0 : +message.data;

            if (curWb.weight !== wb.weight) {
              curWb.lastChange = moment().valueOf();
            } else if (
              moment().valueOf() - wb.lastChange >
              result.WBMS_WB_STABLE_PERIOD
            ) {
              curWb.isStable = true;
            }

            if (curWb.weight === 0 && curWb.isStable && !curWb.onProcessing)
              curWb.canStartScalling = true;

            dispatch(setWb({ ...curWb }));
          };

          wsClient.onerror = (err) => {
            // alert(`Cannot connect to WB: ${err}`);
            // console.log("Get Weight Component");
            // console.log(err);
          };
        }

        return result;
      }))();
  }, []);

  const navigate = useNavigate();
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

  const fetchTransactionsFromAPI = async () => {
    try {
      const response = await TransactionAPI.getAll({});
      return response.records;
    } catch (error) {
      // Tangani error jika permintaan gagal
      console.error("Error fetching transactions:", error);
      return [];
    }
  };

  const handleSubmit = async () => {
    const {
      bonTripNo,
      productId,
      productName,
      transporterId,
      transporterCompanyName,
      driverId,
      driverName,
      transportVehicleId,
      transportVehiclePlateNo,
      customername,
      customerId,
      originWeighInKg,
      deliveryOrderNo,
      progressStatus,
      originWeighInTimestamp,
      transportVehicleSccModel,
    } = values;

    const tempTrans = {
      bonTripNo,
      productId,
      productName,
      transporterId,
      transporterCompanyName,
      driverId,
      driverName,
      transportVehicleId,
      transportVehiclePlateNo,
      customername,
      customerId,
      originWeighInKg,
      deliveryOrderNo,
      progressStatus,
      originWeighInTimestamp,
      transportVehicleSccModel,
    };

    if (tempTrans.progressStatus === 0) {
      tempTrans.progressStatus = 20;
      tempTrans.tType = "1";
      tempTrans.originWeighInTimestamp = moment().toDate();
      tempTrans.originWeighInKg = wb.weight;
    }

    try {
      const transactionsFromAPI = await fetchTransactionsFromAPI();

      const duplicateEntryFromAPI = transactionsFromAPI.some(
        (item) =>
          item.transportVehiclePlateNo === transportVehiclePlateNo &&
          [20, 21, 22].includes(item.progressStatus)
      );

      if (duplicateEntryFromAPI) {
        toast.error(` ${transportVehiclePlateNo} Truk Masih di Dalam`);
        return;
      }

      if (
        tempTrans.progressStatus === 20 ||
        tempTrans.progressStatus === 21 ||
        tempTrans.progressStatus === 22
      ) {
        const results = await TransactionAPI.create({ ...tempTrans });

        if (!results?.status) {
          toast.error(`Error: ${results?.message}.`);
          return;
        }

        toast.success(`Transaksi Timbang Masuk telah tersimpan.`);

        return handleClose();
      }
    } catch (error) {
      toast.error(`Error: ${error.message}.`);
      return;
    }

    setValues({ ...tempTrans });
  };

  const [bonTripNo, setBonTripNo] = useState(""); // State untuk menyimpan Nomor BON Trip

  useEffect(() => {
    // Fungsi untuk menghasilkan Nomor BON Trip dengan format P041YYMMDDHHmmss
    const generateBonTripNo = () => {
      const dateNow = moment().format("YYMMDDHHmmss");
      return `P041${dateNow}`;
    };

    const generatedBonTripNo = generateBonTripNo(); // Panggil fungsi untuk menghasilkan Nomor BON Trip
    setBonTripNo(generatedBonTripNo); // Simpan Nomor BON Trip dalam state

    // Set nilai Nomor BON Trip ke dalam form values
    setValues({
      ...values,
      bonTripNo: generatedBonTripNo,
    });
  }, []);

  useEffect(() => {
    // ... (kode useEffect yang sudah ada)

    // Tetapkan nilai awal canSubmit berdasarkan nilai yang sudah ada
    let cSubmit = false;
    if (values.progressStatus === 0) {
      // cSubmit = values.originWeighInKg >= Config.ENV.WBMS_WB_MIN_WEIGHT;
    } else if (values.progressStatus === 4) {
      cSubmit = values.originWeighOutKg >= Config.ENV.WBMS_WB_MIN_WEIGHT;
    }
    setCanSubmit(cSubmit);
  }, [values]);

  const validateForm = () => {
    // Implementasikan aturan validasi Anda di sini
    // Kembalikan true jika semua kolom yang dibutuhkan terisi, jika tidak, kembalikan false
    return (
      values.bonTripNo &&
      values.deliveryOrderNo &&
      values.transportVehicleId &&
      values.driverId &&
      values.transporterId &&
      values.productId
      // values.originWeighInKg >= Config.ENV.WBMS_WB_MIN_WEIGHT
    );
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
              value={"Timbang Masuk"}
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
                      color: MenuItem ? "gray" : "black",
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
                      color: MenuItem ? "gray" : "black",
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
                      color: MenuItem ? "gray" : "black",
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

                <FormControl variant="outlined" size="small" sx={{ my: 2 }}>
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
                    sx={{
                      borderRadius: "10px",
                      color: MenuItem ? "gray" : "black",
                    }}
                    onChange={(event) => {
                      const { name, value } = event.target;
                      const selectedCustomer = dtCustomer.find(
                        (item) => item.id === value
                      );
                      setValues((prevValues) => ({
                        ...prevValues,
                        [name]: value,
                        customername: selectedCustomer
                          ? selectedCustomer.name
                          : "",
                      }));
                    }}
                    name="customerId"
                    value={values.customerId || ""}
                    displayEmpty
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
                </FormControl>
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
                      color: MenuItem ? "gray" : "black",
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
              </FormControl>

              <FormControl sx={{ gridColumn: "span 4" }}>
                <WeightWB />

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
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">kg</InputAdornment>
                    ),
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
                      Weight IN
                    </Typography>
                  }
                  name="originWeighInKg"
                  value={values.originWeighInKg}
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
                      Weight OUT
                    </Typography>
                  }
                  name="originWeighOutKg"
                  value={values.originWeighOutKg || 0}
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
                  sx={{
                    my: 2,
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
                      TOTAL
                    </Typography>
                  }
                  name="weightNetto"
                  value={originWeightNetto || 0}
                />

                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={handleSubmit}
                  // disabled={
                  //   !validateForm() ||
                  //   isDisabled ||
                  //   !wb.isStable ||
                  //   wb.weight < configs.WBMS_WB_MIN_WEIGHT
                  //     ? true
                  //     : false
                  // }
                >
                  Simpan
                </Button>
                <BonTripPrint
                  dtTrans={{ ...values }}
                  isDisable={!(values.progressStatus === 4)}
                />
                <Button
                  variant="contained"
                  sx={{ my: 1 }}
                  fullWidth
                  onClick={handleClose}
                  // disabled={!(values.progressStatus === 4)}
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

export default PksManualOthersTimbangMasuk;
