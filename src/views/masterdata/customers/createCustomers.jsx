import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  TextField,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  FormLabel,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { Formik } from "formik";
import * as yup from "yup";
import { grey } from "@mui/material/colors";

import * as CustomersAPI from "../../../api/customerApi";
// import * as ProvinceAPI from "../../../api/provinceApi";

const CreateCities = ({
  isOpen,
  onClose,
  dtCities,
  dtCustomergroups,
  dtCustomertypes,
}) => {
  const handleSubmit = (values, { setSubmitting }) => {
    CustomersAPI.create(values)
      .then((res) => {
        console.log("Data Berhasil Disimpan:", res.data);
        toast.success("Data Berhasil Disimpan"); // Display success toast
        // Perform any additional actions or update state as needed
        onClose();
      })
      .catch((error) => {
        console.error("Error creating item:", error);
        toast.error("Error creating item"); // Display error toast
        // Perform error handling or display error messages
      });
    onClose("", false);
  };

  const checkoutSchema = yup.object().shape({
    code: yup.string().required("required"),
    codeSap: yup.string().required("required"),
    name: yup.string().required("required"),
    shortName: yup.string().required("required"),
    cityId: yup.string().required("required"),
    customerGroupId: yup.string().required("required"),
    customerTypeId: yup.string().required("required"),
    address: yup.string().required("Address is required"),
    addressExt: yup.string().required("Address Ext  required"),
    postalCode: yup.string().required("Postal Code is required"),
    phone: yup.string().required("Phone Number is required"),
    url: yup.string().required("required"),
    contactEmail: yup
      .string()
      .email("Enter a valid email")
      .required("Email is required"),
    contactName: yup.string().required("required"),
    contactPhone: yup.string().required("required"),
    sortasi: yup.number().required("required"),
  });
  const initialValues = {
    code: "",
    name: "",
    shortName: "",
    codeSap: "",
    cityId: "",
    customerGroupId: "",
    customerTypeId: "",
    address: "",
    addressExt: "",
    postalCode: "",
    phone: "",
    url: "",
    contactEmail: "",
    contactName: "",
    contactPhone: "",
    sortasi: "",
  };
  return (
    <Dialog open={isOpen} fullWidth maxWidth="md">
      <DialogTitle
        sx={{ color: "white", backgroundColor: "black", fontSize: "27px" }}
      >
        Tambah Data Customer
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

      <Formik
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
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
                    Code
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Code...."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.code}
                    name="code"
                    error={!!touched.code && !!errors.code}
                    helperText={touched.code && errors.code}
                    sx={{
                      gridColumn: "span 4",
                      "& label": { typography: { fontSize: "14px" } },
                    }}
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
                    SAP Code
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan SAP Code...."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.codeSap}
                    name="codeSap"
                    error={!!touched.codeSap && !!errors.codeSap}
                    helperText={touched.codeSap && errors.codeSap}
                    sx={{
                      gridColumn: "span 4",
                      "& label": { typography: { fontSize: "14px" } },
                    }}
                  />
                </FormControl>
                <FormControl sx={{ gridColumn: "span 5" }}>
                  <FormLabel
                    sx={{
                      marginBottom: "8px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Full Name
                  </FormLabel>
                  <TextField
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Full Name...."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    name="name"
                    error={!!touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                    id="name-input"
                  />
                </FormControl>
                <FormControl sx={{ gridColumn: "span 3" }}>
                  <FormLabel
                    sx={{
                      marginBottom: "8px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Short Name
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Masukkan Short Name...."
                    type="text"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.shortName}
                    name="shortName"
                    error={!!touched.shortName && !!errors.shortName}
                    helperText={touched.shortName && errors.shortName}
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
                    Customer Type
                  </FormLabel>
                  <Select
                    fullWidth
                    name="customerTypeId"
                    value={values.customerTypeId}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    displayEmpty
                    sx={{
                      color: MenuItem ? "gray" : "black",
                    }}
                  >
                    <MenuItem value="" disabled>
                      -- Pilih Customer Type --
                    </MenuItem>
                    {dtCustomertypes.map((item) => {
                      return <MenuItem value={item.id}>{item.name}</MenuItem>;
                    })}
                  </Select>
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
                    Customer Group
                  </FormLabel>
                  <Select
                    fullWidth
                    name="customerGroupId"
                    value={values.customerGroupId}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    displayEmpty
                    sx={{
                      color: MenuItem ? "gray" : "black",
                    }}
                  >
                    <MenuItem value="" disabled>
                      -- Pilih Customer Group --
                    </MenuItem>
                    {dtCustomergroups.map((item) => {
                      return <MenuItem value={item.id}>{item.name}</MenuItem>;
                    })}
                  </Select>
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
                    City
                  </FormLabel>
                  <Select
                    labelId="cities"
                    fullWidth
                    name="cityId"
                    value={values.cityId}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    displayEmpty
                    sx={{
                      color: MenuItem ? "gray" : "black",
                    }}
                  >
                    <MenuItem value="" disabled>
                      -- Pilih City --
                    </MenuItem>
                    {dtCities.map((item) => {
                      return <MenuItem value={item.id}>{item.name}</MenuItem>;
                    })}
                  </Select>
                </FormControl>{" "}
                <FormControl sx={{ gridColumn: "span 4" }}>
                  <FormLabel
                    sx={{
                      marginBottom: "8px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Url
                  </FormLabel>
                  <TextField
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Url...."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.url}
                    name="url"
                    error={!!touched.url && !!errors.url}
                    helperText={touched.url && errors.url}
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
                    Email
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="email"
                    placeholder="Masukkan Email..."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.contactEmail}
                    name="contactEmail"
                    error={!!touched.contactEmail && !!errors.contactEmail}
                    helperText={touched.contactEmail && errors.contactEmail}
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
                    Phone Number
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Phone Number...."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.phone}
                    name="phone"
                    error={!!touched.phone && !!errors.phone}
                    helperText={touched.phone && errors.phone}
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
                    Contact Name
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Contact Name..."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.contactName}
                    name="contactName"
                    error={!!touched.contactName && !!errors.contactName}
                    helperText={touched.contactName && errors.contactName}
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
                    Contact Phone
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Contact Phone.."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.contactPhone}
                    name="contactPhone"
                    error={!!touched.contactPhone && !!errors.contactPhone}
                    helperText={touched.contactPhone && errors.contactPhone}
                  />
                </FormControl>{" "}
                <FormControl sx={{ gridColumn: "span 4", gap: "28px" }}>
                  <FormControl>
                    <FormLabel
                      sx={{
                        marginBottom: "8px",
                        color: "black",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      Address
                    </FormLabel>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="text"
                      placeholder="Masukkan Alamat...."
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.address}
                      name="address"
                      error={!!touched.address && !!errors.address}
                      helperText={touched.address && errors.address}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel
                      sx={{
                        marginBottom: "8px",
                        color: "black",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      Postal Code
                    </FormLabel>
                    <TextField
                      variant="outlined"
                      type="text"
                      placeholder="Masukkan Kode Pos...."
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.postalCode}
                      name="postalCode"
                      error={!!touched.postalCode && !!errors.postalCode}
                      helperText={touched.postalCode && errors.postalCode}
                      sx={{
                        gridColumn: "span 4",
                        "& label": { typography: { fontSize: "14px" } },
                      }}
                    />
                  </FormControl>
                </FormControl>{" "}
                <FormControl sx={{ gridColumn: "span 4" }}>
                  <FormLabel
                    sx={{
                      marginBottom: "8px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Address Ext
                  </FormLabel>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    variant="outlined"
                    placeholder="Masukkan alamat lengkap..."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.addressExt}
                    name="addressExt"
                    error={!!touched.addressExt && !!errors.addressExt}
                    helperText={touched.addressExt && errors.addressExt}
                  />
                </FormControl>
                <FormControl sx={{ gridColumn: "span 8" }}>
                  <FormLabel
                    sx={{
                      marginBottom: "8px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Sortasi
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="number"
                    placeholder="Masukkan Sortasi...."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.sortasi}
                    name="sortasi"
                    error={!!touched.sortasi && !!errors.sortasi}
                    helperText={touched.sortasi && errors.sortasi}
                    sx={{
                      gridColumn: "span 2",
                      "& label": { typography: { fontSize: "14px" } },
                    }}
                  />
                </FormControl>
              </Box>
            </DialogContent>
            <Box display flex p={1}>
              <DialogActions>
                <Box mr="auto" ml={4}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: grey[700],
                      color: "white",
                    }}
                    onClick={() => {
                      onClose("", false);
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
                <Box mr={4}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      color: "white",
                    }}
                  >
                    Simpan
                  </Button>
                </Box>
              </DialogActions>
            </Box>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};

export default CreateCities;
