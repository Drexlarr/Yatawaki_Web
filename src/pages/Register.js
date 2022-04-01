import { Box, Checkbox, CircularProgress, FormControlLabel, Grid, InputAdornment, Paper, TextField, Typography } from "@mui/material";
import { Lock } from "@mui/icons-material";
import React from "react";
import UserApi from "../apis/user-apis";
import SnackBarContext from "../context/snack-bar-context";
import { useNavigate } from "react-router-dom";
import ImageAutoSlider from "../components/ImageAutoSlider";
import logo_upc from '../assets/Logo UPC.png';

let buttonStyle = { width: ['300px', '300px', '400px'], height: '70px', borderRadius: '15px', mx: 'auto', backgroundColor: 'secondary.main', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', mt: '30px' };

const Register = () => {
    const [nickname, setNickname] = React.useState(null);
    const [firstname, setFirstname] = React.useState(null);
    const [lastname, setLastname] = React.useState(null);
    const [mail, setMail] = React.useState(null);
    const [password, setPassword] = React.useState(null);

    const [nicknameError, setNicknameError] = React.useState(false);
    const [firstnameError, setFirstnameError] = React.useState(false);
    const [lastnameError, setLastnameError] = React.useState(false);
    const [mailError, setMailError] = React.useState(false);
    const [passwordError, setPasswordError] = React.useState(false);

    const [step, setStep] = React.useState(1);
    const [terms, setTerms] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const snackBarContext = React.useContext(SnackBarContext);
    const navigate = useNavigate()



    const register = async () => {

        let errorExist = false;

        if (nickname === "" || nickname === null) {
            setNicknameError(true);
            errorExist = true;
        }
        if (password === "" || password === null) {
            setPasswordError(true);
            errorExist = true;
        }


        if (errorExist) {
            snackBarContext.onOpen({
                severity: "error",
                message: "Completa todas los campos"
            });
        } else if (!/[a-zA-Z]/.test(password)) {
            setPasswordError(true);
            snackBarContext.onOpen({
                severity: "error",
                message: "Tu contraseña no tiene letras"
            });
        } else if (!/\d/.test(password)) {
            setPasswordError(true);
            snackBarContext.onOpen({
                severity: "error",
                message: "Tu contraseña no tiene numeros"
            });
        } else if (password.length < 8) {
            setPasswordError(true);
            snackBarContext.onOpen({
                severity: "error",
                message: "Por favor ingresa mas de 8 caracteres"
            });
        } else if (terms === false) {
            snackBarContext.onOpen({
                severity: "error",
                message: "Por favor acepte los términos y condiciones"
            });
        } else {
            setLoading(true);
            UserApi.register(nickname, password, firstname, lastname, mail)
                .then(response => {
                    console.log(response);
                    snackBarContext.onOpen({
                        severity: "success",
                        message: "Registrado correctamente"
                    });
                    navigate('/login');
                })
                .catch(err => {
                    snackBarContext.onOpen({
                        severity: "error",
                        message: err
                    });
                    console.log(err);
                })
                .finally(() => setLoading(false))
        }


    }

    const nextStep = () => {

        let errorExist = false;

        if (firstname === "" || firstname === null) {
            setFirstnameError(true);
            errorExist = true;
        }
        if (lastname === "" || lastname === null) {
            setLastnameError(true);
            errorExist = true;
        }
        if (mail === "" || mail === null) {
            setMailError(true);
            errorExist = true;
        }

        if (errorExist) {
            snackBarContext.onOpen({
                severity: "error",
                message: "Completa todas los campos"
            });
        } else {
            setStep(step + 1);
        }

    }

    return (
        <React.Fragment>
            <Paper square={true} sx={{ backgroundColor: 'primary.light', height: '100%' }} elevation={0}>
                <Typography textAlign='center' className="title-font title-login" >REGISTRO</Typography>

                <Grid container justifyContent='center' alignItems='center'>
                    <Grid item xs={5} >
                        <Box sx={{ justifyContent: 'center', alignContent: 'center', display: 'flex', height: '400px' }}>
                            <ImageAutoSlider></ImageAutoSlider>
                        </Box>

                    </Grid>

                    <Grid item xs={7} >

                        {step === 1 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <TextField error={firstnameError} placeholder="Ingresa tu nombre" sx={{ width: '80%', mt: 2, backgroundColor: '#FFF' }} onChange={(event) => setFirstname(event.target.value)}></TextField>
                                <TextField error={lastnameError} placeholder="Ingresa tu apelido" sx={{ width: '80%', mt: 2, backgroundColor: '#FFF' }} onChange={(event) => setLastname(event.target.value)}></TextField>
                                <TextField error={mailError} placeholder="Ingresa tu correo electronico" sx={{ width: '80%', mt: 2, backgroundColor: '#FFF' }} onChange={(event) => setMail(event.target.value)}></TextField>

                                <Box sx={buttonStyle} onClick={() => { nextStep() }}>
                                    <Typography className="title-button"> Siguiente</Typography>
                                </Box>
                            </div>
                        ) : null}

                        {step === 2 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <TextField error={nicknameError} placeholder="Ingresa tu usuario" sx={{ width: '80%', mt: 2, backgroundColor: '#FFF' }} onChange={(event) => setNickname(event.target.value)}></TextField>

                                <TextField sx={{ width: '80%', mt: 2, backgroundColor: '#FFF' }} type="password" error={passwordError} label="Contraseña" onChange={(event) => setPassword(event.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock />
                                            </InputAdornment>
                                        ),
                                    }}

                                />

                                <div style={{ width: '80%'}}>
                                    <FormControlLabel sx={{ alignSelf: 'self-start'}} control={<Checkbox checked={terms} onClick={() => { setTerms(!terms) }} />} label="Estoy de acuerdo con los términos y condiciones" />

                                </div>
                                {loading && <CircularProgress />}
                                <Box sx={buttonStyle} onClick={() => { register() }}>
                                    <Typography className="title-button"> Registrarme</Typography>
                                </Box>
                            </div>
                        ) : null}




                    </Grid>
                </Grid>
                <img src={logo_upc} alt="Logo" className="image-upc" />

            </Paper>
        </React.Fragment >
    )


}

export default Register;