import React from 'react'
import { Button, FormControl, FormLabel, Stack } from '@mui/material';
import { Textarea } from '@mui/joy';
import { useMutation } from 'react-query';

import slipService from '../../../../services/slip.service';
import Star from '../../../../../assets/Star.svg'

import { ReservebuttonStyle, CancelbuttonStyle, BlockedReasionText, contentStyle, formWrapper, ReserveDisablebuttonStyle } from './BlockModel.styles'
import { toastError, toastSuccess } from '../../Toasts/Toasts';


interface IBlockModalProps {
    onClose: () => void
    code: string
    onCancel: () => void
}

export default function BlockModal({ code, onClose, onCancel }: IBlockModalProps) {
    const [reason, setReason] = React.useState<string>('');

    const handleSuccessClose = () => {
        toastSuccess('Slip was successfully blocked')
        onClose();
    };
    const handleErrorClose = () => {
        toastError('Blocking was failed')
        onClose();
    };

    const { mutate: blockSlip } = useMutation((req: string) => slipService.blockSlip(req, code), {
        onSuccess: handleSuccessClose,
        onError: handleErrorClose
    })

    const handleChangeReason = (event: React.ChangeEvent<HTMLTextAreaElement>)=>{
        if(event.target.value.length < 250){
            setReason(event.target.value)
        }

    }

    return (
        <div>
            <FormControl style={contentStyle}>
                <Stack style={{ ...formWrapper, flexDirection: "row" }}>
                    <img src={Star} style={{ width: '5px', height: '5px' }} />
                    <FormLabel style={{ color: '#000000', marginLeft: '8px' }}>Blocking Reason</FormLabel>
                </Stack>

                <FormControl>
                    <Textarea
                        minRows={2}
                        placeholder="Text"
                        variant="outlined"
                        style={BlockedReasionText}
                        onChange={handleChangeReason}
                        value={reason}
                    />
                </FormControl>

            </FormControl>
            <Stack direction="row" spacing={2} justifyContent={"flex-end"} marginRight={'16px'} marginTop={'10px'}>
                <Button
                    variant="outlined"
                    disableRipple
                    style={CancelbuttonStyle}
                    onClick={onCancel}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    disableRipple
                    disableElevation
                    disableTouchRipple
                    onClick={() => blockSlip(reason)}
                    style={!reason ? ReserveDisablebuttonStyle : ReservebuttonStyle}

                    disabled={!reason}
                >
                    Block
                </Button>
            </Stack>
        </div >
    );
}
