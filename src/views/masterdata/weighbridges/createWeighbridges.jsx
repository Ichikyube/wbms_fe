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

import * as WeighbridgesAPI from "../../../api/weighbridgesApi";

const CreateWeighbridges = ({ isOpen, onClose, dtSites }) => {
  const handleSubmit = (values, { setSubmitting }) => {
    WeighbridgesAPI.create(values)
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
    name: yup.string().required("required"),
    code: yup.string().required("required"),
    siteId: yup.string().required("required"),
  });
  const initialValues = {
    name: "",
    code: "",
    siteId: "",
  };

  return (
    <Dialog open={isOpen} fullWidth maxWidth="md">
      <DialogTitle
        sx={{ color: "white", backgroundColor: "black", fontSize: "27px" }}
      >
        Tambah Data Weighbridge
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
                paddingBottom={3}
                paddingLeft={3}
                paddingRight={3}
                gap="20px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
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
                    value={values?.code}
                    name="code"
                    error={!!touched.code && !!errors.code}
                    helperText={touched.code && errors.code}
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
                    Name
                  </FormLabel>

                  <TextField
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Name...."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.name}
                    name="name"
                    error={!!touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                    id="name-input"
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
                    Site
                  </FormLabel>
                  <Select
                    fullWidth
                    name="siteId"
                    value={values?.siteId}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    displayEmpty
                    sx={{
                      color: MenuItem ? "gray" : "black",
                    }}
                  >
                    <MenuItem value="" disabled>
                      -- Pilih Site --
                    </MenuItem>
                    {dtSites.map((item) => {
                      return <MenuItem value={item.id}>{item.name}</MenuItem>;
                    })}
                  </Select>
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

export default CreateWeighbridges;
