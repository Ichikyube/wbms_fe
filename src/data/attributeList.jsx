
const Province= [
    'id',
    'name',
    'isDeleted',
    'userCreated',
    'userModified',
    'dtCreated',
    'dtModified',
    'cities'
];
const City= [
    'id',          'provinceId',
    'name',        'isDeleted',
    'userCreated', 'userModified',
    'dtCreated',   'dtModified',
    'province',    'sites',
    'customers'
];

const Company= [
    'id',                'refType',
    'refId',             'code',
    'codeSap',           'name',
    'shortName',         'address',
    'addressExt',        'postalCode',
    'country',           'province',
    'city',              'phone',
    'url',               'contactName',
    'contactEmail',      'contactPhone',
    'isMillOperator',    'isTransporter',
    'isSiteOperator',    'isEstate',
    'isDeleted',         'userCreated',
    'userModified',      'dtCreated',
    'dtModified',        'sites',
    'transportVehicles', 'mills',
    'Driver',            'Transaction',
    'StorageTank'
];

const Customer= [
    'id',              'customerTypeId',
    'customerGroupId', 'cityId',
    'code',            'codeSap',
    'name',            'shortName',
    'address',         'addressExt',
    'postalCode',      'phone',
    'url',             'contactName',
    'contactEmail',    'contactPhone',
    'sortasi',         'isDeleted',
    'userCreated',     'userModified',
    'dtCreated',       'dtModified',
    'customerType',    'customerGroup',
    'city',            'Transaction'
];
  
const CustomerType= [
    'id',
    'name',
    'shortDesc',
    'description',
    'isDeleted',
    'userCreated',
    'userModified',
    'dtCreated',
    'dtModified',
    'customers'
];

const CustomerGroup= [
    'id',
    'name',
    'shortDesc',
    'description',
    'isDeleted',
    'userCreated',
    'userModified',
    'dtCreated',
    'dtModified',
    'customers'
];
 
const BarcodeType= [
    'id',
    'name',
    'shortDesc',
    'description',
    'isDeleted',
    'userCreated',
    'userModified',
    'dtCreated',
    'dtModified'
];
const Site= [
    'id',
    'refType',
    'refId',
    'sourceSiteId',
    'sourceSiteRefId',
    'sourceSiteName',
    'companyId',
    'companyRefId',
    'companyName',
    'cityId',
    'code',
    'codeSap',
    'name',
    'shortName',
    'description',
    'latitude',
    'longitude',
    'solarCalibration',
    'isMill',
    'isDeleted',
    'userCreated',
    'userModified',
    'dtCreated',
    'dtModified',
    'sourceSite',
    'company',
    'city',
    'storageTanks',
    'weighbridges',
    'mills',
    'destinationSites',
    'originSiteTransactions',
    'destinationSiteTransactions'
];
  
const Mill= [
    'id',          'siteId',
    'companyId',   'code',
    'name',        'isDeleted',
    'userCreated', 'userModified',
    'dtCreated',   'dtModified',
    'site',        'company'
];
  
const Weighbridge= [
    'id',           'siteId',
    'code',         'name',
    'isDeleted',    'userCreated',
    'userModified', 'dtCreated',
    'dtModified',   'site'
];
  
const ConfigRequest= [
    'id',
    'lvl1Aprrover',
    'lvl2Approver',
    'lvl3Aprrover',
    'lvl1Signed',
    'lvl2Signed',
    'lvl3Signed',
    'configId'
];

const Config= [
    'id',           'name',
    'description',  'type',
    'value',        'editedValue',
    'lvlOfApprvl',  'status',
    'start',        'end',
    'isDeleted',    'userCreated',
    'userModified', 'dtCreated',
    'dtModified'
];
  
const User= [
    'id',           'username',
    'email',        'nik',
    'name',         'phone',
    'division',     'position',
    'profilePic',   'roleId',
    'role',         'hashedPassword',
    'hashedRT',     'isEmailVerified',
    'isLDAPUser',   'isDisabled',
    'isDeleted',    'userCreated',
    'userModified', 'dtCreated',
    'dtModified',   'userRole'
];

const Role= [
    'id',
    'name',
    'permissions',
    'userCreated',
    'userModified',
    'dtCreated',
    'dtModified',
    'users'
];
  
const Permission= [
    'id',
    'resource',
    'grants',
    'roleId',
    'role',
    'userCreated',
    'userModified',
    'dtCreated',
    'dtModified'
];
  
const Grant= [
    'id',
    'action',
    'possession',
    'attributes',
    'permissionId',
    'permission',
    'userCreated',
    'userModified',
    'dtCreated',
    'dtModified'
];
  
const Product= [
    'id',           'refType',
    'refId',        'productGroupName',
    'code',         'codeSap',
    'name',         'shortName',
    'description',  'certification',
    'isDeleted',    'userCreated',
    'userModified', 'dtCreated',
    'dtModified',   'storageTanks',
    'transactions', 'transportVehicles'
];
  
const ProductGroup= [
    'id',
    'name',
    'shortDesc',
    'description',
    'isDeleted',
    'userCreated',
    'userModified',
    'dtCreated',
    'dtModified'
];
  
