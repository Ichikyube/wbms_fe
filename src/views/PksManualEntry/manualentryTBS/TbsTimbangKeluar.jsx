import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TextField, FormControl, Typography } from "@mui/material";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "../../../utils/useForm";

import * as TransactionAPI from "../../../api/transactionApi";

import { useWeighbridge, useConfig } from "../../../common/hooks";

import GradingCalculator from "../../../components/GradingCalculator";
const typeSite = 1;

const PksManualTBSTimbangKeluar = ({
  selectedCompany,
  PlateNo,
  TransporterId,
  TransporterCompanyName,
  TransporterCompanyCode,
}) => {
  const [dtCompany, setDtCompany] = useState([]);
  const [dtProduct, setDtProduct] = useState([]);
  const [dtDriver, setDtDriver] = useState([]);
  const [dtTransportVehicle, setDtTransportVehicle] = useState([]);
  const [dtCustomer, setDtCustomer] = useState([]);
  const [dtSite, setDtSite] = useState([]);
  const [qtyTbs, setQtyTbs] = useState();
  const [canSubmit, setCanSubmit] = useState(false);
  const initialValues = {
    bonTripNo: "",
    driverName: "",
    transporterId: "",
    transporterCompanyName: "",
    transportVehiclePlateNo: "",
    originWeighOutKg: "",
    deliveryOrderNo: "",
    progressStatus: "",
    originWeighOutTimestamp: "",
    transportVehicleSccModel: "",
    afdeling: "",
    blok: "",
    sptbs: "",
    qtyTbs: "",
  };
  const [weighbridge] = useWeighbridge();
  const [configs] = useConfig();

  const navigate = useNavigate();
  const { id } = useParams();
  const { values, setValues } = useForm(initialValues);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleClose = () => {
    navigate("/pks-transaction");
  };
  const handleSubmit = async () => {
    if (values.progressStatus === 1) {
      values.progressStatus = 4;
      values.originWeighOutKg = weighbridge.getWeight();
      values.originWeighOutTimestamp = moment().toDate();
      values.transporterId = TransporterId;
      values.transporterCompanyName = TransporterCompanyName;
      values.transporterCompanyCode = TransporterCompanyCode;
      values.transportVehiclePlateNo = PlateNo;
    }

    try {
      const results = await TransactionAPI.update({ ...values });

      if (!results?.status) {
        toast.error(`Error: ${results?.message}.`);
        return;
      }

      toast.success(`Transaksi Timbang Keluar Berhasil disimpan.`);
    } catch (error) {
      toast.error(`Error: ${error.message}.`);
    }
  };

  useEffect(() => {
    // ... (kode useEffect yang sudah ada)

    // Tetapkan nilai awal canSubmit berdasarkan nilai yang sudah ada
    let cSubmit = false;
    if (values.progressStatus === 0) {
      cSubmit = values.originWeighInKg >= configs.ENV.WBMS_WB_MIN_WEIGHT;
    } else if (values.progressStatus === 21) {
      cSubmit = values.originWeighOutKg >= configs.ENV.WBMS_WB_MIN_WEIGHT;
    }
    setCanSubmit(cSubmit);
  }, [values]);

  // useEffect(() => {
  //   if (
  //     values.originWeighInKg < configs.ENV.WBMS_WB_MIN_WEIGHT ||
  //     weighbridge.getWeight() < configs.ENV.WBMS_WB_MIN_WEIGHT
  //   ) {
  //     setOriginWeightNetto(0);
  //   } else {
  //     let total =
  //       Math.abs(values.originWeighInKg - weighbridge.getWeight()) -
  //       values.persenPotngWajib -
  //       values.potonganLain;
  //     setOriginWeightNetto(total);
  //   }
  // }, [values, weighbridge]);

  const validateForm = () => {
    return (
      values.bonTripNo &&
      values.deliveryOrderNo &&
      values.driverName &&
      TransporterId &&
      TransporterCompanyName &&
      TransporterCompanyCode &&
      PlateNo
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataById = await TransactionAPI.getById(id);

        if (dataById) {
          const record = Object.fromEntries(
            Object.entries(dataById.record).filter(
              ([key, value]) => value !== null
            )
          );
          setValues({
            ...record,
          });
          console.log(values);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

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
                }}>
                Nama Supir
              </Typography>
            </>
          }
          name="driverName"
          value={values?.driverName}
          onChange={handleChange}
        />

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
                }}>
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
                Tahun
              </Typography>
            </>
          }
          name="yearPlan"
          value={values?.yearPlan}
          onChange={handleChange}
        />
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
                }}>
                Qty TBS
              </Typography>
            </>
          }
          name="qtyTbs"
          value={values?.qtyTbs}
          onChange={(event) => {
            const { name, value } = event.target;
            setValues((prevValues) => ({
              ...prevValues,
              [name]: value,
            }));
            setQtyTbs(value);
          }}
        />
        <hr />
        <TextField
          variant="outlined"
          size="small"
          type="text"
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
                  px: 1.5,
                }}>
                SPBTS
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
          fullWidth
          placeholder="Masukkan Sertifikasi"
          sx={{
            mt: 2,
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
          value={values?.transportVehicleSccModel}
          onChange={handleChange}
        />
      </FormControl>
      <GradingCalculator
        handleSubmit={handleSubmit}
        handleClose={handleClose}
        validateForm={validateForm}
        values={values}
        selectedCompany={selectedCompany}
        weighbridge={weighbridge}
        qtyTbs={qtyTbs}
      />
    </>
  );
};

export default PksManualTBSTimbangKeluar;
