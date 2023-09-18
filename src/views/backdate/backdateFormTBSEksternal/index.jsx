import { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Grid,
  InputAdornment,
  TextField,
  FormControl,
  Typography,
  Paper,
  Box,
  Autocomplete,
  InputLabel,
} from "@mui/material";
import { toast } from "react-toastify";
import moment from "moment";
import "react-toastify/dist/ReactToastify.css";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useForm } from "../../../utils/useForm";
import WeightWB from "../../../components/weightWB";

import BonTripTBS from "../../../components/BonTripTBS";
import * as TransactionAPI from "../../../api/transactionApi";
import Config from "../../../configs";
import ManualEntryGrid from "../../../components/manualEntryGrid";
import PageHeader from "../../../components/PageHeader";
import * as ProductAPI from "../../../api/productsApi";
import * as CompaniesAPI from "../../../api/companiesApi";
import * as DriverAPI from "../../../api/driverApi";
import * as TransportVehicleAPI from "../../../api/transportvehicleApi";
import * as CustomerAPI from "../../../api/customerApi";
import { useConfig } from "../../../common/hooks";

const tType = 1;

const BackdateFormTBSEksternal = () => {
  const dispatch = useDispatch();
  const [configs] = useConfig();
  const navigate = useNavigate();
  const { values, setValues } = useForm({
    ...TransactionAPI.InitialData,
  });
  const [originWeightNetto, setOriginWeightNetto] = useState(0);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
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
      customerName,
      customerId,
      originWeighInKg,
      originWeighOutKg,
      originWeighOutTimestamp,
      deliveryOrderNo,
      progressStatus,
      qtyTbsDikirim,
      qtyTbsDikembalikan,
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
      customerName,
      customerId,
      originWeighInKg,
      originWeighOutKg,
      deliveryOrderNo,
      progressStatus,
      qtyTbsDikirim,
      qtyTbsDikembalikan,
      originWeighInTimestamp,
      originWeighOutTimestamp,
      transportVehicleSccModel,
    };

    if (tempTrans.progressStatus === 0) {
      tempTrans.progressStatus = 4;
      tempTrans.tType = "1";
    }

    try {
      const results = await TransactionAPI.create({ ...tempTrans });

      if (!results?.status) {
        toast.error(`Error: ${results?.message}.`);
        return;
      }

      toast.success(`BackdateForm Berhasil Disimpan.`);
    } catch (error) {
      toast.error(`Error: ${error.message}.`);
    }
    setValues({ ...tempTrans });
  };

  const [bonTripNo, setBonTripNo] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const generateBonTripNo = () => {
      const dateNow = moment(selectedDate).format("YYMMDD");
      const timeNow = moment().format("HHmmss");
      return `P049${dateNow}${timeNow}`;
    };

    const generatedBonTripNo = generateBonTripNo();
    setBonTripNo(generatedBonTripNo);
    setValues({
      ...values,
      bonTripNo: generatedBonTripNo,
    });
  }, [selectedDate]);

  useEffect(() => {
    // setProgressStatus(Config.PKS_PROGRESS_STATUS[values.progressStatus]);

    if (
      values.originWeighInKg < configs.ENV.WBMS_WB_MIN_WEIGHT ||
      values.originWeighOutKg < configs.ENV.WBMS_WB_MIN_WEIGHT
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
    return (
      values.bonTripNo &&
      values.deliveryOrderNo &&
      values.transportVehicleId &&
      values.driverId &&
      values.transporterId &&
      values.productId &&
      values.customerId &&
      values.originWeighInTimestamp &&
      values.originWeighOutTimestamp &&
      values.originWeighInKg > 0 &&
      values.originWeighOutKg > 0
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
        title="Backdate Form PKS"
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
              value="Backdate TBS Eksternal"
            />
          </Paper>
        </Grid>
        <Grid item xs={10.2}>
          <Paper elevation={1} sx={{ p: 3, px: 5, mb: 3 }}>
            <Box
              display="grid"
              gap="20px"
              gridTemplateColumns="repeat(15, minmax(0, 1fr))"
            >
              <FormControl sx={{ gridColumn: "span 4" }}>
                <TextField
                  type="date"
                  variant="outlined"
                  size="small"
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                    },
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
                  value={moment(selectedDate).format("YYYY-MM-DD")}
                  onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    setSelectedDate(newDate);
                  }}
                  disabled={values.progressStatus === 4}
                />
                <TextField
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

                  <Autocomplete
                    id="select-label"
                    options={dtTransportVehicle}
                    getOptionLabel={(option) => option.plateNo}
                    value={
                      dtTransportVehicle.find(
                        (item) => item.id === values.transportVehicleId
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      setValues((prevValues) => ({
                        ...prevValues,
                        transportVehicleId: newValue ? newValue.id : "",
                        transportVehiclePlateNo: newValue
                          ? newValue.plateNo
                          : "",
                        transportVehicleSccModel: newValue
                          ? newValue.sccModel
                          : "",
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="-- Pilih Kendaraan --"
                        variant="outlined"
                        size="small"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                          },
                        }}
                      />
                    )}
                  />
                </FormControl>
                <FormControl variant="outlined" size="small" sx={{ my: 2 }}>
                  <InputLabel
                    id="select-label"
                    shrink
                    sx={{ bgcolor: "white", px: 1 }}
                  >
                    Nama Supir
                  </InputLabel>

                  <Autocomplete
                    id="select-label"
                    options={dtDriver}
                    getOptionLabel={(option) => option.name}
                    value={
                      dtDriver.find((item) => item.id === values.driverId) ||
                      null
                    }
                    onChange={(event, newValue) => {
                      setValues((prevValues) => ({
                        ...prevValues,
                        driverId: newValue ? newValue.id : "",
                        driverName: newValue ? newValue.name : "",
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                          },
                        }}
                        placeholder="-- Pilih Supir --"
                        variant="outlined"
                        size="small"
                      />
                    )}
                  />
                </FormControl>
                <FormControl variant="outlined" size="small" sx={{ my: 2 }}>
                  <InputLabel
                    id="select-label"
                    shrink
                    sx={{ bgcolor: "white", px: 1 }}
                  >
                    Nama Vendor
                  </InputLabel>
                  <Autocomplete
                    id="select-label"
                    options={dtCompany}
                    getOptionLabel={(option) => option.name}
                    value={
                      dtCompany.find(
                        (item) => item.id === values.transporterId
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      setValues((prevValues) => ({
                        ...prevValues,
                        transporterId: newValue ? newValue.id : "",
                        transporterCompanyName: newValue ? newValue.name : "",
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                          },
                        }}
                        placeholder="-- Pilih Vendor --"
                        variant="outlined"
                        size="small"
                      />
                    )}
                  />
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
                    Jenis Barang
                  </InputLabel>

                  <Autocomplete
                    id="select-label"
                    options={dtProduct}
                    getOptionLabel={(option) => option.name}
                    value={
                      dtProduct.find((item) => item.id === values.productId) ||
                      null
                    }
                    onChange={(event, newValue) => {
                      setValues((prevValues) => ({
                        ...prevValues,
                        productId: newValue ? newValue.id : "",
                        productName: newValue ? newValue.name : "",
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                          },
                        }}
                        placeholder="-- Pilih Barang --"
                        variant="outlined"
                        size="small"
                      />
                    )}
                  />
                </FormControl>{" "}
                <FormControl variant="outlined" size="small" sx={{ my: 2 }}>
                  <InputLabel
                    id="select-label"
                    shrink
                    sx={{ bgcolor: "white", px: 1 }}
                  >
                    Customer
                  </InputLabel>

                  <Autocomplete
                    id="select-label"
                    options={dtCustomer}
                    getOptionLabel={(option) => option.name}
                    value={
                      dtCustomer.find(
                        (item) => item.id === values.customerId
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      setValues((prevValues) => ({
                        ...prevValues,
                        customerId: newValue ? newValue.id : "",
                        customerName: newValue ? newValue.name : "",
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                          },
                        }}
                        placeholder="-- Pilih Customer --"
                        variant="outlined"
                        size="small"
                      />
                    )}
                  />
                </FormControl>
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
                  value={originWeightNetto}
                />
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={handleSubmit}
                  disabled={!validateForm() || values.progressStatus === 4}
                >
                  Simpan
                </Button>
                <BonTripTBS
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
              <FormControl sx={{ gridColumn: "span 4" }}>
                <TextField
                  type="datetime-local"
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
                  label={
                    <Typography
                      sx={{
                        bgcolor: "white",
                        px: 1,
                      }}
                    >
                      Tanggal Weight IN
                    </Typography>
                  }
                  name="originWeighInTimestamp"
                  value={values.originWeighInTimestamp}
                  onChange={handleChange}
                />
                <TextField
                  type="datetime-local"
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
                  label={
                    <Typography
                      sx={{
                        bgcolor: "white",
                        px: 1,
                      }}
                    >
                      Tanggal Weight OUT
                    </Typography>
                  }
                  name="originWeighOutTimestamp"
                  value={values.originWeighOutTimestamp}
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
      </Grid>
    </>
  );
};

export default BackdateFormTBSEksternal;
