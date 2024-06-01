'use client'
import AppBar from '@mui/material/AppBar';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import Container from '@mui/material/Container';
import { useHasMounted } from '@/utils/customHook';
import { useEffect, useRef } from 'react';
import { useTrackContext } from '@/lib/track.wrapper';


const AppFooter = () => {
    const hasMouted = useHasMounted()
    const playerRef = useRef(null)
    const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;

    useEffect(() => {
        if (currentTrack?.isPlaying === false) {
            //@ts-ignore
            playerRef?.current?.audio?.current?.pause();
        }
        if (currentTrack?.isPlaying === true) {
            //@ts-ignore
            playerRef?.current?.audio?.current?.play();
        }
    }, [currentTrack])

    if (!hasMouted) return (<></>)

    return (
        <> {currentTrack._id &&
            <div style={{ marginTop: 100, }}>
                <AppBar position="fixed" sx={{ top: 'auto', bottom: 0, background: '#f2f2f2', }}>
                    <Container sx={{
                        display: 'flex',
                        '.rhap_main': { gap: '30px' }

                    }}>
                        <AudioPlayer
                            ref={playerRef}
                            layout='horizontal-reverse'
                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${currentTrack.trackUrl}`}
                            onPlay={() => {

                                setCurrentTrack({ ...currentTrack, isPlaying: true })
                            }}
                            onPause={() => {

                                setCurrentTrack({ ...currentTrack, isPlaying: false })
                            }}
                            style={{
                                boxShadow: 'none',
                                background: '#f2f2f2'
                            }}
                        // other props here
                        />
                        <div style={{
                            display: 'flex',
                            minWidth: 100,
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}>
                            <div style={{
                                color: '#ccc',
                                width: '100%',
                                margin: "0",
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}>{currentTrack.title}</div>
                            <div style={{
                                color: 'black',
                                width: '100%',
                                margin: "0",
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}>{currentTrack.description}</div>
                        </div>
                    </Container>
                </AppBar>
            </div>
        }
        </>
    )
}

export default AppFooter;