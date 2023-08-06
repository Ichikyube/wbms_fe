import { lazy } from "react";

const Dashboard = lazy(() => import("./views/dashboard/Dashboard"));
const PksTransaction = lazy(() => import("./views/pages/PksTransaction"));
const ReportPksTransactions = lazy(() =>
  import("./views/reports/PksTransactions")
);
const PksTransactionManualOthers = lazy(() =>
  import("./views/PksManualEntry/manualentryothers/timbangMasuk")
);
const PksTransactionManualTbsInternal = lazy(() =>
  import("./views/PksManualEntry/manualentryTBSInternal/timbangMasuk")
);
const PksTransactionManualTbsEksternal = lazy(() =>
  import("./views/PksManualEntry/manualentryTBSEksternal/timbangMasuk")
);
const PksTransactionManualCpoPko = lazy(() =>
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
const ViewRole = lazy(() => import("./views/usermanagement/roles/viewRole"));
const Config = lazy(() => import("./views/usermanagement/config"));
const ConfigRequest = lazy(() => import("./views/usermanagement/config/configRequest"));

const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/dashboard", name: "Dashboard", element: Dashboard },
  {
    path: "/pks-transaction",
    name: "PKS Transaction",
    element: PksTransaction,
    exact: true,
  },
  {
    path: "/pks-transaction-ManualEntry-Others",
    name: "PKS Transaction Manual Entry Others",
    element: PksTransactionManualOthers,
    exact: true,
  },

  {
    path: "/pks-transaction-ManualEntry-TBSInternal",
    name: "PKS Transaction Manual Entry TBS Internal",
    element: PksTransactionManualTbsInternal,
    exact: true,
  },
  {
    path: "/pks-transaction-ManualEntry-TBSEksternal",
    name: "PKS Transaction Manual Entry TBS Eksternal",
    element: PksTransactionManualTbsEksternal,
    exact: true,
  },
  {
    path: "/pks-transaction-ManualEntry-CpoPko",
    name: "PKS Transaction Manual Entry CPO PKO",
    element: PksTransactionManualCpoPko,
    exact: true,
  },
  {
    path: "/reports/pks-transactions",
    name: "Report PKS Transactions",
    element: ReportPksTransactions,
  },

  {
    path: "/profile",
    name: "Profile",
    element: Profile,
  },
  {
    path: "/md/province",
    name: "Master Data Province",
    element: Provinces,
  },
  {
    path: "/md/city",
    name: "Master Data City",
    element: Cities,
  },
  {
    path: "/md/company",
    name: "Master Data Company",
    element: Companies,
  },
  {
    path: "/md/site",
    name: "Master Data Site",
    element: Sites,
  },

  {
    path: "/md/customertype",
    name: "Master Data Customer Type",
    element: CustomerTypes,
  },
  {
    path: "/md/customergroup",
    name: "Master Data Customer Group",
    element: CustomerGroups,
  },
  {
    path: "/md/barcodetype",
    name: "BarcodeType",
    element: BarcodeTypes,
  },
  {
    path: "/md/customer",
    name: "Master Data Customer",
    element: Customers,
  },
  {
    path: "/md/mill",
    name: "Master Data Mill",
    element: Mills,
  },
  {
    path: "/md/weighbridge",
    name: "Master Data Weighbridge",
    element: Weighbridges,
  },
  {
    path: "/md/productgroup",
    name: "Master Data Product Group",
    element: Productgroups,
  },
  {
    path: "/md/product",
    name: "Master Data Product",
    element: Products,
  },
  {
    path: "/md/storagetank",
    name: "Master Data Storage Tank",
    element: StorageTank,
  },
  {
    path: "/md/driver",
    name: "Master Data Driver",
    element: Driver,
  },
  {
    path: "/md/transportvehicle",
    name: "Master Data Transport Vehicle",
    element: Transportvehicle,
  },
  {
    path: "/userslist",
    name: "Users List",
    element: UsersList,
  },
  {
    path: "/roleslist",
    name: "Roles List",
    element: RolesList,
  },
  {
    path: "/config",
    name: "Config",
    element: Config,
  },
  {
    path: "/configrequest",
    name: "Config Request",
    element: ConfigRequest,
  },
  {
    path: "/viewrole/:id",
    name: "View Role",
    element: <ViewRole />,
  },

  // { path: "/theme/typography", name: "Typography", element: Typography },
  // { path: "/base", name: "Base", element: Cards, exact: true },
  // { path: "/base/accordion", name: "Accordion", element: Accordion },
  // { path: "/base/breadcrumbs", name: "Breadcrumbs", element: Breadcrumbs },
  // { path: "/base/cards", name: "Cards", element: Cards },
  // { path: "/base/carousels", name: "Carousel", element: Carousels },
  // { path: "/base/collapses", name: "Collapse", element: Collapses },
  // { path: "/base/list-groups", name: "List Groups", element: ListGroups },
  // { path: "/base/navs", name: "Navs", element: Navs },
  // { path: "/base/paginations", name: "Paginations", element: Paginations },
  // { path: "/base/placeholders", name: "Placeholders", element: Placeholders },
  // { path: "/base/popovers", name: "Popovers", element: Popovers },
  // { path: "/base/progress", name: "Progress", element: Progress },
  // { path: "/base/spinners", name: "Spinners", element: Spinners },
  // { path: "/base/tables", name: "Tables", element: Tables },
  // { path: "/base/tooltips", name: "Tooltips", element: Tooltips },
  // { path: "/buttons", name: "Buttons", element: Buttons, exact: true },
  // { path: "/buttons/buttons", name: "Buttons", element: Buttons },
  // { path: "/buttons/dropdowns", name: "Dropdowns", element: Dropdowns },
  // {
  //   path: "/buttons/button-groups",
  //   name: "Button Groups",
  //   element: ButtonGroups,
  // },
  // { path: "/charts", name: "Charts", element: Charts },
  // { path: "/forms", name: "Forms", element: FormControl, exact: true },
  // { path: "/forms/form-control", name: "Form Control", element: FormControl },
  // { path: "/forms/select", name: "Select", element: Select },
  // {
  //   path: "/forms/checks-radios",
  //   name: "Checks & Radios",
  //   element: ChecksRadios,
  // },
  // { path: "/forms/range", name: "Range", element: Range },
  // { path: "/forms/input-group", name: "Input Group", element: InputGroup },
  // {
  //   path: "/forms/floating-labels",
  //   name: "Floating Labels",
  //   element: FloatingLabels,
  // },
  // { path: "/forms/layout", name: "Layout", element: Layout },
  // { path: "/forms/validation", name: "Validation", element: Validation },
  // { path: "/icons", exact: true, name: "Icons", element: CoreUIIcons },
  // { path: "/icons/coreui-icons", name: "CoreUI Icons", element: CoreUIIcons },
  // { path: "/icons/flags", name: "Flags", element: Flags },
  // { path: "/icons/brands", name: "Brands", element: Brands },
  // {
  //   path: "/notifications",
  //   name: "Notifications",
  //   element: Alerts,
  //   exact: true,
  // },
  // { path: "/notifications/alerts", name: "Alerts", element: Alerts },
  // { path: "/notifications/badges", name: "Badges", element: Badges },
  // { path: "/notifications/modals", name: "Modals", element: Modals },
  // { path: "/notifications/toasts", name: "Toasts", element: Toasts },
  // { path: "/widgets", name: "Widgets", element: Widgets },
];

export default routes;
