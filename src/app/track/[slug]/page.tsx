import WaveTrack from '@/components/track/wave.track';
import { sendRequest } from '@/utils/api';
import Container from '@mui/material/Container';
import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'

type Props = {
    params: { slug: string }
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {

    // read route params
    const temp = params?.slug?.split('.html');
    const temp1 = temp[0].split('-');
    const id = temp1[temp1.length - 1]

    // fetch data
    const track = await sendRequest<IBackendRes<ITrackTop>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${id}`,
        method: 'GET',
    })

    // optionally access and extend (rather than replace) parent metadata

    return {
        title: track.data?.title,
        description: track.data?.description,
        openGraph: {
            title: track.data?.title,
            description: track.data?.description,
            type: 'website',
            images: [`https://raw.githubusercontent.com/hoidanit/imageshosting/master/eric.png`],
        },
    }
}

export async function generateStaticParams() {

    return [
        { slug: 'khi-con-mo-dan-phai-664477c83457c60bc61180e5.html' },
        { slug: 'nu-hon-bisou-664477c83457c60bc61180e3.html' },
        { slug: 'mien-man-664477c83457c60bc61180e1.html' },
    ]
}


const DetailTrackPage = async (props: any) => {
    const { params } = props;

    const temp = params?.slug?.split('.html');
    const temp1 = temp[0].split('-');
    const id = temp1[temp1.length - 1]

    const res = await sendRequest<IBackendRes<ITrackTop>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${id}`,
        method: 'GET',
        nextOption: {
            next: { tags: ['track-by-id'] }
        }
    })

    const comments = await sendRequest<IBackendRes<IModelPaginate<ITrackComment>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/comments`,
        method: 'POST',
        queryParams: {
            current: 1,
            pageSize: 100,
            trackId: id,
            sort: '-createdAt'
        }
    })

    if (!res?.data) {
        notFound()
    }

    return (
        <Container>
            <div>
                <WaveTrack track={res?.data ?? null} comments={comments.data?.result ?? null} />
            </div>
        </Container>
    )
}

export default DetailTrackPage;