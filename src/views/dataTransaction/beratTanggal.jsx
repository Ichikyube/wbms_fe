import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  TextField,
  FormControl,
  Typography,
  InputAdornment,
} from "@mui/material";
import format from "date-fns/format";
import { toast } from "react-toastify";
import moment from "moment";
import * as TransactionAPI from "../../api/transactionApi";
import { useForm } from "../../utils/useForm";
import { useConfig } from "../../common/hooks";
const BeratTanggal = () => {
  const [configs] = useConfig();

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataById = await TransactionAPI.getById(id);
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
    values.originWeighInTimestamp = moment(
      values.originWeighInTimestamp
    ).toDate();
    values.originWeighOutTimestamp = moment(
      values.originWeighOutTimestamp
    ).toDate();
    values.originWeighInKg = parseFloat(values.originWeighInKg);
    values.originWeighOutKg = parseFloat(values.originWeighOutKg);

    try {
      const results = await TransactionAPI.update({ ...values });

      if (!results?.status) {
        toast.error(`Error: ${results?.message}.`);
        return;
      }

      toast.success(`Edit Data Transaksi Berhasil Di Update.`);
      return handleClose();
    } catch (error) {
      toast.error(`Error: ${error.message}.`);
    }
    setValues({ ...values });
  };

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
        values.persenPotngWajib -
        values.potonganLain;
      setOriginWeightNetto(total);
    }
  }, [values]);

  const validateForm = () => {
    return (
      values.originWeighInTimestamp &&
      values.originWeighOutTimestamp &&
      values.originWeighInKg > 0 &&
      values.originWeighOutKg > 0
    );
  };

  const handleClose = () => {
    // setProgressStatus("-");
    // setWbPksTransaction(null);

    navigate("/data-transaction");
  };

  return (
    <>
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
          value={originWeightNetto}
        />
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
          value={
            values.originWeighInTimestamp
              ? format(
                  new Date(values.originWeighInTimestamp),
                  "yyyy-MM-dd'T'HH:mm"
                )
              : ""
          }
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
          value={
            values.originWeighOutTimestamp
              ? format(
                  new Date(values.originWeighOutTimestamp),
                  "yyyy-MM-dd'T'HH:mm"
                )
              : ""
          }
          onChange={handleChange}
        />
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleSubmit}
          disabled={!validateForm()}
        >
          Simpan
        </Button>
        {/* <BonTripTBS
        dtTrans={{ ...values }}
        isDisable={!(values.progressStatus === 4)}
      /> */}
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

export default BeratTanggal;
