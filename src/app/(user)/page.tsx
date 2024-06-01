import MainSlider from "@/components/main/main.slider";
import { sendRequest } from "@/utils/api";
import Container from '@mui/material/Container';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export default async function HomePage() {
  const session = await getServerSession(authOptions)

  const chill = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: 'POST',
    body: {
      category: 'CHILL',
      limit: 10,
    }
  })

  const workout = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: 'POST',
    body: {
      category: 'WORKOUT',
      limit: 10,
    }
  })

  const party = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: 'POST',
    body: {
      category: 'PARTY',
      limit: 10,
    }
  })


  return (
    <Container>
      <MainSlider tittle="Top Chill" data={chill?.data ?? []} />
      <MainSlider tittle="Top Workout" data={workout?.data ?? []} />
      <MainSlider tittle="Top Party" data={party?.data ?? []} />
    </Container>
  );
}
