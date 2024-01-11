import { useEffect, useRef, useState } from "react";
import {  useGesture } from "@use-gesture/react";
import { useQuery } from "react-query";

import { EBoatModal, EQueryKeys, ISlip } from "../../../../types/marina.types";
import SlipService from "../../../../services/slip.service";
import Boat from "../Boat/Boat";

import MainModal from "../../Modals/MainModal/MainModal";

import "./MarinaSvg.css";
import { CircularProgress } from "@mui/material";
import useWindowDimensions from "../../../hooks/useResize";

const MarinaSvg = ({refetch}:any) => {
  const [openModal, setOpenModal] = useState(false)
  const [isRefetch, setIsRefetch] = useState<boolean>(false)

  const [currentCode, setCurrentCode] = useState<string>('')
  const [currentBoat, setCurrentBoat] = useState<any>();
  const [finger_pier, setFinger_pier] = useState<string>('')
  const [width, setWidth] = useState<string>('')
  const [maxSize, setMaxSize] = useState<string>('')
  const [type, setType] = useState<EBoatModal>(EBoatModal.FREE)
  const [scale, setScale] = useState(1);
  
  const [slipAUp, setslipAUp] = useState<ISlip[]>([]);
  const [slipADown, setslipADown] = useState<ISlip[]>([]);

  const [slipBUp, setslipBUp] = useState<ISlip[]>([]);
  const [slipBDown, setslipBDown] = useState<ISlip[]>([]);

  const [slipCUp, setslipCUp] = useState<ISlip[]>([]);
  const [slipCDown, setslipCDown] = useState<ISlip[]>([]);

  const [slipDUp, setslipDUp] = useState<ISlip[]>([]);
  const [slipDDown, setslipDDown] = useState<ISlip[]>([]);

  const [slipT, setslipT] = useState<ISlip[]>([]);

  const [crop, setCrop] = useState({ x: 0, y: 0, scale: 1 });

  const [shouldOpenAfterLoad, setShouldOpenAfterLoad] = useState<boolean>(false)

  const imageRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [zoomLimit, setZoomLimit] = useState<boolean>(false)
  const [zoomOutLimit, setZoomOutLimit] = useState<boolean>(false)
  const [count, setCount] = useState<number>(0)

  const { height, widthScreen } = useWindowDimensions();

  const getWidthCategory = (width: number): number => {
    const breakpoints = [    
      { max: 820, count: 0.45 },
      { max: 1550, count: 0.7 },
      { max: Infinity, count: 1 }
    ]

    const breakpoint = breakpoints.find(bp => width <= bp.max)
    
    return breakpoint ? breakpoint.count : 1
  }

  useEffect(() => {
    setCount(getWidthCategory(widthScreen))

  }, [widthScreen])

  const zoomIn = () => {
    setScale((prev) => {
      const newScale = prev + 0.1;
      return newScale <= 2 ? newScale : 2;
    });
  };


  const zoomOut = () => {
    setScale((prev) => {
      const newScale = prev - 0.2;
      return newScale >= count ? newScale : count;
    });
  };

  useEffect(() => {
      setZoomLimit(scale >=  2)
      setZoomOutLimit(scale <= count)
  }, [scale])


  const { data: oneSlipData, refetch: oneSlipDataRefeth } = useQuery(
    EQueryKeys.ONE_SLIP,
    () => SlipService.getOne(currentCode), {
    refetchOnWindowFocus: false,
    enabled: false,
  });

  const { data: allSlipData, isLoading, refetch: allSlipDataRefetch } = useQuery(
    EQueryKeys.ALL_SLIP,
    SlipService.getAll.bind(SlipService)
  );


  function groupObjectsByDock(result: any) {
    const groupedObjects: any = {};

    for (const obj of result) {
      const dock = obj.dock;

      if (!groupedObjects[dock]) {
        groupedObjects[dock] = [];
      }

      groupedObjects[dock].push(obj);
    }
    return groupedObjects;
  }

  useEffect(() => {
    if (currentCode) {
      oneSlipDataRefeth()
    }
  }, [currentCode])

  useEffect(() => {
    if (currentBoat) {
      setFinger_pier(currentBoat.finger_pier)
      setWidth(currentBoat.width)
      setMaxSize(currentBoat.max_size)
      setType(currentBoat.type)

      if(shouldOpenAfterLoad){
        setOpenModal(true)
        setShouldOpenAfterLoad(false)
      }
    }
  }, [currentBoat]);


  useEffect(() => {
    if (oneSlipData) {
      setCurrentBoat(oneSlipData)
    }
  }, [oneSlipData])

  useEffect(() => {
    if (isRefetch) {
      oneSlipDataRefeth()
      allSlipDataRefetch()
      setIsRefetch(false)
      refetch()
    }

  }, [isRefetch])


  const handleClick = (code: string) => {
    if (currentBoat && currentBoat.code === code) {
      setOpenModal(true)
    } else {
      setCurrentCode(code)
      setShouldOpenAfterLoad(true)
    }
  }

  useEffect(() => {
    if (allSlipData) {
      const groupedData = groupObjectsByDock(allSlipData);

      setslipAUp(groupedData.A.slice(0, 18).reverse());
      setslipADown(groupedData.A.slice(18, 36));

      setslipBUp(groupedData.B.slice(0, 13));
      setslipBDown(groupedData.B.slice(13, 26).reverse());

      setslipCUp(groupedData.C.slice(0, 18));
      setslipCDown(groupedData.C.slice(18, 36).reverse());

      setslipDUp(groupedData.D.slice(0, 16).reverse());
      setslipDDown(groupedData.D.slice(16, 32));

      setslipT(groupedData.T);
    }
  }, [allSlipData]);

  const scaling = (d:number) => {
    const minScale = count; 
    const maxScale = 2; 
    
    setScale(Math.max(minScale, Math.min(maxScale, d)))
  };
  useGesture(
    {
      onDrag: ({ offset: [dx, dy] }) => {
        setCrop((crop) => ({ ...crop, x: dx, y: dy }));
        
      },
      onPinch: ({ offset: [d] }) => {
        scaling(d);
        setCrop((crop)=>({...crop, scale:d}));
      },
    },
    {
      target: imageRef,
      eventOptions:{passive: false} 
    }
  );
 
  if (isLoading) {
    return <CircularProgress sx={{
      position: "absolute",
      inset: 0,
      margin: "auto"
    }}/>;
  }

  return (
    <div ref={containerRef} className="mainWrapper">

      <div className="zoomButtons">
        <button  disabled={scale === 2} className={!zoomLimit ? "zoomIn" : "zoomInDisabled"} onClick={zoomIn}>+</button>
        <button disabled={ count == scale } className={! (count == scale) ? "zoomIn" : "zoomOutDisabled"} onClick={zoomOut}>-</button>
      </div>
      <div
        ref={imageRef}
        style={{
          left: crop.x,
          top: crop.y,
          transform: `scale(${scale})`,
          touchAction: "none",
          cursor: "grabb",
          msTouchAction:"none"
        }}
        className="marinaWrapper"
      >


        <div className="dockA">
          {slipADown.map((boat: ISlip) => {
            return (
              <Boat
                type={boat.type}
                rotate={false}
                dock={boat.dock}
                code={boat.code}
                key={boat._id}
                handleClick={handleClick}
              />
            );
          })}
        </div>

        <div className="dockARotate">
          {slipAUp.map((boat: ISlip) => {
            return (

              <Boat
                type={boat.type}
                rotate={true}
                dock={boat.dock}
                code={boat.code}
                key={boat._id}
                handleClick={handleClick}
              />
            );
          })}
        </div>

        <div className="dockB">
          {slipBDown.map((boat: ISlip) => {
            return (
              <Boat
                type={boat.type}
                rotate={false}
                dock={boat.dock}
                code={boat.code}
                key={boat._id}
                handleClick={handleClick}

              />
            );
          })}
        </div>

        <div className="dockBRotate" >
          {slipBUp.map((boat: ISlip) => {
            return (
              <Boat
                type={boat.type}
                rotate={true}
                dock={boat.dock}
                code={boat.code}
                key={boat._id}
                handleClick={handleClick}
              />
            );
          })}
        </div>

        <div className="dockC">
          {slipCUp.map((boat: ISlip) => {
            return (
              <Boat
                type={boat.type}
                rotate={true}
                dock={boat.dock}
                code={boat.code}
                key={boat._id}
                handleClick={handleClick}
              />
            );
          })}
        </div>

        <div className="dockCRotate">
          {slipCDown.map((boat: ISlip) => {
            return (
              <Boat
                type={boat.type}
                rotate={false}
                dock={boat.dock}
                code={boat.code}
                key={boat._id}
                handleClick={handleClick}
              />
            );
          })}
        </div>

        <div className="dockD">
          {slipDDown.map((boat: ISlip) => {
            return (
              <Boat
                type={boat.type}
                rotate={false}
                dock={boat.dock}
                code={boat.code}
                key={boat._id}
                handleClick={handleClick}

              />
            );
          })}
        </div>

        <div className="dockDRotate">
          {slipDUp.map((boat: ISlip) => {
            return (
              <Boat
                type={boat.type}
                rotate={true}
                dock={boat.dock}
                code={boat.code}
                key={boat._id}
                handleClick={handleClick}

              />
            );
          })}
        </div>

        <div className="dockT">
          {slipT.map((boat: ISlip, index: number) => {
            return (
              <Boat
                type={boat.type}
                rotate={!index}
                dock={boat.dock}
                code={boat.code}
                key={boat._id}
                handleClick={handleClick}
              />
            );
          })}
        </div>
      </div>
      <div >
        {
          openModal ?
            <MainModal
              type={type}
              isOpenModal={openModal}
              setIsOpenModal={setOpenModal}
              code={currentCode}
              finger_pier={finger_pier}
              width={width}
              max_size={maxSize}
              setIsRefetch={setIsRefetch}
            /> :
            null
        }
      </div>
    </div>
  );
}

export default MarinaSvg;
