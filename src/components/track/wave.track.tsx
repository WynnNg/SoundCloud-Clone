'use client'
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from 'next/navigation'
import { useWavesurfer } from "@/utils/customHook";
import './wave.scss'
import WaveSurfer, { WaveSurferOptions } from 'wavesurfer.js';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Tooltip from '@mui/material/Tooltip';
import { useTrackContext } from "@/lib/track.wrapper";
import { fetchDefaultImages, sendRequest } from "@/utils/api";
import CommentTrack from "./comment.track";
import LikesTrack from "./likes.track";
import Image from 'next/image';

interface IProps {
    track: ITrackTop | null;
    comments: ITrackComment[] | null;
}

const WaveTrack = (props: IProps) => {
    const { track, comments } = props
    const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;
    const router = useRouter();

    const containerRef = useRef<HTMLDivElement>(null);
    const hoverRef = useRef<HTMLDivElement>(null);
    const firstViewRef = useRef(true)
    const searchParams = useSearchParams()
    const fileName = searchParams.get('audio')
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [time, setTime] = useState<string>('0:00')
    const [duration, setDuration] = useState<string>('0:00')

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const secondsRemainder = Math.round(seconds) % 60
        const paddedSeconds = `0${secondsRemainder}`.slice(-2)
        return `${minutes}:${paddedSeconds}`
    }

    const optionMemo = useMemo((): Omit<WaveSurferOptions, 'container'> => {

        let gradient, progressGradient;

        if (typeof window !== 'undefined') {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')!
            // Define the waveform gradient
            gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35)
            gradient.addColorStop(0, '#656666') // Top color
            gradient.addColorStop((canvas.height * 0.7) / canvas.height, '#656666') // Top color
            gradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
            gradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
            gradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#B1B1B1') // Bottom color
            gradient.addColorStop(1, '#B1B1B1') // Bottom color

            // Define the progress gradient
            progressGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35)
            progressGradient.addColorStop(0, '#EE772F') // Top color
            progressGradient.addColorStop((canvas.height * 0.7) / canvas.height, '#EB4926') // Top color
            progressGradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
            progressGradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
            progressGradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#F6B094') // Bottom color
            progressGradient.addColorStop(1, '#F6B094') // Bottom color
        }

        return {
            waveColor: gradient,
            progressColor: progressGradient,
            url: `/api?audio=${fileName}`,
            barWidth: 3,
            height: 100,
        }
    }, [])

    const wavesurfer = useWavesurfer(containerRef, optionMemo);

    useEffect(() => {
        if (!wavesurfer) return;
        setIsPlaying(false)

        const hover = hoverRef.current!
        const waveform = containerRef.current!
        waveform.addEventListener('pointermove', (e) => (hover.style.width = `${e.offsetX}px`))

        const subscriptions = [
            wavesurfer.on('play', () => setIsPlaying(true)),
            wavesurfer.on('pause', () => setIsPlaying(false)),
            wavesurfer.on('decode', (duration) => (setDuration(formatTime(duration)))),
            wavesurfer.on('timeupdate', (currentTime) => (setTime(formatTime(currentTime)))),
            wavesurfer.once('interaction', () => {
                wavesurfer.play()
            })
        ]

        return () => {
            subscriptions.forEach((unsub) => unsub())
        }

    }, [wavesurfer])

    const onPlayClick = useCallback(() => {
        if (wavesurfer) {
            wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play()
        }
    }, [wavesurfer])


    const calLeft = (moment: number) => {
        let hardTime = wavesurfer?.getDuration() ?? 0;
        let percent = (moment / hardTime) * 100;
        return `${percent}%`
    }

    useEffect(() => {
        if (wavesurfer && currentTrack.isPlaying) {
            wavesurfer.pause();
        }
    }, [currentTrack])

    useEffect(() => {
        if (track?._id && !currentTrack?._id) {
            setCurrentTrack({ ...track, isPlaying: false })
        }
    }, [track])

    const handleIncreaseView = async () => {
        if (firstViewRef.current) {
            await sendRequest<IBackendRes<string>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/increase-view`,
                method: 'POST',
                body: {
                    trackId: track?._id,
                },
            })

            await sendRequest<IBackendRes<any>>({
                url: `/api/revalidate`,
                method: 'POST',
                queryParams: {
                    tag: 'track-by-id',
                    secret: 'justarandomstring'
                },
            })

            router.refresh()
            firstViewRef.current = false
        }



    }

    return (
        <div style={{ marginTop: 20 }}>
            <div style={{
                height: 400, background: "linear-gradient(135deg, rgb(106, 112, 67) 0%, rgb(11, 15, 20) 100%)", display: "flex",
                gap: 15,
                padding: 20,

            }}>
                <div className="left"
                    style={{
                        width: "75%",
                        height: "calc(100% - 10px)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between"
                    }}
                >

                    <div className="info" style={{ display: "flex" }}>
                        <div>
                            <div style={{
                                width: 50,
                                height: 50,
                                borderRadius: "50%",
                                background: '#f50',
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer"
                            }}
                                onClick={() => {
                                    onPlayClick()
                                    handleIncreaseView()
                                    if (track && wavesurfer) {
                                        setCurrentTrack({ ...currentTrack, isPlaying: false })
                                    }

                                }}
                            >{isPlaying ? <PauseIcon sx={{ fontSize: 30, color: 'white' }} /> : <PlayArrowIcon sx={{ fontSize: 30, color: 'white' }} />}
                            </div>
                        </div>
                        <div style={{ marginLeft: 20 }}>
                            <div style={{
                                padding: "0 5px",
                                background: "#333",
                                fontSize: 30,
                                width: "fit-content",
                                color: "white"
                            }}>
                                {track?.title}
                            </div>
                            <div style={{
                                padding: "0 5px",
                                marginTop: 10,
                                background: "#333",
                                fontSize: 20,
                                width: "fit-content",
                                color: "white"
                            }}
                            >
                                {track?.description}
                            </div>
                        </div>
                    </div>
                    <div ref={containerRef} className="wave-form-container">
                        <div className="time">{time}</div>
                        <div className="duration">{duration}</div>
                        <div ref={hoverRef} className="hover-wave"></div>
                        <div className="overlay"
                            style={{
                                position: "absolute",
                                height: "30px",
                                width: "100%",
                                bottom: "0",
                                // background: "#ccc",
                                backdropFilter: 'brightness(0.5)'
                            }}
                        ></div>
                        <div className="comments" style={{ position: 'relative' }}>
                            {comments?.map((item: ITrackComment) => {
                                return (
                                    <Tooltip title={item.content} arrow key={item._id}>
                                        <Image
                                            onPointerMove={(e) => {
                                                const hover = hoverRef.current!;
                                                hover.style.width = calLeft(item.moment)
                                            }}
                                            key={item._id}
                                            src={fetchDefaultImages(item.user.type)}
                                            style={{
                                                position: 'absolute',
                                                top: 97,
                                                left: calLeft(item.moment),
                                                zIndex: 20,
                                            }}
                                            height={20}
                                            width={20}
                                            alt="Image Track"
                                        />

                                    </Tooltip>
                                )
                            })}

                        </div>
                    </div>

                </div>
                <div className="right"
                    style={{
                        width: "25%",
                        padding: 15,
                        display: "flex",
                        alignItems: "center"
                    }}
                >
                    {track?.imgUrl ?
                        <Image
                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track?.imgUrl}`}
                            width={250}
                            height={250}
                            alt="track image"
                        />

                        :
                        <div style={{
                            background: "#ccc",
                            width: 250,
                            height: 250
                        }}>
                        </div>
                    }
                </div>
            </div>
            <div style={{
                margin: "20px 0"
            }}>
                <LikesTrack track={track} />
            </div>
            <div style={{
                margin: "50px 0"
            }}>
                <CommentTrack track={track} comments={comments} wavesurfer={wavesurfer} />
            </div>
        </div>
    )
}

export default WaveTrack;