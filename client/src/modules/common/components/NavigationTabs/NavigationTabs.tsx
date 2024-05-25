import React from "react";
import { useHistory } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import DescriptionIcon from "@mui/icons-material/Description";
import BarChartIcon from '@mui/icons-material/BarChart';
import './NavigationTabs.css';

interface NavigationTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleClick: () => void;
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, setActiveTab, handleClick }) => {
  const history = useHistory();

  const handleTabChange = (newValue: string) => {
    setActiveTab(newValue);
    handleClick();
    switch (newValue) {
      case "":
        history.push("/");
        break;
      case "reporting":
        history.push("/reporting");
        break;
      case "statistics":
        history.push("/statistics");
        break;
      default:
        break;
    }
  };

  return (
    <div className="tabs-container">
      <div onClick={() => handleTabChange("")} className={`tab-wrapper ${activeTab === "" ? 'tab-wrapper-active' : ''}`}>
        <HomeIcon sx={{ color: activeTab === "" ? '#FFF' : '#ccc' }} />
        <span style={{ cursor: "pointer" }}>Головна</span>
      </div>
      <div onClick={() => handleTabChange("reporting")} className={`tab-wrapper ${activeTab === "reporting" ? 'tab-wrapper-active' : ''}`}>
        <DescriptionIcon sx={{ color: activeTab === "reporting" ? '#FFF' : '#ccc' }} />
        <span style={{ cursor: "pointer" }}>Резервації</span>
      </div>
      <div onClick={() => handleTabChange("statistics")} className={`tab-wrapper ${activeTab === "statistics" ? 'tab-wrapper-active' : ''}`}>
        <BarChartIcon sx={{ color: activeTab === "statistics" ? '#FFF' : '#ccc' }} />
        <span style={{ cursor: "pointer" }}>Статистика</span>
      </div>
    </div>
  );
};

export default NavigationTabs;
