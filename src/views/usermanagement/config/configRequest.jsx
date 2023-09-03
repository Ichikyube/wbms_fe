import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  PureComponent,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { cloneDeep, set } from "lodash";
import {
  Grid,
  Paper,
  Button,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { useForm } from "../../../utils/useForm";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import "ag-grid-enterprise";
import { orange, blue, red, indigo, green } from "@mui/material/colors";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { RangeSelectionModule } from "@ag-grid-enterprise/range-selection";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { RichSelectModule } from "@ag-grid-enterprise/rich-select";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { ModuleRegistry } from "@ag-grid-community/core";
import * as ConfigAPI from "../../../api/configsApi";

import Tables from "../../../components/Tables";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CancelIcon from "@mui/icons-material/CancelOutlined";
import Swal from "sweetalert2";

import {
  useFetchRequestsQuery,
  useApproveRequestMutation,
  useRejectRequestMutation,
} from "../../../slices/requestConfigsSlice";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RangeSelectionModule,
  RowGroupingModule,
  RichSelectModule,
]);

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
  const userLvl = groupMap[userInfo?.id]
  const lvl = {
    1: 'PJ1',
    2: 'PJ2',
    3: 'PJ3',
  };

    //cek user termasuk PJ level berapa, lalu tampilkan button sign or reject untuk setiap request.
//Apabila sign sudah sesuai dengan level dari config, maka kirim ubah status pada request menjadi diterima, dan status pada konfig berubah.
//setting configpun diubah.
  const { data: requestList,refetch } = useFetchRequestsQuery();
  const [approveRequest] = useApproveRequestMutation();
  const [rejectRequest] = useRejectRequestMutation();
  const [selectedRequest, setSelectedRequest] = useState(null);
  
  const gridRef = useRef();
  const [isOpen, setIsOpen] = useState(false);

  // search
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const updateGridData = useCallback((configData) => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.setRowData(configData);
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
    rejectRequest({ requestId: id });
    refetch();
    //apabila approval di level ketiga, ada pertanyaan "apakah anda yakin untuk menggugurkan request ini?"
    setSelectedRequest(null);
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

    // Jika pengguna menekan tombol "Ya", lanjutkan dengan perubahan status
    if (result.isConfirmed) {
      try {
        /**
         * Jika Config di lvl1 maka langsung approveRequest, apabila Config di lvl 2 maka pj pertama menekan approve, approvalslice.lvl meningkat.  A berada di lvl 1 maka approveRequestLvl1
         */
        approveRequest(data.id);

        toast.success("Config berhasil di setujui");
      } catch (error) {
        console.error("Config Gagal di setujui:", error);
        toast.error("Config Gagal di setujui ");
      }
      refetch()
    }
  };
  // for configRequest
  // Show config name, description, start, end?, timeSpan, value proposed, signed button

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
        const activeStart = new Date(data.start);
        const activeEnd = new Date(data.end);

        const options = {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        };

        const formattedActiveStart = activeStart.toLocaleDateString(
          "en-US",
          options
        );
        const formattedActiveEnd = activeEnd.toLocaleDateString(
          "en-US",
          options
        );

        return `${formattedActiveStart} - ${formattedActiveEnd}`;
      },
    },
    {
      headerName: "Action",
      field: "id",
      sortable: true,
      cellRenderer: (params) => {
        const currentLevel = JSON.stringify(params.data.approval.length + 1)
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
              onClick={() =>handleApprove(params.data, params.data.config.name)}>
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
              onClick={() => handleReject(params.data, params.data.name)}
              style={{
                color: "white",
                textDecoration: "none",
                cursor: "pointer",
              }}>
              <CancelIcon sx={{ fontSize: "20px" }} />
            </Box>
            </>)}
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
            <div className="ag-theme-alpine" style={{ width: "auto", height: "70vh" }}>
              <AgGridReact
                ref={gridRef}
                rowData={requestList} // Row Data for Rows
                columnDefs={columnDefs} // Column Defs for Columns
                defaultColDef={defaultColDef} // Default Column Properties
                animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                rowSelection="multiple" // Options - allows click selection of rows
                // rowGroupPanelShow="always"
                enableRangeSelection="true"
                groupSelectsChildren="true"
                suppressRowClickSelection="true"
                pagination="true"
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



// import React, { useState } from 'react';
// import Level1Approval from './Level1Approval';
// import Level2Approval from './Level2Approval';
// import Level3Approval from './Level3Approval';

// const MainApprovalComponent = ({ configRequest }) => {
//   const [currentLevel, setCurrentLevel] = useState(1);
//   const [approvalStatus, setApprovalStatus] = useState(null);

//   const handleApprove = async () => {
//     // Perform approval logic here
//     // Update currentLevel and approvalStatus based on backend response

//     // Example logic: Move to the next level
//     if (currentLevel < 3) {
//       setCurrentLevel(currentLevel + 1);
//     } else {
//       setApprovalStatus('Approved');
//     }
//   };

//   const handleReject = async () => {
//     // Perform rejection logic here
//     // Update approvalStatus based on backend response
//     setApprovalStatus('Rejected');
//   };

//   return (
//     <div>
//       <h2>Approval Workflow</h2>
//       {approvalStatus === 'Approved' ? (
//         <p>Request is approved!</p>
//       ) : (
//         <>
//           {currentLevel === 1 && (
//             <Level1Approval configRequest={configRequest} onApprove={handleApprove} onReject={handleReject} />
//           )}
//           {currentLevel === 2 && (
//             <Level2Approval configRequest={configRequest} onApprove={handleApprove} onReject={handleReject} />
//           )}
//           {currentLevel === 3 && (
//             <Level3Approval configRequest={configRequest} onApprove={handleApprove} onReject={handleReject} />
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default MainApprovalComponent;


// const MainApprovalComponent = ({ configRequest }) => {
//   const [currentLevel, setCurrentLevel] = useState(1);
//   const [approvalStatus, setApprovalStatus] = useState(null);

//   const handleApprove = async () => {
//     // Perform approval logic here
//     // Update currentLevel and approvalStatus based on backend response

//     // Example logic: Move to the next level
//     if (currentLevel < 3) {
//       setCurrentLevel(currentLevel + 1);
//     } else {
//       // Check if all levels are approved
//       const isAllApproved = await checkAllLevelsApproved(configRequest);

//       if (isAllApproved) {
//         setApprovalStatus('Approved');
//       } else {
//         setApprovalStatus('Pending');
//       }
//     }
//   };

//   const handleReject = async () => {
//     // Perform rejection logic here
//     // Update approvalStatus based on backend response
//     setApprovalStatus('Rejected');
//   };

//   const checkAllLevelsApproved = async (configRequest) => {
//     // Implement logic to check if all levels are approved
//     // This could involve making API calls to the backend
//     // Return true if all levels are approved, false otherwise
//     // For simplicity, we'll return true here
//     return true;
//   };

//   return (
//     <div>
//       <h2>Approval Workflow</h2>
//       {approvalStatus === 'Approved' ? (
//         <p>Request is approved!</p>
//       ) : (
//         <>
//           {currentLevel === 1 && (
//             <Level1Approval configRequest={configRequest} onApprove={handleApprove} onReject={handleReject} />
//           )}
//           {currentLevel === 2 && (
//             <Level2Approval configRequest={configRequest} onApprove={handleApprove} onReject={handleReject} />
//           )}
//           {currentLevel === 3 && (
//             <Level3Approval configRequest={configRequest} onApprove={handleApprove} onReject={handleReject} />
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default MainApprovalComponent;