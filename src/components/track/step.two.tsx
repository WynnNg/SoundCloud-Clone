import * as React from 'react';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import { useSession } from "next-auth/react";
import { sendRequest } from '@/utils/api';
import { useToast } from '@/utils/toast';
import Image from 'next/image';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function InputFileUpload(props: any) {
    const { info, setInfo } = props
    const { data: session } = useSession();

    const handleUpload = async (images: any) => {
        const formData = new FormData();
        formData.append('fileUpload', images)

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/upload`, formData, {
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`,
                    'target_type': 'images',
                },

            })

            setInfo({
                ...info,
                imgUrl: res.data.data.fileName
            })

        } catch (error) {

            //@ts-ignore
            alert(error?.response.data.message)

        }
    }

    return (
        <Button
            onChange={(e) => {
                const event = e.target as HTMLInputElement;
                if (event.files) {
                    handleUpload(event.files[0])
                }

            }}
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
        >
            Upload file
            <VisuallyHiddenInput type="file" />
        </Button>
    );
}

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

function LinearWithValueLabel(props: Iprops) {

    return (
        <Box sx={{ width: '100%' }}>
            <LinearProgressWithLabel value={props.trackValue.percent} />
        </Box>
    );
}

const categoryArr = [
    {
        value: 'CHILL',
        label: 'CHILL',
    },
    {
        value: 'WORKOUT',
        label: 'WORKOUT',
    },
    {
        value: 'PARTY',
        label: 'PARTY',
    },

];

interface Iprops {
    trackValue: { fileName: string; percent: number; uploadedTrackName: string };
    setValue: (v: number) => void
}

interface INewTrack {
    title: string;
    description: string;
    trackUrl: string;
    imgUrl: string;
    category: string;
}

const StepTwo = (props: Iprops) => {
    const { data: session } = useSession();
    const toast = useToast()

    const { trackValue } = props

    const [info, setInfo] = React.useState<INewTrack>({
        title: "",
        description: "",
        trackUrl: "",
        imgUrl: "",
        category: "",
    })

    React.useEffect(() => {
        if (trackValue && trackValue.uploadedTrackName) {
            setInfo({
                ...info,
                trackUrl: trackValue.uploadedTrackName
            })
        }
    }, [trackValue])


    const handleSaveInfo = async () => {

        const res = await sendRequest<IBackendRes<ITrackTop[]>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks`,
            method: 'POST',
            body: {
                title: info.title,
                description: info.description,
                trackUrl: info.trackUrl,
                imgUrl: info.imgUrl,
                category: info.category
            },
            headers: {
                'Authorization': `Bearer ${session?.access_token}`,
            },
        })

        if (res.data) {
            props.setValue(0)
            toast.success("Create a new track success!")

            await sendRequest<IBackendRes<any>>({
                url: `/api/revalidate`,
                method: 'POST',
                queryParams: {
                    tag: 'track-by-profile',
                    secret: 'justarandomstring'
                },
            })
        } else {
            toast.error(res.message)

        }

    }


    return (
        <>
            <p>{trackValue.fileName}</p>
            <LinearWithValueLabel trackValue={trackValue} setValue={props.setValue} />
            <Box sx={{
                marginTop: 5
            }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4} sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        gap: '15px'
                    }}>
                        <div style={{
                            width: '200px',
                            height: '200px',
                            background: '#CCC',
                            aspectRatio: "1 / 1",
                            position: 'relative'
                        }}>
                            {info.imgUrl &&
                                <Image
                                    fill
                                    style={{
                                        objectFit: "contain",
                                    }}
                                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${info.imgUrl}`}
                                    alt='image track'
                                />

                            }
                        </div>
                        <InputFileUpload setInfo={setInfo} info={info} />
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'start',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            gap: '20px'
                        }}>
                            <TextField
                                label="Title"
                                variant="standard"
                                fullWidth
                                value={info.title}
                                onChange={(e) => {
                                    setInfo({
                                        ...info,
                                        title: e.target.value
                                    })
                                }}
                            />
                            <TextField
                                id="standard-helperText"
                                label="Description"
                                variant="standard"
                                fullWidth
                                value={info.description}
                                onChange={(e) => {
                                    setInfo({
                                        ...info,
                                        description: e.target.value
                                    })
                                }}
                            />
                            <TextField
                                select
                                label="Category"
                                defaultValue="CHILL"
                                fullWidth
                                value={info.category}
                                onChange={(e) => {
                                    setInfo({
                                        ...info,
                                        category: e.target.value
                                    })
                                }}
                                variant="standard"
                                sx={{
                                    marginTop: 2
                                }}
                            >
                                {categoryArr.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Button variant="outlined" onClick={handleSaveInfo}>Save</Button>
                        </div>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default StepTwo;