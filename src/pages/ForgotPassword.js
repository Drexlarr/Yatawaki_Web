import { CircularProgress, Grid, InputAdornment, Paper, TextField, Typography } from "@mui/material";
import { ArrowBackIosRounded, Lock } from "@mui/icons-material";
import React from "react";
import SnackBarContext from "../context/snack-bar-context";
import { useNavigate } from "react-router-dom";
import logo_upc from '../assets/Logo UPC.png';
import { Box } from "@mui/system";
import ImageAutoSlider from "../components/ImageAutoSlider";
import AuthApi from "../apis/auth-apis";
import GameContext from "../context/game-context";
import { useAuth } from "../context/auth-context";

let buttonStyle = { width: '400px', height: '70px', borderRadius: '15px', mx: '40px', backgroundColor: 'secondary.main', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', mt: '30px' };

const ForgotPassword = () => {
    const [email, setEmail] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const { forgotPassword } = useAuth()

    const snackBarContext = React.useContext(SnackBarContext);
    const gameContext = React.useContext(GameContext);
    const navigate = useNavigate()

    const toSplashscreen = () => {
        navigate('/login')
    };

    const submit = async () => {
        forgotPassword(email)
            .then((response) => {
                console.log(response)
                snackBarContext.onOpen({
                    severity: "success",
                    message: "Email enviado con éxito. Sigue las instrucciones"
                });
            })
            .catch((err) => {
                console.log(err)
                snackBarContext.onOpen({
                    severity: "error",
                    message: err.message
                });
            })
    }

    return (
        <React.Fragment>
            <Paper square={true} sx={{ backgroundColor: 'primary.light', height: '100vh' }} elevation={0}>
                <div className="hover" onClick={() => { toSplashscreen() }} style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', margin: '20px', position: 'absolute' }}>
                    <ArrowBackIosRounded fontSize="medium" />
                    <Typography fontWeight={600} fontSize={24} sx={{ marginLeft: '10px' }}>Atrás</Typography>
                </div>
                <Typography textAlign='center' className="title-font title-login" >YATAWAKI</Typography>

                <Grid container justifyContent='center' alignItems='center'>
                    <Grid item xs={5} >
                        <Box sx={{ justifyContent: 'center', alignContent: 'center', display: 'flex', height: '400px' }}>
                            <ImageAutoSlider></ImageAutoSlider>
                        </Box>

                    </Grid>

                    <Grid item xs={7} container direction='column' justifyContent='center' alignItems='center'>
                        <Typography fontWeight={600} fontSize={16}>Te enviaremos un correo para reestablecer tu contraseña</Typography>

                        <TextField placeholder="Escribe tu email" sx={{ width: '80%!important', mt: 2, backgroundColor: '#FFF' }} onChange={(event) => setEmail(event.target.value)}></TextField>

                        {loading && <CircularProgress />}

                        <Box className="hover" sx={buttonStyle} onClick={() => { submit() }}>
                            <Typography className="title-button"> Enviar </Typography>
                        </Box>
                    </Grid>
                </Grid>
                <img src={logo_upc} alt="Logo" className="image-upc" />

            </Paper>
        </React.Fragment>
    )


}

export default ForgotPassword;