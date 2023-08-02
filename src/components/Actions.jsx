import React from "react";
import Box from "@mui/material/Box";
import { blue, green, red } from "@mui/material/colors";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ActionCellRenderer = ({ value }) => {
  const handleView = (id) => {
    // Handle view action
    console.log("Viewing item with id:", id);
  };

  const handleEdit = (id) => {
    // Handle edit action
    console.log("Editing item with id:", id);
  };

  const handleDelete = (id) => {
    // Handle delete action
    console.log("Deleting item with id:", id);
  };

  return (
    <Box display="flex" justifyContent="center">
      <Box
        width="100%"
        display="flex"
        m="0 3px"
        bgcolor={blue[400]}
        borderRadius="5px"
        padding="10px 10px"
        justifyContent="center"
        color="white"
      >
        <button
          onClick={() => handleView(value)}
          style={{
            color: "white",
            textDecoration: "none",
            cursor: "pointer",
            border: "none",
            background: "none",
          }}
        >
          <VisibilityOutlinedIcon />
        </button>
      </Box>

      <Box
        width="100%"
        display="flex"
        m="0 3px"
        bgcolor={green[400]}
        borderRadius="5px"
        padding="10px 10px"
        justifyContent="center"
        color="white"
      >
        <button
          onClick={() => handleEdit(value)}
          style={{
            color: "white",
            textDecoration: "none",
            cursor: "pointer",
            border: "none",
            background: "none",
          }}
        >
          <EditIcon />
        </button>
      </Box>

      <Box
        width="100%"
        display="flex"
        m="0 3px"
        bgcolor={red[500]}
        borderRadius="5px"
        padding="10px 10px"
        justifyContent="center"
        color="white"
      >
        <button
          onClick={() => handleDelete(value)}
          style={{
            color: "white",
            textDecoration: "none",
            cursor: "pointer",
            border: "none",
            background: "none",
          }}
        >
          <DeleteIcon />
        </button>
      </Box>
    </Box>
  );
};

export default ActionCellRenderer;
