import React, { Suspense, lazy, useState, useEffect, useRef } from "react";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { useCollapse } from "react-collapsed";
import "./style.css";
import { styled } from "@mui/material/styles";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  ToggleButton,
  Button,
  FormControl,
  IconButton,
  FormLabel,
  Stack,
  Switch,
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
import * as RoleAPI from "../../../api/roleApi";
import { dtAttrJson } from "../../../data/attributeListObj";
const SelectBox = lazy(() => import("../../../components/selectbox"));
const EditRoles = ({ isEditOpen, onClose, dtRole }) => {
  const [expanded, setExpanded] = useState(null);
  const role = dtRole;
  const toggleAccordion = (index) => {
    setExpanded(index === expanded ? null : index);
  };
  const resourcesList = [
    "Company",
    "Customer",
    "Driver",
    "Mill",
    "Product",
    "Site",
    "StorageTank",
    "Transaction",
    "TransportVehicle",
    "Weighbridge",
    "User",
    "Config",
  ];

  const [checkboxes, setCheckboxes] = useState(
    resourcesList.map((res, index) => ({
      id: index,
      label: res,
      checked: role.permissions.map(({ resource }) => resource).includes(res)
        ? true
        : false,
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
  const actionOptions = ["read", "create", "update", "delete"];
  const adjustValues = {
    id: role.id,
    name: role.name,
    description: role.description,
    permissions: role.permissions.map(({ resource, grants }) => ({
      resource,
      roleId: role.id,
      grants: actionOptions.map((actionOption, index) => {
        const grant = grants[grants.map(({ action }) => action).indexOf(actionOption)];
    
        if (grant) {
          return {
            action: grant.action,
            possession: grant.possession,
            attributes: grant.attributes
              .filter(({ attr }) => attr !== "")
              .map((attr) => ({ value: attr, label: attr })),
          };
        } else {
          return {
            action: '', // or some default value if action is empty
            possession: '', // or some default value if possession is empty
            attributes: [], // or an empty array if attributes are empty
          };
        }
      }),
    })),
  };
  const inValues = _.mergeWith({}, adjustValues, role, (objValue, srcValue) => {
    // Replace values in role with those from initialValue
    if (_.isArray(objValue) && _.isArray(srcValue)) {
      return srcValue;
    }
    return undefined; // Default behavior to let _.merge handle the merge
  });
  const { users, isDeleted, userCreated, ...initialValues } = inValues;
  const [mountAttributes, setMountAttributes] = useState([]);
  const toggleAttr = (attrId) => {
    if (mountAttributes.includes(attrId)) {
      setMountAttributes(mountAttributes.filter((i) => i !== attrId));
    } else {
      setMountAttributes([...mountAttributes, attrId]);
    }
  };

  // Use the useEffect to update selectedResources
  useEffect(() => {
    const updatedResources = checkboxes
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.label);
    setSelectedResources(updatedResources);
  }, [checkboxes]);

  const handleFormSubmit = (values, { setSubmitting, resetForm }) => {
    const updatedPermissions = values.permissions.filter((permission) =>
      selectedResources.includes(permission.resource)
    );
    const { id, name, description } = values;
    values = {
      id,
      name,
      description,
      permissions: updatedPermissions,
    };
    console.log(values);
    RoleAPI.update(values)
      .then((res) => {
        console.log("Data Berhasil Disimpan:", res.data);
        toast.success("Data Berhasil Disimpan"); // Tampilkan toast sukses
        // Lakukan tindakan tambahan atau perbarui state sesuai kebutuhan
      })
      .catch((error) => {
        console.error("Data Gagal Disimpan:", error);
        toast.error("Data Gagal Disimpan: " + error.message); // Tampilkan pesan error spesifik
        // Tangani error atau tampilkan pesan error
      })
      .finally(() => {
        setSubmitting(false);
        resetForm();
        onClose("", false);
      });
  };

  const StyledAccordion = styled(Accordion)(({ theme }) => ({
    backgroundColor: "#fff",
    color: theme.palette.text.secondary,
    transition: "max-width 0.3s ease-in-out",
  }));
  return (
    <Dialog open={isEditOpen} fullWidth maxWidth={"xl"}>
      <DialogTitle
        sx={{ color: "black", backgroundColor: "white", fontSize: "28px" }}>
        Edit Roles
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
        <Formik onSubmit={handleFormSubmit} initialValues={initialValues}>
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
                    <FormLabel
                      sx={{
                        color: "black",
                        marginBottom: "8px",
                        fontSize: "18px",
                        fontWeight: "bold",
                      }}>
                      Description
                    </FormLabel>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="text"
                      placeholder="Masukkan Nama"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.description}
                      name="description"
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
                          onChange={() =>
                            handleCheckboxChange(
                              checkbox.id,
                              values,
                              setFieldValue
                            )
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
                      marginTop: "25px",
                      marginBottom: "8px",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}>
                    Permissions
                  </FormLabel>
                  <Masonry columns={3} spacing={2}>
                    {selectedResources.map((resource, index) => (
                      <Paper key={resource}>
                        <StyledAccordion
                          expanded={expanded === index}
                          onChange={(e, expanded) => toggleAccordion(index)}
                          TransitionProps={{ unmountOnExit: true }}
                          sx={{ minHeight: "15px", width: "auto" }}>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>
                              {" "}
                              <strong>{resource}</strong>
                              <br />
                              {expanded !== index &&
                                values.permissions[index].grants.map((a, i) => (
                                  <span key={i}>
                                    {values.permissions[index].grants[i].action}
                                    <span style={{ fontSize: "10px" }}>
                                      {
                                        values.permissions[index].grants[i]
                                          .possession
                                      }{" "}
                                    </span>
                                  </span>
                                ))}
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
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-evenly",
                                }}>
                                <label>Actions:</label>
                                <label> Possession </label>
                              </div>
                              {actionOptions.map(
                                (actionOption, actionIndex) => (
                                  <div
                                    key={actionIndex}
                                    style={{
                                      display: "block",
                                      width: "100%",
                                    }}>
                                    <Stack
                                      direction="row"
                                      spacing={1}
                                      alignItems="center">
                                      <label>
                                        <Field
                                          type="checkbox"
                                          name={`permissions[${index}].grants[${actionIndex}].action`}
                                          checked={
                                            values.permissions[index].grants[
                                              actionIndex
                                            ].action === actionOption
                                              ? true
                                              : false
                                          }
                                          onChange={(event) => {
                                            if (event.target.checked)
                                              setFieldValue(`permissions[${index}].grants[${actionIndex}]`, {
                                                action: event.target.value,
                                                possession: "own",
                                                attributes: []
                                              });
                                            else
                                            setFieldValue(`permissions[${index}].grants[${actionIndex}]`, {
                                              action: "",
                                              possession: "",
                                              attributes: []
                                            });
                                          }}
                                          value={actionOption}
                                        />
                                        {actionOption}
                                      </label>
                                      {values.permissions[index].grants[
                                        actionIndex
                                      ].action === actionOption && (
                                        <>
                                          <Switch
                                            name={`permissions[${index}].grants[${actionIndex}].possession`}
                                            value={
                                              values.permissions[index].grants[
                                                actionIndex
                                              ].possession
                                            }
                                            checked={
                                              values.permissions[index].grants[
                                                actionIndex
                                              ].possession === "any"
                                                ? true
                                                : false
                                            }
                                            onChange={(event, checked) => {
                                              setFieldValue(
                                                `permissions[${index}].grants[${actionIndex}].possession`,
                                                checked ? "any" : "own"
                                              );
                                            }}
                                          />
                                          <Typography>
                                            {
                                              values.permissions[index].grants[
                                                actionIndex
                                              ].possession
                                            }
                                          </Typography>
                                          <ToggleButton
                                            value={
                                              values.permissions[index].grants[
                                                actionIndex
                                              ]
                                            }
                                            onClick={() =>
                                              toggleAttr(
                                                `permissions[${index}].grants[${actionIndex}].attributes`
                                              )
                                            }
                                            sx={{
                                              border: "none",
                                              "&:hover": {
                                                backgroundColor: "transparent",
                                              },
                                            }}>
                                            <ExpandMoreIcon
                                              style={{
                                                transform:
                                                  mountAttributes.includes(
                                                    `permissions[${index}].grants[${actionIndex}].attributes`
                                                  )
                                                    ? "rotate(180deg)"
                                                    : "none",
                                              }}
                                            />
                                          </ToggleButton>
                                        </>
                                      )}
                                    </Stack>
                                    {mountAttributes.includes(
                                      `permissions[${index}].grants[${actionIndex}].attributes`
                                    ) && (
                                      <SelectBox
                                        name={`permissions[${index}].grants[${actionIndex}].attributes`}
                                        onChange={(selectedOption) => {
                                          if (
                                            values.permissions[index] &&
                                            values.permissions[index].grants[
                                              actionIndex
                                            ]
                                          ) {
                                            setFieldValue(
                                              `permissions[${index}].grants[${actionIndex}].attributes`,
                                              selectedOption.map(
                                                ({ value }) => ({ attr: value })
                                              )
                                            );
                                          }
                                        }}
                                        placeholder="Hide Attributes: "
                                        value={
                                          values.permissions[index]?.grants[
                                            actionIndex
                                          ]?.attributes.map(({ attr }) => ({
                                            value: attr,
                                            label: attr,
                                          })) || null
                                        }
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

export default EditRoles;
