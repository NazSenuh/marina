//@ts-nocheck
import React, {useState} from "react";
import { Box, IconButton, PaginationItem, Typography } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import "./ReportingFooter.css";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";

function ReportingFooter({
  selected,
  setSelected,
  handlePageChange,
  page,
  totalPages,
}) {
  const styles = {
    counter: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: "20px",
      marginBottom: "20px",
    },
  };
  const theme = createTheme({
    components: {},
  });

  const calculatePage = () =>{

  }

  return (
    <ThemeProvider theme={theme}>
      {
        totalPages ?
      
      <Box style={styles.counter}>
        
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconButton
            onClick={() => handlePageChange(null, page - 1)}
            disabled={page === 0}
            aria-label="previous page"
            sx={{
              border: "1px solid #D9D9D9",
              width: "40px",
              height: "40px",
              borderRadius: "2px",
              color: "#D9D9D9",
            }}
          >
            <KeyboardArrowLeft />
          </IconButton>
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={(_, page) => {
              handlePageChange(null, page - 1);
            }}
            color="primary"
            hideNextButton
            hidePrevButton
            renderItem={(item) => (
              //item.page < page + 1 || item.page > page + 1  ? null : 
              
              <PaginationItem
                {...item}
                sx={{
                  border: "1px solid #D9D9D9",
                  color: "#d9d9d9",
                  "&.Mui-selected": {
                    borderColor: "#2E4880",
                    color: "#2E4880",
                    backgroundColor: "#fff",
                    "&:hover": {
                      backgroundColor: "#fff",
                    },
                  },
                }}
              />
            )}
          />
          <IconButton
            onClick={() => handlePageChange(null, page + 1)}
            disabled={page === totalPages - 1}
            aria-label="next page"
            sx={{
              border: "1px solid #D9D9D9",
              width: "40px",
              height: "40px",
              borderRadius: "2px",
              color: "#D9D9D9",
            }}
          >
            <KeyboardArrowRight />
          </IconButton>
        </div>
      </Box>
      :null}
    </ThemeProvider>
  );
}

export default ReportingFooter;
