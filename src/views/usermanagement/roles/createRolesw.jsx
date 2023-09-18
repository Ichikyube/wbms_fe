import React, { Suspense, lazy, useState, useEffect, useRef } from "react";
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
import * as RolesAPI from "../../../api/roleApi";
import SelectBox from "../../../components/selectbox";
import { dtAttrJson } from "../../../data/attributeListObj";
import { useMultiStepForm } from "./hooks/useMultiForm";

const FirstForm = lazy(() => import("./forms/role"));
const SecondForm = lazy(() => import("./forms/permissions"));
const FinishForm = lazy(() => import("./forms/finish"));

const CreateRoles = ({ isOpen, onClose }) => {
  const [expanded, setExpanded] = useState(null);

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
  const [grants, setGrants] = useState(
    actionOptions.map((action, index) => ({
      action: action,
      possession: possesionList[index],
      attributes: [],
    }))
  );
  const [permissions, setPermissions] = useState({ resource: "", grants });
  const generateInitialValues = (permissions) => ({
    name: "",
    description: "",
    permissions,
  });
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

  useEffect(() => {
    setPermissions(selectedResources.map((resource) => ({ resource, grants })));
    setAttrOptions(
      Object.keys(dtAttrJson)
        .filter((resource) => selectedResources.includes(resource))
        .reduce((obj, key) => {
          obj[key] = dtAttrJson[key];
          return obj;
        }, {})
    );
  }, [selectedResources, grants]);

  // Create
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (!isLastStep) return next();
    // alert(JSON.stringify(data));
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
    backgroundColor: "#fff",
    color: theme.palette.text.secondary,
    transition: "max-width 0.3s ease-in-out",
  }));

  const { steps, currentStepIndex, step, isFirstStep, isLastStep, back, next } =
    useMultiStepForm([
      <FirstForm />,
      <SecondForm  />,
      <FinishForm />,
    ]);
    console.log(FirstForm)
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
          enableReinitialize
          onSubmit={handleSubmit}
          initialValues={generateInitialValues(permissions)}
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
              <div className="page-wrapper">
                <div
                  style={{
                    position: "absolute",
                    top: ".5rem",
                    right: ".5rem",
                  }}>
                  {currentStepIndex + 1}/{steps.length}
                </div>
                {step}
                <div
                  style={{
                    marginTop: "1rem",
                    display: "flex",
                    gap: ".5rem",
                    justifyContent: "flex-end",
                  }}>
                  {!isFirstStep && (
                    <button type="button" onClick={back}>
                      Back
                    </button>
                  )}
                  <button type="submit"  onClick={next}>
                    {isLastStep ? "Finish" : "Next"}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoles;

// const pageStage = useSelector((state) => state.FormStage);
// this.state = {
//   step: 1,
//   roleName: "",
//   permissions: [],
// };
// nextStep = () => {
//   this.setState((prevState) => ({ step: prevState.step + 1 }));
// };

// prevStep = () => {
//   this.setState((prevState) => ({ step: prevState.step - 1 }));
// };

// handleRoleNameChange = (event) => {
//   this.setState({ roleName: event.target.value });
// };

// handlePermissionsChange = (event) => {
//   const selectedPermissions = Array.from(
//     event.target.selectedOptions,
//     (option) => option.value
//   );
//   this.setState({ permissions: selectedPermissions });
// };
// function updateFields(fields: Partial<FormData>) {
//   setData((prev) => ({ ...prev, ...fields }));
// }

// const { steps, currentStepIndex, step, isFirstStep, isLastStep, back, next } =
//   useMultiStepForm([
//     <UserForm {...data} updateFields={updateFields} />,
//     <AddressForm {...data} updateFields={updateFields} />,
//     <AccountForm {...data} updateFields={updateFields} />,
//   ]);






{/* When adding/removing components, update the progress bar below */}
{/* <LazyLoad once>
<div className="progressbar">
  <div
    className={
      pageStage === 1
        ? "progress-step progress-step-active"
        : "progress-step"
    }
    data-title="User"></div>
  <div
    className={
      pageStage === 2
        ? "progress-step progress-step-active"
        : "progress-step"
    }
    data-title="Privacy"></div>
  <div
    className={
      pageStage === 3
        ? "progress-step progress-step-active"
        : "progress-step"
    }
    data-title="Done"></div>
</div>
</LazyLoad>
<div
style={{ position: "absolute", top: ".5rem", right: ".5rem" }}>
{currentStepIndex + 1}/{steps.length}
</div>
{step}
<div
style={{
  marginTop: "1rem",
  display: "flex",
  gap: ".5rem",
  justifyContent: "flex-end",
}}>
{!isFirstStep && (
  <button type="button" onClick={back}>
    Back
  </button>
)}
<button type="submit">{isLastStep ? "Finish" : "Next"}</button>
</div>
<div className="page-wrapper">
{pageStage === 1 && (
  // Signup Page
  <LazyLoad once>
    <div className="wrap">
      <FormUserSignup
        pageTitle={"User Form:"} // form page stage title
        submitButtonText={"Next"} // submit next button display text
        previousButton={false} // show/hide previous button
      />
    </div>
  </LazyLoad>
)}

{pageStage === 2 && (
  // Privacy Page
  <LazyLoad once>
    <div className="wrap">
      <FormUserPrivacy
        pageTitle={"Privacy Form:"} // form page stage title
        submitButtonText={"Next"} // submit next button display text
        previousButton={true} // show/hide previous button
      />
    </div>
  </LazyLoad>
)}

{pageStage === 3 && (
  // Completion Page
  <LazyLoad once>
    <div className="wrap">
      <FormUserCompleted
        pageTitle={"Success!"} // form page stage title
        successMessage={
          "Please verify your email address, you should have recieved an email from us already!"
        } // page success message
      />
    </div>
  </LazyLoad>
)}
</div> */}