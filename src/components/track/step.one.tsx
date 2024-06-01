import React, { useCallback } from 'react';
import { useDropzone, FileWithPath } from 'react-dropzone';

import "./theme.css"

import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { sendRequestFile } from '@/utils/api';
import { useSession } from "next-auth/react";
import axios from 'axios';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function InputFileUpload() {
    return (
        <Button
            onClick={(e) => { e.preventDefault() }}
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
        >
            Upload file
            <VisuallyHiddenInput type="file" />
        </Button>
    );
}

interface Iprops {
    setValue: (v: number) => void;
    setTrackValue: (v: any) => void;
    trackValue: any;
}

const StepOne = (props: Iprops) => {
    const { data: session } = useSession();

    const onDrop = useCallback(async (acceptedFiles: FileWithPath[]) => {
        // Do something with the files
        props.setValue(1);
        if (acceptedFiles && acceptedFiles[0]) {
            const audio = acceptedFiles[0];

            const formData = new FormData();
            formData.append('fileUpload', audio)

            try {
                const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/upload`, formData, {
                    headers: {
                        'Authorization': `Bearer ${session?.access_token}`,
                        'target_type': 'tracks',
                    },
                    onUploadProgress: progressEvent => {

                        let percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total!);
                        props.setTrackValue({
                            ...props.trackValue,
                            fileName: acceptedFiles[0].name,
                            percent: percentCompleted
                        })
                        // do whatever you like with the percentage complete
                        // maybe dispatch an action that will update a progress bar or something
                    }
                })
                props.setTrackValue((prevState: any) => ({
                    ...prevState,
                    uploadedTrackName: res.data.data.fileName
                }))

            } catch (error) {

                //@ts-ignore
                alert(error?.response.data.message)

            }

        }
    }, [])

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'audio': ['.mp3', '.m4a', ".aac", '.wma', '.wav', '.flac'],
        }
    });

    const files = acceptedFiles.map((file: FileWithPath) => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    return (
        <section className="container">
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <InputFileUpload />
                <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
            <aside>
                <h4>Files</h4>
                <ul>{files}</ul>
            </aside>
        </section>
    );
}

export default StepOne;