import HeadingPlaylist from "@/components/playlist/heading.playlist";
import Container from "@mui/material/Container";
import Divider from '@mui/material/Divider';
import * as React from 'react';

import { sendRequest } from '@/utils/api';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import MainPlaylist from "@/components/playlist/main.playlist";

const PlaylistPage = async () => {
    const session = await getServerSession(authOptions)

    //@ts-ignore
    const res = await sendRequest<IBackendRes<IModelPaginate<IPlaylist>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/by-user`,
        method: "POST",
        queryParams: { current: 1, pageSize: 100 },
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
        nextOption: {
            next: { tags: ['playlist-by-user'] }
        }
    })

    const playlist = res?.data?.result ?? [];

    const res1 = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks`,
        method: "GET",
        queryParams: { current: 1, pageSize: 100 },
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        }
    })

    const trackList = res1.data?.result ?? []

    console.log("check trackList", trackList)

    return (
        <Container sx={{
            background: 'hsla(215, 15%, 97%, 1)',
            color: 'black',
            mt: 3,
            borderRadius: 1,
            padding: 3
        }}>
            <HeadingPlaylist playlist={playlist} trackList={trackList} />
            <Divider />
            <div style={{
                marginTop: 20
            }}>
                <MainPlaylist playlist={playlist} />
            </div>
        </Container>
    )
}

export default PlaylistPage;