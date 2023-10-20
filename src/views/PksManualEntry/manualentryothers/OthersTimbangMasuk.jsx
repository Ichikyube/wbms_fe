import { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Button,
  InputAdornment,
  TextField,
  FormControl,
  Typography,
  InputLabel,
  Autocomplete,
  Grid,
  Paper,
  Box,
} from "@mui/material";
import moment from "moment";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "../../../utils/useForm";
import WeightWB from "../../../components/weightWB";
import BonTripTBS from "../../../components/BonTripTBS";
import * as TransactionAPI from "../../../api/transactionApi";
import * as ProductAPI from "../../../api/productsApi";
import * as CompaniesAPI from "../../../api/companiesApi";
import * as DriverAPI from "../../../api/driverApi";
import * as TransportVehicleAPI from "../../../api/transportvehicleApi";
import * as CustomerAPI from "../../../api/customerApi";
import { useWeighbridge, useConfig } from "../../../common/hooks";
import Swal from "sweetalert2";
import useBonTripGenerator from "../../../utils/useBonTripGenerator";

const PksManualTimbangMasukOthers = ({
  ProductId,
  ProductName,
  TransporterId,
  TransporterCompanyName,
  TransporterCompanyCode,
  PlateNo,
}) => {
  // console.clear();

  const [weighbridge] = useWeighbridge();
  const bonTripNo = useBonTripGenerator();
  const [configs] = useConfig();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [originWeightNetto, setOriginWeightNetto] = useState(0);
  const [canSubmit, setCanSubmit] = useState(false);

  // const { values, setValues } = useForm({ ...TransactionAPI.InitialData });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const initialValues = {
    bonTripNo: "",
    driverName: "",
    transporterId: "",
    transporterCompanyName: "",
    transporterCompanyCode: "",
    transportVehiclePlateNo: "",
    productId: "",
    productName: "",
    originWeighInKg: "",
    deliveryOrderNo: "",
    progressStatus: "",
    originWeighInTimestamp: "",
    transportVehicleSccModel: "",
    afdeling: "",
    blok: "",
    sptbs: "",
    // yearPlan: "",
    // kebun: "",
  };

  const [values, setValues] = useState(initialValues);

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
    values.progressStatus = 1;
    values.typeTransaction = 2;
    values.typeSite = 1;
    values.originWeighInTimestamp = moment().toDate();
    values.productId = ProductId;
    values.productName = ProductName;
    values.transporterId = TransporterId;
    values.transporterCompanyName = TransporterCompanyName;
    values.transporterCompanyCode = TransporterCompanyCode;
    values.transportVehiclePlateNo = PlateNo;
    values.originWeighInKg = weighbridge.getWeight();

    if (values.progressStatus === 1) {
      const transactionsFromAPI = await fetchTransactionsFromAPI();

      const duplicatePlateNo = transactionsFromAPI.find(
        (item) =>
          item.transportVehiclePlateNo === PlateNo &&
          [1].includes(item.progressStatus)
      );

      if (duplicatePlateNo) {
        const productName = duplicatePlateNo.productName.toLowerCase();

        if (!productName.includes("cpo") && !productName.includes("pko")) {
          const swalResult = await Swal.fire({
            title: "Truk Masih di Dalam",
            text: "Apakah Anda ingin Timbang keluar?",
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

      try {
        const results = await TransactionAPI.create({ ...values });

        if (!results?.status) {
          toast.error(`Error: ${results?.message}.`);
          return;
        }

        toast.success(`Transaksi Timbang Masuk Berhasil disimpan.`);
        return handleClose();
      } catch (error) {
        toast.error(`Error: ${error.message}.`);
        return;
      }
    }
    setValues({ ...values });
  };
  useEffect(() => {
    // Tetapkan nilai awal canSubmit berdasarkan nilai yang sudah ada
    let cSubmit = false;
    if (values.progressStatus === 0) {
      // cSubmit = values.originWeighInKg >= Config.ENV.WBMS_WB_MIN_WEIGHT;
    } else if (values.progressStatus === 4) {
      cSubmit = values.originWeighOutKg >= configs.ENV.WBMS_WB_MIN_WEIGHT;
    }
    setCanSubmit(cSubmit);
  }, [values]);

  const validateForm = () => {
    return (
      values.bonTripNo &&
      values.deliveryOrderNo &&
      values.driverName &&
      ProductId &&
      ProductName &&
      TransporterId &&
      TransporterCompanyName &&
      TransporterCompanyCode &&
      PlateNo
    );
  };

  const handleClose = () => {
    navigate("/pks-transaction");
  };

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
          value={values?.bonTripNo || bonTripNo} // Nilai data Nomor BON Trip yang diambil dari state 'values'
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
          value={values?.deliveryOrderNo}
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          placeholder="Masukkan Nama Supir"
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
                Nama Supir
              </Typography>
            </>
          }
          name="driverName"
          value={values?.driverName}
          onChange={handleChange}
        />
        {/*      

        <FormControl variant="outlined" size="small" sx={{ my: 2 }}>
          <InputLabel id="select-label" shrink sx={{ bgcolor: "white", px: 1 }}>
            Customer
          </InputLabel>

          <Autocomplete
            id="select-label"
            options={dtCompany}
            getOptionLabel={(option) => option.name}
            value={
              dtCompany.find((item) => item.id === values.customerId) || null
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
        </FormControl> */}
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          placeholder="Masukkan Kebun"
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
                Kebun
              </Typography>
            </>
          }
          name="kebun"
          value={values?.kebun}
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          placeholder="Masukkan Afdeling"
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
                Afdeling
              </Typography>
            </>
          }
          name="afdeling"
          value={values?.afdeling}
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          placeholder="Masukkan Blok"
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
                Blok
              </Typography>
            </>
          }
          name="blok"
          value={values?.blok}
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          placeholder="Masukkan Tahun"
          sx={{
            mt: 2,
            mb: 1,
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
                Tahun
              </Typography>
            </>
          }
          name="yearPlan"
          value={values?.yearPlan}
          onChange={handleChange}
        />

        <hr />
        <TextField
          variant="outlined"
          size="small"
          type="text"
          placeholder="Masukkan SPTBS"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          sx={{
            mt: 1,
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
          value={values?.sptbs}
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          size="small"
          placeholder="Masukkan Sertifikasi"
          fullWidth
          sx={{
            mt: 4,
            mb: 1,
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
          value={values?.transportVehicleSccModel}
          onChange={handleChange}
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
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
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
          name="persenPotngWajib"
          value={values.persenPotngWajib || 0}
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
          sx={{ mt: 2 }}
          fullWidth
          onClick={handleSubmit}
          disabled={
            !validateForm()
            // !weighbridge.isStable() ||
            // weighbridge.getWeight() < configs.ENV.WBMS_WB_MIN_WEIGHT
            //   ? true
            //   : false
          }
        >
          Simpan
        </Button>
        <BonTripTBS
          dtTrans={{ ...values }}
          isDisable={!(values.progressStatus === 4)}
        />
        <Button
          variant="contained"
          sx={{ mt: 1 }}
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

export default PksManualTimbangMasukOthers;
