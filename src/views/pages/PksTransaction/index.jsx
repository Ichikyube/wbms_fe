import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { w3cwebsocket } from "websocket";
import { Grid, Paper, Button, Menu, MenuItem } from "@mui/material";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LocalShippingIcon from "@mui/icons-material/LocalShipping";

import { setWb, clearWb, setWbTransaction } from "../../../slices/appSlice";

import * as TransactionAPI from "../../../api/transactionApi";
import { Link } from "react-router-dom";
import PageHeader from "../../../components/PageHeader";
import QRCodeScanner from "../../../components/QRCodeScanner";
import ProgressStatus from "../../../components/ProgressStatus";
import TransactionGrid from "../../../components/TransactionGrid";

const tType = 1;
let wsClient;

const PksTransaction = () => {
  const { configs, wb, wbTransaction } = useSelector((state) => state.app);

  // const [wsClient, setWsClient] = useState(null);
  const [wbms, setWbms] = useState({ weight: -1 });

  // const [wbPksTransaction, setWbPksTransaction] = useState(null);
  // const [progressStatus, setProgressStatus] = useState("-");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCloseQRCodeScanner = async (codeContent, readEnter) => {
    if (codeContent?.trim().length > 10) {
      const data = { content: codeContent.trim(), tType };

      let response = await TransactionAPI.openCreateByQrcodeSemai(data);

      if (!response.status) {
        return toast.error(response.message);
      }

      console.log(
        `vStatus: ${response.data.transaction.vehicleStatus}, dStatus:${response.data.transaction.deliveryStatus}.`
      );

      // setWbPksTransaction(response.data.transaction);
      dispatch(setWbTransaction({ ...response.data.transaction }));

      navigate(response.data.urlPath);
    } else if (readEnter) {
      return toast.error(
        "Tidak dapat membaca QR Code atau QR Code tidak valid..."
      );
    }
  };

  useEffect(() => {
    if (!wbTransaction) {
      dispatch(setWb({ onProcessing: false }));
    } else dispatch(setWb({ onProcessing: true, canStartScalling: false }));
  }, [dispatch, wbTransaction]);

  useEffect(() => {
    const curWb = { ...wb };
    curWb.weight = wbms.weight;
    curWb.isStable = false;

    if (curWb.weight !== wb.weight) {
      curWb.lastChange = moment().valueOf();
    } else if (
      moment().valueOf() - wb.lastChange >
      configs.WBMS_WB_STABLE_PERIOD
    ) {
      curWb.isStable = true;
    }

    if (curWb.weight === 0 && curWb.isStable && !curWb.onProcessing)
      curWb.canStartScalling = true;

    dispatch(setWb({ ...curWb }));
  }, [configs.WBMS_WB_STABLE_PERIOD, dispatch, wb, wbms]);

  useEffect(() => {
    console.clear();

    if (!wsClient) {
      wsClient = new w3cwebsocket(
        `ws://${configs.WBMS_WB_IP}:${configs.WBMS_WB_PORT}/GetWeight`
      );

      wsClient.onmessage = (message) => {
        const _wbms = { ...wbms };

        _wbms.weight = Number.isNaN(+message.data) ? 0 : +message.data;

        setWbms({ ..._wbms });
      };

      wsClient.onerror = (err) => {
        // alert(`Cannot connect to WB: ${err}`);
        // console.log("Get Weight Component");
        // console.log(err);
      };
    }

    return () => {
      console.log("Page PKS Transaction Closed");
      wsClient.close();
      wsClient = null;
      dispatch(clearWb());
      console.clear();
    };
  }, [configs.WBMS_WB_IP, configs.WBMS_WB_PORT, dispatch, wbms]);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <PageHeader
        title="Transaksi PKS4"
        subTitle="Page Description"
        sx={{ mb: 2 }}
        icon={<LocalShippingIcon fontSize="large" />}
      />

      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs="auto">
              <Paper sx={{ p: 2, width: "220px", height: "auto" }}>
                <ProgressStatus />
                <QRCodeScanner
                  onClose={handleCloseQRCodeScanner}
                  isDisable={wb.canStartScalling ? false : true}
                />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handleClick}
                style={{ width: "10vh", fontSize: "13px", borderRadius: "10%" }}
              >
                New
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  component={Link}
                  to="/pks-transaction-ManualEntry-CpoPko"
                  onClick={handleClose}
                >
                  CPO / PKO
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/pks-transaction-ManualEntry-TBSInternal"
                  onClick={handleClose}
                >
                  TBS Internal
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/pks-transaction-ManualEntry-TBSEksternal"
                  onClick={handleClose}
                >
                  TBS Eksternal
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/pks-transaction-ManualEntry-Others"
                  onClick={handleClose}
                >
                  Lainnya
                </MenuItem>
              </Menu>
              <Paper sx={{ p: 2, mt: 1 }}>
                <TransactionGrid tType={tType} />
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <ToastContainer />
    </>
  );
};

export default PksTransaction;
