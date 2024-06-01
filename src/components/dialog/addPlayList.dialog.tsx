'use client'
import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Switch from '@mui/material/Switch';
import DialogTitle from '@mui/material/DialogTitle';
import { FormControlLabel } from '@mui/material';
import { sendRequest } from '@/utils/api';
import { useSession } from "next-auth/react";
import { useToast } from '@/utils/toast';
import { useRouter } from 'next/navigation';

export default function AddPlaylistDialog(props: any) {
    const { data: session } = useSession()
    const router = useRouter();
    const toast = useToast()
    const { openAddPlaylist, setOpenAddPlaylist } = props

    const handleClosePlaylist = () => {
        setOpenAddPlaylist(false);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries((formData as any).entries());
        const title = formJson.title;

        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/empty`,
            method: "POST",
            body: { title, isPublic: true },
            headers: {
                Authorization: `Bearer ${session?.access_token}`,
            }
        })

        if (res.data) {
            toast.success("Create a new playlist success!")
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

        handleClosePlaylist();
    }

    return (
        <React.Fragment>
            <Dialog
                open={openAddPlaylist}
                onClose={handleClosePlaylist}
                PaperProps={{
                    component: 'form',
                    onSubmit: handleSubmit,
                }}
            >
                <DialogTitle>Thêm mới playlist:</DialogTitle>
                <DialogContent sx={{ width: '600px' }}>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        name="title"
                        label="Tiêu đề playlist"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    <FormControlLabel sx={{ marginTop: 2 }} control={<Switch defaultChecked />} label="Public" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePlaylist}>Cancel</Button>
                    <Button type="submit">Save</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}