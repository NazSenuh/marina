import { EBoatTypes, IBboat, EBoatDock } from "../../../../types/marina.types";

import free from '../../../../../assets/Dased.svg'
import blocked from '../../../../../assets/Blocked.svg'
import recerved from '../../../../../assets/Recerved.svg'

import'./Boat.css'

const  Boat= ({type, rotate, dock, code, handleClick}: IBboat)=> {
    
    const boats = ()=>{
        switch (type) {
            case EBoatTypes.FREE:
                return free
            case EBoatTypes.BLOCKED:
                return blocked 
            case EBoatTypes.RECERVED:
                return recerved   
            default:
                return '';
        }
    }

    const size = ()=>{
        switch (dock) {
            case EBoatDock.DockA:
                return {width:'27px', height:'67px'}
            case EBoatDock.DockB:
                return {width:'23px', height:'58px'} 
            case EBoatDock.DockC:
                return {width:'17px', height:'42px'}
            case EBoatDock.DockD:
                return {width:'27px', height:'67px'}  
            case EBoatDock.DockT:
                return {width:'27px', height:'67px'}   
            default:
                return '';
        }
    }

    const style={
        backgroundImage:`url(${boats()})`,
        rotate: rotate ? '180deg' : '0deg',
        ...size()
    }
    
   
    
    return (
      <div className="boatsWrapper" style={style} onClick={()=>handleClick(code,)}>
        <span  style={{transform:`rotate(${rotate ? '180deg': '0deg'})`}}>{code}</span>
      </div>
    );
  }
  
  export default Boat;
  