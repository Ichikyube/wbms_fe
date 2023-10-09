import { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { w3cwebsocket } from "websocket";
import {
  Grid,
  Paper,
  Button,
  Menu,
  MenuItem,
  Box,
  IconButton,
} from "@mui/material";
import useSWR from "swr";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputBase from "@mui/material/InputBase";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SearchIcon from "@mui/icons-material/Search";
import { setWb, clearWb, setWbTransaction } from "../../../slices/appSlice";
import * as TransactionAPI from "../../../api/transactionApi";
import { Link } from "react-router-dom";
import PageHeader from "../../../components/PageHeader";
import QRCodeScanner from "../../../components/QRCodeScanner";
import ProgressStatus from "../../../components/ProgressStatus";
import TransactionGrid from "../../../components/TransactionGrid";
import { useMatrix } from "../../../context/UserMatrixContext";

const typeSite = 1;

const PksTransaction = () => {
  const { configs, wb, wbTransaction } = useSelector((state) => state.app);
  const gridRef = useRef();
  // const [wsClient, setWsClient] = useState(null);
  const [wbms, setWbms] = useState({ weight: -1 });

  // const [wbPksTransaction, setWbPksTransaction] = useState(null);
  // const [progressStatus, setProgressStatus] = useState("-");
  const { backDatedForm } = useSelector((state) => state.tempConfigs);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCloseQRCodeScanner = async (codeContent, readEnter) => {
    if (codeContent?.trim().length > 10) {
      const data = { content: codeContent.trim(), typeSite };

      let response = await TransactionAPI.openCreateByQrcodeSemai(data);

      if (!response?.status) {
        return toast.error(response?.message);
      }

      console.log(
        `vStatus: ${response?.data.transaction.vehicleStatus}, dStatus:${response?.data.transaction.deliveryStatus}.`
      );

      // setWbPksTransaction(response?.data.transaction);
      dispatch(setWbTransaction({ ...response?.data.transaction }));

      navigate(response?.data.urlPath);
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
  }, [wbTransaction, dispatch]);

  useEffect(() => {
    // const curWb = { ...wb };
    // curWb.weight = wbms.weight;
    // curWb.isStable = false;
    // if (curWb.weight !== wb.weight) {
    //   curWb.lastChange = moment().valueOf();
    // } else if (
    //   moment().valueOf() - wb.lastChange >
    //   configs.WBMS_WB_STABLE_PERIOD
    // ) {
    //   curWb.isStable = true;
    // }
    // if (curWb.weight === 0 && curWb.isStable && !curWb.onProcessing)
    //   curWb.canStartScalling = true;
    // dispatch(setWb({ ...curWb }));
  }, [wbms]);

  useEffect(() => {
    console.clear();
    // if (!wsClient) {
    //   wsClient = new w3cwebsocket(
    //     `ws://${configs.WBMS_WB_IP}:${configs.WBMS_WB_PORT}/GetWeight`
    //   );
    //   wsClient.onmessage = (message) => {
    //     const _wbms = { ...wbms };
    //     _wbms.weight = Number.isNaN(+message.data) ? 0 : +message.data;
    //     setWbms({ ..._wbms });
    //   };
    //   wsClient.onerror = (err) => {
    //     // alert(`Cannot connect to WB: ${err}`);
    //     // console.log("Get Weight Component");
    //     // console.log(err);
    //   };
    // }
    // return () => {
    //   console.log("Page PKS Transaction Closed");
    //   wsClient.close();
    //   wsClient = null;
    //   dispatch(clearWb());
    //   console.clear();
    // };
  }, []);
// type Transaction 1.eDispatch(CPO, PKO) 2.pks 3.Bulking
  const [anchorE2, setAnchorE2] = useState(null);

  const handleFormClick = (event) => {
    setAnchorE2(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorE2(null);
  };

  const [searchQuery, setSearchQuery] = useState("");

  const fetcher = () =>
    TransactionAPI.searchMany({
      where: {
        typeSite,
        progressStatus: { notIn: [4, 9, 14] },
      },
      orderBy: { bonTripNo: "desc" },
    }).then((res) => res.records);

  const { data: dtTransactions } = useSWR(
    searchQuery ? `transaction?name_like=${searchQuery}` : "transaction",
    fetcher,
    {
      refreshInterval: 1000,
    }
  );

  const updateGridData = useCallback((transaction) => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.setRowData(transaction);
    }
  }, []);

  useEffect(() => {
    if (dtTransactions) {
      const filteredData = dtTransactions.filter((transaction) => {
        const transactionsData = Object.values(transaction)
          .join(" ")
          .toLowerCase();
        return transactionsData.includes(searchQuery.toLowerCase());
      });
      updateGridData(filteredData);
    }
  }, [searchQuery, dtTransactions, updateGridData]);

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
              <Box display="flex">
                <Box>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/pks-ManualEntry-TimbangMasuk"
                    style={{
                      width: "10vh",
                      fontSize: "13px",
                      borderRadius: "10%",
                    }}>
                    New
                  </Button>
                </Box>
                <Box sx={{ pl: 1 }}>
                  <Button
                    // disabled={!backDatedForm}
                    color="primary"
                    variant="contained"
                    component={Link}
                    to="/Backdate-Form"
                    style={{
                      width: "10vh",
                      fontSize: "13px",
                      borderRadius: "10%",
                    }}
                  >
                    Form
                  </Button>
                </Box>
                <Box
                  display="flex"
                  borderRadius="5px"
                  ml="auto"
                  border="solid grey 1px">
                  <InputBase
                    sx={{ ml: 2, flex: 2, fontSize: "13px" }}
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />

                  <IconButton
                    type="button"
                    sx={{ p: 1 }}
                    onClick={() => {
                      const filteredData = dtTransactions.filter(
                        (transaction) =>
                          transaction.name
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                      );
                      gridRef.current.api.setRowData(filteredData);
                    }}>
                    <SearchIcon sx={{ mr: "3px", fontSize: "19px" }} />
                  </IconButton>
                </Box>
              </Box>

              <Paper sx={{ p: 2, mt: 1 }}>
                <TransactionGrid gridRef={gridRef} fetcher={fetcher} />
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
