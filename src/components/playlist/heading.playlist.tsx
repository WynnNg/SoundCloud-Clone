'use client'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";
import AddPlaylistDialog from "@/components/dialog/addPlayList.dialog";
import AddTrackDialog from '../dialog/addTrack.dialog';



const HeadingPlaylist = (props: any) => {
    const { playlist, trackList } = props
    const [openAddPlaylist, setOpenAddPlaylist] = useState(false);
    const [openAddTrack, setOpenAddTrack] = useState(false);

    const handleOpenPlaylist = () => {
        setOpenAddPlaylist(true);
    };

    const handleOpenTrack = () => {
        setOpenAddTrack(true);
    };


    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            <h4>Danh sách phát</h4>
            <Stack spacing={2} direction="row">
                <Button startIcon={<AddIcon />} variant="outlined" onClick={handleOpenPlaylist}>PLAYLIST</Button>
                <Button startIcon={<AddIcon />} variant="outlined" onClick={handleOpenTrack}>TRACKS</Button>
            </Stack>
            <AddPlaylistDialog openAddPlaylist={openAddPlaylist} setOpenAddPlaylist={setOpenAddPlaylist} />
            <AddTrackDialog openAddTrack={openAddTrack} setOpenAddTrack={setOpenAddTrack} playlistData={playlist} trackList={trackList} />
        </div>
    )
}

export default HeadingPlaylist;