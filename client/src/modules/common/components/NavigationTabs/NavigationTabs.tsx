// @ts-nocheck
import React, { useState } from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import DescriptionIcon from "@mui/icons-material/Description";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./NavigationTabs.styles";
import { useHistory } from "react-router-dom";

import './NavigationTabs.css'

const NavigationTabs = ({ activeTab, setActiveTab , handleClick}) => {
  const [checked, setChecked] = useState<boolean>(false)

  const history = useHistory();

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    if (newValue === "") {
      setChecked(false)
      history.push("/");
    } else if (newValue === "reporting") {
      setChecked(true)
      history.push("/reporting");
    }
    handleClick()
  };

  return (
      <div className="tabs-container">
        <div onClick={()=> handleTabChange("")} className={`tab-wrapper ${checked ? '' : 'tab-wrapper-active'}`}>
          <HomeIcon
            sx={{
              color:` ${checked ? '#ccc !important' : '#FFF'}`
            }}
          />
          <span style={{cursor:"pointer"}}>Home</span>
        </div>
        <div onClick={()=>handleTabChange("reporting")} className={`tab-wrapper ${checked ? 'tab-wrapper-active' : ''}`}>
          <DescriptionIcon
          sx={{
            color:` ${!checked ? '#ccc !important' : '#FFF'}`
          }} />
          <span style={{cursor:"pointer"}}>Reporting</span>
        </div>
      </div>
  );
};

export default NavigationTabs;