const StorageTank= [
    'id',
    'refType',
    'refId',
    'siteId',
    'siteRefId',
    'siteName',
    'stockOwnerId',
    'stockOwnerRefId',
    'stockOwnerName',
    'productId',
    'productRefId',
    'productName',
    'code',
    'codeSap',
    'name',
    'shortName',
    'description',
    'capacity',
    'height',
    'sccModel',
    'isDeleted',
    'userCreated',
    'userModified',
    'dtCreated',
    'dtModified',
    'site',
    'stockOwner',
    'product',
    'originSourceStorageTankTransactions',
    'destinationSinkStorageTankTransactions'
];
  
const Driver= [
    'id',           'refType',
    'refId',        'codeSap',
    'companyId',    'companyRefId',
    'companyName',  'nik',
    'name',         'address',
    'email',        'phone',
    'licenseNo',    'licenseED',
    'isDeleted',    'userCreated',
    'userModified', 'dtCreated',
    'dtModified',   'company',
    'transactions'
];
  
const TransportVehicle= [
    'id',           'refType',
    'refId',        'codeSap',
    'companyId',    'companyRefId',
    'companyName',  'productId',
    'productRefId', 'productName',
    'productCode',  'plateNo',
    'capacity',     'brand',
    'model',        'sccModel',
    'notes',        'licenseED',
    'keurED',       'isDeleted',
    'userCreated',  'userModified',
    'dtCreated',    'dtModified',
    'company',      'product'
];
  
const Transaction= [
    'id',
    'tType',
    'bonTripNo',
    'vehicleStatus',
    'deliveryStatus',
    'progressStatus',
    'deliveryOrderId',
    'deliveryOrderNo',
    'deliveryDate',
    'productId',
    'productCode',
    'productName',
    'customerId',
    'customerCode',
    'name',
    'rspoSccModel',
    'rspoUniqueNumber',
    'isccSccModel',
    'isccUniqueNumber',
    'isccGhgValue',
    'isccEeeValue',
    'transporterId',
    'transporterCompanyCode',
    'transporterCompanyName',
    'transporterCompanyShortName',
    'driverId',
    'driverNik',
    'driverName',
    'driverLicenseNo',
    'transportVehicleId',
    'transportVehiclePlateNo',
    'transportVehicleProductCode',
    'transportVehicleProductName',
    'transportVehicleSccModel',
    'originSiteId',
    'originSiteCode',
    'originSiteName',
    'originSourceStorageTankId',
    'originSourceStorageTankCode',
    'originSourceStorageTankName',
    'destinationSiteId',
    'destinationSiteCode',
    'destinationSiteName',
    'destinationSinkStorageTankId',
    'destinationSinkStorageTankCode',
    'destinationSinkStorageTankName',
    'originFfaPercentage',
    'originMoistPercentage',
    'originDirtPercentage',
    'originWeighInKg',
    'originWeighInRemark',
    'originWeighInOperatorName',
    'originWeighInTimestamp',
    'originWeighOutKg',
    'originWeighOutRemark',
    'originWeighOutOperatorName',
    'originWeighOutTimestamp',
    'potonganWajib',
    'potonganLain',
    'destinationWeighInKg',
    'destinationWeighInRemark',
    'destinationWeighInOperatorName',
    'destinationWeighInTimestamp',
    'destinationWeighOutKg',
    'destinationWeighOutRemark',
    'destinationWeighOutOperatorName',
    'destinationWeighOutTimestamp',
    'returnWeighInKg',
    'returnWeighInRemark',
    'returnWeighInOperatorName',
    'returnWeighInTimestamp',
    'returnWeighOutKg',
    'returnWeighOutRemark',
    'returnWeighOutOperatorName',
    'returnWeighOutTimestamp',
    'currentSeal1',
    'currentSeal2',
    'currentSeal3',
    'currentSeal4',
    'loadedSeal1',
    'loadedSeal2',
    'loadedSeal3',
    'loadedSeal4',
    'loadingRemark',
    'loadingOperatorName',
    'loadingTimestamp',
    'unloadedSeal1',
    'unloadedSeal2',
    'unloadedSeal3',
    'unloadedSeal4',
    'unloadingRemark',
    'unloadingOperatorName',
    'unloadingTimestamp',
    'returnUnloadedSeal1',
    'returnUnloadedSeal2',
    'returnUnloadedSeal3',
    'returnUnloadedSeal4',
    'returnUnloadingRemark',
    'returnUnloadingOperatorName',
    'returnUnloadingTimestamp',
    "returnUnloadingTimestamp",
    "qtyTbs",
    "qtyTbsDikirim",
    "qtyTbsDikembalikan","jsonData","isDeleted", 
    "userCreated",
    "userModified",
    "dtCreated",
    "dtModified",
]

export const dtAttr = { Province, City, Company, Customer, CustomerType, CustomerGroup, BarcodeType, Site, Mill, Weighbridge, Config, User, Product, ProductGroup, StorageTank, Driver, TransportVehicle, Transaction }