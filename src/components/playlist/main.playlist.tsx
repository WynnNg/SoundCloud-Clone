'use client'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import Divider from '@mui/material/Divider';
import { useTrackContext } from '@/lib/track.wrapper';
import { convertSlugUrl } from '@/utils/api';
import { Link } from '@mui/material';

const style = {
    py: 0,
    width: '100%',
    minWidth: 360,
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'divider',
    backgroundColor: 'background.paper',
};

const MainPlaylist = (props: any) => {
    const { playlist } = props
    const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;

    const handlePlay = (track: any) => {
        setCurrentTrack({ ...track, isPlaying: true })
    }

    const handlePause = (track: any) => {
        setCurrentTrack({ ...track, isPlaying: false })
    }

    return (
        <>
            {playlist?.map((item: any) => {

                return (
                    <Accordion key={item._id}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                            sx={{ color: '#ccc' }}
                        >
                            {item.title}
                        </AccordionSummary>
                        <AccordionDetails>
                            {item.tracks.length === 0 ? 'No data' :
                                <List sx={style}>
                                    {item.tracks.map((t: any) => {
                                        return (
                                            <>
                                                <ListItem key={t._id} sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between'
                                                }}>
                                                    <Link sx={{
                                                        textDecoration: 'none',
                                                        color: 'black'
                                                    }} href={`/track/${convertSlugUrl(t.title)}-${t._id}.html?audio=${t.trackUrl}`}>
                                                        <p>{t.title}</p>
                                                    </Link>
                                                    <div >
                                                        {currentTrack.isPlaying && currentTrack._id === t._id ?
                                                            <PauseIcon sx={{ color: 'grey', cursor: "pointer" }} onClick={() => handlePause(t)} /> :
                                                            <PlayArrowIcon sx={{ color: 'grey', cursor: "pointer" }} onClick={() => handlePlay(t)} />}
                                                    </div>
                                                </ListItem>
                                                <Divider component="li" />
                                            </>
                                        )
                                    })}
                                </List>}
                        </AccordionDetails>
                    </Accordion>
                )
            })}
        </>
    )
}

export default MainPlaylist;