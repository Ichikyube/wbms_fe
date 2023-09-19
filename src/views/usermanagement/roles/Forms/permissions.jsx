import React, { useState, useEffect } from "react";
import { Button, Stepper, Step, StepLabel, Typography, Container } from '@mui/material';


const SecondForm = ({ nextStep, prevStep, handleChange  }) => {
  return (
    <div>
    <Typography variant="h6">Step 2</Typography>
    <label htmlFor="email">Email:</label>
    <input type="email" id="email" name="email" onChange={handleChange} />
    <br />
    <Button variant="contained" onClick={nextStep}>Next</Button>
    <Button variant="contained" onClick={prevStep}>Previous</Button>
  </div>
  )
}
export default SecondForm;