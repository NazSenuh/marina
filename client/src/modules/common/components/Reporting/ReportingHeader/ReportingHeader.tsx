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
        <h1>Reporting</h1>
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
        <FormControl
          sx={{
            marginLeft: "8px",
            height: "30px",
          }}
          className="seson-reporting"
        >

          <InputLabel
            id="season-filter-label"
            shrink={false}
            sx={{ marginTop: "-12px", fontFamily: "'Poppins', sans-serif" }}

          >
            {selectedSeasons.length === 0 ? "Select season" : ""}
          </InputLabel>
          <Select
            labelId="season-filter-label"
            id="season-filter"
            multiple
            value={selectedSeasons}
            onChange={(e) => setSelectedSeasons(e.target.value)}
            renderValue={(selected) => selected.join(", ")}
            sx={{
              height: "30px",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            {seasons.map((season) => {
              const isSelected = selectedSeasons.includes(season);
              return (
                <MenuItem
                  key={season}
                  value={season}
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    "&.Mui-selected": {
                      backgroundColor: "#f5f5f5!important",
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                      },
                    },
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  <Checkbox checked={isSelected} />
                  <ListItemText
                    primary={season}
                    sx={{
                      backgroundColor: isSelected ? "#F5F5F5" : "",
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  />
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>


        <FormControl
          sx={{
            marginLeft: "8px",
            height: "30px",
            fontFamily: "'Poppins', sans-serif",
          }}
          className="status-reporting"

        >
          <InputLabel
            id="status-filter-label"
            shrink={false}
            sx={{
              marginTop: "-12px",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            {selectedStatus.length === 0 ? "Payment status" : ""}
          </InputLabel>
          <Select
            placeholder="Filter by Status"
            labelId="status-filter-label"
            id="status-filter"
            value={selectedStatus}
            onChange={(e) =>
             { setSelectedStatus(removeUnderscore(e.target.value.toUpperCase().toLowerCase()))
              console.log(removeUnderscore(e.target.value.toUpperCase().toLowerCase()))}
            }
            
            renderValue={(selected) =>
            ({
              [""]: "All",
              ["unpaid"]: "Unpaid",
              ["paid"]: "Paid",
              ["partially_paid"]: "Partially paid",

            }[selected])
            }
            sx={{
              height: "30px",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            <MenuItem
              value=""
              sx={{
                fontFamily: "'Poppins', sans-serif",
                "&.Mui-selected": {
                  backgroundColor: "#f5f5f5",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                },
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              All
            </MenuItem>
            <MenuItem
              value="Paid"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                "&.Mui-selected": {
                  backgroundColor: "#f5f5f5",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                },
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              Paid
            </MenuItem>
            <MenuItem
              value="Unpaid"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                "&.Mui-selected": {
                  backgroundColor: "#f5f5f5",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                },
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              Unpaid
            </MenuItem>
            <MenuItem
              value="Partially paid"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                "&.Mui-selected": {
                  backgroundColor: "#f5f5f5",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                },
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              Partially paid
            </MenuItem>
          </Select>
        </FormControl>
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
            width: "70px",
            fontSize: "12px",
            padding: "4px 15px",
            borderRadius: "2px"
          }}
          onClick={() => handleCsv()}
          className="export-reporting"
        >
          Export
        </Button>
      </div>
      {/* </div> */}
    </ThemeProvider>
  );
}

export default ReportingHeader;
