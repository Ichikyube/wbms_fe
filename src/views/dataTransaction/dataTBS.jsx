import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  FormControl,
  Typography,
  InputAdornment,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";
import moment from "moment";
import { useForm } from "../../utils/useForm";
import * as TransactionAPI from "../../api/transactionApi";
import * as ProductAPI from "../../api/productsApi";
import * as CompaniesAPI from "../../api/companiesApi";
import * as DriverAPI from "../../api/driverApi";
import * as TransportVehicleAPI from "../../api/transportvehicleApi";
import * as CustomerAPI from "../../api/customerApi";
import FilterDataCompany from "../PksManualEntry/filterDtCompany";
import { useConfig } from "../../common/hooks";
const EditDataTBS = ({}) => {
  const [configs] = useConfig();

  const navigate = useNavigate();
  const { id } = useParams();
  const { values, setValues } = useForm({
    ...TransactionAPI.InitialData,
  });

  const [Transporter, setTransporter] = useState({
    Id: values.transporterId,
    Name: values.transporterCompanyName,
    Code: values.transporterCompanyCode,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataById = await TransactionAPI.getById(id);
        if (dataById) {
          setValues({
            ...dataById.record,
          });

          // Set nilai Transporter dari dataById.record
          setTransporter({
            Id: dataById.record.transporterId,
            Name: dataById.record.transporterCompanyName,
            Code: dataById.record.transporterCompanyCode,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleTransporterChange = (newTransporter) => {
    setTransporter(newTransporter);
  };
  const [originWeightNetto, setOriginWeightNetto] = useState(0);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    values.transporterId = Transporter.Id;
    values.transporterCompanyName = Transporter.Name;
    values.transporterCompanyCode = Transporter.Code;
    values.transportVehicleSccModel = parseFloat(
      values.transportVehicleSccModel
    );
    values.qtyTbs = parseFloat(values.qtyTbs);

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
      values.bonTripNo &&
      values.deliveryOrderNo &&
      values.driverName &&
      values.productName &&
      values.transportVehiclePlateNo &&
      Transporter.Id &&
      Transporter.Name &&
      Transporter.Code
    );
  };

  const handleClose = () => {
    navigate("/data-transaction");
  };
  const [isFilterData, setIsFilterData] = useState(false);
  // const [dtCompany, setDtCompany] = useState([]);
  // const [dtProduct, setDtProduct] = useState([]);
  // const [dtDriver, setDtDriver] = useState([]);
  // const [dtTransportVehicle, setDtTransportVehicle] = useState([]);
  // const [dtCustomer, setDtCustomer] = useState([]);
  // const [dtSite, setDtSite] = useState([]);

  // useEffect(() => {
  //   CompaniesAPI.getAll().then((res) => {
  //     setDtCompany(res.data.company.records);
  //   });

  //   ProductAPI.getAll().then((res) => {
  //     setDtProduct(res.data.product.records);
  //   });
  //   DriverAPI.getAll().then((res) => {
  //     setDtDriver(res.data.driver.records);
  //   });

  //   TransportVehicleAPI.getAll().then((res) => {
  //     setDtTransportVehicle(res.data.transportVehicle.records);
  //   });

  //   CustomerAPI.getAll().then((res) => {
  //     setDtCustomer(res.data.customer.records);
  //   });
  //   SiteAPI.getAll().then((res) => {
  //     setDtSite(res.data.site.records);
  //   });
  // }, []);
  return (
    <>
      <FormControl sx={{ gridColumn: "span 4" }}>
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          // placeholder="Masukkan Jumlah Janjang"
          sx={{
            mb: 2,
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
          value={values?.transportVehiclePlateNo}
          onChange={handleChange}
        />

        <TextField
          variant="outlined"
          size="small"
          type="text"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" sx={{ fontWeight: "bold" }}>
                <SearchIcon sx={{ fontSize: "18px" }} />
              </InputAdornment>
            ),
          }}
          placeholder="Cari cust/vendor..."
          sx={{
            my: 2,
          }}
          label={
            <>
              <Typography
                sx={{
                  bgcolor: "white",
                  px: 1.5,
                }}
              >
                Cust/Vendor transport
              </Typography>
            </>
          }
          // Menentukan nilai yang akan ditampilkan berdasarkan kondisi Transporter.Code
          value={Transporter.Code ? Transporter.Code : Transporter.Name}
          onClick={() => {
            setIsFilterData(true);
          }}
        />

        <TextField
          variant="outlined"
          size="small"
          type="text"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          placeholder="Masukkan Jumlah Janjang"
          sx={{
            my: 2,
          }}
          label={
            <>
              <Typography
                sx={{
                  bgcolor: "white",
                  px: 1.5,
                }}
              >
                Jenis Barang
              </Typography>
            </>
          }
          value={values?.productName}
        />
      </FormControl>
      {isFilterData && (
        <FilterDataCompany
          isFilterData={isFilterData}
          onClose={() => setIsFilterData(false)}
          selectedTransporter={Transporter} // Mengirimkan transporter ke FilterDataCompany
          onTransporterChange={handleTransporterChange} // Fungsi untuk mengubah transporter
        />
      )}
      <FormControl sx={{ gridColumn: "span 4" }}>
        <TextField
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
          value={values?.bonTripNo || ""}
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
      </FormControl>
      <FormControl sx={{ gridColumn: "span 4" }}>
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
        <TextField
          variant="outlined"
          size="small"
          type="text"
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
          value={values?.sptbs}
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          sx={{
            mt: 2,
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
            },
          }}
          InputLabelProps={{
            shrink: true,
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
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleSubmit}
          disabled={!validateForm()}
        >
          Simpan
        </Button>

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

export default EditDataTBS;
