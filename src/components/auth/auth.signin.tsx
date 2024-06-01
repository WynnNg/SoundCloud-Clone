'use client'
import * as React from 'react';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { Avatar, Button, Divider, Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


const AuthSignInPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [isErrorUsername, setIsErrorUsername] = useState(false)
    const [isErrorPassword, setIsErrorPassword] = useState(false)

    const [errorUsername, setErrorUsername] = useState('')
    const [errorPassword, setErrorPassword] = useState('')

    const [openAlert, setOpenAlert] = useState<boolean>(false);
    const [alertMsg, setAlertMsg] = useState<string>('');;

    const router = useRouter()


    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleSubmit = async () => {
        setIsErrorUsername(false);
        setIsErrorPassword(false);

        setErrorUsername('');
        setErrorPassword('');

        if (!username) {
            setIsErrorUsername(true);
            setErrorUsername("Username is not empty!");
            return;
        }
        if (!password) {
            setIsErrorPassword(true);
            setErrorPassword("Password is not empty!");
            return;
        }

        const res = await signIn("credentials", {
            username: username,
            password: password,
            redirect: false
        })

        if (!res?.error) {
            router.push("/")
        } else {
            setOpenAlert(true)
            setAlertMsg(res?.error)
        }

        console.log("check res login", res);


    }

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenAlert(false);
    };


    return (
        <>
            <Box >
                <Grid container sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh'
                }}>

                    <Grid item xs={11} sm={8} md={5} lg={4} sx={{
                        boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'
                    }}>
                        <div style={{ margin: "20px" }}>
                            <Link href="/">
                                <ArrowBackIcon />
                            </Link>
                            <Box
                                sx={{

                                    display: "flex",
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                    width: "100%"
                                }}
                            >

                                <Avatar>
                                    <LockIcon />
                                </Avatar>
                                <Typography component="h1">
                                    Sign In
                                </Typography>
                            </Box>
                            <TextField
                                onChange={(e) => { setUsername(e.target.value) }}
                                error={isErrorUsername}
                                helperText={errorUsername}
                                fullWidth
                                required
                                autoFocus
                                margin='normal'
                                label="Username"
                                name='username'
                                variant="outlined"
                            />
                            <TextField
                                onChange={(e) => { setPassword(e.target.value) }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSubmit()
                                    }
                                }}
                                error={isErrorPassword}
                                helperText={errorPassword}
                                type={showPassword ? 'text' : 'password'}
                                fullWidth
                                required
                                autoFocus
                                margin='normal'
                                label="Password"
                                name='password'
                                variant="outlined"
                                InputProps={{
                                    endAdornment:
                                        <InputAdornment position="end" >
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                }}
                            />
                            <Button
                                sx={{
                                    my: 3
                                }}
                                fullWidth
                                variant='contained'
                                color='primary'
                                type='submit'
                                onClick={handleSubmit}
                            >
                                Sign in
                            </Button>
                            <Divider>Or using</Divider>
                            <Box sx={{
                                display: "flex",
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '15px',
                                mt: 3
                            }}>
                                <Avatar
                                    sx={{
                                        cursor: "pointer",
                                        bgcolor: 'orange'
                                    }}
                                    onClick={() => { signIn("github") }}
                                >
                                    <GitHubIcon titleAccess='Log in with Github' />
                                </Avatar>
                                <Avatar
                                    sx={{
                                        cursor: "pointer",
                                        bgcolor: 'orange'
                                    }}
                                    onClick={() => { signIn("google") }}
                                >
                                    <GoogleIcon titleAccess='Log in with Google' />
                                </Avatar>
                            </Box>

                        </div>

                    </Grid>
                </Grid>
                <Snackbar
                    open={openAlert}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: "top", horizontal: 'center' }}
                >
                    <Alert
                        onClose={handleClose}
                        severity="error"
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {alertMsg}
                    </Alert>
                </Snackbar>
            </Box >
        </>
    )
}

export default AuthSignInPage;