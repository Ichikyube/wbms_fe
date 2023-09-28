import { lazy } from "react";

const Dashboard = lazy(() => import("./views/dashboard/Dashboard"));
const PksTransaction = lazy(() => import("./views/pages/PksTransaction"));
const DataTransaction = lazy(() => import("./views/dataTransaction"));

const BackdateFormTBS = lazy(() => import("./views/backdate/backdateFormTBS"));
const BackdateFormOthers = lazy(() =>
  import("./views/backdate/backdateFormOthers")
);
const BackdateTemplate = lazy(() =>
  import("./views/backdate/backdateTemplate")
);
const EditDataTransaction = lazy(() =>
  import("./views/dataTransaction/editDataTransaksi")
);
const ReportPksTransactions = lazy(() =>
  import("./views/reports/PksTransactions")
);
const PksManualTimbangMasuk = lazy(() =>
  import("./views/PksManualEntry/timbangMasuk")
);
const PksManualTimbangKeluar = lazy(() =>
  import("./views/PksManualEntry/timbangKeluar")
);

const PksManualCpoPko = lazy(() =>
  import("./views/PksManualEntry/manualentryCpoPko/timbangMasuk")
);

const Cities = lazy(() => import("./views/masterdata/cities"));
const Provinces = lazy(() => import("./views/masterdata/provinces"));
const Sites = lazy(() => import("./views/masterdata/sites"));
const Companies = lazy(() => import("./views/masterdata/companies"));
const BarcodeTypes = lazy(() => import("./views/masterdata/barcodetypes"));
const CustomerTypes = lazy(() => import("./views/masterdata/customertypes"));
const CustomerGroups = lazy(() => import("./views/masterdata/customergroups"));
const Customers = lazy(() => import("./views/masterdata/customers"));
const Mills = lazy(() => import("./views/masterdata/mills"));
const Weighbridges = lazy(() => import("./views/masterdata/weighbridges"));
const Productgroups = lazy(() => import("./views/masterdata/productgroups"));
const Products = lazy(() => import("./views/masterdata/products"));
const StorageTank = lazy(() => import("./views/masterdata/storagetanks"));
const Driver = lazy(() => import("./views/masterdata/driver"));
const Profile = lazy(() => import("./views/pages/profile"));
const Transportvehicle = lazy(() =>
  import("./views/masterdata/transportvehicles")
);
const UsersList = lazy(() => import("./views/usermanagement/userslist"));
const RolesList = lazy(() => import("./views/usermanagement/roles"));
const ConfigRequest = lazy(() =>
  import("./views/usermanagement/config/configRequest")
);
const Config = lazy(() => import("./views/usermanagement/config"));

const baseRoute = [
  { path: "/:id", exact: true, name: "Home" },
  { path: "/dashboard", name: "Dashboard", element: Dashboard },
  {
    path: "/profile",
    name: "Profile",
    element: Profile,
  },
  {
    path: "/md/barcodetype",
    name: "BarcodeType",
    element: BarcodeTypes,
  },
  {
    path: "/configrequest",
    name: "Config Request",
    element: ConfigRequest,
  },
  {
    path: "/config",
    name: "Config",
    element: Config,
  },
];

export const protectedRoute = [
  {
    path: "/pks-transaction",
    name: "PKS Transaction",
    element: PksTransaction,
    exact: true,
    resource: "Transaction",
  },
  {
    path: "/pks-ManualEntry-TimbangMasuk",
    name: "PKS  Manual Entry",
    element: PksManualTimbangMasuk,
    exact: true,
    resource: "Transaction",
  },
  {
    path: "/pks-ManualEntry-CpoPko-TimbangMasuk",
    name: "PKS  Manual Entry CPO / PKO",
    element: PksManualCpoPko,
    exact: true,
    resource: "Transaction",
  },
  {
    path: "/pks-ManualEntry-TimbangKeluar/:id",
    name: "PKS  Manual Entry",
    element: PksManualTimbangKeluar,
    exact: true,
    resource: "Transaction",
  },
  {
    path: "/reports/pks-transactions",
    name: "Report PKS Transactions",
    element: ReportPksTransactions,
    resource: "Transaction",
  },
  {
    path: "/data-transaction",
    name: "Data Transaction",
    element: DataTransaction,
    exact: true,
    resource: "Transaction",
  },

  {
    path: "/md/province",
    name: "Master Data Province",
    element: Provinces,
    resource: "Province",
  },
  {
    path: "/md/city",
    name: "Master Data City",
    element: Cities,
    resource: "City",
  },
  {
    path: "/md/company",
    name: "Master Data Company",
    element: Companies,
    resource: "Company",
  },
  {
    path: "/md/site",
    name: "Master Data Site",
    element: Sites,
    resource: "Site",
  },
  {
    path: "/md/customertype",
    name: "Master Data Customer Type",
    element: CustomerTypes,
    resource: "CustomerType",
  },
  {
    path: "/md/customergroup",
    name: "Master Data Customer Group",
    element: CustomerGroups,
    resource: "CustomerGroup",
  },
  {
    path: "/md/customer",
    name: "Master Data Customer",
    element: Customers,
    resource: "Customer",
  },
  {
    path: "/md/mill",
    name: "Master Data Mill",
    element: Mills,
    resource: "Mill",
  },
  {
    path: "/md/weighbridge",
    name: "Master Data Weighbridge",
    element: Weighbridges,
    resource: "Weighbridge",
  },
  {
    path: "/md/productgroup",
    name: "Master Data Product Group",
    element: Productgroups,
    resource: "ProductGroup",
  },
  {
    path: "/md/product",
    name: "Master Data Product",
    element: Products,
    resource: "Product",
  },
  {
    path: "/md/storagetank",
    name: "Master Data Storage Tank",
    element: StorageTank,
    resource: "StorageTank",
  },
  {
    path: "/md/driver",
    name: "Master Data Driver",
    element: Driver,
    resource: "Driver",
  },
  {
    path: "/md/transportvehicle",
    name: "Master Data Transport Vehicle",
    element: Transportvehicle,
    resource: "TransportVehicle",
  },
  {
    path: "/userslist",
    name: "Users List",
    element: UsersList,
    resource: "User",
  },
  {
    path: "/roleslist",
    name: "Roles List",
    element: RolesList,
    resource: "User",
  },
];

export const backdateFormRoutes = [
  {
    path: "/backdateFormTBS",
    name: "Backdate Form TBS",
    element: BackdateFormTBS,
    exact: true,
  },
  {
    path: "/backdateFormOthers",
    name: "Backdate Form Others",
    element: BackdateFormOthers,
    exact: true,
  },
];
export const backdateTemplateRoute = {
  path: "/backdateTemplate",
  name: "Backdate Template",
  element: BackdateTemplate,
  exact: true,
};

export const editTransactionRoute = [
  {
    path: "/edit-data-Transaction/:id",
    name: "Edit Data Transaction",
    element: EditDataTransaction,
    exact: true,
  },
];

export default baseRoute;
