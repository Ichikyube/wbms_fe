import { Box, Button } from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import Header from "../../components/Header";
import useSWR from "swr";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import Swal from "sweetalert2";

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}
const Products = () => {
  const { REACT_APP_WBMS_BACKEND_URL } = process.env;
  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const response = await fetch(
          `${REACT_APP_WBMS_BACKEND_URL}/products/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        console.log(data);
        Swal.fire("Deleted!", "Your data has been deleted.", "success").then(
          () => {
            window.location.reload();
          }
        );
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };
  const columns = [
    { field: "id", headerName: "#" },

    {
      field: "code",
      headerName: "code",
      flex: 1,
      cellClassName: "code-column--cell",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "productGroupId",
      headerName: "Product GroupId",
      flex: 1,
      cellClassName: "productGroupId-column--cell",
    },
    {
      field: "shortName",
      headerName: "Short Name",
      flex: 1,
      cellClassName: "shortName-column--cell",
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      cellClassName: "description-column--cell",
    },
    {
      field: "certification",
      headerName: "Certification",
      flex: 1,
      cellClassName: "certification-column--cell",
    },
    {
      headerName: "Actions",
      width: 200,
      renderCell: ({ row: { id } }) => {
        return (
          <Box display="flex" justifyContent="center">
            <Box
              width="100%"
              display="flex"
              m="0 3px"
    
              borderRadius="5px"
              padding="10px 10px"
              justifyContent="center"
              color="white"
            >
              <a
                href={`products/view/${id}`}
                style={{
                  color: "white",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                <Box>
                  <VisibilityOutlinedIcon />
                </Box>
              </a>
            </Box>
            <Box
              width="100%"
              display="flex"
              m="0 3px"
            
              borderRadius="5px"
              padding="10px 10px"
              justifyContent="center"
              color="white"
            >
              <a
                href={`products/edit/${id}`}
                style={{ color: "white", textDecoration: "none" }}
              >
                <Box>
                  <EditIcon />
                </Box>
              </a>
            </Box>

            <Box
              width="100%"
              display="flex"
              m="0 3px"
             
              borderRadius="5px"
              padding="10px 10px"
              justifyContent="center"
              color="white"
              onClick={() => handleDelete(id)}
              style={{
                color: "white",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              <DeleteIcon />
            </Box>
          </Box>
        );
      },
    },
  ];

  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data, error, isLoading } = useSWR(
    `${REACT_APP_WBMS_BACKEND_URL}/products`,
    fetcher
  );

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;
  console.log(data);
  return (
    <Box m="20px">
      <Header title="PRODUCTS" />

      <Box
        m="40px 0 0 0"
        height="71vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
        
          },
          "& .MuiDataGrid-footerContainer": {
          
          },
        }}
      >
        <Box display="flex" marginBottom="8px">
          <Box display="flex" class="create">
            <Button
              sx={{
             
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 10px",
                color: "white",
              }}
              href={`/products/create`}
              type="submit"
            >
              <AddBoxOutlinedIcon sx={{ mr: "5px" }} />
              Create Products
            </Button>
          </Box>
        </Box>

        <DataGrid
          rows={data.records}
          columns={columns}
          getRowId={(row) => row.id}
          components={{ Toolbar: CustomToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Products;
