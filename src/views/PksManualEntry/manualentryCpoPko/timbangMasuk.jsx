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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ProgressStatusContext } from "../../../context/ProgressStatusContext";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useForm } from "../../../utils/useForm";
import { setWb, clearWb, setWbTransaction } from "../../../slices/appSlice";
import GetWeightWB from "../../../components/GetWeightWB";
import * as CompaniesAPI from "../../../api/companiesApi";
import BonTripPrint from "../../../components/BonTripPrint";
import * as TransactionAPI from "../../../api/transactionApi";
import Config from "../../../configs";
import TransactionGrid from "../../../components/TransactionGrid";
import PageHeader from "../../../components/PageHeader";
import * as ProductAPI from "../../../api/productsApi";
import * as DriverAPI from "../../../api/driverApi";
import * as TransportVehicleAPI from "../../../api/transportvehicleApi";
import * as CustomerAPI from "../../../api/customerApi";
import * as SiteAPI from "../../../api/sitesApi";

const tType = 1;
let wsClient;

const PksManualCpoPkoTimbangMasuk = () => {
  const { values, setValues } = useForm({ ...TransactionAPI.InitialData });
  const navigate = useNavigate();

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
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
        <Grid item xs={1.5}>
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
        <Grid item xs={10.5}>
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
                  name="transportVehiclePlateNo"
                  value={values?.transportVehiclePlateNo || ""}
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
                    onChange={handleChange}
                    name="Nopol"
                    value={values.Nopol || ""}
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
                    onChange={handleChange}
                    name="driver"
                    value={values.driver || ""}
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
                    Nama Transporter
                  </InputLabel>
                  <Select
                    labelId="select-label"
                    id="select"
                    onChange={handleChange}
                    name="Transporter"
                    value={values.Transporter || ""}
                    displayEmpty
                    sx={{
                      borderRadius: "10px",
                      color: MenuItem ? "gray" : "black",
                    }}
                  >
                    <MenuItem value="" disabled>
                      -- Pilih Transporter --
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
                  disabled
                  value="-"
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
                        Sertifikasi Tipe Truk
                      </Typography>
                    </>
                  }
                  name="vehicleAllowableSccModel"
                  // value={
                  //   Config.SCC_MODEL[values?.jsonData?.vehicleAllowableSccModel || 0]
                  // }
                />
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
                    onChange={handleChange}
                    name="productId"
                    value={values.productId || ""}
                    displayEmpty
                    sx={{
                      borderRadius: "10px",
                      color: MenuItem ? "gray" : "black",
                    }}
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
                <Box
                  display="grid"
                  gridTemplateColumns="1.8fr 1fr"
                  gap={2}
                  alignItems="center"
                >
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
                      onChange={handleChange}
                      name="Site"
                      value={values.Site || ""}
                      displayEmpty
                      sx={{
                        borderRadius: "10px",
                        color: MenuItem ? "gray" : "black",
                      }}
                    >
                      <MenuItem value="" disabled>
                        -- Pilih Asal --
                      </MenuItem>
                      {dtSite.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
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
                        }}
                      >
                        Tangki
                      </Typography>
                    }
                    //   name="originWeighInKg"
                    value={values.originWeighInKg || 0}
                  />
                </Box>
                <Box
                  display="grid"
                  gridTemplateColumns="1.8fr 1fr"
                  gap={2}
                  alignItems="center"
                >
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
                      onChange={handleChange}
                      name="customer"
                      value={values.customer || ""}
                      displayEmpty
                      sx={{
                        borderRadius: "10px",
                        color: MenuItem ? "gray" : "black",
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
                        }}
                      >
                        Tangki
                      </Typography>
                    }
                    //   name="originWeighInKg"
                    value={values.originWeighInKg || 0}
                  />
                </Box>
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
                  InputLabelProps={{
                    shrink: true,
                  }}
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
                      }}
                    >
                      GET WEIGHT
                    </Typography>
                  }
                  //   name="originWeighInKg"
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
                  name="weightNetto"
                  //   value={originWeightNetto || 0}
                />
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                  // onClick={handleSubmit}
                  // disabled={
                  //   !(
                  //     canSubmit &&
                  //     (values.progressStatus === 0 || values.progressStatus === 2)
                  //   )
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
                  //   name="transportVehiclePlateNo"
                  //   value={values?.transportVehiclePlateNo || ""}
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
                  //   name="transportVehiclePlateNo"
                  //   value={values?.transportVehiclePlateNo || ""}
                />
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  placeholder="Segel Mainhole 2 *"
                  sx={{
                    my: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                    },
                  }}
                  //   name="transportVehiclePlateNo"
                  //   value={values?.transportVehiclePlateNo || ""}
                />
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  placeholder="Segel Valve 2 *"
                  sx={{
                    my: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                    },
                  }}
                  //   name="transportVehiclePlateNo"
                  //   value={values?.transportVehiclePlateNo || ""}
                />

                <FormControl>
                  <FormLabel
                    sx={{
                      marginBottom: "8px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Sertifikasi
                  </FormLabel>
                  <Autocomplete
                    multiple
                    options={["RSPO", "ISCC"]}
                    getOptionLabel={(option) => option}
                    value={values.sertifikasi}
                    onChange={(event, newValue) => {
                      // Handle changes to the selected values
                      setValues("Sertifikasi", newValue);
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
            <TransactionGrid tType={tType} />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default PksManualCpoPkoTimbangMasuk;
