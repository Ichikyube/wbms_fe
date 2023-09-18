import React from 'react';
import ReactDOM from 'react-dom';
import { Formik, Field, Form } from 'formik';
import { Button, Stepper, Step, StepLabel, Typography, Container } from '@mui/material';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const FirstForm = (nextStep, handleChange) => {
  return (
    <div>
    <Typography variant="h6">Step 1</Typography>
    <label htmlFor="name">Name:</label>
    <input type="text" id="name" name="name" onChange={handleChange} />
    <br />
    <Button variant="contained" onClick={nextStep}>Next</Button>
  </div>
  )
};

export default FirstForm;