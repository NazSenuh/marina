import React, { useEffect, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs';
import { Textarea } from '@mui/joy';
import { useMutation } from 'react-query';
import CloseIcon from '@mui/icons-material/Close'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FormControl, List, ListItem, ListItemButton, ListItemText, Stack } from '@mui/material'
import { LocalizationProvider, TimePicker, pickersLayoutClasses } from '@mui/x-date-pickers';
import { PickersActionBarProps } from '@mui/x-date-pickers/PickersActionBar';
import { DatePicker as DatePickerAnt } from 'antd';
import { IAnnouncement } from '../../../../types/marina.types';
import seasonService from '../../../../services/season.service';
import Star from '../../../../../assets/Star.svg'
import './AnnouncementModal.css'
import { toastError, toastSuccess } from '../../Toasts/Toasts';
import locale from 'antd/es/date-picker/locale/uk_UA';

dayjs.locale('uk-UA');
function ActionList(props: PickersActionBarProps) {
    const { onAccept, onSetToday, className } = props;
    const actions = [
        { text: "Now", method: onSetToday },
        { text: "Ok", method: onAccept }
    ];
    return (
        <List className={className}>
            {actions.map(({ text, method }) => (
                <ListItem key={text} disablePadding>
                    <ListItemButton onClick={method}  >
                        <ListItemText primary={text} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );
}

interface IBlockModalProps {
    onClose: () => void
}

export default function AnnouncementModal({ onClose }: IBlockModalProps) {
    const [announcementText, SetAnnouncementText] = useState<string>('')
    const [announcementDate, SetAnnouncementDate] = useState<dayjs.Dayjs | null>(null)
    const [announcementDateUtc, setAnnouncementDateUtc] = useState<string | undefined>()
    const [announcementTime, SetAnnouncementTime] = useState<Dayjs | null>(null)
    const [announcementTimeUtc, setAnnouncementTimeUtc] = useState<string | undefined>()

    const [dataEmpty, setDataEmpty] = useState<boolean>(true)

    useEffect(() => {
        setDataEmpty(!!(announcementText && announcementDate && announcementTime))
    }, [announcementText, announcementDate, announcementTime])

    useEffect(()=>{
        setAnnouncementDateUtc(announcementDate?.format())
        setAnnouncementTimeUtc(announcementTime?.format())
    })


    const handleSuccessClose = () => {
        toastSuccess('Announcement was sent ')
        onClose()
    }
    
    const handleErrorClose = () => {
        toastError('Announcement time must be between 15 minutes and 7 days in the future,')
    }
    const handleAnnouncementText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (event.target.value.length <= 320) {
            SetAnnouncementText(event.target.value)
        }
    }
    const { mutate: createReservation } = useMutation((data: IAnnouncement) => seasonService.sendAnnouncement(data), {
        onSuccess: handleSuccessClose,
        onError: handleErrorClose
    })

    const handleAnnouncement = async () => {
        const data = {
            message: announcementText!,
            date: announcementDateUtc!,
            time: announcementTimeUtc!
        }
        createReservation(data)
    }
    const isWithinNext7Days = (date: Dayjs) => {
        const today = dayjs().startOf('day'); 
        const next6Days = today.add(6, 'day');
        return !(date.isSame(today) || (date.isAfter(today) && date.isBefore(next6Days)));
    };

    function onChange(date:any, dateString:any) {
        SetAnnouncementDate(date)
      }

    return (
   
        <div className="modalWrapper">

            <Stack direction="row" className="titleStyle">
                <div style={{ display: "flex", alignItems: "center"}}>
                    <h2 id="parent-modal-title" style={{ marginRight: "10px", fontSize: "14px", fontWeight: 500 }}>
                        {"Send Announcement"}{" "}
                    </h2>
                </div>
                <div onClick={onClose}>
                    <CloseIcon style={{ float: "right" }}></CloseIcon>
                </div>
            </Stack>

            <div className='inputsWrapper'>
                <FormControl sx={{ width: "100%" }}>
                    <Textarea
                        minRows={2}
                        placeholder="Text"
                        variant="outlined"
                        onChange={handleAnnouncementText}
                        value={announcementText}
                    />
                </FormControl>
                <div >
                    <div className='announcementLabel'>
                        <img src={Star} alt='*' style={{ width: '5px', height: '5px' }} />
                        <label className='labelStyle'>{"Date of announcement"}</label>
                    </div>
    
                    <DatePickerAnt
                        onChange={onChange}
                        style={{width:"100%",  height:'4em'}}
                        popupStyle={{ zIndex: 9999 }}
                        inputReadOnly={true}
                        disabledDate={isWithinNext7Days}
                        placement='bottomLeft'
                        locale={locale}
                        
                        
                    />

                    <div className='announcementLabel'>
                        <img src={Star} alt='*' style={{ width: '5px', height: '5px' }} />
                        <label className='labelStyle'>{"Time of announcement "}</label>
                    </div>

                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                        <DemoContainer components={['TimePicker']} >
                            <TimePicker
                                label="Select time"                              
                                sx={{ width: "100%",
                               
                                }}
                                slots={{
                                    actionBar: ActionList
                                }}
                                

                                slotProps={{
                                    layout: {
                                        sx: {
                                            '.MuiButtonBase-root.Mui-selected': {
                                                borderColor: '#2196f3',
                                                border: '1.7px solid #2E4880',
                                                backgroundColor: '#2E4880',
                                            },
                                            [`.${pickersLayoutClasses.actionBar}`]: {
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                alignSelf: "end",
                                                justifySelf: "start",
                                                marginRight: "60px",

                                            },
                                            '.css-bmoxj4-MuiList-root-MuiMultiSectionDigitalClockSection-root':{
                                                height:"fitContent"
            
                                             },
                                            
                                            
                                          
                                            [`.${pickersLayoutClasses.actionBar} li:nth-child(1) `]: {
                                                color: "#2E4880"

                                            },
                                            [`.${pickersLayoutClasses.actionBar} li:nth-child(2) `]: {
                                                background: "#2E4880",
                                                color: "#FFF"
                                            },
                                           
                                        }
                                    },
                                }}
                                value={announcementTime}
                                onChange={(val) => SetAnnouncementTime(val ? dayjs(val) : null)}
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                </div>
            </div>

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
                 onClick={onClose}
                 >
                    Cancel
                </button>

                <button
                    disabled={!dataEmpty}
                    className={dataEmpty ? 'announcementButtonClose' : 'announcementButtonCloseDisable'}
                    onClick={handleAnnouncement}
                >
                    Send
                </button>
            </Stack>
        </div>   
    )
}
