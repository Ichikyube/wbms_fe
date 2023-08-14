import { useState, useEffect, React, useMemo } from "react";
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

import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { Formik, Form, Field, FieldArray } from "formik";
import * as yup from "yup";
import { grey, blue } from "@mui/material/colors";
import * as RolesAPI from "../../../api/roleApi";
import * as API from "../../../api/api";
import SelectBox from "../../../components/selectbox";

// import PermissionForm from "../../../components/AccessControl/PermissionForm";

const CreateRoles = ({ isOpen, onClose }) => {
  const [dtAttr, setDtAttr] = useState([]);
  const [availableResources, setAvailableResources] = useState([]);

  let resourcesOpt,
    barcodeAttr,
    cityAttr,
    provinceAttr,
    companyAttr,
    customerAttr,
    customerGroupAttr,
    weighbridgeAttr,
    customerTypeAttr,
    driverAttr,
    millsAttr,
    siteAttr,
    stankAttr,
    transactionAttr,
    transportAttr,
    productAttr,
    productgrupAttr;

  if (dtAttr) {
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
  const resourcesList = [
    "BarcodeType",
    "City",
    "Company",
    "Config",
    "Customer",
    "CustomerType",
    "Driver",
    "CustomerGroup",
    "Mill",
    "Product",
    "ProductGroup",
    "Province",
    "Semai",
    "Site",
    "StorageTank",
    "Transaction",
    "TransportVehicle",
    "User",
    "Weighbridge",
  ];
  const MainSite = ["PKS", "T30", "Labanan"];
  useEffect(() => {
    API.getResourceslist()
      .then((res) => {
        console.log(res.data);
        setDtAttr(res.data.model.allAttributes);
      })
      .then(
        setAvailableResources(
          resourcesList.map((ares) => ({
            value: ares,
            label: ares,
            attrList: dtAttr[ares],
          }))
        )
      );
  }, []);

  const [value, setValue] = useState([]);

  // Create
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
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

        onClose("", false);
      });
  };

  const initialValues = {
    name: "",
    permissions: [
      {
        resource: "",
        grants: [
          {
            action: ["read"],
            possession: "own",
            attributes: [
              {
                attr: "",
              },
            ],
          },
        ],
      },
    ],
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

  const handleResourceChange = (index, newValue) => {
    const updatedResources = availableResources.filter(
      (resource) => resource.value !== newValue
    );
    setAvailableResources(updatedResources);
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
            setFieldValue,
            isSubmitting,
          }) => (
            <Form onSubmit={handleSubmit}>
              <Box
                display="block"
                padding={2}
                paddingBottom={3}
                paddingLeft={3}
                paddingRight={3}
                gap="20px"
                // gridTemplateColumns="repeat(2, minmax(0, 1fr))"
              >
                <FormControl>
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
              </Box>
              <FormLabel
                sx={{
                  color: "black",
                  marginTop: "25px",
                  marginBottom: "8px",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}>
                Permissions
              </FormLabel>
              <Box
                sx={{ gridColumn: "span 4" }}
                display="block"
                padding={2}
                paddingBottom={3}
                paddingLeft={3}
                paddingRight={3}>
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
                    <Checkbox
                      checked={transactionChecked.t30}
                      onChange={handleTransactionChange("t30")}
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
                      Transaksi Labanan
                    </FormLabel>
                    <Checkbox
                      checked={transactionChecked.labanan}
                      onChange={handleTransactionChange("labanan")}
                    />
                  </FormControl>
                </Box>
                <FormLabel
                  sx={{
                    color: "black",
                    fontSize: "18px",
                    fontWeight: "bold",
                    marginBottom: "8px",
                  }}>
                  Master Data
                </FormLabel>

                <FieldArray
                  gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                  name="permissions">
                  {(arrayHelpers) => (
                    <div>
                      {values.permissions.map((permission, permissionIndex) => (
                        <div
                          style={{
                            backgroundColor: blue[50],
                            marginTop: "5px",
                            padding: "15px",
                          }}
                          key={permissionIndex}>
                          <div style={{ flex: 1, width: "100%" }}>
                            <SelectBox
                              width="100%"
                              name={`permissions[${permissionIndex}].resource`}
                              permInd={permissionIndex}
                              onChange={(e) => {
                                arrayHelpers.handleReplace(e);
                                handleResourceChange(permissionIndex, e.value);
                                // const attrs = e.attrList?.map((att) => ({
                                //   value: att,
                                //   label: att,
                                // }));
                                this.attrList = e.attrList;
                                console.log(e.attrList);
                              }}
                              attrList={customerAttr}
                              options={availableResources}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                arrayHelpers.remove(permissionIndex)
                              }>
                              Remove Permission
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          arrayHelpers.push({ resource: "", grants: [] })
                        }>
                        Add Permission
                      </button>
                    </div>
                  )}
                </FieldArray>
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
                  disabled={isSubmitting}
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
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoles;
