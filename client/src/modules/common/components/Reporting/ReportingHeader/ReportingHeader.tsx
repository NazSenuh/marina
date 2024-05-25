//@ts-nocheck
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemText,
  Checkbox,
  Button,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import { useMutation, useQuery } from 'react-query';
import reservationService from "../../../../services/reservation.service";

import "./ReportingHeader.css";
import Search from "antd/es/input/Search";
import { EQueryKeys } from "../../../../types/marina.types";

const ReportingHeader = ({
  search,
  setSearch,
  selectedSeasons,
  setSelectedSeasons,
  seasons,
  selectedStatus,
  setSelectedStatus,
  selected,
  filteredDataIds
}) => {

  const ids = selected.length ? selected : filteredDataIds()
  const { mutate: generateCsv } = useMutation<string, AxiosError<any>>((req) => reservationService.downloadFile(ids))

  const removeUnderscore = (str: string | undefined): string | undefined => {
    if (str) {
      const words = str.split(' ');

     
      const result =  words.join('_');
    
      return result;
    }
    return str
  }
  const handleCsv = () => {
    generateCsv()
  }
  const theme = createTheme({
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            color: "#BFBFBF",
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: "#D5D5D5",
            "&$checked": {
              color: "2E4880",
              backgroundColor: "2E4880",
            },
          },
        },
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <div
        className="reporting-wrapper"
      >
        <h1>Звітність</h1>
        <Search
          allowClear={true}
          value={search}
          placeholder="Search"
          focus
          onChange={(e) => setSearch(e.target.value)}
          style={{
            height: "30px",
            fontFamily: "'Poppins', sans-serif"
          }}
          className="search-reporting"
        />
  
        <Button
          variant="contained"
          color="primary"
          sx={{
            marginLeft: "16px",
            height: "30px",
            boxShadow: "none",
            backgroundColor: "#2E4880",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: "400",
            width: "120px",
            fontSize: "12px",
            padding: "4px 15px",
            borderRadius: "2px"
          }}
          onClick={() => handleCsv()}
          className="export-reporting"
        >
          Експортувати
        </Button>
      </div>
      {/* </div> */}
    </ThemeProvider>
  );
}

export default ReportingHeader;
