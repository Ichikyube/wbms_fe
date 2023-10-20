import { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Grid,
  InputAdornment,
  TextField,
  FormControl,
  Typography,
  Checkbox,
  Box,
} from "@mui/material";
import { io } from "socket.io-client";
import BonTripTBS from "./BonTripTBS";
import WeightWB from "./weightWB";

const GradingCalculator = ({
  handleSubmit,
  handleClose,
  validateForm,
  qtyTbs,
  selectedCompany,
  weighbridge,
  values,
}) => {
  const [socket, setSocket] = useState();

  const [results, setResults] = useState([]);
  const { trxGradingPencentage, trxTypeCodes } = useSelector(
    (app) => app.tempConfigs
  );
  console.log(trxGradingPencentage);
  const gradingPercentage = JSON.parse(trxGradingPencentage);
  const { company, millPlant, millStoLoc, transitStoLoc } =
    JSON.parse(trxTypeCodes);
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

  const trxGradingWajibPERSEN = selectedCompany?.persenPotngWajib || 0;

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
    socket?.emit("hitungPotongan", {
      millCode: millPlant,
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
          name="persenPotngWajib"
          value={values.persenPotngWajib || 0}
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
          }>
          Simpan
        </Button>
        <BonTripTBS
          dtTrans={{ ...values }}
          // isDisable={values.progressStatus !== 4}
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

GradingCalculator.propTypes = {};

export default GradingCalculator;
