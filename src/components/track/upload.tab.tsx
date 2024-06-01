'use client'
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import StepOne from './step.one';
import StepTwo from './step.two';
import { Percent } from '@mui/icons-material';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const UploadTab = () => {
    const [value, setValue] = React.useState(0);
    const [trackValue, setTrackValue] = React.useState({
        fileName: '',
        percent: 0,
        uploadedTrackName: '',
    });

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', marginTop: 5, border: '1px solid #ccc' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Track" disabled={value !== 0} />
                    <Tab label="Basic Information" disabled={value !== 1} />

                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <StepOne setValue={setValue} setTrackValue={setTrackValue} trackValue={trackValue} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <StepTwo setValue={setValue} trackValue={trackValue} />
            </CustomTabPanel>

        </Box>
    );
}

export default UploadTab;