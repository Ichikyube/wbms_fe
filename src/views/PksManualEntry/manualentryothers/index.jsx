import { useState } from "react";
import {
  Grid,
  TextField,
  FormControl,
  Typography,
  Paper,
  Box,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import OthersKirim from "../../PksManualEntry/manualentryothers/timbangMasuk/othersKirim";
import OthersTerima from "../../PksManualEntry/manualentryothers/timbangMasuk/othersTerima";
import ManualEntryGrid from "../../../components/manualEntryGrid";
import PageHeader from "../../../components/PageHeader";

const tType = 1;

const PksManualOthersTimbangMasuk = () => {
  // console.clear();

  const [selectedOption, setSelectedOption] = useState("OthersTerima");

  return (
    <>
      <PageHeader
        title="Transaksi Others PKS"
        subTitle="Page Description"
        sx={{ mb: 2 }}
        icon={<LocalShippingIcon fontSize="large" />}
      />

      <Grid container spacing={3}>
        <Grid item xs={1.8}>
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
              value={"Timbang Masuk"}
            />
          </Paper>
          <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
            <FormControl>
              <RadioGroup
                aria-label="transaksi-others"
                name="transaksi-others"
                value={selectedOption}
                onChange={(event) => {
                  setSelectedOption(event.target.value);
                }}
              >
                <FormControlLabel
                  value="OthersTerima"
                  control={<Radio />}
                  label="Others Terima"
                />
                <FormControlLabel
                  value="OthersKirim"
                  control={<Radio />}
                  label="Others Kirim"
                />
              </RadioGroup>
            </FormControl>
          </Paper>
        </Grid>
        <Grid item xs={10.2}>
          <Paper elevation={1} sx={{ p: 3, px: 5 }}>
            <Box
              display="grid"
              gap="20px"
              gridTemplateColumns="repeat(15, minmax(0, 1fr))"
            >
              {/* OTHERS TERIMA */}

              {selectedOption === "OthersTerima" && <OthersTerima />}

              {/* OTHERS KIRIM */}

              {selectedOption === "OthersKirim" && <OthersKirim />}
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

export default PksManualOthersTimbangMasuk;
