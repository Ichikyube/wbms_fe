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
} from "@mui/material";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { ProgressStatusContext } from "../../../../context/ProgressStatusContext";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useForm } from "../../../../utils/useForm";
import { setWb, clearWb, setWbTransaction } from "../../../../slices/appSlice";
import GetWeightWB from "../../../../components/GetWeightWB";
import BonTripPrint from "../../../../components/BonTripPrint";
import * as TransactionAPI from "../../../../api/transactionApi";
import Config from "../../../../configs";
import TransactionGrid from "../../../../components/TransactionGrid";
import PageHeader from "../../../../components/PageHeader";

const tType = 1;
let wsClient;

const PksTBSInternal = () => {
  const { values, setValues } = useForm({ ...TransactionAPI.InitialData });
  const navigate = useNavigate();

  let bonTripNo = `P041${moment().format("YYMMDDHHmmss")}`;

  const handleClose = () => {
    // setProgressStatus("-");
    // setWbPksTransaction(null);

    navigate("/pks-transaction");
  };

  return (
    <>
      <PageHeader
        title="Transaksi PKS4"
        subTitle="Page Description"
        sx={{ mb: 2 }}
        icon={<LocalShippingIcon fontSize="large" />}
      />

      <Grid container spacing={3}>
        <Grid item xs={2}>
          <Paper elevation={2} sx={{ px: 5, py: 3 }}>
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
        <Grid item xs={10}>
          <Paper elevation={3} sx={{ p: 3, px: 5 }}>
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
                  // value={values?.bonTripNo || ""}
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
                  // value={values?.transportVehiclePlateNo || ""}
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
                  label={
                    <>
                      <Typography
                        sx={{
                          bgcolor: "white",
                          px: 1.5,
                        }}
                      >
                        Nomor Polisi
                      </Typography>
                    </>
                  }
                  name="transportVehiclePlateNo"
                  // value={values?.transportVehiclePlateNo || ""}
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
                  label={
                    <>
                      <Typography
                        sx={{
                          bgcolor: "white",
                          px: 1,
                        }}
                      >
                        Nama Supir
                      </Typography>
                    </>
                  }
                  name="driverFullName"
                  // value={values?.jsonData?.driverFullName || ""}
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
                  label={
                    <>
                      <Typography
                        sx={{
                          bgcolor: "white",
                          px: 1,
                        }}
                      >
                        Nama Vendor
                      </Typography>
                    </>
                  }
                  name="transporterCompanyFullName"
                  // value={values?.jsonData?.transporterCompanyFullName || ""}
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
                  label={
                    <>
                      <Typography
                        sx={{
                          bgcolor: "white",
                          px: 1,
                        }}
                      >
                        Jenis Barang
                      </Typography>
                    </>
                  }
                  name="vehicleAllowableSccModel"
                  // value={
                  //   Config.SCC_MODEL[values?.jsonData?.vehicleAllowableSccModel || 0]
                  // }
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
                  label={
                    <Typography
                      sx={{
                        bgcolor: "white",
                        px: 1,
                      }}
                    >
                      Customer
                    </Typography>
                  }
                  name="vehicleAllowableSccModel"
                  // value={
                  //   Config.SCC_MODEL[values?.jsonData?.vehicleAllowableSccModel || 0]
                  // }
                />
              </FormControl>

              <FormControl sx={{ gridColumn: "span 4" }}>
                {values.progressStatus === 0 && (
                  <GetWeightWB
                    handleSubmit={(weightWb) => {
                      setValues((prev) => ({
                        ...prev,
                        originWeighInKg: weightWb,
                      }));
                    }}
                  />
                )}
                {values.progressStatus === 2 && (
                  <GetWeightWB
                    handleSubmit={(weightWb) => {
                      setValues((prev) => ({
                        ...prev,
                        originWeighOutKg: weightWb,
                      }));
                    }}
                  />
                )}
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
                  sx={{ mb: 2 }}
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
                  sx={{ mb: 1, mt: 2 }}
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
            <TransactionGrid tType={tType} />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default PksTBSInternal;
