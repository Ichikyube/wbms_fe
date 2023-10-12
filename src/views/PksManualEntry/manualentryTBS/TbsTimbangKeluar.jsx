import { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import {
  Button,
  Grid,
  InputAdornment,
  TextField,
  FormControl,
  Typography,
  Checkbox,
  Box,
  Autocomplete,
  InputLabel,
} from "@mui/material";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "../../../utils/useForm";
import WeightWB from "../../../components/weightWB";
import * as SiteAPI from "../../../api/sitesApi";
import BonTripTBS from "../../../components/BonTripTBS";
import * as TransactionAPI from "../../../api/transactionApi";
import * as ProductAPI from "../../../api/productsApi";
import * as CompaniesAPI from "../../../api/companiesApi";
import * as DriverAPI from "../../../api/driverApi";
import * as TransportVehicleAPI from "../../../api/transportvehicleApi";
import * as CustomerAPI from "../../../api/customerApi";

import { useWeighbridge, useConfig } from "../../../common/hooks";
import { IosShareRounded } from "@mui/icons-material";

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
  const [socket, setSocket] = useState();
  const [qtyTbs, setQtyTbs] = useState();

  const [results, setResults] = useState([]);

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
  const { trxGradingPencentage, trxTypeCodes } = Object.assign({}, ...JSON.parse(localStorage.getItem("tempConfigs")));
  const {company, millPlant, millStoLoc, transitStoLoc} = JSON.parse(trxTypeCodes);
  const navigate = useNavigate();
  const { id } = useParams();
  const { values, setValues } = useForm(initialValues);
  const gradingPercentage = JSON.parse(trxGradingPencentage);
  let trxGradingWAJIB;
  const {
    trxGradingAIRPERSEN,
    trxGradingTPPERSEN,
    trxGradingTKPERSEN,
    trxGradingSAMPAHPERSEN,
    trxGradingBLMPERSEN,
    trxGradingBMPERSEN,
    trxGradingPartenoPERSEN,
    trxGradingBrondolanPERSEN,
  } = gradingPercentage;
  const [potBMKG, setPotBMKG] = useState();
  const [potBLMKG, setPotBLMKG] = useState();
  const [potTPKG, setPotTPKG] = useState();
  const [potTKKG, setPotTKKG] = useState();
  const [potSMPHKG, setPotSMPHKG] = useState();
  const [potAirKG, setPotAirKG] = useState();
  const [potPartenoKG, setPotPartenoKG] = useState();
  const [potBrondolanKG, setPotBrondolanKG] = useState();
  const [potWajibKG, setPotWajibKG] = useState();
  const [potLainnyaKG, setPotLainnyaKG] = useState();
  const [potTotalKG, setPotTotalKG] = useState();
  const [originWeightNetto, setOriginWeightNetto] = useState(8000);
  const [canSubmit, setCanSubmit] = useState(false);
  const trxGradingWajibPERSEN = selectedCompany?.persenPotngWajib || 0;

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
  //       values.potonganWajib -
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

    const socket = io("http://localhost:6001");
    setSocket(socket);
    socket.on("connect", () => console.log("Connected"));
    socket.on("result", (values) => {
      setResults(values);
      console.log(values);
    });
    socket.on("connect_error", (error) => {
      console.error("Connection Error:", error.message); // Handle the error here
    });
    return () => {
      socket.disconnect(); // Clean up on component unmount
    };
  }, []);
  useEffect(() => {
    if (results) {
      setPotBMKG(results.calculatedBM);
      setPotBLMKG(results.calculatedBLM);
      setPotTPKG(results.calculatedTP);
      setPotTKKG(results.calculatedTK);
      setPotSMPHKG(results.calculatedTrash);
      setPotAirKG(results.calculatedWater);
      setPotPartenoKG(results.calculatedParteno);
      setPotBrondolanKG(results.calculatedBrondolan);
      setPotWajibKG(results.calculatedObligatory);
      // setPotLainnyaKG()
      // setPotTotalKG()
    }
  }, [results]);

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

  useEffect(() => {
    socket?.emit("hitungPotongan", {
      millCode:millPlant,
      qtyTbs,
      weightnetto: originWeightNetto,
      trxGradingAIRPERSEN,
      trxGradingTPPERSEN,
      trxGradingTKPERSEN,
      trxGradingSAMPAHPERSEN,
      trxGradingBLMPERSEN,
      trxGradingBMPERSEN,
      trxGradingPartenoPERSEN,
      trxGradingBrondolanPERSEN,
      trxGradingWajibPERSEN,
    });
  }, [
    millPlant,
    qtyTbs,
    originWeightNetto,
    trxGradingAIRPERSEN,
    trxGradingTPPERSEN,
    trxGradingTKPERSEN,
    trxGradingSAMPAHPERSEN,
    trxGradingBLMPERSEN,
    trxGradingBMPERSEN,
    trxGradingPartenoPERSEN,
    trxGradingBrondolanPERSEN,
  ]);

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

      <FormControl sx={{ gridColumn: "span 4" }}>
        <Box
          display="grid"
          gridTemplateColumns="4fr 2fr"
          gap={2}
          alignItems="center">
          <FormControl
            sx={{
              flexDirection: "row",
            }}>
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
                readOnly: true,
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
                  }}>
                  Buah Mentah
                </Typography>
              }
              value={trxGradingBMPERSEN}
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
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end" sx={{ fontWeight: "bold" }}>
                  kg
                </InputAdornment>
              ),
            }}
            value={potBMKG}
          />
          <FormControl
            sx={{
              flexDirection: "row",
            }}>
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
                readOnly: true,
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
                  }}>
                  Buah Lewat Matang
                </Typography>
              }
              value={trxGradingBLMPERSEN}
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
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end" sx={{ fontWeight: "bold" }}>
                  kg
                </InputAdornment>
              ),
            }}
            value={potBLMKG}
          />
          <FormControl
            sx={{
              flexDirection: "row",
            }}>
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
                readOnly: true,
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
                  }}>
                  Tangkai Panjang
                </Typography>
              }
              value={trxGradingTPPERSEN}
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
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end" sx={{ fontWeight: "bold" }}>
                  kg
                </InputAdornment>
              ),
            }}
            value={potTPKG}
          />
          <FormControl
            sx={{
              flexDirection: "row",
            }}>
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
                readOnly: true,
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
                  }}>
                  Tangkai Kosong
                </Typography>
              }
              value={trxGradingTKPERSEN}
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
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end" sx={{ fontWeight: "bold" }}>
                  kg
                </InputAdornment>
              ),
            }}
            value={potTKKG}
          />
          <FormControl
            sx={{
              flexDirection: "row",
            }}>
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
                readOnly: true,
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
                  }}>
                  Sampah
                </Typography>
              }
              value={trxGradingSAMPAHPERSEN}
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
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end" sx={{ fontWeight: "bold" }}>
                  kg
                </InputAdornment>
              ),
            }}
            value={potSMPHKG}
          />
          <FormControl
            sx={{
              flexDirection: "row",
            }}>
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
                readOnly: true,
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
                  }}>
                  Air
                </Typography>
              }
              value={trxGradingAIRPERSEN}
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
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end" sx={{ fontWeight: "bold" }}>
                  kg
                </InputAdornment>
              ),
            }}
            value={potAirKG}
          />
          <FormControl
            sx={{
              flexDirection: "row",
            }}>
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
                readOnly: true,
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
                  }}>
                  Parteno
                </Typography>
              }
              value={trxGradingPartenoPERSEN}
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
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end" sx={{ fontWeight: "bold" }}>
                  kg
                </InputAdornment>
              ),
            }}
            value={potPartenoKG}
          />
          <FormControl
            sx={{
              flexDirection: "row",
            }}>
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
                readOnly: true,
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
                  }}>
                  Brondolan
                </Typography>
              }
              value={trxGradingBrondolanPERSEN}
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
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end" sx={{ fontWeight: "bold" }}>
                  kg
                </InputAdornment>
              ),
            }}
            value={potBrondolanKG}
          />
          <FormControl
            sx={{
              flexDirection: "row",
            }}>
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
                readOnly: true,
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
                  }}>
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
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end" sx={{ fontWeight: "bold" }}>
                  kg
                </InputAdornment>
              ),
            }}
            value={potWajibKG}
          />
          <FormControl
            sx={{
              flexDirection: "row",
            }}>
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
                readOnly: true,
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
                  }}>
                  Pot. Lainnya
                </Typography>
              }
              // value={trxGradingLAINNYAPERSEN}
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
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end" sx={{ fontWeight: "bold" }}>
                  kg
                </InputAdornment>
              ),
            }}
            value={potLainnyaKG}
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
              }}>
              TOTAL Potongan
            </Typography>
          }
          value={potTotalKG}
        />
      </FormControl>
      <FormControl sx={{ gridColumn: "span 4" }}>
        <WeightWB />

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
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
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
          value={values.originWeighInKg}
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
              }}>
              Weight OUT
            </Typography>
          }
          name="originWeighOutKg"
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
            readOnly: true,
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
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
            readOnly: true,
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
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
            readOnly: true,
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
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
            !validateForm() || values?.progressStatus === 4
            //   !weighbridge.isStable() ||
            //   weighbridge.getWeight() < configs.ENV.WBMS_WB_MIN_WEIGHT
            //     ? true
            //     : false
          }
        >
          Simpan
        </Button>
        <BonTripTBS
          dtTrans={{ ...values }}
          isDisable={values.progressStatus !== 4}
        />
        <Button
          variant="contained"
          sx={{ my: 1 }}
          fullWidth
          onClick={handleClose}>
          Tutup
        </Button>
      </FormControl>
    </>
  );
};

export default PksManualTBSTimbangKeluar;
