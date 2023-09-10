  // Declare an EventSource
const eventSource = new EventSource('http://some.url');
// Handler for events without an event type specified
eventSource.onmessage = (e) => {
   // Do something - event data etc will be in e.data
};
// Handler for events of type 'eventType' only
eventSource.addEventListener('eventType', (e) => {
   // Do something - event data will be in e.data,
   // message will be of type 'eventType'
});
  
  
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




import { WavyContainer, WavyLink } from "react-wavy-transitions";

const Home = () => <div>Home</div>;
const About = () => <div>About</div>;
const Contact = () => <div>Contact</div>;

function App() {
  return (
    <BrowserRouter>
      <WavyContainer />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <WavyLink to="/" color="#ff44fd">Home</WavyLink>
              <WavyLink to="/about" color="#8f44fd">About</WavyLink>
              <WavyLink to="/contact" color="#2f44fd">Contact</WavyLink>
              <Outlet />
            </>
          }
        >
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<>No Match</>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}




<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<!-- This script got from frontendfreecode.com -->

<script src='https://cdnjs.cloudflare.com/ajax/libs/react/15.3.1/react.min.js'></script>
<script src='https://cdnjs.cloudflare.com/ajax/libs/react/15.3.1/react-dom.min.js'></script>
<style>
body {
	padding: 30px;
}
h2 {
	font-size: 18px;
	line-height: 1em;
	margin-bottom: 5px;
}
.accordion-box {
	margin-bottom: 100px;
}
.accordion-list .accordion-box:last-child {
	margin-bottom: 5px;
}
.accordion-label {
	position: relative;
	cursor: pointer;
	display: block;
	padding: 10px 50px 10px 10px;
	color: #fff;
	background-color: #222;
}
.accordion-content {
	max-height: 0;
	overflow: hidden;
}
.accordion-inner {
	background-color: #eee;
	padding: 15px;
}
.accordion-list.actived>.accordion-content {
	max-height: none;
}
.acd-sub {
	padding: 10px;
}
.acd-arrow {
	position: absolute;
	right: 15px;
	top: 16px;
	display: inline-block;
	vertical-align: middle;
	width: 0;
	height: 0;
	border-style: solid;
	border-color: transparent;
	border-width: 8px 8px 0px 8px;
	border-top-color: #fff;
}
.accordion-list.actived>.accordion-label>.acd-arrow {
	-webkit-transform: rotate(180deg);
	transform: rotate(180deg);
}
.acd-transition>.accordion-label>.acd-arrow {
	-webkit-transition: -webkit-transform 0.3s ease;
	transition: transform 0.3s ease;
}
</style>

