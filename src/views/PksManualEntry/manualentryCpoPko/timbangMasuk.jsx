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
  FormLabel,
  Autocomplete,
} from "@mui/material";
import moment from "moment";
import { toast } from "react-toastify";
import WeightWB from "../../../components/weightWB";
import "react-toastify/dist/ReactToastify.css";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useForm } from "../../../utils/useForm";
import * as CompaniesAPI from "../../../api/companiesApi";
import BonTripPrint from "../../../components/BonTripPrint";
import * as TransactionAPI from "../../../api/transactionApi";
import ManualEntryGrid from "../../../components/manualEntryGrid";
import PageHeader from "../../../components/PageHeader";
import * as ProductAPI from "../../../api/productsApi";
import * as DriverAPI from "../../../api/driverApi";
import * as TransportVehicleAPI from "../../../api/transportvehicleApi";
import * as CustomerAPI from "../../../api/customerApi";
import * as SiteAPI from "../../../api/sitesApi";
import { useWeighbridge, useConfig } from "../../../common/hooks";

const typeTransaction = 1;
let wsClient;

const PksManualCpoPkoTimbangMasuk = () => {
  const [weighbridge] = useWeighbridge();
  const [configs] = useConfig();

  const { values, setValues } = useForm({ ...TransactionAPI.InitialData });
  const navigate = useNavigate();

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
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
      originSiteId,
      originSiteName,
      customerName,
      customerId,
      originWeighInKg,
      deliveryOrderNo,
      progressStatus,
      originWeighInTimestamp,
      transportVehicleSccModel,
      currentSeal1,
      currentSeal2,
      currentSeal3,
      currentSeal4,
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
      originSiteId,
      originSiteName,
      customerName,
      customerId,
      originWeighInKg,
      deliveryOrderNo,
      progressStatus,
      originWeighInTimestamp,
      transportVehicleSccModel,
      currentSeal1,
      currentSeal2,
      currentSeal3,
      currentSeal4,
    };

    if (tempTrans.progressStatus === 0) {
      tempTrans.progressStatus = 1;
      tempTrans.typeTransaction = "1";
      tempTrans.originWeighInTimestamp = moment().toDate();
      tempTrans.originWeighInKg = weighbridge.getWeight();
    }

    try {
      const transactionsFromAPI = await fetchTransactionsFromAPI();

      const duplicateEntryFromAPI = transactionsFromAPI.some(
        (item) =>
          item.transportVehiclePlateNo === transportVehiclePlateNo &&
          [1].includes(item.progressStatus)
      );

      if (duplicateEntryFromAPI) {
        toast.error(`${transportVehiclePlateNo} Truk Masih di Dalam`);
        return;
      }

      if (tempTrans.progressStatus === 1) {
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

  const validateForm = () => {
    return (
      values.bonTripNo &&
      values.deliveryOrderNo &&
      values.transportVehicleId &&
      values.driverId &&
      values.transporterId &&
      values.productId &&
      values.originSiteId &&
      values.customerId &&
      values.currentSeal1 &&
      values.currentSeal2
    );
  };

  const [originWeightNetto, setOriginWeightNetto] = useState(0);

  useEffect(() => {
    // setProgressStatus(configs.PKS_PROGRESS_STATUS[values.progressStatus]);

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

  const [bonTripNo, setBonTripNo] = useState("");

  useEffect(() => {
    const generateBonTripNo = () => {
      const dateNow = moment().format("YYMMDDHHmmss");
      return `P041${dateNow}`;
    };

    const generatedBonTripNo = generateBonTripNo();
    setBonTripNo(generatedBonTripNo);

    // Set nilai Nomor BON Trip ke dalam form values
    setValues({
      ...values,
      bonTripNo: generatedBonTripNo,
    });
  }, []);

  const handleClose = () => {
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
                    }}>
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
              gridTemplateColumns="repeat(15, minmax(0, 1fr))">
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
                        }}>
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
                        }}>
                        No. DO/NPB
                      </Typography>
                    </>
                  }
                  name="deliveryOrderNo"
                  value={values?.deliveryOrderNo}
                  onChange={handleChange}
                />
                <FormControl variant="outlined" size="small" sx={{ my: 2 }}>
                  <InputLabel
                    id="select-label"
                    shrink
                    sx={{ bgcolor: "white", px: 1 }}>
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
                    sx={{ bgcolor: "white", px: 1 }}>
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
                    sx={{ bgcolor: "white", px: 1 }}>
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
                        }}>
                        Sertifikasi Tipe Truk
                      </Typography>
                    </>
                  }
                  name="transportVehicleSccModel"
                  value={values?.transportVehicleSccModel || "-"}
                />
                <FormControl variant="outlined" size="small" sx={{ my: 2 }}>
                  <InputLabel
                    id="select-label"
                    shrink
                    sx={{ bgcolor: "white", px: 1 }}>
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
                </FormControl>
                <Box
                  display="grid"
                  gridTemplateColumns="1.8fr 1fr"
                  gap={2}
                  alignItems="center">
                  <FormControl variant="outlined" size="small" sx={{ my: 2 }}>
                    <InputLabel
                      id="select-label"
                      shrink
                      sx={{ bgcolor: "white", px: 1 }}>
                      Asal
                    </InputLabel>

                    <Autocomplete
                      id="select-label"
                      options={dtSite}
                      getOptionLabel={(option) => option.name}
                      value={
                        dtSite.find(
                          (item) => item.id === values.originSiteId
                        ) || null
                      }
                      onChange={(event, newValue) => {
                        setValues((prevValues) => ({
                          ...prevValues,
                          originSiteId: newValue ? newValue.id : "",
                          originSiteName: newValue ? newValue.name : "",
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
                          placeholder="-- Pilih Asal --"
                          variant="outlined"
                          size="small"
                        />
                      )}
                    />
                  </FormControl>
                  <TextField
                    type="number"
                    variant="outlined"
                    size="small"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                      },
                    }}
                    label={
                      <Typography
                        sx={{
                          bgcolor: "white",
                          px: 1,
                        }}>
                        Tangki
                      </Typography>
                    }
                    //   name="originWeighInKg"
                    value={0}
                  />
                </Box>
                <Box
                  display="grid"
                  gridTemplateColumns="1.8fr 1fr"
                  gap={2}
                  alignItems="center">
                  <FormControl variant="outlined" size="small" sx={{ my: 2 }}>
                    <InputLabel
                      id="select-label"
                      shrink
                      sx={{ bgcolor: "white", px: 1 }}>
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
                    label={
                      <Typography
                        sx={{
                          bgcolor: "white",
                          px: 1,
                        }}>
                        Tangki
                      </Typography>
                    }
                    //   name="originWeighInKg"
                    value={0}
                  />
                </Box>
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
                  label={
                    <Typography
                      sx={{
                        bgcolor: "white",
                        px: 1,
                      }}>
                      Weight IN
                    </Typography>
                  }
                  name="originWeighInKg"
                  value={weighbridge.getWeight()}
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
                      }}>
                      Weight OUT
                    </Typography>
                  }
                  name="originWeighOutKg"
                  value={values?.originWeighOutKg || 0}
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
                      }}>
                      Potongan Wajib Vendor
                    </Typography>
                  }
                  name="potonganWajib"
                  value={values?.potonganWajib || 0}
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
                      }}>
                      Potongan Lainnya
                    </Typography>
                  }
                  name="potonganLain"
                  value={values?.potonganLain || 0}
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
                      }}>
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
                  disabled={
                    (!validateForm() && !weighbridge.isStable()) ||
                    weighbridge.getWeight() < configs.ENV.WBMS_WB_MIN_WEIGHT
                      ? true
                      : false
                  }>
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
              <FormControl sx={{ gridColumn: "span 4" }}>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  placeholder="Segel Mainhole 1 *"
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
                      }}>
                      Segel Mainhole 1 *
                    </Typography>
                  }
                  name="currentSeal1"
                  value={values?.currentSeal1}
                  onChange={handleChange}
                />
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  placeholder="Segel Valve 1 *"
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
                      }}>
                      Segel Mainhole 1 *
                    </Typography>
                  }
                  name="currentSeal2"
                  value={values?.currentSeal2}
                  onChange={handleChange}
                />
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  placeholder="Segel Mainhole 2 "
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
                      }}>
                      Segel Mainhole 2
                    </Typography>
                  }
                  name="currentSeal3"
                  value={values?.currentSeal3}
                  onChange={handleChange}
                />
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  placeholder="Segel Valve 2"
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
                      }}>
                      Segel Mainhole 2
                    </Typography>
                  }
                  name="currentSeal4"
                  value={values?.currentSeal4}
                  onChange={handleChange}
                />

                <FormControl>
                  <FormLabel
                    sx={{
                      marginBottom: "8px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}>
                    Sertifikasi
                  </FormLabel>
                  <Autocomplete
                    multiple
                    options={["RSPO", "ISCC"]}
                    getOptionLabel={(option) => option}
                    value={values?.sertifikasi}
                    onChange={(event, newValue) => {
                      setValues({
                        ...values,
                        sertifikasi: newValue,
                      });
                    }}
                    name="Sertifikasi"
                    isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => (
                      <TextField {...params} variant="outlined" />
                    )}
                    renderValue={(selected) => selected.join(", ")}
                  />
                </FormControl>
              </FormControl>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mt: 1 }}>
            <ManualEntryGrid typeTransaction={typeTransaction} />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default PksManualCpoPkoTimbangMasuk;
