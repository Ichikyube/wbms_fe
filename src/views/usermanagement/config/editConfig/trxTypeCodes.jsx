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

const TrxTypeCodes = ({ dtConfig, setFieldValue, values }) => {
  const [formData, setFormData] = useState(JSON.parse(dtConfig.defaultVal));
  useEffect(() => {
    setFieldValue("defaultVal", formData);
  }, [formData])
  const handleChange = (fieldName) => async (event) => {
    const input = event.target.value;
    console.log(values.defaultVal);

    
    setFormData(prevFormData => ({
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
        <Grid item xs={4} sm={2}>
          <FormLabel
            sx={{
              marginBottom: "8px",
              color: "black",
              fontSize: "16px",
              fontWeight: "bold",
            }}>
            Company Code
          </FormLabel>
          <TextField
            // label="Company"
            variant="outlined"
            name="company"
            inputProps={{ maxLength: 4 }}
            value={formData.company}
            onChange={handleChange("company")}
          />
        </Grid>
        <Grid item xs={4} sm={2}>
          <FormLabel
            sx={{
              marginBottom: "8px",
              color: "black",
              fontSize: "16px",
              fontWeight: "bold",
            }}>
            Mill Plant Code
          </FormLabel>
          <TextField
            // label="Mill Plant"
            variant="outlined"
            name="millPlant"
            inputProps={{ maxLength: 4 }}
            value={formData.millPlant}
            onChange={handleChange("millPlant")}
          />
        </Grid>
        <Grid item xs={4} sm={2}>
          <FormLabel
            sx={{
              marginBottom: "8px",
              color: "black",
              fontSize: "16px",
              fontWeight: "bold",
            }}>
            Mill Storage Location Code
          </FormLabel>
          <TextField
            // label="Mill Storage Location"
            variant="outlined"
            name="millStoLoc"
            inputProps={{ maxLength: 4 }}
            value={formData.millStoLoc}
            onChange={handleChange("millStoLoc")}
          />
        </Grid>
        <Grid item xs={4} sm={2}>
          <FormLabel
            sx={{
              marginBottom: "8px",
              color: "black",
              fontSize: "16px",
              fontWeight: "bold",
            }}>
            Transit Storage Location Code
          </FormLabel>
          <TextField
            // label="Transit Storage Location"
            variant="outlined"
            name="transitStoLoc"
            inputProps={{ maxLength: 4 }}
            value={formData.transitStoLoc}
            onChange={handleChange("transitStoLoc")}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default TrxTypeCodes;
