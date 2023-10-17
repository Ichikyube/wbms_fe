import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./style/style.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  FormControl,
  FormLabel,
  IconButton,
  TextareaAutosize,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { format, addDays, addHours } from "date-fns";
import { Formik } from "formik";
import { grey } from "@mui/material/colors";
import moment from "moment";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useTimescape, $NOW } from "timescape/react";
import {
  useFetchRequestsQuery,
  useCreateRequestMutation,
} from "../../../slices/requestConfigsSlice";
import { createNotificationAsync } from "../../../slices/notificationSlice";

const CreateRequestConfig = ({ isRequestOpen, onClose, dtConfig }) => {
  const dispatch = useDispatch();
  const { refetch } = useFetchRequestsQuery();
  const { userInfo } = useSelector((state) => state.app);
  const groupMap = useSelector((state) => state.groupMapping);
  const [createRequest, { isLoading, isSuccess }] = useCreateRequestMutation();
  const [isCopied, setIsCopied] = useState(false);
  const [initialValues, setInitialValue] = useState({
    configId: dtConfig?.id,
    name: dtConfig?.name,
    schedule: null,
  });
  const [nextSchedule, setNextSchedule] = useState(new Date());
  const [timeReceipt, setTimeReceipt] = useState("");
  const { getRootProps, getInputProps } = useTimescape({
    minDate: $NOW,
    date: nextSchedule,
    wrapAround: false,
    onChangeDate: setNextSchedule,
  });
  const handleCopy = () => {
    setIsCopied(true);
  };
  const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
    values["schedule"] = new Date(nextSchedule);

    try {
      await createRequest(values);
      await refetch();
      toast.success("Data Berhasil Dibuat");
      const notificationData = {
        photo: userInfo.profilePic,
        sender: userInfo.name,
        message: `Meminta persetujuan untuk mengaktifkan ${dtConfig.name}`,
        target: Object.keys(groupMap).filter((id => groupMap[id] === 'PJ1')),
        configRequestId: dtConfig.id
      };
      dispatch(createNotificationAsync(notificationData))
        .unwrap()
        .then((createdNotification) => {
          console.log("Notification sended:", createdNotification);
        })
        .catch((error) => {
          // Handle failure (error in creating notification)
          console.error("Error sending notification:", error);
        });
    } catch (error) {
      console.error("Data Gagal Dibuat:", error);
      toast.error("Data Gagal Dibuat: " + error.message);
      // Tangani error atau tampilkan pesan error
    } finally {
      setSubmitting(false);
      refetch();
      resetForm();
      onClose("", false);
    }
  };

  useEffect(() => {
    setTimeReceipt(
      `Perkiraan request akan berlaku mulai ${nextSchedule} hingga ${new Date(
        new Date(nextSchedule).getTime() + dtConfig?.lifespan * 1000
      )}`
    );
  }, [nextSchedule, dtConfig]);

  return (
    <Dialog
      open={isRequestOpen}
      fullWidth
      maxWidth="md"
      onClose={() => onClose("", false)}>
      <DialogTitle
        sx={{ color: "white", backgroundColor: "black", fontSize: "27px" }}>
        Request Use Config
        <IconButton
          sx={{
            color: "white",
            position: "absolute",
            right: "10px",
            top: "15px",
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
                <FormControl sx={{ gridColumn: "span 2" }}>
                  <FormLabel
                    sx={{
                      marginBottom: "8px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}>
                    Nama Konfig
                  </FormLabel>

                  <TextField
                    variant="outlined"
                    id="name-input"
                    name="name"
                    type="text"
                    placeholder="Masukkan Nama...."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={initialValues.name}
                    inputProps={{ readOnly: true }}
                    sx={{ backgroundColor: "whitesmoke" }}
                    error={!!touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                  />
                </FormControl>
                <FormControl sx={{ gridColumn: "span 2" }}>
                  <FormLabel
                    sx={{
                      marginBottom: "8px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}>
                    Dijadwalkan Pada
                  </FormLabel>
                  <div
                    className="timescape"
                    onChange={console.log(values.name)}
                    id="schedule-input"
                    name="schedule"
                    {...getRootProps()}
                    value={
                      values.schedule
                        ? format(
                            new Date(values.schedule),
                            "yyyy-MM-dd'T'HH:mm"
                          )
                        : ""
                    }>
                    <input {...getInputProps("days")} />
                    <span>/</span>
                    <input {...getInputProps("months")} />
                    <span>/</span>
                    <input {...getInputProps("years")} />
                    <span className="separator">&nbsp;</span>
                    <input {...getInputProps("hours")} />
                    <span>:</span>
                    <input {...getInputProps("minutes")} />
                  </div>
                </FormControl>
              </Box>
              <div className="form-group row d-flex align-items-sm-center">
                <div className="col-sm-2 text-sm-right">
                  <span className="col-form-label">
                    <strong>timeReceipt</strong>
                  </span>
                </div>

                <div className="col-sm-8">
                  <TextareaAutosize
                    aria-label="minimum height"
                    minRows={3}
                    placeholder="Minimum 3 rows"
                    className={`form-control rrule ${
                      isCopied ? "rrule-copied" : "rrule-not-copied"
                    }`}
                    value={timeReceipt}
                    readOnly
                  />
                </div>

                <div className="col-sm-2">
                  <CopyToClipboard text={timeReceipt} onCopy={handleCopy}>
                    <button
                      type="button"
                      aria-label="Copy generated RRule"
                      className={`btn ${
                        isCopied ? "btn-secondary" : "btn-primary"
                      } float-right`}>
                      {isCopied ? "Copied" : "Copy"}
                    </button>
                  </CopyToClipboard>
                </div>
              </div>
              <Box display="flex" mt={2} ml={3}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: grey[700],
                    color: "white",
                  }}
                  onClick={() => {
                    onClose("", false);
                  }}>
                  Cancel
                </Button>
                <Box ml="auto" mr={3}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      color: "white",
                    }}>
                    Simpan
                  </Button>
                </Box>
              </Box>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};
export default CreateRequestConfig;
