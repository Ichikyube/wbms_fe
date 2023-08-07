import React from 'react';
import { Field, FieldArray } from 'formik';

const GrantForm = ({ grants, parentIndex }) => (
  <FieldArray name={`permissions[${parentIndex}].grants`}>
    {({ push, remove }) => (
      <div>
        {grants.map((grant, index) => (
          <div key={index}>
            <button type="button" onClick={() => remove(index)}>
              Remove Grant
            </button>
            <label>
              Action:
              <Field
                type="text"
                name={`permissions[${parentIndex}].grants[${index}].action`}
              />
            </label>
            {/* Add more fields for grants */}
          </div>
        ))}
        <button
          type="button"
          onClick={() => push({ action: '', possession: '', attributes: [] })}
        >
          Add Grant
        </button>
      </div>
    )}
  </FieldArray>
);

export default GrantForm;
