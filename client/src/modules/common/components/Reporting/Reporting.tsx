import { useContext, useState, useMemo, useEffect } from "react";
import ReportingHeader from "./ReportingHeader/ReportingHeader";
import ReportingFooter from "./ReportingFooter/ReportingFooter";
import ReportingTable from "./ReportingTable/ReportingTable";
import {  IReservationDisplay } from "../../../types/marina.types";

import { CircularProgress } from "@mui/material";
import { FilterContext } from "../../../context/filterContext"

import { StatusContext } from "../../../context/paymentContext";
import { OrderContext } from "../../../context/sortContext";
import { ReportingContext } from "../../../context/reportingContext";

const ROWS_PER_PAGE = 10;

interface IReprting {
  reportingData:IReservationDisplay[] | undefined,
  isLoading: boolean,
  refetch:any
}

function ReportingView({
  reportingData,
  isLoading,
  refetch
}: IReprting) {
 
  const {data, setData} = useContext(ReportingContext);
  const [initialData, setInitialData] = useState<IReservationDisplay[]>(reportingData? reportingData : []);
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const { selectedSeasons, setSelectedSeasons } = useContext(FilterContext);
  const { selectedStatus, setSelectedStatus } = useContext(StatusContext);
  const [selectAll, setSelectAll] = useState(false);
  const { orderBy, setOrderBy, order, setOrder } = useContext(OrderContext)
  const seasons = [...new Set(initialData.map((item) => item.season))];
  

  const handleSort = (columnId: string, currentOrder?: 'asc' | 'desc') => {
    setOrderBy(columnId);
    setOrder(currentOrder);


    if (!currentOrder) {
      setData([...initialData])
      return
    }
    const sortedData = [...initialData].sort((a, b) => {

      const fieldOne = a[columnId].toString()
      const fieldTwo = b[columnId].toString()

      if (!isNaN(Number(fieldOne)) && !isNaN(Number(fieldTwo))) {
        return currentOrder === "asc" ? Number(fieldOne) - Number(fieldTwo) : Number(fieldTwo) - Number(fieldOne)
      }

      return currentOrder === "asc" ? fieldOne.localeCompare(fieldTwo) : fieldTwo.localeCompare(fieldOne);
    });

    setData(sortedData);
  };

  const handleSelect = (item: string) => {
    setSelected((prev) => {
      const elem = prev.find(el => el === item)
      if (elem) {
        return prev.filter(el => el !== elem)
      }
      return [...prev, item]
    });
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (selectAll) {
      setSelected([]);
    } else {
      setSelected(filteredData.map((item) => item._id));
    }
  };

  const handlePageChange = (_: void, newPage: number) => {
    setPage(newPage);
  };

  const filteredData = data.filter((item: IReservationDisplay) => {
  
    return (
      (item.fullName.toLowerCase().includes(search.toLowerCase()) ||
        item.price.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase()))
      &&
      (selectedSeasons.length === 0 || selectedSeasons.includes(item.season)) &&
      (selectedStatus === "" || item.status.toLowerCase() === selectedStatus)
    );

  });


  const filteredDataIds = () => {
    return filteredData.map((item) => item._id)
  }

  const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE);

  if (isLoading) {
    return <CircularProgress sx={{
      position: "absolute",
      inset: 0,
      margin: "auto"
    }} />;
  }

  return (
    <div
      style={{
        margin: "24px",
        marginTop: "z20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >

      <ReportingHeader
        search={search}
        setSearch={setSearch}
        selectedSeasons={selectedSeasons}
        setSelectedSeasons={setSelectedSeasons}
        seasons={seasons}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selected={selected}
        filteredDataIds={filteredDataIds}
      />

      <ReportingTable
        selected={selected}
        selectAll={selectAll}
        handleSelectAll={handleSelectAll}
        handleSort={handleSort}
        handleSelect={handleSelect}
        filteredData={filteredData}
        page={page}
        rowsPerPage={ROWS_PER_PAGE}
        orderBy={orderBy}
        order={order}
      />
      <ReportingFooter
        selected={selected}
        setSelected={setSelected}
        handlePageChange={handlePageChange}
        page={page}
        totalPages={totalPages}
      />

    </div>
  );
}

export default ReportingView;
