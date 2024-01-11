import React, { useEffect } from 'react'

import { Box, Button, CircularProgress, FormControl, Stack } from '@mui/material';
import { Textarea } from '@mui/joy';
import { useMutation, useQuery } from 'react-query';

import { ReservebuttonStyle, textStyle, contentStyle } from './InfoBlocked.styles'
import slipService from '../../../../../services/slip.service';
import { EBoatModal, EQueryKeys } from '../../../../../types/marina.types';
import { toastError, toastSuccess } from '../../../Toasts/Toasts';


interface IModalProps {
    code: string
    type: EBoatModal
    onClose: ()=> void
    setModalView: React.Dispatch<React.SetStateAction<EBoatModal>>
}
  
export default function InfoModalBlocked({code, type, onClose, setModalView}:IModalProps) {
    const [reason, setReason] = React.useState<any>()
    const [currentBoat, setCurrentBoat] = React.useState<any>();

    const handleSuccessClose = () => {
        toastSuccess('Slip was successfully unblocked')
        onClose();
    };
    const handleErrorClose = () => {
        toastError('Unblocking was failed')
        onClose();
    };

    const {mutate: unBlockSlip, isLoading} = useMutation((req:string) => slipService.unBlockSlip(req),{
        onSuccess: handleSuccessClose,
        onError: handleErrorClose
    })
    
    const { data: oneSlipData} = useQuery(
        EQueryKeys.ONE_SLIP,
        ()=>slipService.getOne(code), {
        refetchOnWindowFocus: false,
        enabled: false,
      });

      
      useEffect(() => {
        if (oneSlipData) {
            setCurrentBoat(oneSlipData)
        }
      }, [oneSlipData])

      useEffect(() => {
        if (currentBoat) {
            setReason(currentBoat.blockingReason.reason)
        }
      }, [currentBoat]);
    

    return (
        <div>
                <Box>

                    <FormControl style={contentStyle}>
                      <Textarea
                        minRows={2}
                        maxRows={10}
                        style={textStyle}
                        readOnly
                        disabled
                        
                        defaultValue={reason}
                      >
                      </Textarea>
                      
                    </FormControl>
                    <Stack direction="row" spacing={2} justifyContent={"flex-end"} marginRight={'16px'} marginTop={'10px'}>

                        <Button
                            variant="contained"
                            disableRipple
                            disableElevation
                            disableTouchRipple
                            style={ReservebuttonStyle}
                            onClick={()=>setModalView(EBoatModal.CANCEL_BLOCK_ACTION) }
                        > 
                            {isLoading ?  <CircularProgress /> :
                           <p>Unblock</p>}
                        </Button>
                    </Stack>
                </Box>
        </div>
    );
}
