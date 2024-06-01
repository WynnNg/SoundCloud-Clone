'use client'
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { useTrackContext } from '@/lib/track.wrapper';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { convertSlugUrl } from '@/utils/api';

export default function MediaControlCard(props: any) {
    const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;
    const { data } = props
    const theme = useTheme();

    return (
        <Card sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="h5">
                        <Link
                            style={{ textDecoration: "none", cursor: "pointer", color: "black", fontSize: '22px' }}
                            href={`/track/${convertSlugUrl(data.title)}-${data._id}.html?audio=${data.trackUrl}`}>
                            {data.title}
                        </Link>
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                        {data.description}
                    </Typography>
                </CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                    <IconButton aria-label="previous">
                        {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
                    </IconButton>
                    {data._id === currentTrack._id && currentTrack.isPlaying === true &&

                        <IconButton aria-label="pause"
                            onClick={() => {
                                setCurrentTrack({ ...data, isPlaying: false })
                            }}
                        >
                            <PauseIcon sx={{ height: 38, width: 38 }} />

                        </IconButton>
                    }
                    {((data._id !== currentTrack._id) || (data._id === currentTrack._id && currentTrack.isPlaying === false))
                        &&
                        <IconButton aria-label="play"
                            onClick={() => {
                                setCurrentTrack({ ...data, isPlaying: true })
                            }}
                        >
                            <PlayArrowIcon sx={{ height: 38, width: 38 }} />

                        </IconButton>
                    }
                    <IconButton aria-label="next">
                        {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
                    </IconButton>
                </Box>
            </Box>
            <CardMedia
                component="img"
                sx={{ width: 151, background: '#ccc' }}
                image={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${data.imgUrl}`}
                alt={data.title}
            />
        </Card>
    );
}