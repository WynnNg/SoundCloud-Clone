import MediaControlCard from "@/components/ImageCard/ImageCard";
import { sendRequest } from "@/utils/api"
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

const ProfilePage = async ({ params }: { params: { slug: string } }) => {

    const res = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/users?current=1&pageSize=10`,
        method: 'POST',
        body: {
            id: params.slug
        },
        nextOption: {
            next: { tag: ['track-by-profile'] }
        }
    })

    const data = res.data?.result ?? [];

    return (

        <Container>
            <Box sx={{ width: '100%', marginTop: '25px' }}>
                <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    {data.map((track) => {
                        return (
                            <Grid item xs={6} key={track._id}>
                                <MediaControlCard
                                    data={track}
                                />
                            </Grid>
                        )
                    })}

                </Grid>
            </Box>
        </Container>
    )
}

export default ProfilePage