import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, InputAdornment, TextField, Typography } from "@mui/material";
import { w3cwebsocket } from "websocket";
import moment from "moment";
import { useWeighbridge } from "../configs";
import { getEnvInit } from "../configs";
import { setWb } from "../slices/appSlice";

const WeightWB = () => {
  const [weighbridge] = useWeighbridge();

  return (
    <>
      <TextField
        type="number"
        fullWidth
        size="small"
        InputProps={{
          endAdornment: <InputAdornment position="end">kg</InputAdornment>,
        }}
        sx={{
          mb: 3.2,
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
              }}>
              WB WEIGHT
            </Typography>
          </>
        }
        disabled={true}
        value={weighbridge.getWeight()}
      />

      {/* <Button
        variant="contained"
        fullWidth
        sx={{
          mb: 3,
        }}
        disabled={
          isDisabled || !wb.isStable || wb.weight < configs.WBMS_WB_MIN_WEIGHT
            ? true
            : false
        }
        onClick={() => {
          handleSubmit(wb.weight);
        }}
      >
        Get Weight
      </Button> */}
    </>
  );
};

export default WeightWB;
