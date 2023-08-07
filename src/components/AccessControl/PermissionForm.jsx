import React from 'react';
import { Field, FieldArray } from 'formik';
import GrantForm from './GrantForm';

const PermissionForm = ({ permissions }) => (
  <FieldArray name="permissions">
    {({ push, remove }) => (
      <div>
        {permissions.map((permission, index) => (
          <div key={index}>
            <button type="button" onClick={() => remove(index)}>
              Remove Permission
            </button>
            <label>
              Resource:
              <Field
                type="text"
                name={`permissions[${index}].resource`}
              />
            </label>
            <GrantForm grants={permission.grants} parentIndex={index} />
          </div>
        ))}
        <button type="button" onClick={() => push({ resource: '', grants: [] })}>
          Add Permission
        </button>
      </div>
    )}
  </FieldArray>
);

export default PermissionForm;
