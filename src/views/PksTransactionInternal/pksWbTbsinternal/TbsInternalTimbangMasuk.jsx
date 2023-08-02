import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { w3cwebsocket } from "websocket";
import { Button, Grid, InputAdornment, TextField } from "@mui/material";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

import LocalShippingIcon from "@mui/icons-material/LocalShipping";

import { setWb, clearWb, setWbTransaction } from "../../../slices/appSlice";
import GetWeightWB from "../../../components/GetWeightWB";
import QRCodeViewer from "../../../components/QRCodeViewer";
import BonTripPrint from "../../../components/BonTripPrint";
import * as TransactionAPI from "../../../api/transactionApi";

import PageHeader from "../../../components/PageHeader";
import QRCodeScanner from "../../../components/QRCodeScanner";
import ProgressStatus from "../../../components/ProgressStatus";
import TransactionGrid from "../../../components/TransactionGrid";

const tType = 1;
let wsClient;

const PksTBSInternal = () => {
  return (
    <>
      <PageHeader
        title="Transaksi PKS4"
        subTitle="Page Description"
        sx={{ mb: 2 }}
        icon={<LocalShippingIcon fontSize="large" />}
      />

      <Grid container spacing={1}>
        <Grid item xs={3}>
          <TextField
            variant="outlined"
            size="small"
            fullWidth
            sx={{ mb: 1, backgroundColor: "whitesmoke" }}
            label="Nomor BON Trip"
            name="bonTripNo"
            // value={values?.bonTripNo || ""}
          />
          <TextField
            variant="outlined"
            size="small"
            fullWidth
            sx={{ my: 1, backgroundColor: "whitesmoke" }}
            label="Nomor Polisi"
            name="transportVehiclePlateNo"
            // value={values?.transportVehiclePlateNo || ""}
          />
          <TextField
            variant="outlined"
            size="small"
            fullWidth
            sx={{ my: 1, backgroundColor: "whitesmoke" }}
            label="Nama Supir"
            name="driverFullName"
            // value={values?.jsonData?.driverFullName || ""}
          />
          <TextField
            variant="outlined"
            size="small"
            fullWidth
            sx={{ my: 1, backgroundColor: "whitesmoke" }}
            label="Nama Vendor"
            name="transporterCompanyFullName"
            // value={values?.jsonData?.transporterCompanyFullName || ""}
          />
          <TextField
            variant="outlined"
            size="small"
            fullWidth
            sx={{ my: 1, backgroundColor: "whitesmoke" }}
            label="Sertifikasi Tipe Truk"
            name="vehicleAllowableSccModel"
            // value={
            //   Config.SCC_MODEL[values?.jsonData?.vehicleAllowableSccModel || 0]
            // }
          />
        </Grid>

        <Grid item xs={3}>
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
          {values.progressStatus === 2 && (
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
            sx={{ mb: 2, backgroundColor: "whitesmoke" }}
            InputProps={{
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            }}
            label="Weight IN"
            name="originWeighInKg"
            // value={values.originWeighInKg || 0}
          />
          <TextField
            type="number"
            variant="outlined"
            size="small"
            fullWidth
            sx={{ mb: 2, backgroundColor: "whitesmoke" }}
            InputProps={{
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            }}
            label="Weight OUT"
            name="originWeighOutKg"
            // value={values.originWeighOutKg || 0}
          />

          <TextField
            type="number"
            variant="outlined"
            size="small"
            fullWidth
            sx={{ mb: 2, backgroundColor: "whitesmoke" }}
            InputProps={{
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            }}
            label="Potongan Wajib Vendor"
            name="potonganWajib"
            // value={values.potonganWajib || 0}
          />
          <TextField
            type="number"
            variant="outlined"
            size="small"
            fullWidth
            sx={{ mb: 2, backgroundColor: "whitesmoke" }}
            InputProps={{
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            }}
            label="Potongan Lainnya"
            name="potonganLain"
            // value={values.potonganLain || 0}
          />
          <TextField
            type="number"
            variant="outlined"
            size="small"
            fullWidth
            sx={{ mb: 2, backgroundColor: "whitesmoke" }}
            InputProps={{
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            }}
            label="TOTAL"
            name="weightNetto"
            // value={originWeightNetto || 0}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{ mb: 1 }}
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
          <Button
            variant="contained"
            fullWidth
            sx={{ mb: 1 }}
            // onClick={() => {
            //   // Function Code 5 = Dispatch Delivery
            //   SemaiAPI.encodeQrcode(values.jsonData.deliveryOrderId, 5).then(
            //     (results) => {
            //       setQrContent(results.data.qrcode);
            //       setShowQRCodeViewer(true);
            //     }
            //   );
            // }}
            // disabled={!(values.progressStatus === 4)}
          >
            Tampilkan QR
          </Button>
          <Button
            variant="contained"
            sx={{ mb: 1 }}
            fullWidth
            // onClick={handleClose}
            // disabled={!(values.progressStatus === 4)}
          >
            Tutup
          </Button>

          {/* <BonTripPrint
            // dtTrans={{ ...values }}
            // isDisable={!(values.progressStatus === 4)}
          /> */}
        </Grid>

        <Grid item xs={6}></Grid>
      </Grid>
    </>
  );
};

export default PksTBSInternal;
