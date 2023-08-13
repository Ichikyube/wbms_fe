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
import { Formik, Form, Field, FieldArray } from "formik";
import * as yup from "yup";
import { grey, blue, orange, red, yellow, purple } from "@mui/material/colors";
import * as RolesAPI from "../../../api/roleApi";
import * as API from "../../../api/api";
import SelectBox from "../../../components/selectbox";

// Code snippet from c:\wbms\wbms_fe\src\components\AccessControl\PermissionForm.jsx
import PermissionForm from "../../../components/AccessControl/PermissionForm";
const animatedComponents = makeAnimated();
const CreateRoles = ({ isOpen, onClose }) => {
  const [resources, setResources] = useState([]);
  const [dtAttr, setDtAttr] = useState([]);
  const [availableResources, setAvailableResources] = useState([]);

  const resourcesList = [  
    'barcodeTypes', 'cities', 'companies', 'configs',  
    'customers', 'customerType','driver', 'customerGroups',
    'mills', 'products', 'ProductGroups','provinces','semai', 'sites',
    'storageTanks', 'transactions', 'transportVehicles', 'users', 'weighbridges']
  setAvailableResources(
    resourcesList.map((ares) => ({
      value: ares,
      label: ares,
    }))
  );
  const MainSite = [ 'PKS','T30', 'Labanan' ]

  useEffect(() => {
    API.getResourceslist().then((res) => {
      setResources(res.data.model.records);
      setDtAttr(res.data.model.allAttributes);
    });
  }, []);

  useEffect(() => {
    setAvailableResources(
      resources.map((ares) => ({
        value: ares,
        label: ares,
      }))
    );
  }, [resources]);

  // console.log(resources);
  console.log(availableResources);

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
    resourcesOpt = resources.map((resource) => ({
      value: resource,
      label: resource,
    }));

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
  const [selectedResources, setSelectedResources] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

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
        // setTimeout(() => {
        //   window.location.reload();
        // }, 1000);
        onClose("", false);
      });
  };

  const actionOptions = ["read", "create", "update", "delete"];
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

                <FieldArray
                  gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                  name="permissions">
                  {(arrayHelpers) => (
                    <div>
                      <FormLabel
                        sx={{
                          color: "black",
                          marginBottom: "8px",
                          fontSize: "18px",
                          fontWeight: "bold",
                        }}>
                        Permissions
                      </FormLabel>
                      {values.permissions.map((permission, permissionIndex) => (
                        <div
                          style={{
                            backgroundColor: blue[50],
                            marginTop: "5px",
                            padding: "15px",
                          }}
                          key={permissionIndex}>
                          <button
                            type="button"
                            onClick={() =>
                              arrayHelpers.remove(permissionIndex)
                            }>
                            Remove Permission
                          </button>
                          <FormLabel
                            sx={{
                              color: "black",
                              marginBottom: "8px",
                              fontSize: "18px",
                              fontWeight: "bold",
                            }}>
                            Resource:
                          </FormLabel>
                          <div style={{ flex: 1, width: "50%" }}>
                            <SelectBox
                              width="50%"
                              name={`permissions[${permissionIndex}].resource`}
                              onChange={(e) => {
                                arrayHelpers.handleReplace(e);
                                handleResourceChange(permissionIndex, e.value);
                              }}
                              options={availableResources}
                            />
                          </div>

                          <FieldArray
                            name={`permissions[${permissionIndex}].grants`}>
                            {(grantArrayHelpers) => (
                                <div>
                                {permission.grants.map((grant, grantIndex) => (
                                    <div key={grantIndex}>
                                    <button
                                        type="button"
                                        onClick={() =>
                                        grantArrayHelpers.remove(grantIndex)
                                        }>
                                        Remove Grant
                                    </button>
                                    <div>
                                        <label>Actions:</label>
                                        <div>
                                        {actionOptions.map((actionOption) => (
                                            <label key={actionOption}>
                                            <Field
                                                type="checkbox"
                                                name={`permissions[${permissionIndex}].grants[${grantIndex}].action`}
                                                value={actionOption}
                                            />{" "}
                                            {actionOption}
                                            </label>
                                        ))}
                                        </div>
                                    </div>
                                    <label>Hide Attributes:</label>
                                    <Select
                                        fullWidth
                                        name={`permissions[${permissionIndex}].grants[${grantIndex}].attributes`}
                                        closeMenuOnSelect={false}
                                        components={animatedComponents}
                                        defaultValue={[siteAttr[4], siteAttr[5]]}
                                        isMulti
                                        options={siteAttr}
                                    />
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() =>
                                    grantArrayHelpers.push({
                                        action: "",
                                        possession: "",
                                        attributes: [],
                                    })
                                    }>
                                    Add Grant
                                </button>
                                </div>
                            )}
                            </FieldArray>
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
