import { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Button,
  Box,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import useSWR from "swr";
import {
  red,
  blue,
  green,
  yellow,
  purple,
  indigo,
  pink,
  teal,
  cyan,
  lime,
  orange,
  deepOrange,
} from "@mui/material/colors";
import "ag-grid-enterprise";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { RangeSelectionModule } from "@ag-grid-enterprise/range-selection";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { RichSelectModule } from "@ag-grid-enterprise/rich-select";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { ModuleRegistry } from "@ag-grid-community/core";
import * as React from "react";


ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RangeSelectionModule,
  RowGroupingModule,
  RichSelectModule,
]);

const ViewPermissions = ({ Permissions, onClose, isViewOpen }) => {
  // console.clear();
  const gridRef = useRef();
  const role = Permissions;

  const [showGrants, setShowGrants] = useState(null);
  const toggleGrants = (index) => {
    setShowGrants(index === showGrants ? null : index);
  };
  const permissionColors = [
    red[900],
    blue[900],
    green[900],
    yellow[900],
    purple[900],
    indigo[900],
    pink[900],
    lime[900],
    orange[900],
    deepOrange[900],
    cyan[900],
    teal[900],
  ];

  const permissionBgColors = [
    red[50],
    blue[50],
    green[50],
    yellow[50],
    purple[50],
    indigo[50],
    pink[50],
    lime[50],
    orange[50],
    deepOrange[50],
    cyan[50],
    teal[50],
  ];
  return (
    <Dialog open={isViewOpen} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          color: "black",
          backgroundColor: "white",
          fontSize: "25px",
          ml: 2,
        }}
      >
        Role :  <strong>{role.name}</strong>
        <IconButton
          sx={{
            color: "black",
            position: "absolute",
            right: "20px",
            top: "15px",
          }}
          onClick={() => {
            onClose("", false);
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            mx: 3,
            my: 7,
            borderTop: "5px solid #000",
            borderRadius: "10px 10px 10px 10px",
          }}
        >
          <div
            className="ag-theme-alpine"
            style={{ width: "auto", height: "auto" }}
          >
            <Box sx={{ px: 3, py: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                {role.permissions.map((permission, index) => (
                  <div
                    style={{
                      position: "relative",
                      marginBottom: "10px",
                      marginRight: "5px",
                    }}
                  >
                    <Chip
                      label={permission.resource}
                      variant="outlined"
                      style={{
                        margin: "4px",
                        position: "static",
                        fontWeight: "bold",
                        backgroundColor:
                          permissionBgColors[index % permissionBgColors.length],
                        color:
                          permissionColors[index % permissionColors.length],
                      }}
                      onClick={(e, showGrants) => toggleGrants(index)}
                    />
                    {showGrants === index && (
                      <Box
                        sx={{
                          border: 1,
                          p: 1,
                          bgcolor: "background.paper",
                          position: "absolute",
                          zIndex: 1,
                        }}
                      >
                        <h6>{permission.resource}</h6>
                        <ul>
                          {permission.grants.map((grant, index) => (
                            <li key={index}>
                              {grant.action}:{grant.possession}
                            </li>
                          ))}
                        </ul>
                      </Box>
                    )}
                  </div>
                ))}
              </Box>
            </Box>
          </div>
        </Paper>
      </DialogContent>
    </Dialog>
  );
};

export default ViewPermissions;
