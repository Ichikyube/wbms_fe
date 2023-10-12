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
  const { id } = useParams();
  const { values, setValues } = useForm({
    ...TransactionAPI.InitialData,
  });
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
                  <TBS />
                </>
              )}

              {/* OTHERS */}

              {selectedOption === "Others" && <DataOthers />}

              {/* BERAT DAN TANGGAL */}

              {(selectedOption === "BeratTanggalTbs" ||
                selectedOption === "BeratTanggalOthers") && <BeratTanggal />}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default EditDataTransaksi;
