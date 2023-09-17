

3. **Consume the Context in Components**

   In the components where you want to access the context, use the `useContext` hook.

   ```jsx
   // ComponentA.js
   import React, { useContext } from 'react';
   import { MyContext } from './MyContext';

   const ComponentA = () => {
     const { sharedValue, setSharedValue } = useContext(MyContext);

     return (
       <div>
         <div>Component A</div>
         <div>Shared Value: {sharedValue}</div>
         <button onClick={() => setSharedValue('New Value A')}>
           Change Shared Value from A
         </button>
       </div>
     );
   };

   export default ComponentA;
   ```

   ```jsx
   // ComponentB.js
   import React, { useContext } from 'react';
   import { MyContext } from './MyContext';

   const ComponentB = () => {
     const { sharedValue, setSharedValue } = useContext(MyContext);

     return (
       <div>
         <div>Component B</div>
         <div>Shared Value: {sharedValue}</div>
         <button onClick={() => setSharedValue('New Value B')}>
           Change Shared Value from B
         </button>
       </div>
     );
   };

   export default ComponentB;
   ```

In this example, `ComponentA` and `ComponentB` are both wrapped in the `MyContextProvider`. They can now access the shared value and function to update it using the `useContext` hook.

Keep in mind that changes made in one component will be reflected in the other component since they are sharing the same context.


AuthContext untuk autentikasi user dan juga menentukan role user untuk menentukan akses pada protected route.

import { Link } from 'react-router-dom';

export function RolesAuthRoute({ children, roles }) {
  const userRoles = useUserRoles();
  const canAccess = userRoles.some(userRole => roles.includes(userRole));

  if (canAccess) {
    return (
      <Fragment>
        {children}
      </Fragment>
    );
  }

  return <Navigate to="/dashboard/login" />;
}
<Route path="users" element={<RolesAuthRoute roles={['admin']}> <ProjectUsersPage /> </RolesAuthRoute>} />




export function RolesAuthRoute({ children, roles }: { children: ReactNode, roles: Array<typeof UserRoles[number]> }) {

    const userRoles = useUserRoles();

    const canAccess = userRoles.some(userRole => roles.includes(userRole));


    if (canAccess)
        return (
            <Fragment>
                {children}
            </Fragment>
        );

    return (<Navigate to="/dashboard/login" />);
}

export function RolesAuthRoute({ children, roles }: { children: ReactNode, roles: Array<typeof UserRoles[number]> }) {

    const userRoles = useUserRoles();

    const canAccess = userRoles.some(userRole => roles.includes(userRole));


    if (canAccess)
        return (
            <Fragment>
                {children}
            </Fragment>
        );

    return (<Navigate to="/dashboard/login" />);
}
