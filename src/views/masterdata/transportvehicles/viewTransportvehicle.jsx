import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  TextField,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  FormLabel,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Formik } from "formik";
import { format } from "date-fns";

const ViewTransportvehicle = ({
  isViewOpen,
  onClose,
  dtCompanies,
  dtProduct,
  dtTransportvehicle,
}) => {
  return (
    <Dialog open={isViewOpen} fullWidth maxWidth="md">
      <DialogTitle
        sx={{ color: "white", backgroundColor: "black", fontSize: "27px" }}
      >
        Detail Data Transport Vehicle
        <IconButton
          sx={{
            color: "white",
            position: "absolute",
            right: "10px",
            top: "15px",
          }}
          onClick={() => {
            onClose("", false);
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Formik initialValues={dtTransportvehicle}>
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <DialogContent dividers>
              <Box
                display="grid"
                padding={2}
                paddingBottom={2}
                paddingLeft={3}
                paddingRight={3}
                gap="20px"
                gridTemplateColumns="repeat(8, minmax(0, 1fr))"
              >
                <FormControl sx={{ gridColumn: "span 4" }}>
                  <FormLabel
                    sx={{
                      color: "black",
                      marginBottom: "8px",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Plat No
                  </FormLabel>
                  <TextField
                    fullWidth
                    inputProps={{ readOnly: true }}
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Plat No...."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.plateNo}
                    name="plateNo"
                    error={!!touched.plateNo && !!errors.plateNo}
                    helperText={touched.plateNo && errors.plateNo}
                  />
                </FormControl>
                <FormControl sx={{ gridColumn: "span 4" }}>
                  <FormLabel
                    sx={{
                      color: "black",
                      marginBottom: "8px",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Code Sap
                  </FormLabel>
                  <TextField
                    fullWidth
                    inputProps={{ readOnly: true }}
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Code Sap...."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.codeSap}
                    name="codeSap"
                    error={!!touched.codeSap && !!errors.codeSap}
                    helperText={touched.codeSap && errors.codeSap}
                  />
                </FormControl>
                <FormControl sx={{ gridColumn: "span 4" }}>
                  <FormLabel
                    sx={{
                      color: "black",
                      marginBottom: "8px",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Company
                  </FormLabel>
                  <Select
                    fullWidth
                    inputProps={{ readOnly: true }}
                    name="companyId"
                    value={values.companyId}
                    onBlur={handleBlur}
                    onChange={(event) => {
                      handleChange(event);
                      const selectedCompany = dtCompanies.find(
                        (item) => item.id === event.target.value
                      );
                      setFieldValue(
                        "companyName",
                        selectedCompany ? selectedCompany.name : ""
                      );
                    }}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      -- Pilih Company --
                    </MenuItem>
                    {dtCompanies.map((item) => {
                      return (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <FormControl sx={{ gridColumn: "span 4" }}>
                  <FormLabel
                    sx={{
                      marginBottom: "8px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Company Name
                  </FormLabel>
                  <TextField
                    fullWidth
                    inputProps={{ readOnly: true }}
                    variant="outlined"
                    type="text"
                    placeholder="Masukan Company Name....."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.companyName}
                    name="companyName"
                    error={!!touched.companyName && !!errors.companyName}
                    helperText={touched.companyName && errors.companyName}
                  />
                </FormControl>
                <FormControl sx={{ gridColumn: "span 4" }}>
                  <FormLabel
                    sx={{
                      marginBottom: "8px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Capacity
                  </FormLabel>

                  <TextField
                    variant="outlined"
                    type="number"
                    inputProps={{ readOnly: true }}
                    placeholder="Masukkan Capacity...."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.capacity}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">kg</InputAdornment>
                      ),
                    }}
                    name="capacity"
                    error={!!touched.capacity && !!errors.capacity}
                    helperText={touched.capacity && errors.capacity}
                    id="capacity-input"
                  />
                </FormControl>

                <FormControl sx={{ gridColumn: "span 4" }}>
                  <FormLabel
                    sx={{
                      marginBottom: "8px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    License ED
                  </FormLabel>
                  <TextField
                    fullWidth
                    inputProps={{ readOnly: true }}
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan License ED...."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={
                      values.licenseED
                        ? format(new Date(values.licenseED), "yyyy-MM-dd")
                        : ""
                    }
                    name="licenseED"
                    error={!!touched.licenseED && !!errors.licenseED}
                    helperText={touched.licenseED && errors.licenseED}
                  />
                </FormControl>
                <FormControl sx={{ gridColumn: "span 4" }}>
                  <FormLabel
                    sx={{
                      color: "black",
                      marginBottom: "8px",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Product
                  </FormLabel>
                  <Select
                    fullWidth
                    inputProps={{ readOnly: true }}
                    name="productId"
                    value={values.productId}
                    onBlur={handleBlur}
                    onChange={(event) => {
                      handleChange(event);
                      const selectedproduct = dtProduct.find(
                        (item) => item.id === event.target.value
                      );
                      setFieldValue(
                        "productName",
                        selectedproduct ? selectedproduct.name : ""
                      );
                    }}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      -- Pilih Product --
                    </MenuItem>
                    {dtProduct.map((item) => {
                      return (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <FormControl sx={{ gridColumn: "span 4" }}>
                  <FormLabel
                    sx={{
                      marginBottom: "8px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Product Name
                  </FormLabel>
                  <TextField
                    fullWidth
                    inputProps={{ readOnly: true }}
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Product Name...."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.productName}
                    name="productName"
                    error={!!touched.productName && !!errors.productName}
                    helperText={touched.productName && errors.productName}
                  />
                </FormControl>
                <FormControl sx={{ gridColumn: "span 4" }}>
                  <FormLabel
                    sx={{
                      marginBottom: "8px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Product Code
                  </FormLabel>
                  <TextField
                    fullWidth
                    inputProps={{ readOnly: true }}
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Product Code..."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.productCode}
                    name="productCode"
                    error={!!touched.productCode && !!errors.productCode}
                    helperText={touched.productCode && errors.productCode}
                  />
                </FormControl>
                <FormControl sx={{ gridColumn: "span 4" }}>
                  <FormLabel
                    sx={{
                      marginBottom: "8px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Scc Model
                  </FormLabel>
                  <TextField
                    fullWidth
                    inputProps={{ readOnly: true }}
                    variant="outlined"
                    type="number"
                    placeholder="Masukkan Scc Model...."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.sccModel}
                    name="sccModel"
                    error={!!touched.sccModel && !!errors.sccModel}
                    helperText={touched.sccModel && errors.sccModel}
                  />
                </FormControl>
                <FormControl sx={{ gridColumn: "span 4" }}>
                  <FormLabel
                    sx={{
                      marginBottom: "8px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Brand
                  </FormLabel>
                  <TextField
                    fullWidth
                    inputProps={{ readOnly: true }}
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Brand....."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.brand}
                    name="brand"
                    error={!!touched.brand && !!errors.brand}
                    helperText={touched.brand && errors.brand}
                  />
                </FormControl>
                <FormControl sx={{ gridColumn: "span 4" }}>
                  <FormLabel
                    sx={{
                      marginBottom: "8px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Model
                  </FormLabel>
                  <TextField
                    fullWidth
                    inputProps={{ readOnly: true }}
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Model..."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.model}
                    name="model"
                    error={!!touched.model && !!errors.model}
                    helperText={touched.model && errors.model}
                  />
                </FormControl>
                <FormControl sx={{ gridColumn: "span 4" }}>
                  <FormLabel
                    sx={{
                      marginBottom: "8px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Notes
                  </FormLabel>
                  <TextField
                    fullWidth
                    inputProps={{ readOnly: true }}
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Notes...."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.notes}
                    name="notes"
                    error={!!touched.notes && !!errors.notes}
                    helperText={touched.notes && errors.notes}
                  />
                </FormControl>

                <FormControl sx={{ gridColumn: "span 4" }}>
                  <FormLabel
                    sx={{
                      marginBottom: "8px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Keur ED
                  </FormLabel>
                  <TextField
                    fullWidth
                    inputProps={{ readOnly: true }}
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Keur ED...."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={
                      values.keurED
                        ? format(new Date(values.keurED), "yyyy-MM-dd")
                        : ""
                    }
                    name="keurED"
                    error={!!touched.keurED && !!errors.keurED}
                    helperText={touched.keurED && errors.keurED}
                  />
                </FormControl>
              </Box>
            </DialogContent>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};

export default ViewTransportvehicle;
