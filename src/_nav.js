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
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: "Jembatan Timbang (WB)",
  },
  {
    component: CNavGroup,
    name: "PKS",
    to: "/pks-transaction",
    icon: <MdCarRepair className="nav-icon" />,
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
      {
        component: CNavItem,
        name: "Backdate Template",
        to: "/backdateTemplate",
      },
    ],
  },
  {
    component: CNavGroup,
    name: "T30",
    to: "/base",
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
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
  },
  {
    component: CNavGroup,
    name: "Master Data",
    to: "/base",
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Province",
        to: "/md/province",
      },

      {
        component: CNavItem,
        name: "City",
        to: "/md/city",
      },
      {
        component: CNavItem,
        name: "Company",
        to: "/md/company",
      },
      {
        component: CNavItem,
        name: "Sites",
        to: "/md/site",
      },
      {
        component: CNavItem,
        name: "Customers Type",
        to: "/md/customertype",
      },
      {
        component: CNavItem,
        name: "Customer Group",
        to: "/md/customergroup",
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
      },
      {
        component: CNavItem,
        name: "Mill",
        to: "/md/mill",
      },
      {
        component: CNavItem,
        name: "Weighbridge",
        to: "/md/weighbridge",
      },
      {
        component: CNavItem,
        name: "Product Group",
        to: "/md/productgroup",
      },
      {
        component: CNavItem,
        name: "Product",
        to: "/md/product",
      },
      {
        component: CNavItem,
        name: "Storage Tank",
        to: "/md/storagetank",
      },
      {
        component: CNavItem,
        name: "Driver",
        to: "/md/driver",
      },
      {
        component: CNavItem,
        name: "Transport Vehicle",
        to: "/md/transportvehicle",
      },
    ],
  },
  {
    component: CNavTitle,
    name: "User Administration",
  },
  {
    component: CNavGroup,
    name: "Config",
    to: "/base",
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Config",
        to: "/config",
      },
      {
        component: CNavItem,
        name: "Config Request",
        to: "/configrequest",
      },
    ],
  },
  {
    component: CNavGroup,
    name: "User Management",
    icon: <CIcon icon={cilUserFollow} customClassName="nav-icon" />,
    to: "/base",
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
