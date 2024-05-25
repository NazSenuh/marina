//@ts-nocheck
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Box,
  Stack,
  Icon,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import noData from "../../../../../assets/empty-img-gray.svg";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close'
import { SortArrow } from "../../SvgComponents/common/sort-arrow.component";
import Chip from "./Chip";
import { useMutation, useQuery } from "react-query";
import reservationService from "../../../../services/reservation.service";
import { EQueryKeys } from "../../../../types/marina.types";
import ModalTrigger from "../../ModalTrigger/ModalTrigger";
import { Button } from "antd";
import slipService from "../../../../services/slip.service";

import './ReportingTable.css'


const theme = createTheme({
  components: {
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

export const ReportingTable = ({
  selected,
  selectAll,
  handleSelectAll,
  handleSort,
  handleSelect,
  filteredData,
  page,
  rowsPerPage,
  orderBy,
  order,
}) => {
  const columns = {
    fullName: "Ім'я",
    phoneNumber: "Номер телефону",
    parkingDuration: "Тривалість парковки",
    price: "Ціна",
    type: "Статус резервації"
  };
  const [dataLength, setDataLength] = useState(1)
  const [selectedLength, setSelectedLength] = useState(selected.length)
  const [isOpenModal, setIsOpenModal] = useState(false);

  const columnsMap = new Map(Object.entries(columns));


  const styles = {
    counter: {
      backgroundColor: "#0000000F",
      color: "white",
      padding: "8px",
      display: "flex",
      alignItems: "center",
    },
  };

  const {
    refetch: reportingRefetch,
  } = useQuery(
    EQueryKeys.ALL_REPORTS,
    reservationService.getAllReservations.bind(reservationService)
  );

  const { refetch: allSlipDataRefetch } = useQuery(
    EQueryKeys.ALL_SLIP,
    slipService.getAll.bind(slipService)
  );

  const { mutate: deleteReservation } = useMutation<string, AxiosError<any>>((req) => reservationService.deleteReservation(selected), {
    onSuccess: () => handleDelete()
  })

  const handleDelete = () => {
    reportingRefetch()
    allSlipDataRefetch()
    setSelectedLength(0)
    handleClose()
  }
  const handleClick = () => {
    deleteReservation()
  }


  const labelId = (_id) => `enhanced-table-checkbox-${_id}`;
  const isItemSelected = (_id) => selected.indexOf(_id) !== -1;


  const BasicCustomColumnHeaderCell = ({
    children,
    onSort,
    backgroundColor,
    border,
    styles

  }) => {

    return (
      <TableCell
        padding="checkbox"
        sx={{
          backgroundColor: backgroundColor ?? "#FAFAFA",
          ...styles,
        }}
        onClick={onSort}

      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderRight: border ?? "1px solid #EBEBEB",
            padding: "8px",

          }}
        >
          {children}
        </Box>
      </TableCell>
    );
  };

  const CustomColumnHeaderCell = ({
    children,
    onSort,
    backgroundColor,
    border,
    orderBy,
    columnId,
    order

  }) => {

    return (
      <BasicCustomColumnHeaderCell
        backgroundColor={backgroundColor}
        border={border}
      >
        {children}
        <SortArrow onSort={onSort} order={orderBy === columnId ? order : undefined} />

      </BasicCustomColumnHeaderCell>
    );
  };

  const CustomTableBodyCell = ({ children, width }) => {
    return (
      <TableCell
        sx={{
          fontFamily: '"Poppins", sans-serif',
        }}
      >
        <div
          style={{
            display: "block",
            minWidth: width ?? "150px",
          }}
        >
          {children}
        </div>
      </TableCell>
    );
  };
  useEffect(() => {
    if (filteredData) {
      setDataLength(filteredData.length);

    }
  }, [filteredData])



  useEffect(() => {
    setSelectedLength(selected.length)
  }, [selected])

  const handleOpen = () => {
    setIsOpenModal(true);
  };
  const handleClose = () => {
    setIsOpenModal(false);
  };

  const removeUnderscore = (str: string | undefined): string | undefined => {
    if (str) {
      const words = str.split('_');

      if (words.length > 0) {
        words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
      }
    
      const capitalizedWords = words.slice(1).map(word => word.charAt(0).toLocaleLowerCase() + word.slice(1));
      const result = [words[0], ...capitalizedWords].join(' ');
    
      return result;
    }
    return str
  }
  const rentConfig = {
    "closed":"завершене",
    "active":"активне",
    "canceled":"скасоване"
  }

  return (
    <ThemeProvider theme={theme}>
      {!dataLength ?
        <div style={{ display: "flex", position: "absolute", top: "50%", alignItems: "center", justifyItems: "center", flexDirection: "column" }}>
          <img src={noData} />
          <div>No Data</div>
        </div>
        :
        <>
          <TableContainer
            component={Paper}
            sx={{
              fontFamily: '"Poppins", sans-serif',
              border: "1px solid #F0F0F0",
              boxShadow: "none",
              backgroundColor: "#FAFAFA",
            }}
          >

            <Table >
              <TableHead>
                <TableRow sx={styles.columnHeader}>
                  {!filteredData ?
                    <>
                      <BasicCustomColumnHeaderCell padding="checkbox" border="none">
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRight: "1px solid #EBEBEB",
                            paddingRight: "8px",
                            marginLeft: "4px",
                          }}
                        >
                          <Checkbox
                            indeterminate={
                              selectedLength > 0 &&
                              selectedLength < filteredData.length
                            }
                            checked={selectAll}
                            onChange={handleSelectAll}
                            sx={{ color: "1px solid #D5D5D5" }}
                          />
                        </Box>
                      </BasicCustomColumnHeaderCell>

                      {!selected.length ?
                        Object.keys(columns).map((columnId, i) => {

                          const sortColumnById = (currentOrder: 'asc' | 'desc') => {
                            handleSort(columnId, currentOrder);
                          };

                          return (
                            <CustomColumnHeaderCell
                              onSort={sortColumnById}
                              key={i}
                              columnId={columnId}
                              orderBy={orderBy}
                              order={order}
                            >
                              {columnsMap.get(columnId)}
                            </CustomColumnHeaderCell>
                          );
                        })
                        :
                        <BasicCustomColumnHeaderCell >
                          {selectedLength} Selected
                        </BasicCustomColumnHeaderCell>
                      }
                    </>
                    :
                    <>
                      <BasicCustomColumnHeaderCell padding="checkbox" border="none">
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRight: "1px solid #EBEBEB",
                            paddingRight: "8px",
                            marginLeft: "4px",
                          }}
                        >
                          <Checkbox
                            indeterminate={
                              selectedLength > 0 &&
                              selectedLength < filteredData.length
                            }
                            checked={selectAll}
                            onChange={handleSelectAll}
                            sx={{ color: "1px solid #D5D5D5" }}
                          />
                        </Box>
                      </BasicCustomColumnHeaderCell>

                      {!selectedLength ?
                        Object.keys(columns).map((columnId, i) => {
                          const sortColumnById = (currentOrder: 'asc' | 'desc') => {
                            handleSort(columnId, currentOrder);
                          };

                          return (
                            <CustomColumnHeaderCell
                              onSort={sortColumnById}
                              key={i}
                              columnId={columnId}
                              orderBy={orderBy}
                              order={order}

                            >
                              {columnsMap.get(columnId)}
                            </CustomColumnHeaderCell>
                          );
                        })
                        :
                        <>
                          <BasicCustomColumnHeaderCell >
                            {selectedLength} Selected
                          </BasicCustomColumnHeaderCell>
                          <BasicCustomColumnHeaderCell >
                          </BasicCustomColumnHeaderCell><BasicCustomColumnHeaderCell >
                          </BasicCustomColumnHeaderCell><BasicCustomColumnHeaderCell >
                         
                          </BasicCustomColumnHeaderCell>

                          <ModalTrigger
                            isOpenModal={isOpenModal}
                            setIsOpenModal={setIsOpenModal}
                            handleSuccess={handleClick}
                            modalTrigger={

                              <BasicCustomColumnHeaderCell styles={{ position: 'relative !important', color: "#8C8C8C", fontSize: "12px", fontWeight: "500", alignSelf: "center", width: '0px !important', cursor: "pointer", width: "100px" }} >
                                <div className="deleteRows" onClick={handleOpen}>
                                  <Icon sx={{ color: "gray", display: "flex  !important", justifyContent: "center  !important", alignItems: "center  !important" }}><DeleteOutlineIcon /></Icon>
                                  <span style={{ letterSpacing: '0.5px' }}>
                                    Delete selected
                                  </span>
                                </div>
                              </BasicCustomColumnHeaderCell>

                            }
                          >
                            <div className='style' >
                              <div direction="row" className="titleStyle">
                                <div style={{ display: "flex", alignItems: "center" }}>
                                  <h2 id="parent-modal-title" style={{ marginRight: "10px" }}>
                                    {" "}
                                    {"Close season"}{" "}
                                  </h2>
                                </div>
                                <div onClick={handleClose}>

                                  <CloseIcon style={{ float: "right" }}></CloseIcon>
                                </div>
                              </div>

                              <p id="parent-modal-description" className="contentStyle">
                                {"Are you sure you want to delete this rows?"}
                              </p>
                              <Stack
                                direction="row"
                                spacing={2}
                                justifyContent={"flex-end"}
                                marginRight={"16px"}
                                marginTop={"10px"}
                                marginBottom={"10px"}
                              >
                                <button
                                  className="cancelButtonStyles"
                                  onClick={handleClose}
                                >
                                  Cancel
                                </button>

                                <Button
                                  variant="contained"
                                  disableRipple
                                  disableElevation
                                  disableTouchRipple
                                  className='successButtonClose'
                                  onClick={handleClick}
                                >
                                  Yes
                                </Button>
                              </Stack>
                            </div>

                          </ModalTrigger>
                        </>
                      }
                    </>
                  }
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, i) => (
                    <TableRow
                      key={item._id}
                      sx={{
                        backgroundColor: isItemSelected(item._id)
                          ? "#EFF4FD"
                          : "transparent",
                        borderTop: "solid 1px rgba(0, 0, 0, 0.06)"
                      }}
                    >
                      <CustomTableBodyCell width="42px">
                        <Checkbox
                          checked={isItemSelected(item._id)}
                          onChange={() => handleSelect(item._id)}
                          inputProps={{ "aria-labelledby": labelId(item._id) }}
                        />
                      </CustomTableBodyCell>

                      <CustomTableBodyCell >{item.fullName}</CustomTableBodyCell>
                      <CustomTableBodyCell width={"150px"}>{item.phoneNumber}</CustomTableBodyCell>
                      <CustomTableBodyCell width={"200px"}>
                        {item.parkingDuration}
                      </CustomTableBodyCell>
                     
                      <CustomTableBodyCell>{item.price}</CustomTableBodyCell>
                      
                      

                      <CustomTableBodyCell>
                        {(() => {
                          const chipProps = {
                            ["closed"]: {
                              display: "inline",
                              borderColor: "#7D97CF",
                              backgroundColor: "#EFF4FD",
                              color: "#2E4880",
                              width: "61px",
                            },
                            ["active"]: {
                              display: "inline",
                              borderColor: "#B7EB8F",
                              backgroundColor: "#F6FFED",
                              color: "#237804",
                              width: "60px",
                            },
                            ["canceled"]: {
                              display: "inline",
                              borderColor: "#FFA39E",
                              backgroundColor: "#FFF1F0",
                              color: "#CF1322",
                              width: "70px",
                            },
                          }[item.type.toUpperCase().toLowerCase()];
                          chipProps.text = rentConfig[item.type];
                          return <Chip {...chipProps} key={i} />;
                        })()}
                      </CustomTableBodyCell>

                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

        </>}
    </ThemeProvider>
  );

};

export default ReportingTable;
