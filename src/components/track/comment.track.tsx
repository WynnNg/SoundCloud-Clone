'use client'
import { fetchDefaultImages, sendRequest } from "@/utils/api";
import { TextField } from "@mui/material";
import { useSession } from "next-auth/react";
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';

dayjs.extend(duration);
dayjs.extend(relativeTime)


interface IProps {
    track: ITrackTop | null;
    comments: ITrackComment[] | null;
    wavesurfer: any
}

const CommentTrack = (props: IProps) => {
    const { data: session } = useSession()
    const router = useRouter();
    const { track, comments, wavesurfer } = props;
    const [yourComment, setYourComment] = useState('')


    const handleSubmit = async () => {
        const res = await sendRequest<IBackendRes<IModelPaginate<ITrackComment>>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments`,
            method: 'POST',
            body: {
                content: yourComment,
                moment: Math.round(wavesurfer?.getCurrentTime() ?? 0),
                track: track?._id,
            },
            headers: {
                'Authorization': `Bearer ${session?.access_token}`,
            },
        })

        if (res.data) {
            setYourComment('');
            router.refresh();
        }
    }

    const handleJumpTrack = (moment: number) => {
        if (wavesurfer) {
            const duration = wavesurfer.getDuration();
            wavesurfer.seekTo(moment / duration);
            wavesurfer.play();
        }
    }

    return (
        <>
            <div>
                <div>
                    <TextField
                        value={yourComment}
                        fullWidth
                        label="Comments"
                        variant="standard"
                        onChange={(e) => {
                            setYourComment(e.target.value)
                        }}
                        onKeyDown={(e) => {
                            if (e.code === 'Enter') {
                                handleSubmit()
                            }
                        }}
                    />
                </div>
                <div style={{
                    marginTop: 50,
                    display: 'flex',
                    gap: 50,
                }}>
                    <div>
                        {session ?
                            <>
                                <Image
                                    width={150}
                                    height={150}
                                    src={fetchDefaultImages(session.user.type)}
                                    alt="comment image"
                                />

                                <p style={{
                                    marginTop: 3,
                                }}>{session.user.email}</p>
                            </>
                            :
                            ""
                        }
                    </div>
                    <div style={{
                        width: "100%",
                    }}>
                        {comments && comments.map((comment) => {
                            return (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    width: "100%",
                                    margin: '30px 0'
                                }}
                                    key={comment._id}
                                >
                                    <div style={{
                                        display: 'flex',
                                        gap: 15,
                                    }}>
                                        <Image
                                            width={50}
                                            height={50}
                                            src={fetchDefaultImages(comment.user.type)}
                                            alt="comment image"
                                        />
                                        <div>
                                            <p style={{
                                                margin: 0,
                                            }}

                                            ><span>{comment.user.email} at </span><span
                                                style={{
                                                    cursor: 'pointer',
                                                    color: '#5AB2FF',
                                                    margin: 0,
                                                }}

                                                onClick={() => {
                                                    handleJumpTrack(comment.moment)
                                                }}

                                            >{dayjs.duration(comment.moment, 'seconds').format('mm:ss')}</span></p>

                                            <p style={{
                                                margin: 0,
                                            }}>{comment.content}</p>
                                        </div>
                                    </div>
                                    <div>{dayjs(comment.createdAt).fromNow()}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}

export default CommentTrack;