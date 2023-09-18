import React from 'react'
import { useSelector } from 'react-redux'
import { Button, Stepper, Step, StepLabel, Typography, Container } from '@mui/material';

const FinishForm = ({ pageTitle, successMessage, prevStep, handleChange, handleSubmit }) => {

  return (
    <div>
      <Typography variant="h6">Step 3</Typography>
      <label htmlFor="password">Password:</label>
      <input type="password" id="password" name="password" onChange={handleChange} />
      <br />
      <Button variant="contained" onClick={handleSubmit}>Submit</Button>
      <Button variant="contained" onClick={prevStep}>Previous</Button>
    </div>
  );
};

export default FinishForm;