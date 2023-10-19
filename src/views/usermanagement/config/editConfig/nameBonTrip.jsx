import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  FormControl,
  FormLabel,
  Grid,
  Container,
} from "@mui/material";

export const NameBonTrip = ({dtConfig, setFieldValue, values}) => {
  const [formData, setFormData] = useState(JSON.parse(dtConfig.defaultVal));
  useEffect(() => {
    setFieldValue("defaultVal", formData);
  }, [formData, setFieldValue]);
  const handleChange = (fieldName) => async (event) => {
    const input = event.target.value;
    console.log(values.defaultVal);
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: input,
    }));
  };

  return (
    <Box display="grid" paddingTop={2} paddingBottom={2} gap="20px">
      <Grid
        container
        alignItems={"baseline"}
        justifyContent={"space-between"}
        spacing={2}>
        <Grid item xs={6} sm={4}>
          <FormLabel
            sx={{
              marginBottom: "8px",
              color: "black",
              fontSize: "16px",
              fontWeight: "bold",
            }}>
            nama PGS
          </FormLabel>
          <TextField
            // label="Company"
            variant="outlined"
            name="namePGS"
            value={formData.namePGS}
            onChange={handleChange("namePGS")}
          />
        </Grid>
        <Grid item xs={6} sm={4}>
          <FormLabel
            sx={{
              marginBottom: "8px",
              color: "black",
              fontSize: "16px",
              fontWeight: "bold",
            }}>
            nama MillHead
          </FormLabel>
          <TextField
            // label="Mill Plant"
            variant="outlined"
            name="nameMillHead"
            value={formData.nameMillHead}
            onChange={handleChange("nameMillHead")}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