</head>
<body>
<div id="root"></div><div id="bcl"><a style="font-size:8pt;text-decoration:none;" href="http://www.devanswer.com">Free Frontend</a></div>
<script>
"use strict";
class App extends React.Component {
    render() {
        return (React.createElement("div", null,
            React.createElement("h2", null, "Only One Open"),
            React.createElement(Accordion, { muitipleOpen: false },
                React.createElement(AccordionList, { expanded: true, id: "1", key: "1", headTitle: "Title 1" }, "Content 1"),
                React.createElement(AccordionList, { expanded: false, id: "2", key: "2", headTitle: "Title 2" }, "Content 2"),
                React.createElement(AccordionList, { expanded: false, id: "3", key: "3", headTitle: "Title 3" }, "Content 3"),
                React.createElement(AccordionList, { expanded: false, id: "4", key: "4", headTitle: "Title 4" }, "Content 4")),
            React.createElement("h2", null, "Multiple Open"),
            React.createElement(Accordion, { muitipleOpen: true },
                React.createElement(AccordionList, { expanded: false, id: "1", key: "1", headTitle: "Title 1" }, "Content 1"),
                React.createElement(AccordionList, { expanded: true, id: "2", key: "2", headTitle: "Title 2" }, "Content 2"),
                React.createElement(AccordionList, { expanded: false, id: "3", key: "3", headTitle: "Title 3" }, "Content 3"),
                React.createElement(AccordionList, { expanded: false, id: "4", key: "4", headTitle: "Title 4" }, "Content 4")),
            React.createElement("h2", null, "Nested Accordion"),
            React.createElement(Accordion, { muitipleOpen: false },
                React.createElement(AccordionList, { expanded: true, id: "1", key: "1", headTitle: "Title 1" },
                    "Content 1",
                    React.createElement("br", null),
                    React.createElement("br", null),
                    React.createElement(Accordion, { muitipleOpen: false },
                        React.createElement(AccordionList, { expanded: false, id: "1", key: "1", headTitle: "Nested Title 1" }, "Content 1"),
                        React.createElement(AccordionList, { expanded: false, id: "2", key: "2", headTitle: "Nested Title 2" }, "Content 2"),
                        React.createElement(AccordionList, { expanded: false, id: "3", key: "3", headTitle: "Nested Title 3" }, "Content 3"))),
                React.createElement(AccordionList, { expanded: false, id: "2", key: "2", headTitle: "Title 2" }, "Content 2"))));
    }
}
class Accordion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activedIndex: this.getID(),
            acdTransition: false
        };
    }
    getID() {
        let expandedIndex = [];
        let children = this.props.children;
        React.Children.map(children, (items, i) => {
            if (items.props.expanded) {
                expandedIndex.push(items.props.id);
            }
        });
        return expandedIndex;
    }
    addTransition() {
        if (this.state.acdTransition === true) {
            return 'acd-transition';
        }
        else {
            return "";
        }
    }
    handleClick(acdID) {
        let muitipleOpen = this.props.muitipleOpen;
        let activedList = [...this.state.activedIndex];
        let activedItem = this.state.activedIndex.indexOf(acdID);
        if (muitipleOpen) {
            if (activedItem !== -1) {
                activedList.splice(activedItem, 1);
                this.setState({ activedIndex: activedList });
            }
            else {
                this.setState({ activedIndex: [...activedList, acdID] });
            }
        }
        else {
            if (activedItem !== -1) {
                activedList.splice(activedItem, 1);
                this.setState({ activedIndex: activedList });
            }
            else {
                this.setState({ activedIndex: [acdID] });
            }
        }
        if (this.state.acdTransition === false) {
            this.setState({ acdTransition: true });
        }
    }
    isExpanded(acdID) {
        if (this.state.activedIndex.includes(acdID)) {
            return 'actived';
        }
        else {
            return '';
        }
    }
    render() {
        let childArr = this.props.children;
        if (childArr.length === undefined) {
            childArr = [this.props.children];
        }
        const items = childArr.map((child, i) => {
            //let newIndex = i + 1;
            return React.cloneElement(child, {
                isExpanded: this.isExpanded.bind(this),
                handleClick: this.handleClick.bind(this),
                addTransition: this.addTransition.bind(this)
            });
        });
        return (React.createElement("div", { className: `accordion-box` }, items));
    }
}
class AccordionList extends React.Component {
    render() {
        return (React.createElement("div", { className: `accordion-list ${this.props.isExpanded(this.props.id)} ${this.props.addTransition()}` },
            React.createElement("div", { className: `accordion-label`, onClick: () => { this.props.handleClick(this.props.id); } },
                this.props.headTitle,
                " ",
                React.createElement("span", { className: "acd-arrow" })),
            React.createElement("div", { className: `accordion-content` },
                React.createElement("div", { className: "accordion-inner" }, this.props.children))));
    }
}
ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
</script>

</body>
</html>




import React from "react";
import { Route, Redirect } from "react-router-dom";

const GuardedRoute = ({ component: Component, auth, ...rest }) => {
  <Route
    {...rest}
    render={(props) =>
      auth === true ? <Component {...props} /> : <Redirect to="/forbidden`" />
    }
  />;
};

export const Nav = () => {
  return <GuardedRoute 
    auth={true}component={() => <h1>Have Access To Nuclear Bomb Management</h1>}
    path={'/bomb-management'}
  />;
};




const Detenator = () => {
 return (
   <><button>Detonate Reactor</button></>
 );
};

const verifyPermissions = (permissions, userPermissions) => {
 let isVerified = true;
 if (!permissions || !userPermissions) isVerified = false;
 isVerified = permissions.every((permission) =>
   userPermissions.includes(permission)
 );
 return isVerified;
};

