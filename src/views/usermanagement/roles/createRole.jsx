import { useState, useEffect, useMemo, React } from "react";
import "./style.css";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Checkbox,
  Typography,
  Button,
  Box,
  RadioGroup,
  Radio,
  FormControl,
  IconButton,
  FormLabel,
  TextField,
} from "@mui/material";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { Formik, Form, FieldArray } from "formik";
import * as yup from "yup";
import { grey, blue } from "@mui/material/colors";
import * as RolesAPI from "../../../api/roleApi";
import SelectBox from "../../../components/selectbox";
import { dtAttr } from "../../../data/attributeList";
// import PermissionForm from "../../../components/AccessControl/PermissionForm";

const animatedComponents = makeAnimated();
const CreateRoles = ({ isOpen, onClose }) => {
  const [availableResources, setAvailableResources] = useState([]);

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

  // const MainSite = ["PKS", "T30", "Labanan"];
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const handleSelectAllChange = (event, value) => {
    const isChecked = event.target.checked;
    setSelectAllChecked(isChecked);
    value.pks= isChecked;
    value.t30= isChecked;
    value.labanan= isChecked;
  };

  const handleTransactionChange = (name, value) => (event) => {
    const isChecked = event.target.checked;
    value[name]= isChecked;

    // Set "Pilih Semua" checkbox to checked if all transaction checkboxes are checked
    if (
      isChecked &&
      value.pks && value.t30 && value.labanan)
    {
      setSelectAllChecked(true);
    } else {
      setSelectAllChecked(false);
    }
  };

  const mapResources = useMemo(() => {
    return (ares) => ({
      value: ares,
      label: ares,
      attrList: dtAttr[ares],
    });
  }, []);
  const mappedResources = resourcesList.map(mapResources);
  useEffect(() => {
    setAvailableResources(mappedResources);
  }, [mappedResources]);

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
    pks: "",
    t30: "",
    labanan: "",
    name: "",
    permissions: [
      {
        resource: "",
        grants: [
          {
            action: "read",
            possession: "own",
            attributes: [],
          },
        ],
      },
    ],
  };

  const checkoutSchema = yup.object().shape({
    name: yup.string().required("required"),
  });

  const [resourceAtt, setresourceAtt] = useState([]);

  const handleResourceChange = (index, newValue) => {
    const updatedResources = availableResources.filter(
      (resource) => resource.value !== newValue
    );
    setAvailableResources(updatedResources);
  };

  const actionOptions = ["read", "create", "update", "delete"];
  const [possesionList, setPossesionList] = useState(
    Array(actionOptions.length).fill("own")
  );

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
                gap="20px">
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
                        onChange={event=> handleSelectAllChange(event, values)}
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
                      name="pks"
                      checked={values.pks}
                      onChange={handleTransactionChange("pks", values)}
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
                      name="t30"
                      checked={values.t30}
                      onChange={handleTransactionChange("t30", values)}
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
                      name="labanan"
                      checked={values.labanan}
                      onChange={handleTransactionChange("labanan", values)}
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
                            <Select
                              className="basic-single"
                              classNamePrefix="select"
                              // defaultValue={options[0]}
                              isClearable={true}
                              isSearchable={true}
                              style={{ flex: 1, width: "50%" }}
                              components={animatedComponents}
                              name={`permissions[${permissionIndex}].resource`}
                              // value={permission.resource}
                              onChange={(e) => {
                                arrayHelpers.handleReplace(e);
                                handleResourceChange(permissionIndex, e.value);
                                permission.resource = e.value;
                                const attrs = e.attrList.map((att) => ({
                                  value: att,
                                  label: att,
                                }));
                                setresourceAtt(attrs);
                              }}
                              options={availableResources}
                            />
                            <div
                              name={`permissions[${permissionIndex}].grants`}>
                              <label>Actions:</label>
                              <div>
                                {actionOptions.map(
                                  (actionOption, actionIndex) => (
                                    <>
                                      <div
                                        style={{
                                          display: "block",
                                          width: "100%",
                                        }}>
                                        <FormControl
                                          sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            marginBottom: "5px",
                                          }}>
                                          <FormLabel
                                            style={{
                                              display: "flex",
                                              marginRight: "25px",
                                              marginBottom: "5px",
                                            }}
                                            key={actionOption}>
                                            <Checkbox
                                              name={`permissions[${permissionIndex}].grants[${actionIndex}].action`}
                                              onChange={handleChange}
                                              value={actionOption}
                                              style={{ marginRight: "15px" }}
                                            />
                                            {actionOption}
                                          </FormLabel>

                                          <FormLabel
                                            key={actionIndex}
                                            className="switch-title">
                                            Possession
                                          </FormLabel>

                                          <RadioGroup
                                            row
                                            name={`permissions[${permissionIndex}].grants[${actionIndex}].possession`}
                                            className="switch-field"
                                            sx={{
                                              padding: "0px",
                                              borderRadius: "0px",
                                              "--RadioGroup-gap": "0px",
                                              "--Radio-actionRadius": "0px",
                                            }}
                                            onChange={(event) => {
                                              const { value } = event.target;
                                              const list = [...possesionList];
                                              list[actionIndex] = value;
                                              setPossesionList(list);
                                              // setFieldValue(
                                              //   `permissions[${permissionIndex}].grants[${actionIndex}].possession`,
                                              //   possesionList[actionIndex]
                                              // );
                                            }}
                                            value={possesionList[actionIndex]}>
                                            <FormControlLabel
                                              sx={{
                                                display: "flex",
                                                marginRight: "0",
                                                marginBottom: "0",
                                              }}
                                              value="own"
                                              control={
                                                <Radio disableicon="true" />
                                              }
                                              label="Own"
                                            />
                                            <FormControlLabel
                                              value="any"
                                              control={
                                                <Radio disableicon="true" />
                                              }
                                              label="Any"
                                            />
                                          </RadioGroup>
                                        </FormControl>
                                      </div>
                                      <label
                                        style={{
                                          display: "block",
                                          textAlign: "right",
                                          fontSize: "12px",
                                          width: "100%",
                                        }}>
                                        Hide Attributes:
                                      </label>
                                      <SelectBox
                                        name={`permissions[${permissionIndex}].grants[${actionIndex}].attributes`}
                                        onChange={(event) => {
                                          console.log(event);
                                          setFieldValue(`permissions[${permissionIndex}].grants[${actionIndex}].attributes`, event.map(option=>option.value))
                                        }}
                                        // value={values.permissions[permissionIndex].grants[actionIndex].attributes}
                                        defaultValues={[
                                          resourceAtt?.userCreated,
                                          resourceAtt?.userModified,
                                          resourceAtt?.dtCreated,
                                          resourceAtt?.dtModified,
                                        ]}
                                        options={resourceAtt}
                                      />
                                    </>
                                  )
                                )}
                              </div>
                            </div>
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
