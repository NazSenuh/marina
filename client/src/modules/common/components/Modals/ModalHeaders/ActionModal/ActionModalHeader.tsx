import { Stack } from '@mui/material'

import { titleStyle } from './ActionModalHeader.style'

interface IModalProps {
    text: string
   
  }

export default function ActionModalHeader({text}:IModalProps) {
    return (
        <Stack direction="row" style={titleStyle}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <p id="parent-modal-title" style={{ marginRight: '10px' }}>{text}</p>
            </div>
            
        </Stack>
    )
}
