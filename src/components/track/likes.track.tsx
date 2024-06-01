'use client'
import * as React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import FaceIcon from '@mui/icons-material/Face';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { sendRequest } from '@/utils/api';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface IProps {
    track: ITrackTop | null
}

export default function LikesTrack(props: IProps) {
    const { data: session } = useSession()
    const router = useRouter();
    const [tracksLike, setTracksLike] = React.useState<ITrackLikeByUser[] | null>(null)

    const { track } = props

    React.useEffect(() => {
        fetchTracksLikeByUser()
    }, [session])

    const fetchTracksLikeByUser = async () => {
        if (session?.access_token) {
            const res = await sendRequest<IBackendRes<IModelPaginate<ITrackLikeByUser>>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
                method: 'GET',
                queryParams: {
                    current: 1,
                    pageSize: 100,
                    sort: "-createdAt",
                },
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`,
                },
            })

            if (res?.data?.result) {
                setTracksLike(res?.data?.result)
            }
        }
    }

    const handleLikeTrack = async () => {
        await sendRequest<IBackendRes<IModelPaginate<ITrackLikeByUser>>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
            method: 'POST',
            body: {
                track: track?._id,
                quantity: tracksLike?.some(t => t._id === track?._id) ? -1 : 1,
            },
            headers: {
                'Authorization': `Bearer ${session?.access_token}`,
            },
        })

        fetchTracksLikeByUser();
        await sendRequest<IBackendRes<any>>({
            url: `/api/revalidate`,
            method: 'POST',
            queryParams: {
                tag: ['track-by-id', 'liked-by-user'],
                secret: 'justarandomstring'
            },
        })

        router.refresh()
    }

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
        }}>
            <Chip
                icon={<FavoriteIcon />}
                label="Likes"
                variant="outlined"
                color={tracksLike?.some(t => t._id === track?._id) ? 'error' : 'default'}
                onClick={() => { handleLikeTrack() }}
            />
            <div style={{
                display: 'flex',
                gap: 25
            }}>
                <div style={{
                    display: 'flex',
                    gap: 5,
                    alignItems: "center"
                }}><PlayArrowIcon sx={{ fontSize: 30 }} /> <span>{track?.countPlay}</span></div>
                <div style={{
                    display: 'flex',
                    gap: 5,
                    alignItems: "center"
                }}><FavoriteIcon /> <span>{track?.countLike}</span></div>
            </div>
        </div>
    );
}