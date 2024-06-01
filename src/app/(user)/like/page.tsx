import { convertSlugUrl, sendRequest } from "@/utils/api";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Image from "next/image";
import { Link } from "@mui/material";

const LikePage = async () => {
    const session = await getServerSession(authOptions)

    const res = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
        method: "GET",
        queryParams: { current: 1, pageSize: 100 },
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
        nextOption: {
            next: { tags: ['liked-by-user'] }
        }
    })

    const tracksLike = res.data?.result ?? []

    return (
        <>
            <Container>
                <Box sx={{ width: '100%', marginTop: '25px' }}>
                    <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        {tracksLike.map((track) => {
                            return (
                                <Grid item xs={6} sm={4} md={2} key={track._id}>
                                    <div style={{
                                        position: "relative",
                                        width: '180px',
                                        height: '180px',
                                    }}>
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`}
                                            alt="image slider"
                                            fill
                                            sizes=""
                                        />
                                    </div>

                                    <Link sx={{
                                        textDecoration: 'none',
                                        color: 'black'
                                    }} href={`/track/${convertSlugUrl(track.title)}-${track._id}.html?audio=${track.trackUrl}`}>
                                        <p>{track.title}</p>
                                    </Link>
                                </Grid>
                            )
                        })}

                    </Grid>
                </Box>
            </Container>
        </>
    )
}

export default LikePage;