
function DynamicInputArray() {
  const [inputValues, setInputValues] = useState(['']); // Initialize with an empty input

  const handleInputChange = (index, value) => {
    const newValues = [...inputValues];
    newValues[index] = value;
    setInputValues(newValues);
  };

  const addInput = () => {
    setInputValues([...inputValues, '']);
  };

  return (
    <div>
      {inputValues.map((value, index) => (
        <input
          key={index}
          type="text"
          value={value}
          onChange={(e) => handleInputChange(index, e.target.value)}
        />
      ))}
      <button onClick={addInput}>Add Input</button>
      <pre>{JSON.stringify(inputValues, null, 2)}</pre>
    </div>
  );
}


import React, { useState } from 'react';

function DynamicInputArray() {
  const [inputValues, setInputValues] = useState([]);

  // Add more state variables if needed
  // const [otherState, setOtherState] = useState(initialValue);

  // ... rest of your component ...
}


function DynamicInputArray() {
  // ... state setup ...

  const handleInputChange = (event, index) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = event.target.value;
    setInputValues(newInputValues);
  };

  // ... rest of your component ...
}



function DynamicInputArray() {
  // ... state setup ...

  const handleInputChange = (event, index) => {
    // ... handle input change ...
  };

  return (
    <div>
      {inputValues.map((value, index) => (
        <input
          key={index}
          type="text"
          value={value}
          onChange={(e) => handleInputChange(e, index)}
        />
      ))}
      <button>Add Input</button>
    </div>
  );
}


function DynamicInputArray() {
  // ... state setup ...

  const handleInputChange = (event, index) => {
    // ... handle input change ...
  };

  const addInput = () => {
    setInputValues([...inputValues, '']);
  };

  return (
    <div>
      {inputValues.map((value, index) => (
        <input
          key={index}
          type="text"
          value={value}
          onChange={(e) => handleInputChange(e, index)}
        />
      ))}
      <button onClick={addInput}>Add Input</button>
    </div>
  );
}


import React, { useState } from 'react';

function DynamicInputArray() {
  const [inputValues, setInputValues] = useState(['']); // Initialize with an empty input

  const handleInputChange = (index, value) => {
    const updatedValues = [...inputValues];
    updatedValues[index] = value;
    setInputValues(updatedValues);
  };

  const addInput = () => {
    setInputValues([...inputValues, '']);
  };

  const removeInput = (index) => {
    const updatedValues = inputValues.filter((_, i) => i !== index);
    setInputValues(updatedValues);
  };

  return (
    <div>
      {inputValues.map((value, index) => (
        <div key={index}>
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
          <button onClick={() => removeInput(index)}>Remove</button>
        </div>
      ))}
      <button onClick={addInput}>Add Input</button>
    </div>
  );
}

export default DynamicInputArray;
import React from 'react';
import DynamicInputArray from './DynamicInputArray';

function App() {
  return (
    <div>
      <h1>Dynamic Input Array</h1>
      <DynamicInputArray />
    </div>
  );
}

export default App;
