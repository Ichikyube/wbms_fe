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

const PksManualTBSEksternalTimbangKeluar = (props) => {
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
      originWeighInKg,
      originWeighOutKg,
      deliveryOrderNo,
      progressStatus,
      qtyTbsDikirim,
      qtyTbsDikembalikan,
      originWeighInTimestamp,
      originWeighOutTimestamp,
    } = values;

    let updatedProgressStatus = progressStatus;
    let updatedOriginWeighOutTimestamp = originWeighOutTimestamp;
    let updatedOriginWeighOutKg = originWeighOutKg;

    if (progressStatus === 22) {
      updatedProgressStatus = 4;
      updatedOriginWeighOutKg = wb.weight;
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
      transportVehicleSccModel,
      originWeighInKg,
      originWeighOutKg: updatedOriginWeighOutKg,
      deliveryOrderNo,
      progressStatus: updatedProgressStatus,
      qtyTbsDikirim: parseFloat(qtyTbsDikirim),
      qtyTbsDikembalikan: parseFloat(qtyTbsDikembalikan),
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
    } else if (values.progressStatus === 22) {
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
                  variant="outlined"
                  size="small"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                    },
                  }}
                  label={
                    <>
                      <Typography
                        sx={{
                          bgcolor: "white",
                          px: 1,
                        }}
                      >
                        Nomor BON Trip
                      </Typography>
                    </>
                  }
                  name="bonTripNo"
                  value={values?.bonTripNo || ""}
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

                {/* Asumsikan Anda ingin menampilkan nama produk yang dipilih */}
                {/* <TextField
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
                    display: "none",
                  }}
                  label={
                    <Typography
                      sx={{
                        bgcolor: "white",
                        px: 1,
                      }}
                    >
                      Nama Barang
                    </Typography>
                  }
                  name="productName"
                  value={values.productName}
                /> */}
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
                    readOnly: true,
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
                  value={wb.weight}
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
                  // name="weightNetto"
                  value={originWeightNetto || 0}
                />

                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={handleSubmit}
                  disabled={
                    values.progressStatus === 4 ||
                    isDisabled ||
                    !wb.isStable ||
                    wb.weight < configs.WBMS_WB_MIN_WEIGHT
                      ? true
                      : false
                  }
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
              <FormControl sx={{ gridColumn: "span 4" }}>
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
                      <InputAdornment position="end">JJG</InputAdornment>
                    ),
                  }}
                  label={
                    <Typography
                      sx={{
                        bgcolor: "white",
                        px: 1,
                      }}
                    >
                      Qty TBS Dikirim
                    </Typography>
                  }
                  name="qtyTbsDikirim"
                  value={values.qtyTbsDikirim}
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
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">JJG</InputAdornment>
                    ),
                  }}
                  label={
                    <Typography
                      sx={{
                        bgcolor: "white",
                        px: 1,
                      }}
                    >
                      Qty TBS Dikembalikan
                    </Typography>
                  }
                  name="qtyTbsDikembalikan"
                  value={values.qtyTbsDikembalikan}
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
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                  label={
                    <Typography
                      sx={{
                        bgcolor: "white",
                        px: 1,
                      }}
                    >
                      Potongan
                    </Typography>
                  }
                  // name="potonganLain"
                  value={values.potonganLain || 0}
                  onChange={handleChange}
                />
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

export default PksManualTBSEksternalTimbangKeluar;
