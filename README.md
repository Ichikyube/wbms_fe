  Jika User adalah admin maka bisa menunjuk approver
  Creating a request approval feature involves several steps, including setting up the frontend and backend components, handling API requests, and managing the state. Below is a high-level overview of the process:

1. **Frontend Setup:**

   - Create the React components for your request approval feature, such as the request list, request details, and approval form.
   - Use a state management library like Redux to manage the state of the requests and approvals.

2. **Backend Setup:**

   - Implement the necessary API endpoints for fetching requests, approving requests, and rejecting requests in your backend using a framework like Express for Node.js.

3. **Redux Configuration:**

   - Set up Redux reducers, actions, and thunks to manage the state of the requests and approvals.
   - Create separate actions for fetching the request list, approving requests, and rejecting requests.

4. **Fetch Request List:**

   - Create a thunk action to fetch the list of requests from the backend.
   - Dispatch the action to fetch the list of requests when the corresponding component mounts.

5. **Display Request List:**

   - Render the list of requests in a component, allowing users to select a request for approval or rejection.
   - Provide buttons or options to approve or reject each request.

6. **Approval Form:**

   - Create a separate component for the approval form.
   - Allow users to provide additional information or comments for their approval decision.

7. **Dispatch Approval Actions:**

   - Dispatch the "approve" or "reject" thunk actions when a user submits the approval form for a specific request.
   - Pass the request ID and any relevant data to the thunk actions.

8. **Backend API Endpoints:**

   - Implement API endpoints for approving and rejecting requests.
   - Update the status of the requests in the database based on the approval or rejection.

9. **Update Request List:**

   - After a request is approved or rejected successfully, update the state in Redux to reflect the new status.
   - This can be done by filtering the list of requests and updating the corresponding request's status.

10. **UI Feedback:**

    - Provide visual feedback to users after they approve or reject a request, such as success messages or error notifications.

11. **Testing:**

    - Test your feature thoroughly to ensure that requests are fetched correctly, approvals are processed accurately, and the state updates as expected.

Remember that this is a general overview, and the implementation details may vary based on your specific project requirements, frontend and backend technologies, and preferred coding practices. It's important to design your components and actions according to your application's structure and needs.
  const resourcesList = [
    "BarcodeType",
    "City",
    "Company",
    "Config",
    "Customer",
    "CustomerType",
    "Driver",
    "CustomerGroup",
    "Mill",
    "Product",
    "ProductGroup",
    "Province",
    "Semai",
    "Site",
    "StorageTank",
    "Transaction",
    "TransportVehicle",
    "User",
    "Weighbridge",
  ];

<Field name={`permissions[${index}].resource`} value={resource} as="select" onChange={(event) => {
                                const { checked } = event.target;
                                if (checked) {
                                  setFieldValue(
                                    `permissions[${index}].resource`,
                                    String(event.target.value)
                                  );
                                }
                              }}>
## Usage

`AsyncPaginate` is an alternative of `Async` but supports loading page by page. It is wrapper above default `react-select` thus it accepts all props of default `Select`. And there are some new props:

### loadOptions

Required. Async function that take next arguments:

1. Current value of search input.
2. Loaded options for current search.
3. Collected additional data e.g. current page number etc. For first load it is `additional` from props, for next is `additional` from previous response for current search. `null` by default.

It should return next object:

```
{
  options: Array,
  hasMore: boolean,
  additional?: any,
}
```

It similar to `loadOptions` from `Select.Async` but there is some differences:

1. Loaded options as 2nd argument.
2. Additional data as 3nd argument.
3. Not supports callback.
4. Should return `hasMore` for detect end of options list for current search.

### debounceTimeout

Not required. Number. Debounce timeout for `loadOptions` calls. `0` by default.

### additional

Not required. Default `additional` for first request for every search.

### defaultAdditional

Not required. Default `additional` for empty search if `options` or `defaultOptions` defined.

### shouldLoadMore

Not required. Function. By default new options will load only after scroll menu to bottom. Arguments:

- scrollHeight
- clientHeight
- scrollTop

Should return boolean.

### reduceOptions

Not required. Function. By default new loaded options are concat with previous. Arguments:

- previous options
- loaded options
- next additional

Should return new options.

### cacheUniqs

Not required. Array. Works as 2nd argument of `useEffect` hook. When one of items changed, `AsyncPaginate` cleans all cached options.

### loadOptionsOnMenuOpen

Not required. Boolean. If `false` options will not load on menu opening.

### selectRef

Ref for take `react-select` instance.

## Example

### offset way

```javascript
import { AsyncPaginate } from 'react-select-async-paginate';

...

/*
 * assuming the API returns something like this:
 *   const json = {
 *     results: [
 *       {
 *         value: 1,
 *         label: 'Audi',
 *       },
 *       {
 *         value: 2,
 *         label: 'Mercedes',
 *       },
 *       {
 *         value: 3,
 *         label: 'BMW',
 *       },
 *     ],
 *     has_more: true,
 *   };
 */

async function loadOptions(search, loadedOptions) {
  const response = await fetch(`/awesome-api-url/?search=${search}&offset=${loadedOptions.length}`);
  const responseJSON = await response.json();

  return {
    options: responseJSON.results,
    hasMore: responseJSON.has_more,
  };
}

<AsyncPaginate
  value={value}
  loadOptions={loadOptions}
  onChange={setValue}
/>
```

### page way

```javascript
import { AsyncPaginate } from 'react-select-async-paginate';

...

async function loadOptions(search, loadedOptions, { page }) {
  const response = await fetch(`/awesome-api-url/?search=${search}&page=${page}`);
  const responseJSON = await response.json();

  return {
    options: responseJSON.results,
    hasMore: responseJSON.has_more,
    additional: {
      page: page + 1,
    },
  };
}

<AsyncPaginate
  value={value}
  loadOptions={loadOptions}
  onChange={setValue}
  additional={{
    page: 1,
  }}
/>
```

