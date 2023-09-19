import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Grid, Typography, Paper, Box, TextField } from "@mui/material";
import { toast } from "react-toastify";
import moment from "moment";
import "react-toastify/dist/ReactToastify.css";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useForm } from "../../utils/useForm";
import * as TransactionAPI from "../../api/transactionApi";
import PageHeader from "../../components/PageHeader";
import ManualEntryGrid from "../../components/manualEntryGrid";
import * as ProductAPI from "../../api/productsApi";
import * as CompaniesAPI from "../../api/companiesApi";
import * as DriverAPI from "../../api/driverApi";
import * as TransportVehicleAPI from "../../api/transportvehicleApi";
import * as CustomerAPI from "../../api/customerApi";
import { useConfig } from "../../common/hooks";
import * as SiteAPI from "../../api/sitesApi";
import TimbangKeluarTBSInternal from "../PksManualEntry/manualentryTBSInternal/timbangKeluar";
import TimbangKeluarTBSEksternal from "../PksManualEntry/manualentryTBSEksternal/timbangKeluar";
import TimbangKeluarOthers from "../PksManualEntry/manualentryothers/timbangKeluar";
import BeratTanggal from "../dataTransaction/beratTanggal";

const tType = 1;

const TimbangKeluar = () => {
  const [configs] = useConfig();
  const { id } = useParams();
  const { values, setValues } = useForm({
    ...TransactionAPI.InitialData,
  });

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

  const [selectedOption, setSelectedOption] = useState("");

  return (
    <>
      <PageHeader
        title="Transaksi PKS"
        subTitle="Page Description"
        sx={{ mb: 2 }}
        icon={<LocalShippingIcon fontSize="large" />}
      />

      <Grid container spacing={3}>
        <Grid item xs={1.7}>
          <Paper elevation={2} sx={{ p: 2 }}>
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
              value={"Timbang Keluar"}
            />
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
                  <TimbangKeluarTBSInternal />
                </>
              )}

              {/* TBS EKSTERNAL */}

              {selectedOption === "TbsEksternal" && (
                <TimbangKeluarTBSEksternal />
              )}

              {/* OTHERS */}

              {selectedOption === "Others" && <TimbangKeluarOthers />}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mt: 1 }}>
            <ManualEntryGrid tType={tType} />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default TimbangKeluar;
