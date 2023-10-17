import React, { useState, useEffect } from "react";
import moment from "moment";
import { useSelector } from "react-redux";

const useBonTripGenerator = () => {
  const { WBMS_SITE_CODE, WBMS_BONTRIP_SUFFIX } = useSelector((app) => app.tempConfigs);
  console.log(WBMS_SITE_CODE)
  const generateBonTripNo = () => {
    const dateNow = moment().format("YYMMDDHHmmss");
    return `${WBMS_SITE_CODE}${WBMS_BONTRIP_SUFFIX}${dateNow}`;
  };

  const generatedBonTripNo = generateBonTripNo();

  return generatedBonTripNo; // Return the generated number for external use
};

export default useBonTripGenerator;
