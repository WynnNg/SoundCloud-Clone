import Container from "@mui/material/Container";
import ClientSearch from "./components/client.search";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'search your tracks',
    description: 'Hãy tìm kiếm những bài hát bạn yêu thích'
}

const SearchPage = () => {

    return (
        <Container sx={{ my: 5 }}>
            <ClientSearch />
        </Container>
    )
}

export default SearchPage;