## Grouped options

You can use `reduceGroupedOptions` util to group options by `label` key.

```javascript
import { AsyncPaginate, reduceGroupedOptions } from 'react-select-async-paginate';

/*
 * assuming the API returns something like this:
 *   const json = {
 *     options: [
 *       label: 'Cars',
 *       options: [
 *         {
 *           value: 1,
 *           label: 'Audi',
 *         },
 *         {
 *           value: 2,
 *           label: 'Mercedes',
 *         },
 *         {
 *           value: 3,
 *           label: 'BMW',
 *         },
 *       ]
 *     ],
 *     hasMore: true,
 *   };
 */

...

<AsyncPaginate
  {...otherProps}
  reduceOptions={reduceGroupedOptions}
/>
```

## Replacing react-select component

You can use `withAsyncPaginate` HOC.

```javascript
import { withAsyncPaginate } from 'react-select-async-paginate';

...

const CustomAsyncPaginate = withAsyncPaginate(CustomSelect);
```

### typescript

Describing type of component with extra props (example with `Creatable`):

```typescript
import type { ReactElement } from 'react';
import type { GroupBase } from 'react-select';
import Creatable from 'react-select/creatable';
import type { CreatableProps } from 'react-select/creatable';

import { withAsyncPaginate } from 'react-select-async-paginate';
import type {
  UseAsyncPaginateParams,
  ComponentProps,
} from 'react-select-async-paginate';

type AsyncPaginateCreatableProps<
OptionType,
Group extends GroupBase<OptionType>,
Additional,
IsMulti extends boolean,
> =
  & CreatableProps<OptionType, IsMulti, Group>
  & UseAsyncPaginateParams<OptionType, Group, Additional>
  & ComponentProps<OptionType, Group, IsMulti>;

type AsyncPaginateCreatableType = <
OptionType,
Group extends GroupBase<OptionType>,
Additional,
IsMulti extends boolean = false,
>(props: AsyncPaginateCreatableProps<OptionType, Group, Additional, IsMulti>) => ReactElement;

const AsyncPaginateCreatable = withAsyncPaginate(Creatable) as AsyncPaginateCreatableType;
```

## Replacing Components

Usage of replacing components is similar with `react-select`, but there is one difference. If you redefine `MenuList` you should wrap it with `wrapMenuList` for workaround of some internal bugs of `react-select`.

```javascript
import { AsyncPaginate, wrapMenuList } from 'react-select-async-paginate';

...

const MenuList = wrapMenuList(CustomMenuList);

<AsyncPaginate
  {...otherProps}
  components={{
    ...otherComponents,
    MenuList,
  }}
/>
```

## Extended usage

If you want construct own component that uses logic of `react-select-async-paginate` inside, you can use next hooks:

- `useAsyncPaginate`
- `useAsyncPaginateBase`
- `useComponents`

```javascript
import {
  useAsyncPaginate,
  useComponents,
} from 'react-select-async-paginate';

...

const CustomAsyncPaginateComponent = ({
  options,
  defaultOptions,
  additional,
  loadOptionsOnMenuOpen,
  debounceTimeout,
  filterOption,
  reduceOptions,
  shouldLoadMore,

  components: defaultComponents,

  value,
  onChange,
}) => {
  const asyncPaginateProps = useAsyncPaginate({
    options,
    defaultOptions,
    additional,
    loadOptionsOnMenuOpen,
    debounceTimeout,
    filterOption,
    reduceOptions,
    shouldLoadMore,
  });

  const components = useComponents(defaultComponents);

  return (
    <CustomSelect
      {...asyncPaginateProps}
      components={components}
      value={value}
      onChange={onChange}
    />
  );
}
```

`useComponents` provides redefined `MenuList` component by default. If you want redefine it, you should also wrap in with `wrapMenuList`.



import React from 'react';
import { useAuth } from './AuthContext';

function AuthButton() {
  const { authenticated, login, logout } = useAuth();

  return (
    <div>
      {authenticated ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={login}>Login</button>
      )}
    </div>
  );
}

export default AuthButton;



import React from 'react';
import { Route, Navigate } from 'react-router-dom';

// Fake authentication state for demonstration purposes
const isAuthenticated = true;

const AuthenticateRoute = ({ element: Element, redirectTo, ...rest }) => {
  return (
    <Route
      {...rest}
      element={
        isAuthenticated ? (
          <Element />
        ) : (
          <Navigate to={redirectTo || '/login'} replace />
        )
      }
    />
  );
};

const App = () => {
  return (
    <CContainer fluid>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <AuthenticateRoute
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={route.element}
                  redirectTo="/login" // Redirect to login if not authenticated
                />
              )
            );
          })}
          <Route path="/" element={<Navigate to="/dashboard" />} replace />
        </Routes>
      </Suspense>
    </CContainer>
  );
};

export default App;



import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

// Assume these components exist
import Dashboard from './Dashboard';
import LoginComponent from './LoginComponent';
import PublicComponent from './PublicComponent';

// A fake authentication state for demonstration purposes
const isAuthenticated = true;

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated ? (
        <Redirect to="/dashboard" />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

const PublicRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => <Component {...props} />} />
);

const App = () => {
  return (
    <Router>
      <Switch>
        <PublicRoute
          exact
          path="/public"
          component={PublicComponent}
        />
        <PrivateRoute
          exact
          path="/dashboard"
          component={Dashboard}
        />
        <Route exact path="/login" component={LoginComponent} />
        {/* Fallback route if none of the above matches */}
        <Redirect to="/public" />
      </Switch>
    </Router>
  );
};

export default App;
