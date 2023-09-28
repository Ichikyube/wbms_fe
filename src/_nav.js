import React from "react";
import CIcon from "@coreui/icons-react";
import { CNavGroup, CNavItem, CNavTitle } from "@coreui/react";

import {
  cilPuzzle,
  cilSpeedometer,
  cilClipboard,
  cilSettings,
  cilUserFollow,
} from "@coreui/icons";
import { MdCarRepair } from "react-icons/md";

const _nav = [
  {
    component: CNavItem,
    name: "Dashboard",
    to: "/dashboard",
    resource: "Base",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: "Jembatan Timbang (WB)",
    resource: "Base"
  },
  {
    component: CNavGroup,
    name: "PKS",
    to: "/pks-transaction",
    icon: <MdCarRepair className="nav-icon" />,
    resource: "Transaction",
    items: [
      {
        component: CNavItem,
        name: "Transaksi WB",
        to: "/pks-transaction",
      },
      {
        component: CNavItem,
        name: "Report",
        to: "/reports/pks-transactions",
      },
      {
        component: CNavItem,
        name: "Data Transaction",
        to: "/data-transaction",
      },
    ],
  },
  {
    component: CNavGroup,
    name: "T30",
    to: "/base",
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    resource: "Transaction",
    items: [
      {
        component: CNavItem,
        name: "Transaksi WB",
        to: "/wb/pks-transaction",
      },
      {
        component: CNavItem,
        name: "Report",
        to: "/base/breadcrumbs",
      },
    ],
  },
  {
    component: CNavGroup,
    name: "Labanan",
    to: "/base",
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    resource: "Transaction",
    items: [
      {
        component: CNavItem,
        name: "Transaksi WB",
        to: "/wb/pks-transaction",
      },
      {
        component: CNavItem,
        name: "Report",
        to: "/base/breadcrumbs",
      },
    ],
  },
  {
    component: CNavTitle,
    name: "Administrasi WBMS",
    resource: "Base",
  },
  {
    component: CNavGroup,
    name: "Master Data",
    to: "/base",
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
    resource: "Base",
    items: [
      {
        component: CNavItem,
        name: "Province",
        to: "/md/province",
        resource: "Province"
      },

      {
        component: CNavItem,
        name: "City",
        to: "/md/city",
        resource: "City"
      },
      {
        component: CNavItem,
        name: "Company",
        to: "/md/company",
        resource: "Company"
      },
      {
        component: CNavItem,
        name: "Site",
        to: "/md/site",
        resource: "Site"
      },
      {
        component: CNavItem,
        name: "Customers Type",
        to: "/md/customertype",
        resource: "CustomerType"
      },
      {
        component: CNavItem,
        name: "Customer Group",
        to: "/md/customergroup",
        resource: "CustomerGroup"
      },
      // {
      //   component: CNavItem,
      //   name: "Barcode Type",
      //   to: "/md/barcodetype",
      // },
      {
        component: CNavItem,
        name: "Customer",
        to: "/md/customer",
        resource: "Customer"
      },
      {
        component: CNavItem,
        name: "Mill",
        to: "/md/mill",
        resource: "Mill"
      },
      {
        component: CNavItem,
        name: "Weighbridge",
        to: "/md/weighbridge",
        resource: "Weighbridge"
      },
      {
        component: CNavItem,
        name: "Product Group",
        to: "/md/productgroup",
        resource: "ProductGroup"
      },
      {
        component: CNavItem,
        name: "Product",
        to: "/md/product",
        resource: "Product"
      },
      {
        component: CNavItem,
        name: "Storage Tank",
        to: "/md/storagetank",
        resource: "StorageTank"
      },
      {
        component: CNavItem,
        name: "Driver",
        to: "/md/driver",
        resource: "Driver"
      },
      {
        component: CNavItem,
        name: "Transport Vehicle",
        to: "/md/transportvehicle",
        resource: "TransportVehicle"
      },
    ],
  },
  {
    component: CNavTitle,
    name: "User Administration",
    resource: "Base",
  },
  {
    component: CNavGroup,
    name: "Config",
    to: "/base",
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    resource: "Base",
    items: [
      {
        component: CNavItem,
        name: "Config ",
        to: "/config",
      },
      {
        component: CNavItem,
        name: "Config Request ",
        to: "/configrequest",
      },
    ],
  },
  {
    component: CNavGroup,
    name: "User Management",
    icon: <CIcon icon={cilUserFollow} customClassName="nav-icon" />,
    to: "/base",
    resource: "User",
    items: [
      {
        component: CNavGroup,
        name: "Users",
        to: "/base",
        items: [
          {
            component: CNavItem,
            name: "Users List",
            to: "/userslist",
          },
        ],
      },
      {
        component: CNavGroup,
        name: "Roles",
        to: "/base",
        items: [
          {
            component: CNavItem,
            name: "Roles List",
            to: "roleslist",
          },
        ],
      },
    ],
  },
];

export default _nav;

export const backdateTemplateNav = {
  component: CNavItem,
  name: "Backdate Template",
  to: "/backdateTemplate",
};
