import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Grid,
  Paper,
  Button,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Formik } from "formik";
import useSWR from "swr";
import { red, blue } from "@mui/material/colors";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import "ag-grid-enterprise";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { RangeSelectionModule } from "@ag-grid-enterprise/range-selection";
import {
  RowGroupingModule,
  ValuesDropZonePanel,
} from "@ag-grid-enterprise/row-grouping";
import { RichSelectModule } from "@ag-grid-enterprise/rich-select";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { ModuleRegistry } from "@ag-grid-community/core";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

import Config from "../../../configs";
import * as TransactionAPI from "../../../api/transactionApi";

import PageHeader from "../../../components/PageHeader";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RangeSelectionModule,
  RowGroupingModule,
  RichSelectModule,
]);

const tType = 1;

const ReportPksTransactions = () => {
  return (
    <>
      <Typography
        sx={{ fontSize: "25px", fontWeight: "bold", mt: 2, mb: 3, ml: 2 }}
      >
        Profile
      </Typography>

      <Grid container spacing={1}>
        <Grid item xs={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              mx: 1,
              borderTop: "5px solid #000",
              borderRadius: "10px 10px 10px 10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
           
            }}
          >
            <div
              className="ag-theme-alpine "
              style={{ width: "auto", height: "50vh" }}
            >
              <AccountCircleOutlinedIcon sx={{ fontSize: "15rem", mt: 5 }} />
              <Typography
                sx={{ fontSize: "24px", fontWeight: "bold", mb: 1, ml: 6 }}
              >
                User name
              </Typography>
              <Typography sx={{ fontSize: "15px", mb: 6, ml: 11 }}>
                PKS
              </Typography>

              {/* <Button
                type="submit"
                fullwidth
                variant="contained"
                sx={{
                  backgroundColor: blue[700],
                  fontSize: "13px",
                  fontWeight: "bold",
                  color: "white",
                  paddingLeft: 10,
                  paddingRight: "0px"
                  
                }}
              >
                Edit Profile
              </Button> */}
            </div>
          </Paper>
        </Grid>
        <Grid item xs={9}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              mx: 1,
              borderTop: "5px solid #000",
              borderRadius: "10px 10px 10px 10px",
            }}
          >
            <div
              className="ag-theme-alpine"
              style={{ width: "auto", height: "50vh" }}
            ></div>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default ReportPksTransactions;
