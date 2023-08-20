import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useCollapse from "react-collapsed";
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
import { Formik, Form, FieldArray, Field } from "formik";
import * as yup from "yup";
import { grey, blue } from "@mui/material/colors";
import * as RolesAPI from "../../../api/roleApi";
import SelectBox from "../../../components/selectbox";
import { dtAttrJson } from "../../../data/attributeListObj";

const CreateRoles = ({ isOpen, onClose }) => {
  const [expanded , setExpanded] = useState(null);

  const toggleAccordion = (index) => {
    setExpanded(index === expanded ? null : index);
  };
  const resourcesList = [
    "Company",
    "Customer",
    "Driver",
    "Mill",
    "Product",
    "Semai",
    "Site",
    "StorageTank",
    "Transaction",
    "TransportVehicle",
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
  const handleCheckboxChange = (id, values, setFieldValue) => {
    setCheckboxes((prevCheckboxes) =>
      prevCheckboxes.map((checkbox) =>
        checkbox.id === id
          ? { ...checkbox, checked: !checkbox.checked }
          : checkbox
      )
    );
  };
  const handleSelectAll = () => {
    const allChecked = checkboxes.every((checkbox) => checkbox.checked);
    const updatedCheckboxes = checkboxes.map((checkbox) => ({
      ...checkbox,
      checked: !allChecked,
    }));
    setCheckboxes(updatedCheckboxes);
  };
  const actionOptions = ["read", "create", "update", "delete"];
  const [possesionList, setPossesionList] = useState(
    Array(actionOptions.length).fill("own")
  );
  const [initialValues, setInitialValues] = useState({
    name: "",
    permissions: [
      {
        resource: "",
        grants: [
          {
            action: '',
            possession: '',
            attributes: [
              {
                attr: "",
              },
            ],
          },
        ],
      },
    ],
  });
  // Use the useEffect to update selectedResources
  useEffect(() => {
    const updatedResources = checkboxes
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.label);
    setSelectedResources(updatedResources);
  }, [checkboxes]);
  useEffect(() => {
    // Update initial values based on selected resources
    const permissions = selectedResources.map((resource) => ({
      resource,
      grants: [
        {
          action: '',
          possession: '',
          attributes: [{ attr: '' }],
        },
      ],
    }));
    setInitialValues({name: "", permissions});
    setAttrOptions(
      Object.keys(dtAttrJson)
        .filter((resource) => selectedResources.includes(resource))
        .reduce((obj, key) => {
          obj[key] = dtAttrJson[key];
          return obj;
        }, {})
    );
  }, [selectedResources]);
  
  // Create
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    values.permissions = initialValues.permissions
    const asArray = Object.entries(values);
    const filtered = asArray.filter(([key, value]) => value !== "");
    const filteredValues = Object.fromEntries(filtered);
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
                  <label>
                    <input
                      type="checkbox"
                      checked={checkboxes.every((checkbox) => checkbox.checked)}
                      onChange={handleSelectAll}
                    />
                    Select All
                  </label>
                  {checkboxes.map((checkbox) => (
                    <div key={checkbox.id}>
                      <label>
                        <input
                          type="checkbox"
                          checked={checkbox.checked}
                          onChange={() =>
                            handleCheckboxChange(checkbox.id, values, setFieldValue)
                          }
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
                        <StyledAccordion key={index} 
                          expanded={expanded === index} 
                          onChange={(e, expanded)=>toggleAccordion(index)}
                          TransitionProps={{ unmountOnExit: true }}
                          sx={{ minHeight: "15px", width: "auto" }}>
                          
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>
                              {" "}
                              {/* {  values.permissions[index] &&
                                (values.permissions[index].resource = resource) } */}
                              {values.permissions[index] && values.permissions[index].resource}
                              <br />
                              {expanded !== index  && values.permissions[index]?.grants.length > 0 &&
                                actionOptions.map(
                                  (actionOption, actionIndex) => (
                                    <span>
                                      {"|| " +
                                        values.permissions[index]?.grants[
                                          actionIndex
                                        ]?.action}
                                      <span style={{ fontSize: "10px" }}>
                                        {
                                          values.permissions[index]?.grants[
                                            actionIndex
                                          ]?.possession
                                        }{" "}
                                      </span>
                                    </span>
                                  )
                                ) }
                              {expanded !== index  && values.permissions[index]?.grants.length && "||"}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                              <Box
                                name={`permissions[${index}].grants`}
                                sx={{
                                  flex: 1,
                                  width: "auto",
                                  backgroundColor: blue[50],
                                  marginTop: "5px",
                                  padding: "15px",
                                }}>
                                <label>Actions:</label>
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
                                            onChange={handleChange}
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
                                        value={values.permissions[index]?.grants[actionIndex]?.possession}>
                                        <FormControlLabel
                                          sx={{
                                            display: "flex",
                                            marginRight: "0",
                                            marginBottom: "0",
                                          }}
                                          value="own"
                                          control={<Radio disableicon="true" />}
                                          label="Own"
                                        />
                                        <FormControlLabel
                                          value="any"
                                          control={<Radio disableicon="true" />}
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
                                            if (
                                              values.permissions[index] &&
                                              values.permissions[index].grants[
                                                actionIndex
                                              ]
                                            ) {
                                              event.forEach((option, i) =>
                                                setFieldValue(
                                                  `permissions[${index}].grants[${actionIndex}].attributes[${i}].attr`,
                                                  option.value
                                                )
                                              );
                                              // values.permissions[index].grants[
                                              //     actionIndex
                                              //   ].attributes[i].attr = option.value;
                                            }
                                          }}
                                          setFieldValue={setFieldValue}
                                          permission={`permissions[${index}].grants[${actionIndex}]`}
                                          length={attrOptions[resource]?.length}
                                          options={attrOptions[resource]}
                                        />
                                      )}
                                    </div>
                                  )
                                )}
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
