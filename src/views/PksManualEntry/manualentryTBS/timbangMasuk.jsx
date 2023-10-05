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

const PksManualTBSinternalTimbangMasuk = ({
  ProductId,
  ProductName,
  TransporterId,
  TransporterCompanyName,
  PlateNo,
}) => {
  const [weighbridge] = useWeighbridge();
  const [configs] = useConfig();
  const dispatch = useDispatch();
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

  const initialValues = {
    bonTripNo: "",
    driverName: "",
    transporterId: "",
    transporterCompanyName: "",
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
    qtyTbs: "",
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
    let tempTrans = { ...values };

    tempTrans.progressStatus = 1;
    tempTrans.typeTransaction = 1;
    tempTrans.typeSite = 1;
    tempTrans.originWeighInTimestamp = moment().toDate();
    tempTrans.productId = ProductId;
    tempTrans.productName = ProductName;
    tempTrans.transporterId = TransporterId;
    tempTrans.transporterCompanyName = TransporterCompanyName;
    tempTrans.transportVehiclePlateNo = PlateNo;
    tempTrans.originWeighInKg = weighbridge.getWeight();

    try {
      // Tambahkan logika untuk menentukan apakah membuat atau mengambil transaksi
      if (tempTrans.progressStatus === 1) {
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
      values.driverName &&
      ProductId &&
      ProductName &&
      TransporterId &&
      TransporterCompanyName &&
      PlateNo
    );
  };

  const handleClose = () => {
    // setProgressStatus("-");
    // setWbPksTransaction(null);

    navigate("/pks-transaction");
  };

  // BUAH MENTAH

  const [persenBM, setPersenBM] = useState(0);

  const handlePersenBM = (event) => {
    const value = event.target.value;
    // Memastikan nilai yang dimasukkan adalah angka
    if (!isNaN(value)) {
      setPersenBM(value);
    }
  };

  const BMkg = () => {
    let result;
    const persenbm = persenBM / values.qtyTbs;
    // result = Math.round((persenbm * 2500)/100);
    result = Math.round(((25 / 100) * (persenbm - 5) * values.qtyTbs) / 100);

    return result;
  };

  // BUAH LEWAT MATANG

  const [persenBLM, setPersenBLM] = useState(0);

  const handlePersenBLM = (event) => {
    const value = event.target.value;
    if (!isNaN(value)) {
      setPersenBLM(value);
    }
  };

  const BLMkg = () => {
    let parsenBLM = persenBLM / values.qtyTbs;
    let result;
    parsenBLM *= 100;
    if (parsenBLM >= 5) {
      result = Math.round(((25 / 100) * (parsenBLM - 5) * values.qtyTbs) / 100);
    } else {
      return "Nilai persenBLM kurang dari 5"; // Handle jika persenBLM kurang dari 5
    }
    console.log(result);
    return result;
  };

  // TANGKAI PANJANG

  const [persenTP, setPersenTP] = useState(0);

  const handlePersenTP = (event) => {
    const value = event.target.value;
    if (!isNaN(value)) {
      setPersenTP(value);
    }
  };

  const TPkg = () => {
    const result = (persenTP * values.qtyTbs) / 100;
    return result;
  };

  // AIR

  const [persenAir, setPersenAir] = useState(0);

  const handlePersenAir = (event) => {
    const value = event.target.value;
    if (!isNaN(value)) {
      setPersenAir(value);
    }
  };

  const Airkg = () => {
    const result = (persenAir * values.qtyTbs) / 100;
    return result;
  };

  // SAMPAH

  const [persenSMPH, setPersenSMPH] = useState(0);

  const handlePersenSMPH = (event) => {
    const value = event.target.value;
    if (!isNaN(value)) {
      setPersenSMPH(value);
    }
  };

  const SMPHkg = () => {
    const result = (persenSMPH * values.qtyTbs) / 100;
    return result;
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
        {/* <FormControl variant="outlined" size="small" sx={{ my: 2 }}>
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
        </FormControl> */}
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
          value={values?.qtyTbs}
          onChange={handleChange}
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
          placeholder="Masukkan SPTBS"
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
          value={values?.transportVehicleSccModel}
          onChange={handleChange}
        />
      </FormControl>

      <FormControl sx={{ gridColumn: "span 4" }}>
        <Box
          display="grid"
          gridTemplateColumns="4fr 3fr"
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
              value={persenBM}
              onChange={handlePersenBM}
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
            value={BMkg()}
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
              value={persenBLM}
              onChange={handlePersenBLM}
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
            value={BLMkg()}
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
              value={persenTP}
              onChange={handlePersenTP}
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
            value={TPkg()}
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
              value={persenSMPH}
              onChange={handlePersenSMPH}
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
            value={SMPHkg()}
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
              value={persenAir}
              onChange={handlePersenAir}
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
            value={Airkg()}
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
