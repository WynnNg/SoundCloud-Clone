'use client'
import { convertSlugUrl, sendRequest } from '@/utils/api';
import { Divider, Grid, Link } from '@mui/material';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react';

const ClientSearch = () => {

    const searchParams = useSearchParams()
    const keyword = searchParams.get('q')

    const [trackList, setTrackList] = useState<ITrackTop[] | null>(null)

    useEffect(() => {
        document.title = `Tiềm kiếm từ khóa "${keyword}" trên SoundClound`
        if (keyword) {
            fetchTrack(keyword)
        }

    }, [keyword])

    const fetchTrack = async (keyword: string) => {
        const res = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/search`,
            method: "POST",
            body: {
                current: 1,
                pageSize: 10,
                title: keyword
            }
        })
        if (res.data?.result) {
            setTrackList(res.data?.result)
        }

    }

    return (
        <>
            {!keyword || trackList?.length === 0 ?
                <>
                    <div>
                        <p>Không tồn tại kết quả tìm kiếm</p>
                    </div>
                    <Divider />
                </> :
                <div >
                    <div>
                        <p>Kết quả tìm kiếm cho từ khóa: {keyword}</p>
                    </div>
                    <Divider />
                    <div>
                        <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ marginTop: 1 }}>
                            {trackList?.map((track) => {
                                return (
                                    <Grid item xs={12} key={track._id} sx={{
                                        display: 'flex',
                                        gap: '25px'
                                    }}>
                                        <div style={{
                                            position: "relative",
                                            width: '80px',
                                            height: '80px',
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
                    </div>
                </div>}

        </>
    )
}

export default ClientSearch;