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
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { Formik } from "formik";
import * as yup from "yup";
import { grey } from "@mui/material/colors";
import * as RolesAPI from "../../../api/roleApi";

const CreateRoles = ({ isOpen, onClose }) => {
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
        sx={{ color: "black", backgroundColor: "white", fontSize: "28px" }}
      >
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
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
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
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
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
                  }}
                >
                  Role Permissions :
                </FormLabel>
                <FormControl
                  sx={{
                    gridColumn: "span 4",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <FormLabel
                    sx={{
                      color: "black",
                      fontWeight: "bold",
                      fontSize: "18px",
                    }}
                  >
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
                          }}
                        >
                          Pilih Semua
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
                  }}
                >
                  <FormLabel
                    sx={{
                      color: "black",

                      fontSize: "18px",
                    }}
                  >
                    Transaksi PKS
                  </FormLabel>
                  <FormControlLabel
                    sx={{ marginLeft: "auto" }}
                    control={
                      <Checkbox
                        checked={transactionChecked.pks}
                        onChange={handleTransactionChange("pks")}
                      />
                    }
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Read
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ marginLeft: "88px", marginRight: "88px" }}
                    control={
                      <Checkbox
                        checked={transactionChecked.pks}
                        onChange={handleTransactionChange("pks")}
                      />
                    }
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Create/Edit/Delete
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
                  }}
                >
                  <FormLabel
                    sx={{
                      color: "black",

                      fontSize: "18px",
                    }}
                  >
                    Transaksi T-30
                  </FormLabel>
                  <FormControlLabel
                    sx={{ marginLeft: "auto" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Read
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ marginLeft: "88px", marginRight: "88px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Create/Edit/Delete
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
                  }}
                >
                  <FormLabel
                    sx={{
                      color: "black",

                      fontSize: "18px",
                    }}
                  >
                    Transaksi Labanan
                  </FormLabel>
                  <FormControlLabel
                    sx={{ marginLeft: "auto" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Read
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ marginLeft: "88px", marginRight: "88px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Create/Edit/Delete
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
                  }}
                >
                  <FormLabel
                    sx={{
                      color: "black",

                      fontSize: "18px",
                    }}
                  >
                    Report
                  </FormLabel>
                  <FormControlLabel
                    sx={{ marginLeft: "auto" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Read
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ marginLeft: "88px", marginRight: "88px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Create/Edit/Delete
                        </Typography>
                      </>
                    }
                  />
                </FormControl>
                <FormLabel
                  sx={{
                    color: "black",
                    fontSize: "18px",
                    fontWeight: "bold",
                    marginBottom: "5px",
                  }}
                >
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
                  }}
                >
                  <FormLabel
                    sx={{
                      color: "black",

                      fontSize: "18px",
                    }}
                  >
                    Province
                  </FormLabel>
                  <FormControlLabel
                    sx={{ marginLeft: "auto" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Read
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ marginLeft: "88px", marginRight: "88px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Create/Edit/Delete
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
                  }}
                >
                  <FormLabel
                    sx={{
                      color: "black",

                      fontSize: "18px",
                    }}
                  >
                    City
                  </FormLabel>
                  <FormControlLabel
                    sx={{ marginLeft: "auto" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Read
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ marginLeft: "88px", marginRight: "88px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Create/Edit/Delete
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
                  }}
                >
                  <FormLabel
                    sx={{
                      color: "black",

                      fontSize: "18px",
                    }}
                  >
                    Company
                  </FormLabel>
                  <FormControlLabel
                    sx={{ marginLeft: "auto" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Read
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ marginLeft: "88px", marginRight: "88px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Create/Edit/Delete
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
                  }}
                >
                  <FormLabel
                    sx={{
                      color: "black",

                      fontSize: "18px",
                    }}
                  >
                    Sites
                  </FormLabel>
                  <FormControlLabel
                    sx={{ marginLeft: "auto" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Read
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ marginLeft: "88px", marginRight: "88px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Create/Edit/Delete
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
                  }}
                >
                  <FormLabel
                    sx={{
                      color: "black",

                      fontSize: "18px",
                    }}
                  >
                    Customer Type
                  </FormLabel>
                  <FormControlLabel
                    sx={{ marginLeft: "auto" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Read
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ marginLeft: "88px", marginRight: "88px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Create/Edit/Delete
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
                  }}
                >
                  <FormLabel
                    sx={{
                      color: "black",

                      fontSize: "18px",
                    }}
                  >
                    Customer Group
                  </FormLabel>
                  <FormControlLabel
                    sx={{ marginLeft: "auto" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Read
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ marginLeft: "88px", marginRight: "88px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Create/Edit/Delete
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
                  }}
                >
                  <FormLabel
                    sx={{
                      color: "black",

                      fontSize: "18px",
                    }}
                  >
                    Customer
                  </FormLabel>
                  <FormControlLabel
                    sx={{ marginLeft: "auto" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Read
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ marginLeft: "88px", marginRight: "88px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Create/Edit/Delete
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
                  }}
                >
                  <FormLabel
                    sx={{
                      color: "black",

                      fontSize: "18px",
                    }}
                  >
                    Mill
                  </FormLabel>
                  <FormControlLabel
                    sx={{ marginLeft: "auto" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Read
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ marginLeft: "88px", marginRight: "88px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Create/Edit/Delete
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
                  }}
                >
                  <FormLabel
                    sx={{
                      color: "black",

                      fontSize: "18px",
                    }}
                  >
                    Weighbridge
                  </FormLabel>
                  <FormControlLabel
                    sx={{ marginLeft: "auto" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Read
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ marginLeft: "88px", marginRight: "88px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Create/Edit/Delete
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
                  }}
                >
                  <FormLabel
                    sx={{
                      color: "black",

                      fontSize: "18px",
                    }}
                  >
                    Product Group
                  </FormLabel>
                  <FormControlLabel
                    sx={{ marginLeft: "auto" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Read
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ marginLeft: "88px", marginRight: "88px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Create/Edit/Delete
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
                  }}
                >
                  <FormLabel
                    sx={{
                      color: "black",

                      fontSize: "18px",
                    }}
                  >
                    Product
                  </FormLabel>
                  <FormControlLabel
                    sx={{ marginLeft: "auto" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Read
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ marginLeft: "88px", marginRight: "88px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Create/Edit/Delete
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
                  }}
                >
                  <FormLabel
                    sx={{
                      color: "black",

                      fontSize: "18px",
                    }}
                  >
                    Storage Tank
                  </FormLabel>
                  <FormControlLabel
                    sx={{ marginLeft: "auto" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Read
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ marginLeft: "88px", marginRight: "88px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Create/Edit/Delete
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
                  }}
                >
                  <FormLabel
                    sx={{
                      color: "black",

                      fontSize: "18px",
                    }}
                  >
                    Driver
                  </FormLabel>
                  <FormControlLabel
                    sx={{ marginLeft: "auto" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Read
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ marginLeft: "88px", marginRight: "88px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Create/Edit/Delete
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
                  }}
                >
                  <FormLabel
                    sx={{
                      color: "black",

                      fontSize: "18px",
                    }}
                  >
                    Transport Vehicle
                  </FormLabel>
                  <FormControlLabel
                    sx={{ marginLeft: "auto" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Read
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    sx={{ marginLeft: "88px", marginRight: "88px" }}
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          sx={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: "grey",
                          }}
                        >
                          Create/Edit/Delete
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
                  }}
                >
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
                  }}
                >
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
