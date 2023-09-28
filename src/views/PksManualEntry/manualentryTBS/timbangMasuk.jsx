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
  Checkbox,
  InputLabel,
  Autocomplete,
} from "@mui/material";
import moment from "moment";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useForm } from "../../../utils/useForm";
import WeightWB from "../../../components/weightWB";
import BonTripTBS from "../../../components/BonTripTBS";
import * as TransactionAPI from "../../../api/transactionApi";
import * as ProductAPI from "../../../api/productsApi";
import * as CompaniesAPI from "../../../api/companiesApi";
import * as DriverAPI from "../../../api/driverApi";
import * as TransportVehicleAPI from "../../../api/transportvehicleApi";
import * as CustomerAPI from "../../../api/customerApi";
import * as SiteAPI from "../../../api/sitesApi";
import Swal from "sweetalert2";
import { useWeighbridge, useConfig } from "../../../common/hooks";

let wsClient;

const tType = 1;

const PksManualTBSinternalTimbangMasuk = ({
  selectedProduct,
  selectedCompany,
  PlateNo,
}) => {
  const [weighbridge] = useWeighbridge();
  const [configs] = useConfig();

  const dispatch = useDispatch();

  const { values, setValues } = useForm({ ...TransactionAPI.InitialData });
  const navigate = useNavigate();

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
      originSiteId,
      originSiteName,
      customerName,
      customerId,
      originWeighInKg,
      deliveryOrderNo,
      progressStatus,
      originWeighInTimestamp,
      transportVehicleSccModel,
      qtyTbs,
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
      qtyTbs,
    };

    if (tempTrans.progressStatus === 0) {
      tempTrans.progressStatus = 1;
      tempTrans.tType = "1";
      tempTrans.originWeighInTimestamp = moment().toDate();
      tempTrans.originWeighInKg = weighbridge.getWeight();
      tempTrans.productId = selectedProduct ? selectedProduct.id : "";
      tempTrans.productName = selectedProduct ? selectedProduct.name : "";
      tempTrans.transporterId = selectedCompany ? selectedCompany.id : "";
      tempTrans.transporterCompanyName = selectedCompany
        ? selectedCompany.name
        : "";
      tempTrans.transportVehiclePlateNo = PlateNo;
    }

    try {
      // Tambahkan logika untuk menentukan apakah membuat atau mengambil transaksi
      if (tempTrans.progressStatus === 1) {
        const transactionsFromAPI = await fetchTransactionsFromAPI();

        const duplicatePlateNo = transactionsFromAPI.find(
          (item) =>
            item.transportVehiclePlateNo === transportVehiclePlateNo &&
            [1].includes(item.progressStatus)
        );

        if (duplicatePlateNo) {
          const productName = duplicatePlateNo.productName.toLowerCase();

          if (!productName.includes("cpo") && !productName.includes("pko")) {
            const swalResult = await Swal.fire({
              title: "Truk Masih di Dalam",
              text: "Apakah Anda ingin keluar?",
              icon: "question",
              showCancelButton: true,
              confirmButtonColor: "#1976d2",
              confirmButtonText: "Ya",
              cancelButtonText: "Tidak",
            });

            if (swalResult.isConfirmed) {
              const Id = duplicatePlateNo.id;
              navigate(`/pks-ManualEntry-TimbangKeluar/${Id}`);
            }
          }
          return;
        }

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
      cSubmit = values.originWeighInKg >= configs.ENV.WBMS_WB_MIN_WEIGHT;
    } else if (values.progressStatus === 4) {
      cSubmit = values.originWeighOutKg >= configs.ENV.WBMS_WB_MIN_WEIGHT;
    }
    setCanSubmit(cSubmit);
  }, [values]);

  const validateForm = () => {
    return (
      values.bonTripNo &&
      values.deliveryOrderNo &&
      values.transportVehicleId &&
      values.driverId &&
      values.transporterId &&
      values.productId &&
      values.originSiteId &&
      values.qtyTbs &&
      values.customerId
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
        {/* <FormControl variant="outlined" size="small" sx={{ my: 2 }}>
          <InputLabel id="select-label" shrink sx={{ bgcolor: "white", px: 1 }}>
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
                transportVehiclePlateNo: newValue ? newValue.plateNo : "",
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
        </FormControl> */}
        <FormControl variant="outlined" size="small" sx={{ my: 2 }}>
          <InputLabel id="select-label" shrink sx={{ bgcolor: "white", px: 1 }}>
            Nama Supir
          </InputLabel>
          <Autocomplete
            id="select-label"
            options={dtDriver}
            getOptionLabel={(option) => option.name}
            value={dtDriver.find((item) => item.id === values.driverId) || null}
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
        {/* <FormControl variant="outlined" size="small" sx={{ my: 2 }}>
          <InputLabel id="select-label" shrink sx={{ bgcolor: "white", px: 1 }}>
            Nama Vendor
          </InputLabel>
          <Autocomplete
            id="select-label"
            options={dtCompany}
            getOptionLabel={(option) => option.name}
            value={
              dtCompany.find((item) => item.id === values.transporterId) || null
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
        </FormControl> */}
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
          value={values.transportVehicleSccModel}
          onChange={handleChange}
        />
        {/* <FormControl variant="outlined" size="small" sx={{ my: 2 }}>
          <InputLabel id="select-label" shrink sx={{ bgcolor: "white", px: 1 }}>
            Jenis Barang
          </InputLabel>
          <Autocomplete
            id="select-label"
            options={dtProduct}
            getOptionLabel={(option) => option.name}
            value={
              dtProduct.find((item) => item.id === values.productId) || null
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
        </FormControl> */}
        <FormControl variant="outlined" size="small" sx={{ my: 2 }}>
          <InputLabel id="select-label" shrink sx={{ bgcolor: "white", px: 1 }}>
            Customer
          </InputLabel>

          <Autocomplete
            id="select-label"
            options={dtCustomer}
            getOptionLabel={(option) => option.name}
            value={
              dtCustomer.find((item) => item.id === values.customerId) || null
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
        <FormControl variant="outlined" size="small" sx={{ my: 2 }}>
          <InputLabel id="select-label" shrink sx={{ bgcolor: "white", px: 1 }}>
            Asal
          </InputLabel>

          <Autocomplete
            id="select-label"
            options={dtSite}
            getOptionLabel={(option) => option.name}
            value={
              dtSite.find((item) => item.id === values.originSiteId) || null
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
          variant="outlined"
          size="small"
          type="number"
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
        />{" "}
        <TextField
          variant="outlined"
          size="small"
          type="number"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          // placeholder="Masukkan Jumlah Janjang"
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
                SPTBS
              </Typography>
            </>
          }
          name="sptbs"
          value={values.sptbs}
          onChange={handleChange}
        />
      </FormControl>

      <FormControl sx={{ gridColumn: "span 4" }}>
        <Box
          display="grid"
          gridTemplateColumns="4fr 2fr"
          gap={2}
          alignItems="center"
        >
          <FormControl
            sx={{
              flexDirection: "row",
            }}
          >
            <Checkbox
              size="small"
              sx={{
                alignItems: "center",
                mb: 1,
              }}
            />
            <TextField
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ fontWeight: "bold" }}>
                    %/Jjg
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  mb: 1,
                },
              }}
              label={
                <Typography
                  sx={{
                    bgcolor: "white",
                    px: 1,
                  }}
                >
                  Buah Mentah
                </Typography>
              }
              // name="originWeighInKg"
              // value={0}
            />
          </FormControl>
          <TextField
            type="number"
            variant="outlined"
            size="small"
            fullWidth
            disabled
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                mb: 1,
                bgcolor: "whitesmoke",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ fontWeight: "bold" }}>
                  kg
                </InputAdornment>
              ),
            }}
            //   name="originWeighInKg"
            // value={0}
          />
          <FormControl
            sx={{
              flexDirection: "row",
            }}
          >
            <Checkbox
              size="small"
              sx={{
                alignItems: "center",
                mb: 1,
              }}
            />
            <TextField
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ fontWeight: "bold" }}>
                    %/Jjg
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                },
                my: 1,
              }}
              label={
                <Typography
                  sx={{
                    bgcolor: "white",
                    px: 1,
                  }}
                >
                  Buah Lewat Matang
                </Typography>
              }
              //   name="originWeighInKg"
              // value={0}
            />
          </FormControl>
          <TextField
            type="number"
            variant="outlined"
            size="small"
            fullWidth
            disabled
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                bgcolor: "whitesmoke",
                my: 1,
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ fontWeight: "bold" }}>
                  kg
                </InputAdornment>
              ),
            }}
            //   name="originWeighInKg"
            // value={0}
          />
          <FormControl
            sx={{
              flexDirection: "row",
            }}
          >
            <Checkbox
              size="small"
              sx={{
                alignItems: "center",
                mb: 1,
              }}
            />
            <TextField
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ fontWeight: "bold" }}>
                    %/Jjg
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                },
                my: 1,
              }}
              label={
                <Typography
                  sx={{
                    bgcolor: "white",
                    px: 1,
                  }}
                >
                  Tangkai Panjang
                </Typography>
              }
              //   name="originWeighInKg"
              // value={0}
            />
          </FormControl>
          <TextField
            type="number"
            variant="outlined"
            size="small"
            fullWidth
            disabled
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                bgcolor: "whitesmoke",
              },
              my: 1,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ fontWeight: "bold" }}>
                  kg
                </InputAdornment>
              ),
            }}
            //   name="originWeighInKg"
            // value={0}
          />
          <FormControl
            sx={{
              flexDirection: "row",
            }}
          >
            <Checkbox
              size="small"
              sx={{
                alignItems: "center",
                mb: 1,
              }}
            />
            <TextField
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ fontWeight: "bold" }}>
                    %/Jjg
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                },
                my: 1,
              }}
              label={
                <Typography
                  sx={{
                    bgcolor: "white",
                    px: 1,
                  }}
                >
                  Tangkai Kosong
                </Typography>
              }
              //   name="originWeighInKg"
              // value={0}
            />
          </FormControl>
          <TextField
            type="number"
            variant="outlined"
            size="small"
            fullWidth
            disabled
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                bgcolor: "whitesmoke",
              },
              my: 1,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ fontWeight: "bold" }}>
                  kg
                </InputAdornment>
              ),
            }}
            //   name="originWeighInKg"
            // value={0}
          />
          <FormControl
            sx={{
              flexDirection: "row",
            }}
          >
            <Checkbox
              size="small"
              sx={{
                alignItems: "center",
                mb: 1,
              }}
            />
            <TextField
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ fontWeight: "bold" }}>
                    %/Jjg
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                },
                my: 1,
              }}
              label={
                <Typography
                  sx={{
                    bgcolor: "white",
                    px: 1,
                  }}
                >
                  Sampah
                </Typography>
              }
              //   name="originWeighInKg"
              // value={0}
            />
          </FormControl>
          <TextField
            type="number"
            variant="outlined"
            size="small"
            fullWidth
            disabled
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                bgcolor: "whitesmoke",
              },
              my: 1,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ fontWeight: "bold" }}>
                  kg
                </InputAdornment>
              ),
            }}
            //   name="originWeighInKg"
            // value={0}
          />
          <FormControl
            sx={{
              flexDirection: "row",
            }}
          >
            <Checkbox
              size="small"
              sx={{
                alignItems: "center",
                mb: 1,
              }}
            />
            <TextField
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ fontWeight: "bold" }}>
                    %/Jjg
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                },
                my: 1,
              }}
              label={
                <Typography
                  sx={{
                    bgcolor: "white",
                    px: 1,
                  }}
                >
                  Air
                </Typography>
              }
              //   name="originWeighInKg"
              // value={0}
            />
          </FormControl>
          <TextField
            type="number"
            variant="outlined"
            size="small"
            fullWidth
            disabled
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                bgcolor: "whitesmoke",
              },
              my: 1,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ fontWeight: "bold" }}>
                  kg
                </InputAdornment>
              ),
            }}
            //   name="originWeighInKg"
            // value={0}
          />
          <FormControl
            sx={{
              flexDirection: "row",
            }}
          >
            <Checkbox
              size="small"
              sx={{
                alignItems: "center",
                mb: 1,
              }}
            />
            <TextField
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ fontWeight: "bold" }}>
                    %/Jjg
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                },
                my: 1,
              }}
              label={
                <Typography
                  sx={{
                    bgcolor: "white",
                    px: 1,
                  }}
                >
                  Parteno
                </Typography>
              }
              //   name="originWeighInKg"
              // value={0}
            />
          </FormControl>
          <TextField
            type="number"
            variant="outlined"
            size="small"
            fullWidth
            disabled
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                bgcolor: "whitesmoke",
              },
              my: 1,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ fontWeight: "bold" }}>
                  kg
                </InputAdornment>
              ),
            }}
            //   name="originWeighInKg"
            // value={0}
          />
          <FormControl
            sx={{
              flexDirection: "row",
            }}
          >
            <Checkbox
              size="small"
              sx={{
                alignItems: "center",
                mb: 1,
              }}
            />
            <TextField
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ fontWeight: "bold" }}>
                    %/Jjg
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                },
                my: 1,
              }}
              label={
                <Typography
                  sx={{
                    bgcolor: "white",
                    px: 1,
                  }}
                >
                  Brondolan
                </Typography>
              }
              //   name="originWeighInKg"
              // value={0}
            />
          </FormControl>
          <TextField
            type="number"
            variant="outlined"
            size="small"
            fullWidth
            disabled
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                bgcolor: "whitesmoke",
              },
              my: 1,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ fontWeight: "bold" }}>
                  kg
                </InputAdornment>
              ),
            }}
            //   name="originWeighInKg"
            // value={0}
          />
          <FormControl
            sx={{
              flexDirection: "row",
            }}
          >
            <Checkbox
              size="small"
              sx={{
                alignItems: "center",
                mb: 1,
              }}
            />
            <TextField
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ fontWeight: "bold" }}>
                    %/Jjg
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                },
                my: 1,
              }}
              label={
                <Typography
                  sx={{
                    bgcolor: "white",
                    px: 1,
                  }}
                >
                  Pot. Wajib Vendor
                </Typography>
              }
              //   name="originWeighInKg"
              // value={0}
            />
          </FormControl>
          <TextField
            type="number"
            variant="outlined"
            size="small"
            fullWidth
            disabled
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                bgcolor: "whitesmoke",
              },
              my: 1,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ fontWeight: "bold" }}>
                  kg
                </InputAdornment>
              ),
            }}
            //   name="originWeighInKg"
            // value={0}
          />
          <FormControl
            sx={{
              flexDirection: "row",
            }}
          >
            <Checkbox
              size="small"
              sx={{
                alignItems: "center",
                mb: 1,
              }}
            />
            <TextField
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ fontWeight: "bold" }}>
                    %/Jjg
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                },
                my: 1,
              }}
              label={
                <Typography
                  sx={{
                    bgcolor: "white",
                    px: 1,
                  }}
                >
                  Pot. Lainnya
                </Typography>
              }
              //   name="originWeighInKg"
              // value={0}
            />
          </FormControl>
          <TextField
            type="number"
            variant="outlined"
            size="small"
            fullWidth
            disabled
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                bgcolor: "whitesmoke",
              },
              my: 1,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ fontWeight: "bold" }}>
                  kg
                </InputAdornment>
              ),
            }}
            //   name="originWeighInKg"
            // value={0}
          />
        </Box>
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
            mt: 3,
          }}
          label={
            <Typography
              sx={{
                bgcolor: "white",
                px: 1,
              }}
            >
              TOTAL Potongan
            </Typography>
          }
          //   name="originWeighInKg"
          // value={0}
        />
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
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
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
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
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
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
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
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
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
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
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
          //   !weighbridge.isStable() ||
          //   weighbridge.getWeight() < configs.ENV.WBMS_WB_MIN_WEIGHT
          //     ? true
          //     : false
          // }
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
    </>
  );
};

export default PksManualTBSinternalTimbangMasuk;
