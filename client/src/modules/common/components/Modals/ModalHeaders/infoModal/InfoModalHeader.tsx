import { EBoatTypes } from '../../../../../types/marina.types'

import { reservedStatusStyle, freeStatusStyle, labelStyles, blockedStatusStyle } from './InfoModalHeader.styles'

interface IModalHeaderProps {
    type: string
    code: string
}

export default function InfoModalHeader({type, code}: IModalHeaderProps) {

    const boatsStyle = () => {
        switch (type) {
            case EBoatTypes.FREE:
                return freeStatusStyle
            case EBoatTypes.BLOCKED:
                return blockedStatusStyle
            case EBoatTypes.RECERVED:
                return reservedStatusStyle
            default:
                return freeStatusStyle;
        }
    }

    return (
        <div style={labelStyles}>
            <h2 style={{ marginRight: '10px' }}> {code} </h2>
            <span style={boatsStyle()}>{type}</span>
        </div>
    )
}
