import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
// import PropTypes from "prop-types";
// import { cloneDeep, set } from "lodash";
// import { useForm } from "../../../utils/useForm";
import {
  Grid,
  Paper,
  Button,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import "ag-grid-enterprise";
import { red, green } from "@mui/material/colors";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { RangeSelectionModule } from "@ag-grid-enterprise/range-selection";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { RichSelectModule } from "@ag-grid-enterprise/rich-select";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { ModuleRegistry } from "@ag-grid-community/core";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CancelIcon from "@mui/icons-material/CancelOutlined";
import Swal from "sweetalert2";
import moment from "moment";
import "moment/locale/id";
import {
  useFetchRequestsQuery,
  useApproveRequestMutation,
  useRejectRequestMutation,
} from "../../../slices/requestConfigsSlice";
import {
  createNotificationAsync,
  modifyNotificationAsync,
} from "../../../slices/notificationSlice";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RangeSelectionModule,
  RowGroupingModule,
  RichSelectModule,
]);
moment.locale("id");
const ConfigRequest = () => {
  // console.clear();
  const dispatch = useDispatch();
  /**
   * Pada tampilan configRequest.
   * Ketika config request berhasil dibuat, akan muncul notifikasi pada tampilan user yang terpilih sebagai matrix approval lvl pertama,
   * dan hanya user matrix approval lvl pertama yang dapat melihat request, ketika sudah di approve,
   * baru notifikasi muncul di user matrix approval lvl kedua, dan terlihat di halaman configRequest, begitu juga ke level 3.
   *
   * ketika PJ mengirim response apakah approve atau rejected, dikirim ke config-approval.
   * Ketika response di level pertama rejected, maka request status Rejected, apabila approved,
   * maka approval masuk ke level kedua, notifikasi masuk ke PJ2 untuk segera memberi response, seperti itu seterusnya hingga level 3.
   * Hanya apabila approval di semua level approve, maka status request berubah menjadi Approved, dan status config berubah menjadi selain default.
   */
  const groupMap = useSelector((state) => state.groupMapping);
  const { userInfo } = useSelector((state) => state.app);

  //cek user termasuk PJ level berapa, lalu tampilkan button sign or reject untuk setiap request.
  const userLvl = groupMap[userInfo?.id];
  const lvl = {
    1: "PJ1",
    2: "PJ2",
    3: "PJ3",
  };

  const { data: requestList, refetch } = useFetchRequestsQuery();

  const [approveRequest] = useApproveRequestMutation();
  const [rejectRequest] = useRejectRequestMutation();
  const [selectedRequest, setSelectedRequest] = useState(null);

  const gridRef = useRef();
  const [isOpen, setIsOpen] = useState(false);

  // search
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const updateGridData = useCallback((requestList) => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.setRowData(requestList);
    }
  }, []);

  useEffect(() => {
    if (requestList) {
      const filteredData = requestList.filter((config) => {
        const configData = Object.values(config).join(" ").toLowerCase();
        return configData.includes(searchQuery.toLowerCase());
      });
      setFilteredData(filteredData);
    }
  }, [searchQuery, requestList]);

  const handleReject = (id) => {
    //apabila approval di level ketiga, ada pertanyaan "apakah anda yakin untuk menggugurkan request ini?"
    Swal.fire({
      title: "Apakah Anda yakin untuk menggugurkan request ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, gugurkan",
      cancelButtonText: "Tidak, batalkan",
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          // Tindakan jika pengguna menekan "Ya"
          Swal.fire("Gugurkan!", "Request telah digugurkan.", "success");
          await rejectRequest(id);
          await refetch();
        }
      })
      .then(refetch());
    setSelectedRequest(null);
    refetch();
  };

  const handleApprove = async (data, name) => {
    // Tampilkan SweetAlert untuk konfirmasi
    const result = await Swal.fire({
      title: "Persetujuan",
      html: `Apakah Anda yakin ingin menyetujui <span style="font-weight: bold; font-size: "30px;"> ${name} ?</span> `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      try {
        await approveRequest(data.id);
        await refetch();

        console.log(data);
        await toast.success(
          data.approval.length + 1 >= data.config.lvlOfApprvl
            ? "Permintaan telah di setujui"
            : "Request naik 1 tingkat"
        );
        await refetch();
      } catch (error) {
        console.error("Config Gagal di setujui:", error);
        toast.error("Config Gagal di setujui ");
      }
    }
  };
  // Show config name, description, start, end?, value proposed, signed button
  const [columnDefs] = useState([
    {
      headerName: "No",
      field: "no",
      filter: true,
      sortable: true,
      hide: false,
      flex: 1,
      valueGetter: (params) => params.node.rowIndex + 1,
    },
    {
      headerName: " Config Name",
      field: "config.name",
      filter: true,
      sortable: true,
      hide: false,
      flex: 2,
    },
    {
      headerName: "Status",
      field: "status",
      filter: true,
      sortable: true,
      hide: false,
      flex: 1,
    },
    {
      headerName: "currentLvl",
      field: "status",
      filter: true,
      sortable: true,
      hide: false,
      flex: 1,
      valueGetter: (params) => JSON.stringify(params.data.approval.length + 1),
    },
    {
      headerName: "Active Time",
      filter: true,
      sortable: true,
      hide: false,
      flex: 3,
      valueGetter: (params) => {
        const { data } = params;

        console.log(data)
        const formattedActiveStart = moment(data.schedule).calendar();

        const formattedActiveEnd = moment(data.schedule)
          .add(data.config.lifespan, "seconds")
          .calendar();

        return `${formattedActiveStart} - ${formattedActiveEnd}`;
      },
    },
    {
      headerName: "Action",
      field: "id",
      sortable: true,
      cellRenderer: (params) => {
        const currentLevel = JSON.stringify(params.data.approval.length + 1);
        return (
          <Box display="flex" justifyContent="center">
            {userLvl === lvl[currentLevel] && (
              <>
                <Box //disabled={params.status === 'Accepted'}
                  width="25%"
                  display="flex"
                  m="0 3px"
                  bgcolor={green[500]}
                  borderRadius="25%"
                  justifyContent="center"
                  padding="10px 10px"
                  color="white"
                  style={{
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleApprove(params.data, params.data.config.name)
                  }>
                  <TaskAltIcon sx={{ fontSize: "20px" }} />
                </Box>

                <Box
                  width="25%"
                  display="flex"
                  m="0 3px"
                  bgcolor={red[500]}
                  borderRadius="25%"
                  padding="10px 10px"
                  justifyContent="center"
                  color="white"
                  onClick={() => handleReject(params.data.id)}
                  style={{
                    color: "white",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}>
                  <CancelIcon sx={{ fontSize: "20px" }} />
                </Box>
              </>
            )}
          </Box>
        );
      },
    },
  ]);
  const defaultColDef = {
    sortable: true,
    resizable: true,
    floatingFilter: false,
    filter: true,
  };
  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              mx: 3,
              mb: 5,
              mt: 2,
              borderTop: "5px solid #000",
              borderRadius: "10px 10px 10px 10px",
            }}>
            <div style={{ marginBottom: "5px" }}>
              <Box display="flex">
                <Typography fontSize="20px">WBMS Config Request</Typography>
              </Box>
              <hr sx={{ width: "100%" }} />
              <Box display="flex" pb={1}>
                <Box
                  display="flex"
                  borderRadius="5px"
                  ml="auto"
                  border="solid grey 1px">
                  <InputBase
                    sx={{ ml: 2, flex: 2, fontSize: "13px" }}
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />

                  <IconButton
                    type="button"
                    sx={{ p: 1 }}
                    onClick={() => {
                      const filteredData = requestList.filter((config) =>
                        config.name
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                      );
                      gridRef.current.api.setRowData(filteredData);
                    }}>
                    <SearchIcon sx={{ mr: "3px", fontSize: "19px" }} />
                  </IconButton>
                </Box>
              </Box>
            </div>
            <div
              className="ag-theme-alpine"
              style={{ width: "auto", height: "70vh" }}>
              <AgGridReact
                ref={gridRef}
                rowData={requestList} // Row Data for Rows
                columnDefs={columnDefs} // Column Defs for Columns
                defaultColDef={defaultColDef} // Default Column Properties
                animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                rowSelection="multiple" // Options - allows click selection of rows
                // rowGroupPanelShow="always"updateGridData
                enableRangeSelection="true"
                groupSelectsChildren="true"
                suppressRowClickSelection="true"
                // pagination="true"
                paginationAutoPageSize="true"
                groupDefaultExpanded="1"
              />
            </div>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default ConfigRequest;