export const Authorizer = ({ permissions, requiredPermissions, children }) => {
 const isAuthorized = verifyPermissions(permissions, requiredPermissions);
 if (isAuthorized) {
   return children;
 }
 return (
   <><h1>Forbidden. No permissions to access</h1></>
 );
};
export const Page = ({ children }) => {
 return (
   <><h1>Nuclear Bomb Management</h1>
     {children}
     <Authorizer permissions={[]} requiredPermissions={["detonate", "president"]}>
       ﻿<Detenator /></Authorizer></>
 );
};





// SSEComponent.js

import React, { useEffect } from 'react';

function SSEComponent() {
  useEffect(() => {
    const eventSource = new EventSource('http://localhost:3001/sse');

    eventSource.onmessage = event => {
      console.log('Received:', event.data);
      // Handle the received event data in your React component
    };

    eventSource.onerror = error => {
      console.error('Error:', error);
      // Handle SSE errors
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div>
      <h2>SSE Component</h2>
      {/* Render your SSE data here */}
    </div>
  );
}

export default SSEComponent;



const socket = io('http://localhost:8080');

socket.on('sse', data => {
  console.log('Received:', data);
  // Handle the received data in your client application
});






import React, { useState } from 'react';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const handleLogin = async () => {
    // Perform login request and receive the token
    const response = await fetch('/api/login', {
      method: 'POST',
      // ...
    });

    const data = await response.json();

    // Save the token to localStorage
    localStorage.setItem('token', data.token);
    setToken(data.token);
  };

  return (
    <div>
      {token ? (
        <p>Authenticated with token: {token}</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
};

export default App;



// Assuming you have received a response from an API call
const response = /* your API response */;

// Get the cookie string from the response headers
const cookieString = response.headers.get('Set-Cookie'); // Replace 'Set-Cookie' with the actual header name

// Extract specific cookies from the cookie string
const cookies = {};
cookieString.split(';').forEach((cookie) => {
  const parts = cookie.split('=');
  cookies[parts[0].trim()] = parts[1].trim();
});

// Now you can access individual cookies
const myCookieValue = cookies['myCookie']; // Replace 'myCookie' with your cookie name



// reducers.js
import {
  REQUEST_APPROVAL,
  RECEIVE_APPROVAL,
  REQUEST_APPROVAL_ERROR,
} from './actions';

const initialState = {
  isLoading: false,
  approvalData: null,
  error: null,
};

const approvalReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_APPROVAL:
      return { ...state, isLoading: true, error: null };
    case RECEIVE_APPROVAL:
      return { ...state, isLoading: false, approvalData: action.payload };
    case REQUEST_APPROVAL_ERROR:
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export default approvalReducer;
// actions.js
export const REQUEST_APPROVAL = 'REQUEST_APPROVAL';
export const RECEIVE_APPROVAL = 'RECEIVE_APPROVAL';
export const REQUEST_APPROVAL_ERROR = 'REQUEST_APPROVAL_ERROR';

export const requestApproval = (requestData) => ({
  type: REQUEST_APPROVAL,
  payload: requestData,
});

export const receiveApproval = (approvalData) => ({
  type: RECEIVE_APPROVAL,
  payload: approvalData,
});

export const requestApprovalError = (error) => ({
  type: REQUEST_APPROVAL_ERROR,
  payload: error,
});



import React, { useState } from 'react';
import { connect } from 'react-redux';
import { requestApprovalAsync } from './thunks';

const RequestApprovalPage = ({ requestApprovalAsync, isLoading, error }) => {
  const [requestData, setRequestData] = useState({ /* initial data */ });

  const handleRequestApproval = () => {
    requestApprovalAsync(requestData);
  };

  return (
    <div>
      {/* Form for inputting approval request data */}
      {/* Display loading indicator and error messages */}
      <button onClick={handleRequestApproval}>Submit Approval Request</button>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isLoading: state.approval.isLoading,
  error: state.approval.error,
});

const mapDispatchToProps = {
  requestApprovalAsync,
};

export default connect(mapStateToProps, mapDispatchToProps)(RequestApprovalPage);
const fetcher = async (url) => {
  const response = await axios.get(url);
  const eventSource = new EventSource('/api/data/stream'); // SSE endpoint
  eventSource.onmessage = (event) => {
    // Handle real-time updates here
    // Update data with event.data
  };
  return response.data;
};
