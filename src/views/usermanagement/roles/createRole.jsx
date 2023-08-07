import { useState, useEffect, useRef, React } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Checkbox,
  Typography,
  Button,
  Box,
  FormControl,
  IconButton,
  FormLabel,
  TextField,
} from "@mui/material";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { Formik } from "formik";
import * as yup from "yup";
import { grey, blue, orange, red, yellow, purple } from "@mui/material/colors";
import * as RolesAPI from "../../../api/roleApi";
import * as API from "../../../api/api";

const animatedComponents = makeAnimated();
const CreateRoles = ({ isOpen, onClose }) => {
  let Col = [];
  const [dtModel, setDtModel] = useState([]);
  const [dtAttr, setDtAttr] = useState([]);

  const fetcher = () =>
    API.getResourceslist().then((res) => res.data.model.records);

  useEffect(() => {
    API.getResourceslist().then((res) => {
      setDtModel(res.data.model.records);
      setDtAttr(res.data.model.allAttributes);
    });
  }, []);
  let resourcesOpt, barcodeAttr, cityAttr, provinceAttr, companyAttr,customerAttr,customerGroupAttr,weighbridgeAttr,
    customerTypeAttr, driverAttr, millsAttr, siteAttr, stankAttr, transactionAttr, transportAttr, productAttr, productgrupAttr;


  if(dtAttr) {
      //const models = dtAttr.records;
      resourcesOpt = dtModel.map((model) => ({ value: model, label: model }));

      barcodeAttr = dtAttr[" BarcodeType"]?.map((attr) => ({
        value: attr,
        label: attr,
      }));
      cityAttr = dtAttr["City"]?.map((attr) => ({
        value: attr,
        label: attr,
      }));
      provinceAttr = dtAttr["Province"]?.map((attr) => ({
        value: attr,
        label: attr,
      }));
        companyAttr = dtAttr["Company"]?.map((attr) => ({
        value: attr,
        label: attr,
      }));
      customerAttr = dtAttr["Customer"]?.map((attr) => ({
        value: attr,
        label: attr,
      }));
      customerGroupAttr = dtAttr["CustomerGroup"]?.map((attr) => ({
        value: attr,
        label: attr,
      }));
      customerTypeAttr = dtAttr["CustomerType"]?.map((attr) => ({
        value: attr,
        label: attr,
      }));
      driverAttr = dtAttr["Driver"]?.map((attr) => ({
        value: attr,
        label: attr,
      }));
      millsAttr = dtAttr["Mill"]?.map((attr) => ({
        value: attr,
        label: attr,
      }));
      siteAttr = dtAttr["Site"]?.map((attr) => ({
        value: attr,
        label: attr,
      }));
      stankAttr = dtAttr["StorageTank"]?.map((attr) => ({
        value: attr,
        label: attr,
      }));
      transactionAttr = dtAttr["Transaction"]?.map((attr) => ({
        value: attr,
        label: attr,
      }));
      transportAttr = dtAttr["TransportVehicle"]?.map((attr) => ({
        value: attr,
        label: attr,
      }));
      productAttr = dtAttr["Product"]?.map((attr) => ({
        value: attr,
        label: attr,
      }));
      productgrupAttr = dtAttr["ProductGroup"]?.map((attr) => ({
        value: attr,
        label: attr,
      }));
      weighbridgeAttr = dtAttr["Product"]?.map((attr) => ({
        value: attr,
        label: attr,
      }));
  }

  // Create
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    RolesAPI.create(values)
      .then((res) => {
        console.log("Data Berhasil Disimpan:", res.data);
        toast.success("Data Berhasil Disimpan");
      })
      .catch((error) => {
        console.error("Data Gagal Disimpan:", error);
        toast.error("Data Gagal Disimpan: " + error.message);
      })
      .finally(() => {
        setSubmitting(false);
        resetForm();
        // setTimeout(() => {
        //   window.location.reload();
        // }, 1000);
        onClose("", false);
      });
  };

  const initialValues = {
    name: "",
  };

  const checkoutSchema = yup.object().shape({
    name: yup.string().required("required"),
  });

  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [transactionChecked, setTransactionChecked] = useState({
    pks: false,
    t30: false,
    labanan: false,
    report: false,
  });

  // ... your other code ...

  const handleSelectAllChange = (event) => {
    const isChecked = event.target.checked;
    setSelectAllChecked(isChecked);
    setTransactionChecked({
      pks: isChecked,
      t30: isChecked,
      labanan: isChecked,
      report: isChecked,
    });
  };

  const handleTransactionChange = (name) => (event) => {
    const isChecked = event.target.checked;
    setTransactionChecked((prevChecked) => ({
      ...prevChecked,
      [name]: isChecked,
    }));

    // Set "Pilih Semua" checkbox to checked if all transaction checkboxes are checked
    if (
      isChecked &&
      Object.values(transactionChecked).every((value) => value === true)
    ) {
      setSelectAllChecked(true);
    } else {
      setSelectAllChecked(false);
    }
  };

  return (
    <Dialog open={isOpen} fullWidth maxWidth={"md"}>
      <DialogTitle
        sx={{ color: "black", backgroundColor: "white", fontSize: "28px" }}>
        Tambah Roles
        <IconButton
          sx={{
            color: "black",
            position: "absolute",
            right: "15px",
            top: "20px",
          }}
          onClick={() => {
            onClose("", false);
          }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Formik
          onSubmit={handleSubmit}
          initialValues={initialValues}
          validationSchema={checkoutSchema}>
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                padding={2}
                paddingBottom={3}
                paddingLeft={3}
                paddingRight={3}
                gap="20px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))">
                <FormControl sx={{ gridColumn: "span 4" }}>
                  <FormLabel
                    sx={{
                      color: "black",
                      marginBottom: "8px",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}>
                    Role Name
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Nama"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    name="name"
                    error={!!touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                  />
                </FormControl>

                <FormLabel
                  sx={{
                    color: "black",
                    fontSize: "18px",
                    fontWeight: "bold",
                    marginTop: "25px",
                  }}>
                  Permissions :
                </FormLabel>
                <FormControl
                  sx={{
                    gridColumn: "span 4",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}>
                  <FormLabel
                    sx={{
                      color: "black",
                      fontWeight: "bold",
                      fontSize: "18px",
                    }}>
                    Transaction
                  </FormLabel>

                  <FormControlLabel
                    sx={{ marginLeft: "21vh" }}
                    control={
                      <Checkbox
                        checked={selectAllChecked}
                        onChange={handleSelectAllChange}
                      />
                    }
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}>
                          Pilih Semua
                        </Typography>
                      </>
                    }
                  />
                </FormControl>
                <Box
                  sx={{
                    justifyContent: "space-between",
                    alignContent: "center",
                    width: "100%",
                    display: "grid",
                    gridColumn: "span 4",
                  }}>
                  <FormControl
                    sx={{
                      flexDirection: "row",
                      marginTop: "5px",
                      alignItems: "center",
                      marginBottom: "5px",
                    }}>
                    <FormLabel
                      sx={{
                        color: "black",

                        fontSize: "18px",
                      }}>
                      Transaksi PKS
                    </FormLabel>
                    <Checkbox
                      checked={transactionChecked.pks}
                      onChange={handleTransactionChange("pks")}
                    />
                  </FormControl>
                  <FormControl
                    sx={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: "5px",
                    }}>
                    <FormLabel
                      sx={{
                        color: "black",

                        fontSize: "18px",
                      }}>
                      Transaksi T-30
                    </FormLabel>
                    <Checkbox />
                  </FormControl>
                  <FormControl
                    sx={{
                      gridColumn: "3/4",
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: "5px",
                    }}>
                    <FormLabel
                      sx={{
                        color: "black",

                        fontSize: "18px",
                      }}>
                      Transaksi Labanan
                    </FormLabel>
                    <Checkbox />
                  </FormControl>
                </Box>
                <FormControl
                  sx={{
                    gridColumn: "span 4",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}>
                  <FormLabel
                    sx={{
                      color: "black",

                      fontSize: "18px",
                    }}>
                    Report
                  </FormLabel>
                  <Checkbox />
                </FormControl>
                <FormLabel
                  sx={{
                    color: "black",
                    fontSize: "18px",
                    fontWeight: "bold",
                    marginBottom: "5px",
                  }}>
                  Master Data
                </FormLabel>
                <FormControl
                  sx={{
                    gridColumn: "span 4",
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "5px",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}>
                  <FormLabel
                    sx={{
                      color: "black",

                      fontSize: "18px",
                    }}>
                    Province
                  </FormLabel>
                  <FormControlLabel
                    sx={{ marginLeft: "25px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}>
                          Read
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ marginRight: "25px", marginLeft: "5px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}>
                          Full
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ display: "block", width: "80%" }}
                    control={
                      <Select
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        defaultValue={[provinceAttr[4], provinceAttr[5]]}
                        isMulti
                        options={provinceAttr}
                      />
                    }
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                            gridColumn: "span 2",
                          }}>
                          Hide Attributes
                        </Typography>
                      </>
                    }
                  />
                </FormControl>
                <FormControl
                  sx={{
                    gridColumn: "span 4",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}>
                  <FormLabel
                    sx={{
                      color: "black",

                      fontSize: "18px",
                    }}>
                    City
                  </FormLabel>
                  <FormControlLabel
                    sx={{ marginLeft: "25px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}>
                          Read
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ marginRight: "25px", marginLeft: "5px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}>
                          Full
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ display: "block", width: "80%" }}
                    control={
                      <Select
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        defaultValue={[cityAttr[4], cityAttr[5]]}
                        isMulti
                        options={cityAttr}
                      />
                    }
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                            gridColumn: "span 2",
                          }}>
                          Hide Attributes
                        </Typography>
                      </>
                    }
                  />
                </FormControl>
                <FormControl
                  sx={{
                    gridColumn: "span 4",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}>
                  <FormLabel
                    sx={{
                      color: "black",

                      fontSize: "18px",
                    }}>
                    Company
                  </FormLabel>
                  <FormControlLabel
                    sx={{ marginLeft: "25px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}>
                          Read
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ marginRight: "25px", marginLeft: "5px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}>
                          Full
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ display: "block", width: "80%" }}
                    control={
                      <Select
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        defaultValue={[companyAttr[4], companyAttr[5]]}
                        isMulti
                        options={companyAttr}
                      />
                    }
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                            gridColumn: "span 2",
                          }}>
                          Hide Attributes
                        </Typography>
                      </>
                    }
                  />
                </FormControl>
                <FormControl
                  sx={{
                    gridColumn: "span 4",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}>
                  <FormLabel
                    sx={{
                      color: "black",

                      fontSize: "18px",
                    }}>
                    Sites
                  </FormLabel>
                  <FormControlLabel
                    sx={{ marginLeft: "25px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}>
                          Read
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ marginRight: "25px", marginLeft: "5px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}>
                          Full
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ display: "block", width: "80%" }}
                    control={
                      <Select
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        defaultValue={[siteAttr[4], siteAttr[5]]}
                        isMulti
                        options={siteAttr}
                      />
                    }
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                            gridColumn: "span 2",
                          }}>
                          Hide Attributes
                        </Typography>
                      </>
                    }
                  />
                </FormControl>
                <FormControl
                  sx={{
                    gridColumn: "span 4",
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "5px",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}>
                  <FormLabel
                    sx={{
                      color: "black",

                      fontSize: "18px",
                    }}>
                    Customer Type
                  </FormLabel>
                  <FormControlLabel
                    sx={{ marginLeft: "25px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}>
                          Read
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ marginRight: "25px", marginLeft: "5px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}>
                          Full
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ display: "block", width: "80%" }}
                    control={
                      <Select
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        defaultValue={[customerTypeAttr[4], customerTypeAttr[5]]}
                        isMulti
                        options={customerTypeAttr}
                      />
                    }
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                            gridColumn: "span 2",
                          }}>
                          Hide Attributes
                        </Typography>
                      </>
                    }
                  />
                </FormControl>
                <FormControl
                  sx={{
                    gridColumn: "span 4",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}>
                  <FormLabel
                    sx={{
                      color: "black",

                      fontSize: "18px",
                    }}>
                    Customer Group
                  </FormLabel>
                  <FormControlLabel
                    sx={{ marginLeft: "25px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}>
                          Read
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ marginRight: "25px", marginLeft: "5px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}>
                          Full
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ display: "block", width: "80%" }}
                    control={
                      <Select
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        defaultValue={[customerGroupAttr[4], customerGroupAttr[5]]}
                        isMulti
                        options={customerGroupAttr}
                      />
                    }
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                            gridColumn: "span 2",
                          }}>
                          Hide Attributes
                        </Typography>
                      </>
                    }
                  />
                </FormControl>
                <FormControl
                  sx={{
                    gridColumn: "span 4",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}>
                  <FormLabel
                    sx={{
                      color: "black",

                      fontSize: "18px",
                    }}>
                    Customer
                  </FormLabel>
                  <FormControlLabel
                    sx={{ marginLeft: "25px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}>
                          Read
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ marginRight: "25px", marginLeft: "5px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}>
                          Full
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ display: "block", width: "80%" }}
                    control={
                      <Select
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        defaultValue={[customerAttr[4], customerAttr[5]]}
                        isMulti
                        options={customerAttr}
                      />
                    }
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                            gridColumn: "span 2",
                          }}>
                          Hide Attributes
                        </Typography>
                      </>
                    }
                  />
                </FormControl>
                <FormControl
                  sx={{
                    gridColumn: "span 4",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}>
                  <FormLabel
                    sx={{
                      color: "black",

                      fontSize: "18px",
                    }}>
                    Mill
                  </FormLabel>
                  <FormControlLabel
                    sx={{ marginLeft: "25px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}>
                          Read
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ marginRight: "25px", marginLeft: "5px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}>
                          Full
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ display: "block", width: "80%" }}
                    control={
                      <Select
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        defaultValue={[millsAttr[4], millsAttr[5]]}
                        isMulti
                        options={millsAttr}
                      />
                    }
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                            gridColumn: "span 2",
                          }}>
                          Hide Attributes
                        </Typography>
                      </>
                    }
                  />
                </FormControl>
                <FormControl
                  sx={{
                    gridColumn: "span 4",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}>
                  <FormLabel
                    sx={{
                      color: "black",

                      fontSize: "18px",
                    }}>
                    Weighbridge
                  </FormLabel>
                  <FormControlLabel
                    sx={{ marginLeft: "25px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}>
                          Read
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ marginRight: "25px", marginLeft: "5px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}>
                          Full
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ display: "block", width: "80%" }}
                    control={
                      <Select
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        defaultValue={[weighbridgeAttr[4], weighbridgeAttr[5]]}
                        isMulti
                        options={weighbridgeAttr}
                      />
                    }
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                            gridColumn: "span 2",
                          }}>
                          Hide Attributes
                        </Typography>
                      </>
                    }
                  />
                </FormControl>
                <FormControl
                  sx={{
                    gridColumn: "span 4",
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "5px",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}>
                  <FormLabel
                    sx={{
                      color: "black",

                      fontSize: "18px",
                    }}>
                    Product Group
                  </FormLabel>
                  <FormControlLabel
                    sx={{ marginLeft: "25px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}>
                          Read
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ marginRight: "25px", marginLeft: "5px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}>
                          Full
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ display: "block", width: "80%" }}
                    control={
                      <Select
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        defaultValue={[productgrupAttr[4], productgrupAttr[5]]}
                        isMulti
                        options={productgrupAttr}
                      />
                    }
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                            gridColumn: "span 2",
                          }}>
                          Hide Attributes
                        </Typography>
                      </>
                    }
                  />
                </FormControl>
                <FormControl
                  sx={{
                    gridColumn: "span 4",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}>
                  <FormLabel
                    sx={{
                      color: "black",

                      fontSize: "18px",
                    }}>
                    Product
                  </FormLabel>
                  <FormControlLabel
                    sx={{ marginLeft: "25px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}>
                          Read
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ marginRight: "25px", marginLeft: "5px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}>
                          Full
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ display: "block", width: "80%" }}
                    control={
                      <Select
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        defaultValue={[productAttr[4], productAttr[5]]}
                        isMulti
                        options={productAttr}
                      />
                    }
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                            gridColumn: "span 2",
                          }}>
                          Hide Attributes
                        </Typography>
                      </>
                    }
                  />
                </FormControl>
                <FormControl
                  sx={{
                    gridColumn: "span 4",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}>
                  <FormLabel
                    sx={{
                      color: "black",

                      fontSize: "18px",
                    }}>
                    Storage Tank
                  </FormLabel>
                  <FormControlLabel
                    sx={{ marginLeft: "25px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}>
                          Read
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ marginRight: "25px", marginLeft: "5px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}>
                          Full
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ display: "block", width: "80%" }}
                    control={
                      <Select
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        defaultValue={[stankAttr[4], stankAttr[5]]}
                        isMulti
                        options={stankAttr}
                      />
                    }
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                            gridColumn: "span 2",
                          }}>
                          Hide Attributes
                        </Typography>
                      </>
                    }
                  />
                </FormControl>
                <FormControl
                  sx={{
                    gridColumn: "span 4",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}>
                  <FormLabel
                    sx={{
                      color: "black",

                      fontSize: "18px",
                    }}>
                    Driver
                  </FormLabel>
                  <FormControlLabel
                    sx={{ marginLeft: "25px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}>
                          Read
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ marginRight: "25px", marginLeft: "5px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}>
                          Full
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ display: "block", width: "80%" }}
                    control={
                      <Select
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        defaultValue={[driverAttr[4], driverAttr[5]]}
                        isMulti
                        options={driverAttr}
                      />
                    }
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                            gridColumn: "span 2",
                          }}>
                          Hide Attributes
                        </Typography>
                      </>
                    }
                  />
                </FormControl>
                <FormControl
                  sx={{
                    gridColumn: "span 4",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}>
                  <FormLabel
                    sx={{
                      color: "black",

                      fontSize: "18px",
                    }}>
                    Transport Vehicle
                  </FormLabel>
                  <FormControlLabel
                    sx={{ marginLeft: "25px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}>
                          Read
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ marginRight: "25px", marginLeft: "5px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}>
                          Full
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ display: "block", width: "80%" }}
                    control={
                      <Select
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        defaultValue={[transportAttr[4], transportAttr[5]]}
                        isMulti
                        options={transportAttr}
                      />
                    }
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                            gridColumn: "span 2",
                          }}>
                          Hide Attributes
                        </Typography>
                      </>
                    }
                  />
                </FormControl>
              </Box>
              <Box display="flex" mt={3} mb={4} justifyContent="center">
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: grey[700],
                    color: "white",
                    textTransform: "none",
                    fontSize: "16px",
                  }}
                  onClick={() => {
                    onClose("", false);
                  }}>
                  Cancel
                </Button>
                <Box mr={1} />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    color: "white",
                    textTransform: "none",
                    fontSize: "16px",
                  }}>
                  Simpan
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoles;
