import React, { useState, useEffect } from "react";
import "./style.css";
import { styled } from "@mui/material/styles";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Checkbox,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Button,
  RadioGroup,
  Radio,
  FormControl,
  IconButton,
  FormLabel,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Masonry from "@mui/lab/Masonry";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { Formik, Form, FieldArray } from "formik";
import * as yup from "yup";
import { grey, blue } from "@mui/material/colors";
import * as RolesAPI from "../../../api/roleApi";
import SelectBox from "../../../components/selectbox";
import { dtAttrJson } from "../../../data/attributeListObj";

const CreateRoles = ({ isOpen, onClose }) => {
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
  const [checkboxes, setCheckboxes] = useState(
    resourcesList.map((resource, index) => ({
      id: index,
      label: resource,
      checked: true,
    }))
  );
  const [selectedResources, setSelectedResources] = useState([]);
  const [attrOptions, setAttrOptions] = useState(dtAttrJson);
  const handleCheckboxChange = (id) => {
    setCheckboxes((prevCheckboxes) =>
      prevCheckboxes.map((checkbox) =>
        checkbox.id === id
          ? { ...checkbox, checked: !checkbox.checked }
          : checkbox
      )
    );
  };

  useEffect(() => {
    const updatedResources = checkboxes
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.label);
    setSelectedResources(updatedResources);
  }, [checkboxes]);

  useEffect(() => {
    if (selectedResources) {
      setAttrOptions(
        Object.keys(dtAttrJson)
          .filter((resource) => selectedResources.includes(resource))
          .reduce((obj, key) => {
            obj[key] = dtAttrJson[key];
            return obj;
          }, {})
      );
    }
  }, [selectedResources]);
  // Create
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log(values.permissions.grants.attributes);
    const asArray = Object.entries(values);
    const filtered = asArray.filter(([key, value]) => value !== "");
    const filteredValues = Object.fromEntries(filtered);
    console.log(filteredValues);
    RolesAPI.create(filteredValues)
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

  const checkoutSchema = yup.object().shape({
    name: yup.string().required("required"),
  });

  const actionOptions = ["read", "create", "update", "delete"];
  const [possesionList, setPossesionList] = useState(
    Array(actionOptions.length).fill("own")
  );
  const initialValues = {
    name: "",
    permissions: [
      {
        resource: "",
        grants: actionOptions.map((action, index) => ({
          action: action,
          possession: possesionList[index],
          attributes: [
            {
              attr: "",
            },
          ],
        })),
      },
    ],
  };
  const StyledAccordion = styled(Accordion)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    color: theme.palette.text.secondary,
    transition: "max-width 0.3s ease-in-out",
  }));
  return (
    <Dialog open={isOpen} fullWidth maxWidth={"xl"}>
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
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#f8f8f8",
                  marginBottom: "20px",
                }}>
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
                  {checkboxes.map((checkbox) => (
                    <div key={checkbox.id}>
                      <label>
                        <input
                          type="checkbox"
                          checked={checkbox.checked}
                          onChange={() => handleCheckboxChange(checkbox.id)}
                        />
                        {checkbox.label}
                      </label>
                    </div>
                  ))}
                </Box>
                <Box
                  sx={{ gridColumn: "span 4", width: "100%" }}
                  display="block"
                  padding={2}
                  paddingBottom={3}
                  paddingLeft={3}
                  paddingRight={3}>
                  <FormLabel
                    sx={{
                      color: "black",
                      fontSize: "18px",
                      fontWeight: "bold",
                      marginBottom: "8px",
                    }}>
                    Master Data
                  </FormLabel>

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
                  <Masonry columns={4} spacing={2}>
                    {selectedResources.map((resource, index) => (
                      <Paper key={index}>
                        <StyledAccordion
                          sx={{ minHeight: "15px", width: "auto" }}>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography> {resource}</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Box
                              sx={{
                                flex: 1,
                                width: "auto",
                                backgroundColor: blue[50],
                                marginTop: "5px",
                                padding: "15px",
                              }}>
                              <div name={`permissions[${index}].grants`}>
                                <label>Actions:</label>
                                <>
                                  {actionOptions.map(
                                    (actionOption, actionIndex) => (
                                      <div
                                        key={actionIndex}
                                        style={{
                                          display: "block",
                                          width: "100%",
                                        }}>
                                        <FormControl
                                          sx={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            marginBottom: "5px",
                                          }}>
                                          <FormLabel
                                            style={{
                                              display: "flex",
                                              marginRight: "25px",
                                              marginBottom: "5px",
                                            }}>
                                            <Checkbox
                                              name={`permissions[${index}].grants[${actionIndex}].action`}
                                              onChange={(event) => {
                                                const { checked } =
                                                  event.target;
                                                if (checked) {
                                                  setFieldValue(
                                                    `permissions[${index}].grants[${actionIndex}].action`,
                                                    String(event.target.value)
                                                  );
                                                  values.permissions[
                                                    index
                                                  ].grants[
                                                    actionIndex
                                                  ].possession = "own";
                                                } else if (!checked) {
                                                  setFieldValue(
                                                    `permissions[${index}].grants[${actionIndex}].action`,
                                                    ""
                                                  );
                                                  values.permissions[
                                                    index
                                                  ].grants[
                                                    actionIndex
                                                  ].possession = "";
                                                }
                                              }}
                                              value={actionOption}
                                              style={{
                                                marginRight: "15px",
                                              }}
                                            />
                                            {actionOption}
                                          </FormLabel>
                                        </FormControl>
                                        <FormLabel className="switch-title">
                                            Possession
                                          </FormLabel>
                                          <RadioGroup
                                            row
                                            name={`permissions[${index}].grants[${actionIndex}].possession`}
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
                                              setFieldValue(
                                                `permissions[${index}].grants[${actionIndex}].possession`,
                                                possesionList[actionIndex]
                                              );
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
                                        <label
                                          style={{
                                            display: "block",
                                            textAlign: "right",
                                            fontSize: "12px",
                                            width: "100%",
                                          }}>
                                          Hide Attributes:
                                        </label>
                                        {attrOptions[resource] && (
                                          <SelectBox
                                            name={`permissions[${index}].grants[${actionIndex}].attributes`}
                                            onChange={(event) => {
                                              event.forEach((option, index) =>
                                                setFieldValue(
                                                  `permissions[${index}].grants[${actionIndex}].attributes[${index}].attr`,
                                                  option.value
                                                )
                                              );
                                            }}
                                            length={
                                              attrOptions[resource]?.length
                                            }
                                            options={attrOptions[resource]}
                                          />
                                        )}
                                      </div>
                                    )
                                  )}
                                </>
                              </div>
                            </Box>
                          </AccordionDetails>
                        </StyledAccordion>
                      </Paper>
                    ))}
                  </Masonry>
                </Box>
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
