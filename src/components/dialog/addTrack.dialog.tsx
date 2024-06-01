'use client'
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { MenuItem } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import { sendRequest } from '@/utils/api';
import { useSession } from "next-auth/react";
import { useToast } from '@/utils/toast';
import { useRouter } from 'next/navigation';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(name: string, trackId: readonly string[], theme: Theme) {
    return {
        fontWeight:
            trackId.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

export default function AddTrackDialog(props: any) {

    const { openAddTrack, setOpenAddTrack, playlistData, trackList } = props
    const { data: session } = useSession()
    const router = useRouter();
    const toast = useToast()
    const theme = useTheme();

    const [playlist, setPlaylist] = React.useState('');
    const [selectedPlaylist, setSelectedPlaylist] = React.useState({});
    const [trackId, setTrackId] = React.useState<string[]>([]);

    const handleChangeTrack = (event: SelectChangeEvent<typeof trackId>) => {
        const {
            target: { value },
        } = event;
        setTrackId(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleChangePlaylist = (event: SelectChangeEvent) => {

        setPlaylist(event.target.value);

        const id = event.target.value
        const playlistItem = playlistData.find((item: any) => item._id === id)
        setSelectedPlaylist(playlistItem)

        console.log("check playlistItem", playlistItem)
    };

    const handleCloseTrack = () => {
        setOpenAddTrack(false);
        setTrackId([])
    };

    const handleSubmit = async () => {

        console.log("check selectedPlaylist", selectedPlaylist)
        console.log("check trackId", trackId)

        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists`,
            method: "PATCH",
            body: {
                //@ts-ignore
                "id": selectedPlaylist?._id,
                //@ts-ignore
                "title": selectedPlaylist?.title,
                //@ts-ignore
                "isPublic": selectedPlaylist?.isPublic,
                "tracks": trackId
            },
            headers: {
                Authorization: `Bearer ${session?.access_token}`,
            }
        })

        if (res.data) {
            toast.success("Create a new track success!")
            await sendRequest<IBackendRes<any>>({
                url: `/api/revalidate`,
                method: 'POST',
                queryParams: {
                    tag: 'playlist-by-user',
                    secret: 'justarandomstring'
                },
            })
            router.refresh()
        } else {
            toast.error(res.message)
        }

        handleCloseTrack();
    }


    return (
        <React.Fragment>
            <Dialog
                open={openAddTrack}
                onClose={handleCloseTrack}

            >
                <DialogTitle>Thêm mới track vào playlist:</DialogTitle>
                <DialogContent sx={{ width: '600px' }}>
                    <Box sx={{ width: '100%', marginBottom: 5 }}>
                        <InputLabel id="playlist-select">Chọn playlist</InputLabel>
                        <Select
                            labelId="playlist-select"
                            id="playlist-select"
                            name='playlist'
                            value={playlist}
                            onChange={handleChangePlaylist}
                            label="Chọn playlist"
                            fullWidth
                            variant="standard"
                        >
                            {playlistData.map((item: any) => {
                                return (
                                    <MenuItem value={item._id} key={item._id}>
                                        <em>{item.title}</em>
                                    </MenuItem>
                                )
                            })}
                        </Select>
                    </Box>
                    <Box sx={{ width: '100%' }}>
                        <InputLabel id="demo-multiple-chip-label">Chip</InputLabel>
                        <Select
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            name='track'
                            multiple
                            fullWidth
                            value={trackId}
                            onChange={handleChangeTrack}
                            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => {
                                        const trackData = trackList.find((item: any) => item._id === value)
                                        return (
                                            <Chip key={value} label={trackData.title} />
                                        )
                                    })}
                                </Box>
                            )}
                            MenuProps={MenuProps}
                        >
                            {trackList.map((track: any) => (
                                <MenuItem
                                    key={track._id}
                                    value={track._id}
                                    style={getStyles(track.title, trackId, theme)}
                                >
                                    {track.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseTrack}>Cancel</Button>
                    <Button onClick={handleSubmit}>Save</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}