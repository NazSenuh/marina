import * as React from 'react';
import Button from '@mui/material/Button';
import { Stack } from '@mui/material';

import {  contentStyle, ReservebuttonStyle, BlockbuttonStyle } from './Modal.styles'
import { EBoatModal } from '../../../../../types/marina.types';


interface IModalProps {
  code: string
  type: EBoatModal
  finger_pier: string
  width: string
  max_size: string
  setModalView: React.Dispatch<React.SetStateAction<EBoatModal>>
}

export default function InfoModalFree({ finger_pier, width, max_size , setModalView}: IModalProps) {


  
  return (
    <div>
        <Stack borderBottom={'1px solid #D9D9D9'} >
          <Stack direction="row">
            <div style={contentStyle}>
              <div>Finger pier: {finger_pier}</div>
              <div>Width: {width}</div>
              <div>Max boat size: {max_size}</div>
            </div>
          </Stack>
        </Stack>

      <Stack direction="row" spacing={2} justifyContent={"flex-end"} marginRight={'16px'} marginTop={'10px'}>
        <Button
          variant="outlined"
          disableRipple
          style={BlockbuttonStyle}
          onClick={()=>setModalView(EBoatModal.BLOCKED_ACTION)}
        >
          Block
        </Button>

        <Button
          variant="contained"
          disableRipple
          disableElevation
          disableTouchRipple
          style={ReservebuttonStyle}
          onClick={()=>setModalView(EBoatModal.RESERVED_ACTION)}
        >
          Reserve
        </Button>
      </Stack>
    </div>
  );
} 