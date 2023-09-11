import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Grid,
  FormControl,
  Paper,
  Box,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import moment from "moment";
import "react-toastify/dist/ReactToastify.css";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useForm } from "../../utils/useForm";
import * as TransactionAPI from "../../api/transactionApi";
import PageHeader from "../../components/PageHeader";
import * as ProductAPI from "../../api/productsApi";
import * as CompaniesAPI from "../../api/companiesApi";
import * as DriverAPI from "../../api/driverApi";
import * as TransportVehicleAPI from "../../api/transportvehicleApi";
import * as CustomerAPI from "../../api/customerApi";
import { useConfig } from "../../common/hooks";
import * as SiteAPI from "../../api/sitesApi";
import TBSInternal from "./dataTBSInternal";
import TBSEksternal from "./dataTBSEksternal";
import Others from "./dataOthers";
import BeratTanggal from "./beratTanggal";

const EditDataTransaksi = () => {
  const [configs] = useConfig();

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataById = await TransactionAPI.getById(id);
        console.log(dataById);
        if (dataById) {
          setValues({
            ...dataById.record,
          });
          // Set selectedOption berdasarkan productName dari data yang diambil
          const productName = dataById.record.productName;
          if (productName === "TBS Internal") {
            setSelectedOption("TbsInternal");
          } else if (productName === "TBS Eksternal") {
            setSelectedOption("TbsEksternal");
          } else {
            setSelectedOption("Others"); // Default ke "Others" jika productName bukan "TBS Internal" atau "TBS Eksternal"
          }
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
    const {
      id,
      bonTripNo,
      productId,
      productName,
      transporterId,
      transporterCompanyName,
      driverId,
      driverName,
      originSiteId,
      originSiteName,
      transportVehicleId,
      transportVehiclePlateNo,
      customerName,
      customerId,
      originWeighInKg,
      originWeighOutKg,
      originWeighOutTimestamp,
      deliveryOrderNo,
      progressStatus,
      qtyTbsDikirim,
      qtyTbs,
      qtyTbsDikembalikan,
      originWeighInTimestamp,
      transportVehicleSccModel,
    } = values;

    const tempTrans = {
      id,
      bonTripNo,
      productId,
      productName,
      transporterId,
      transporterCompanyName,
      driverId,
      driverName,
      originSiteId,
      originSiteName,
      transportVehicleId,
      transportVehiclePlateNo,
      customerName,
      customerId,
      originWeighInKg: parseFloat(originWeighInKg),
      originWeighOutKg: parseFloat(originWeighOutKg),
      deliveryOrderNo,
      progressStatus,
      qtyTbsDikirim: parseFloat(qtyTbsDikirim),
      qtyTbs: parseFloat(qtyTbs),
      qtyTbsDikembalikan: parseFloat(qtyTbsDikembalikan),
      originWeighInTimestamp: moment(originWeighInTimestamp).toDate(),
      originWeighOutTimestamp: moment(originWeighOutTimestamp).toDate(),
      transportVehicleSccModel,
    };

    try {
      const results = await TransactionAPI.update({ ...tempTrans });

      if (!results?.status) {
        toast.error(`Error: ${results?.message}.`);
        return;
      }

      toast.success(`Edit Data Transaksi Berhasil Di Update.`);
      return handleClose();
    } catch (error) {
      toast.error(`Error: ${error.message}.`);
    }
    setValues({ ...tempTrans });
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
        values.potonganWajib -
        values.potonganLain;
      setOriginWeightNetto(total);
    }
  }, [values]);

  const validateForm = () => {
    return (
      values.bonTripNo &&
      values.deliveryOrderNo &&
      values.transportVehicleId &&
      values.driverId &&
      values.transporterId &&
      values.productId &&
      values.customerId &&
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
  const [dtCompany, setDtCompany] = useState([]);
  const [dtProduct, setDtProduct] = useState([]);
  const [dtDriver, setDtDriver] = useState([]);
  const [dtTransportVehicle, setDtTransportVehicle] = useState([]);
  const [dtCustomer, setDtCustomer] = useState([]);
  const [dtSite, setDtSite] = useState([]);

  useEffect(() => {
    CompaniesAPI.getAll().then((res) => {
      setDtCompany(res.data.company.records);
    });

    ProductAPI.getAll().then((res) => {
      setDtProduct(res.data.product.records);
    });
    DriverAPI.getAll().then((res) => {
      setDtDriver(res.data.driver.records);
    });

    TransportVehicleAPI.getAll().then((res) => {
      setDtTransportVehicle(res.data.transportVehicle.records);
    });

    CustomerAPI.getAll().then((res) => {
      setDtCustomer(res.data.customer.records);
    });
    SiteAPI.getAll().then((res) => {
      setDtSite(res.data.site.records);
    });
  }, []);

  const [selectedOption, setSelectedOption] = useState("");

  return (
    <>
      <PageHeader
        title="Edit Transaksi PKS"
        subTitle="Page Description"
        sx={{ mb: 2 }}
        icon={<LocalShippingIcon fontSize="large" />}
      />

      <Grid container spacing={3}>
        <Grid item xs={1.7}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel
                id="select-label"
                sx={{
                  bgcolor: "white",
                  px: 2,
                }}
              >
                Edit Transaksi
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                size="large"
                value={selectedOption}
                onChange={(event) => {
                  setSelectedOption(event.target.value);
                }}
              >
                {/* TBS INTERNAL */}

                {(selectedOption === "TbsInternal" ||
                  selectedOption === "BeratTanggalTbsInternal") && (
                  <MenuItem value="TbsInternal">TBS Internal</MenuItem>
                )}
                {(selectedOption === "BeratTanggalTbsInternal" ||
                  selectedOption === "TbsInternal") && (
                  <MenuItem value="BeratTanggalTbsInternal">
                    Berat & Tanggal
                  </MenuItem>
                )}

                {/* TBS EKSTERNAL */}

                {(selectedOption === "TbsEksternal" ||
                  selectedOption === "BeratTanggalTbsEksternal") && (
                  <MenuItem value="TbsEksternal">TBS Eksternal</MenuItem>
                )}
                {(selectedOption === "BeratTanggalTbsEksternal" ||
                  selectedOption === "TbsEksternal") && (
                  <MenuItem value="BeratTanggalTbsEksternal">
                    Berat & Tanggal
                  </MenuItem>
                )}

                {/* OTHERS */}

                {(selectedOption === "Others" ||
                  selectedOption === "BeratTanggalOthers") && (
                  <MenuItem value="Others">Others</MenuItem>
                )}
                {(selectedOption === "BeratTanggalOthers" ||
                  selectedOption === "Others") && (
                  <MenuItem value="BeratTanggalOthers">
                    Berat & Tanggal
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </Paper>
        </Grid>
        <Grid item xs={10.3}>
          <Paper elevation={1} sx={{ p: 3, px: 5 }}>
            <Box
              display="grid"
              gap="20px"
              gridTemplateColumns="repeat(15, minmax(0, 1fr))"
            >
              {/* TBS INTERNAL */}

              {selectedOption === "TbsInternal" && (
                <>
                  <TBSInternal
                    values={values}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    setValues={setValues}
                    handleClose={handleClose}
                    dtCompany={dtCompany}
                    dtTransportVehicle={dtTransportVehicle}
                    validateForm={validateForm}
                    dtProduct={dtProduct}
                    dtSite={dtSite}
                    dtCustomer={dtCustomer}
                    dtDriver={dtDriver}
                  />
                </>
              )}

              {/* TBS EKSTERNAL */}

              {selectedOption === "TbsEksternal" && (
                <TBSEksternal
                  values={values}
                  handleChange={handleChange}
                  handleSubmit={handleSubmit}
                  setValues={setValues}
                  handleClose={handleClose}
                  dtCompany={dtCompany}
                  dtTransportVehicle={dtTransportVehicle}
                  validateForm={validateForm}
                  dtProduct={dtProduct}
                  dtSite={dtSite}
                  dtCustomer={dtCustomer}
                  dtDriver={dtDriver}
                />
              )}

              {/* OTHERS */}

              {selectedOption === "Others" && (
                <Others
                  values={values}
                  handleChange={handleChange}
                  handleSubmit={handleSubmit}
                  setValues={setValues}
                  handleClose={handleClose}
                  dtCompany={dtCompany}
                  dtTransportVehicle={dtTransportVehicle}
                  validateForm={validateForm}
                  dtProduct={dtProduct}
                  dtCustomer={dtCustomer}
                  dtDriver={dtDriver}
                />
              )}

              {/* BERAT DAN TANGGAL */}

              {(selectedOption === "BeratTanggalTbsInternal" ||
                selectedOption === "BeratTanggalTbsEksternal" ||
                selectedOption === "BeratTanggalOthers") && (
                <BeratTanggal
                  values={values}
                  handleChange={handleChange}
                  handleSubmit={handleSubmit}
                  handleClose={handleClose}
                  originWeightNetto={originWeightNetto}
                  validateForm={validateForm}
                />
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default EditDataTransaksi;
