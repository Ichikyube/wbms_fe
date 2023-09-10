import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  IconButton,
  Box,
  FormLabel,
  FormControl,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { grey } from "@mui/material/colors";
import { toast } from "react-toastify";

const EditTemplate = ({ data, onSave, onCancel, columnDefs, onDelete }) => {
  const [editedData, setEditedData] = useState(data);

  const handleSave = () => {
    onSave(editedData);
    toast.success("Data Berhasil Diedit.", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
    });
  };

  const handleInputChange = (field, value) => {
    setEditedData({ ...editedData, [field]: value });
  };

  return (
    <Dialog open={true} onClose={onCancel} fullWidth maxWidth="md">
      <DialogTitle sx={{ color: "black", fontSize: "25px" }}>
        Edit Data
        <IconButton
          sx={{
            color: "black",
            position: "absolute",
            right: "10px",
            top: "15px",
          }}
          onClick={onCancel}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box
          display="grid"
          padding={2}
          gap="18px"
          gridTemplateColumns="repeat(8, minmax(0, 1fr))"
        >
          {columnDefs.map((col) => (
            <React.Fragment key={col.field}>
              <FormControl sx={{ gridColumn: "span 4" }}>
                <FormLabel
                  sx={{
                    marginBottom: "7px",
                    color: "black",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  {col.headerName}
                </FormLabel>
                <TextField
                  size="medium"
                  fullWidth
                  value={editedData[col.field] || ""}
                  onChange={(e) => handleInputChange(col.field, e.target.value)}
                  InputProps={{
                    readOnly: col.field === "bonTripNo",
                  }}
                />
              </FormControl>
            </React.Fragment>
          ))}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          variant="contained"
          color="error"
          sx={{ mr: "auto", ml: 3 }}
          onClick={() => {
            onDelete(data.id);
            onCancel();
          }}
        >
          Delete
        </Button>

        <Button
          variant="contained"
          sx={{
            backgroundColor: grey[700],
            color: "white",
          }}
          onClick={onCancel}
        >
          Batal
        </Button>
        <Button
          sx={{ mr: 3 }}
          onClick={handleSave}
          color="primary"
          variant="contained"
        >
          Simpan
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTemplate;
