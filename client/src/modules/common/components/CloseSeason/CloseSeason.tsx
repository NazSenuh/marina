import React, { useState } from "react";
import { AxiosError } from "axios";
import { useMutation, useQuery } from "react-query";
import seasonService from "../../../services/season.service";
import CloseIcon from '@mui/icons-material/Close'
import ModalTrigger from "../ModalTrigger/ModalTrigger";
import { Box, Button, Stack } from "@mui/material";

import "./CloseSeason.css";
import { EQueryKeys } from "../../../types/marina.types";
import slipService from "../../../services/slip.service";

function CloseSeason() {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleOpen = () => {
    setIsOpenModal(true);
  };

  const handleClose = () => {
    setIsOpenModal(false);
  };

  const { refetch: allSlipDataRefetch } = useQuery(
    EQueryKeys.ALL_SLIP,
    ()=>slipService.getAll(), {
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );
 
  const { mutate: closeActiveSeasonAndCreateNew } = useMutation<
    string,
    AxiosError<any>,
    void
  >(() => {
    handleClose();
    return seasonService.closeActiveSeasonAndCreateNew();
  }, {onSuccess: ()=> allSlipDataRefetch() });


  const handleYes = async () => {
    closeActiveSeasonAndCreateNew();
  };

  return (
    <ModalTrigger
      isOpenModal={isOpenModal}
      setIsOpenModal={setIsOpenModal}
      handleSuccess={handleYes}
      modalTrigger={<div style={{cursor:"pointer"}} onClick={handleOpen}>Close Season</div>}
    >
      <Box className='style' >
          <Stack direction="row" className="titleStyle">
            <div style={{ display: "flex", alignItems: "center"}}>
              <h2 id="parent-modal-title" style={{ marginRight: "10px" }}>
                {" "}
                {"Close season"}{" "}
              </h2>
            </div>
            <div onClick={handleClose}>

            <CloseIcon style={{ float: "right" } }></CloseIcon>
            </div>
          </Stack>

          <p id="parent-modal-description" className="contentStyle">
            {"Are you sure you want to close the season? All slips will become available, and reservation data will only be accessible in the Reporting section."}
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
              onClick={handleYes}
            >
              Yes
            </Button>
          </Stack>
        </Box>
    </ModalTrigger>
  );
}

export default CloseSeason;

