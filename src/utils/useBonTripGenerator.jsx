import React, { useState, useEffect } from 'react';
import moment from 'moment';

const useBonTripGenerator = () => {
  const [bonTripNo, setBonTripNo] = useState("");

  useEffect(() => {
    const generateBonTripNo = () => {
      const dateNow = moment().format("YYMMDDHHmmss");
      return `P041${dateNow}`;
    };

    const generatedBonTripNo = generateBonTripNo();
    setBonTripNo(generatedBonTripNo);

    return generatedBonTripNo; // Return the generated number for external use
  }, []);

  return [bonTripNo, setBonTripNo];
};

export default useBonTripGenerator;
