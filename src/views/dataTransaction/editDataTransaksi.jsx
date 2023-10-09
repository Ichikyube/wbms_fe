import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Grid,
  FormControl,
  Paper,
  Box,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
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
import TBS from "./dataTBS";
import DataOthers from "./dataOthers";
import BeratTanggal from "./beratTanggal";

const EditDataTransaksi = () => {
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
          const productName = dataById.record.productName.toLowerCase();

          if (productName.includes("tbs")) {
            setSelectedOption("Tbs");
          } else {
            setSelectedOption("Others");
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
      destinationSiteId,
      destinationSiteName,
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
      destinationSiteId,
      destinationSiteName,
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
      // values.transportVehicleId &&
      // values.driverId &&
      // values.transporterId &&
      // values.productId &&
      // values.originWeighInTimestamp &&
      // values.originWeighOutTimestamp &&
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
            <FormControl component="fieldset">
              <FormLabel
                component="legend"
                sx={{ fontWeight: "bold", fontSize: "17px" }}
              >
                Edit Transaksi
              </FormLabel>
              <RadioGroup
                aria-label="edit-transaksi"
                name="edit-transaksi"
                value={selectedOption}
                onChange={(event) => {
                  setSelectedOption(event.target.value);
                }}
              >
                {/* TBS */}
                {(selectedOption === "Tbs" ||
                  selectedOption === "BeratTanggalTbs") && (
                  <>
                    <FormControlLabel
                      value="Tbs"
                      control={<Radio />}
                      label="TBS"
                    />
                    <FormControlLabel
                      value="BeratTanggalTbs"
                      control={<Radio />}
                      label="Berat & Tanggal"
                    />
                  </>
                )}

                {/* OTHERS */}
                {(selectedOption === "Others" ||
                  selectedOption === "BeratTanggalOthers") && (
                  <>
                    <FormControlLabel
                      value="Others"
                      control={<Radio />}
                      label="Others "
                    />
                    <FormControlLabel
                      value="BeratTanggalOthers"
                      control={<Radio />}
                      label="Berat & Tanggal"
                    />
                  </>
                )}
              </RadioGroup>
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
              {/* TBS */}

              {selectedOption === "Tbs" && (
                <>
                  <TBS
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

              {/* OTHERS */}

              {selectedOption === "Others" && (
                <DataOthers
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
                  dtSite={dtSite}
                />
              )}

              {/* BERAT DAN TANGGAL */}

              {(selectedOption === "BeratTanggalTbs" ||
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
