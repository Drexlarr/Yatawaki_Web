import { CircularProgress, Dialog, Paper, Typography } from "@mui/material";
import React, { useState } from "react";
import calibracion from '../assets/calibracion.png';
import { PauseRounded } from "@mui/icons-material";
import { Box } from "@mui/system";
import '@tensorflow/tfjs'
import * as tmPose from '@teachablemachine/pose'
import { useLocation, useNavigate } from "react-router-dom";
import AudioController from "../context/audio-context-controller";
import PoseContext from "../context/pose-controller";
import PauseMenu from "./components/PauseMenu";
import ConcertApis from "../apis/concert-apis";
import CameraDeniedDialog from "./components/CameraDeniedDialog";
import violin1 from '../assets/songs/Mozart String Quartet No. 17, K.458, Movement 2 (Dry)-Violin-(Violin 2).mp3'
import violin2 from '../assets/songs/Mozart String Quartet No. 17, K.458, Movement 2 (Dry)-Violin-(Violin 1).mp3'
import cello from '../assets/songs/Mozart String Quartet No. 17, K.458, Movement 2 (Dry)-Cello-(Cello).mp3'
import viola from '../assets/songs/Mozart String Quartet No. 17, K.458, Movement 2 (Dry)-Viola-(Viola).mp3'
import { motion, AnimatePresence } from 'framer-motion';
import { MechanicalCounter } from "mechanical-counter";
import SnackBarContext from "../context/snack-bar-context";

let buttonStyle = { width: '150px', height: '50px', borderRadius: '15px', mx: '40px', backgroundColor: 'secondary.main', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', mt: '20px' };


const Game = () => {
    const navigate = useNavigate();
    const audioController = React.useContext(AudioController);
    const poseController = React.useContext(PoseContext);
    const snackBarContext = React.useContext(SnackBarContext);


    //progreso de la cancion
    const [time, setTime] = useState(0);
    const [response, setResponse] = useState(null);
    const [timerOn, setTimerOn] = useState(false);
    const [currentBPM, setCurrentBPM] = useState(0);
    const [posesCount, setPosesCount] = useState(0);
    const [currentVolume, setCurrentVolume] = useState(72);
    const [songDuration, setSongDuration] = useState(0);

    const [speed, setProgressSpeed] = useState(10);

    const [puntaje, setPuntaje] = useState(0);
    const [precision, setPrecision] = useState(0);


    //estados de animaciones
    const [animatePiano, setAnimatePiano] = useState(false);
    const [animateViolin, setAnimateViolin] = useState(false);
    const [animateChello, setAnimateChello] = useState(false);
    const [animateGuitar, setAnimateGuitar] = useState(false);



    const animateLeft = () => {
        setAnimateViolin(true);
        setAnimatePiano(true);
    }

    const animateRight = () => {
        setAnimateGuitar(true);
        setAnimateChello(true);
    }

    const stopAnimationLeft = () => {
        setAnimateViolin(false);
        setAnimatePiano(false);
    }

    const stopAnimationRight = () => {
        setAnimateGuitar(false);
        setAnimateChello(false);
    }

    const startGame = () => {
        setOpen(false);
        animateLeft();
        animateRight();
        setTimerOn(true);
        poseController.startController(response.initialBpm)
        audioController.start();
    }

    const { state } = useLocation();

    const startConcert = () => {
        let test = false;
        if (test) {
            let response2 = {
                "idConcert": 1,
                "name": "Nocturne Op 9 No 2",
                "initialBpm": 122,
                "duration": 230,
                "instruments": [
                    {
                        "name": "Piano",
                        "icon": "https://adriancames.github.io/Yatawaki_Files/Images/Instruments/Pianos/piano_casio.png",
                        "position": "L",
                        "track": violin2
                    },
                    {
                        "name": "Violin",
                        "icon": "https://adriancames.github.io/Yatawaki_Files/Images/Instruments/Violins/violin_casio.png",
                        "position": "L",
                        "track": violin1
                    },
                    {
                        "name": "Cello",
                        "icon": "https://adriancames.github.io/Yatawaki_Files/Images/Instruments/Cellos/cello_casio.png",
                        "position": "R",
                        "track": cello
                    },
                    {
                        "name": "Guitar",
                        "icon": "https://adriancames.github.io/Yatawaki_Files/Images/Instruments/Guitars/guitar_casio.png",
                        "position": "R",
                        "track": viola
                    }
                ]
            }
            audioController.setSongs(response2.instruments);
            audioController.setInitialBpm(response2.initialBpm);
            setSongDuration(response2.duration)
            setCurrentBPM(response2.initialBpm);
            setResponse(response2);
        } else {
            ConcertApis.startConcert(state.symphonyId)
                .then((res) => {
                    setResponse(res.data);
                    console.log("empezando el juego...");

                    audioController.setSongs(res.data.instruments);
                    audioController.setInitialBpm(res.data.initialBpm);
                    setSongDuration(res.data.duration)
                    setCurrentBPM(res.data.initialBpm);
                })
                .catch(() => {
                    snackBarContext.onOpen({ severity: "error", message: 'Algo salió mal, intenta nuevamente luego' });
                    navigate('/menu')
                })
        }


    }


    React.useEffect(() => {
        let interval = null;

        if (timerOn) {
            //default speed = 10
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + speed);
            }, 10);
        } else if (!timerOn) {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [timerOn, speed]);

    const renderSwitch = (param) => {
        switch (param.name) {
            case 'Piano':
                return <div>
                    <img style={{ position: 'absolute', left: '8%', top: '15%', height: '230px', }} src={param.icon} className={`piano ${animatePiano ? "pianoAnimation" : ""}`} ></img>
                </div>
            case 'Guitar':
                return <div>
                    <img style={{ position: 'absolute', left: '52%', top: '29%', height: '170px' }} className={`guitar ${animateGuitar ? "guitarAnimation" : ""}`} src={param.icon} ></img>
                    <img style={{ position: 'absolute', left: '62%', top: '10%', height: '170px' }} className={`guitar ${animateGuitar ? "guitarAnimation" : ""}`} src={param.icon} ></img>
                </div>
            case 'Violin':
                return <div>
                    <img style={{ position: 'absolute', left: '18%', top: '45%', height: '180px' }} className={`violin ${animateViolin ? "violinAnimation" : ""}`} src={param.icon} ></img>
                    <img style={{ position: 'absolute', left: '25%', top: '30%', height: '180px' }} className={`violin ${animateViolin ? "violinAnimation" : ""}`} src={param.icon} ></img>
                    <img style={{ position: 'absolute', left: '34%', top: '17%', height: '180px' }} className={`violin ${animateViolin ? "violinAnimation" : ""}`} src={param.icon} ></img>
                    <img style={{ position: 'absolute', left: '28%', top: '60%', height: '180px' }} className={`violin ${animateViolin ? "violinAnimation" : ""}`} src={param.icon} ></img>
                    <img style={{ position: 'absolute', left: '32%', top: '48%', height: '180px' }} className={`violin ${animateViolin ? "violinAnimation" : ""}`} src={param.icon} ></img>
                    <img style={{ position: 'absolute', left: '39%', top: '36%', height: '180px' }} className={`violin ${animateViolin ? "violinAnimation" : ""}`} src={param.icon} ></img>
                </div>
            case 'Cello':
                return <div>
                    <img style={{ position: 'absolute', left: '58%', top: '43%', height: '220px' }} className={`chello ${animateChello ? "chelloAnimation" : ""}`} src={param.icon} ></img>
                    <img style={{ position: 'absolute', left: '62%', top: '60%', height: '220px' }} className={`chello ${animateChello ? "chelloAnimation" : ""}`} src={param.icon} ></img>
                    <img style={{ position: 'absolute', left: '70%', top: '20%', height: '220px' }} className={`chello ${animateChello ? "chelloAnimation" : ""}`} src={param.icon} ></img>
                    <img style={{ position: 'absolute', left: '75%', top: '43%', height: '220px' }} className={`chello ${animateChello ? "chelloAnimation" : ""}`} src={param.icon} ></img>
                </div>;
            default:
                return '';
        }
    }

    //modelo

    const URLRight = "https://teachablemachine.withgoogle.com/models/7vVySgCUN/";
    const URLLeft = "https://teachablemachine.withgoogle.com/models/6WeNGi4Pn/";
    const URLTPose = "https://teachablemachine.withgoogle.com/models/sFWZWZTan/";
    const URLRightPitch = "https://teachablemachine.withgoogle.com/models/sVIndV-v-/";
    const URLLeftPitch = "https://teachablemachine.withgoogle.com/models/kwhV8Vs4-/";
    const URLDetecJugador = "https://teachablemachine.withgoogle.com/models/-GnOXIlck/";
    let modelRight, webcam, ctx, ctx2, maxPredictionsRight, modelLeft, maxPredictionsLeft, modelTPose, maxPredictionsTPose, modelPitchLeft, maxPredictionsPitchLeft, modelPitchRight, maxPredictionsPitchRight, modelDetecJugador, maxPredictionsDetecJugador;
    const [open, setOpen] = React.useState(true);
    const [loading, setLoading] = React.useState(true);
    const [openDialog, setOpenDialog] = React.useState(false);

    const init = async () => {
        const modelURLRight = URLRight + "model.json";
        const metadataURLRight = URLRight + "metadata.json";

        const modelURLLeft = URLLeft + "model.json";
        const metadataURLLeft = URLLeft + "metadata.json";

        const modelURLTPose = URLTPose + "model.json";
        const metadataURLTPose = URLTPose + "metadata.json";

        const modelURLRightPitch = URLRightPitch + "model.json";
        const metadataURLRightPitch = URLRightPitch + "metadata.json";

        const modelURLLeftPitch = URLLeftPitch + "model.json";
        const metadataURLLeftPitch = URLLeftPitch + "metadata.json";

        const modelURLDetecJugador = URLDetecJugador + "model.json";
        const metadataURLDetecJugador = URLDetecJugador + "metadata.json";

        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // Note: the pose library adds a tmPose object to your window (window.tmPose)
        modelRight = await tmPose.load(modelURLRight, metadataURLRight);
        maxPredictionsRight = modelRight.getTotalClasses();
        //modelRight.predict
        modelLeft = await tmPose.load(modelURLLeft, metadataURLLeft);
        maxPredictionsLeft = modelLeft.getTotalClasses();
        //tpose
        modelTPose = await tmPose.load(modelURLTPose, metadataURLTPose);
        maxPredictionsTPose = modelTPose.getTotalClasses();
        //pitch right
        modelPitchRight = await tmPose.load(modelURLRightPitch, metadataURLRightPitch);
        maxPredictionsPitchRight = modelPitchRight.getTotalClasses();
        //pitch left
        modelPitchLeft = await tmPose.load(modelURLLeftPitch, metadataURLLeftPitch);
        maxPredictionsPitchLeft = modelPitchLeft.getTotalClasses();
        //detec jugador
        modelDetecJugador = await tmPose.load(modelURLDetecJugador, metadataURLDetecJugador);
        maxPredictionsDetecJugador = modelDetecJugador.getTotalClasses();

        // Convenience function to setup a webcam
        const size = 400;
        const flip = true; // whether to flip the webcam
        webcam = new tmPose.Webcam(size, size, flip); // width, height, flip
        await webcam.setup(); // request access to the webcam
        await webcam.play();
        window.requestAnimationFrame(loop);

        // append/get elements to the DOM
        const canvas = document.getElementsByClassName("canvas");
        canvas[1].width = size; canvas[1].height = size;
        canvas[0].width = size; canvas[0].height = size;
        ctx = canvas[0].getContext("2d");
        ctx2 = canvas[1].getContext("2d");

        setLoading(false);

    }

    const loop = async () => {
        webcam.update(); // update the webcam frame
        await predict();
        webcam.update();
        await predict2();
        webcam.update();
        await predictTPose();
        webcam.update();
        await predictPitchLeft();
        webcam.update();
        await predictPitchRight();
        webcam.update();
        await predictDetecJugador();
        window.requestAnimationFrame(loop);
    }

    const predict = async () => {
        // Prediction #1: run input through posenet
        // estimatePose can take in an image, video or canvas html element
        const { pose, posenetOutput } = await modelRight.estimatePose(webcam.canvas);

        // Prediction 2: run input through teachable machine classification model
        const prediction = await modelRight.predict(posenetOutput);
        poseDecoderRight(prediction);

        drawPose(pose);
    }

    const predict2 = async () => {
        // Prediction #1: run input through posenet
        // estimatePose can take in an image, video or canvas html element

        const { pose, posenetOutput } = await modelLeft.estimatePose(webcam.canvas);
        const predictionLeft = await modelLeft.predict(posenetOutput);
        poseDecoderLeft(predictionLeft);

        // finally draw the poses
        drawPose(pose);
    }

    const predictTPose = async () => {
        // Prediction #1: run input through posenet
        // estimatePose can take in an image, video or canvas html element

        const { pose, posenetOutput } = await modelTPose.estimatePose(webcam.canvas);
        const predictionTPose = await modelTPose.predict(posenetOutput);
        poseDecoderTPose(predictionTPose);

        // finally draw the poses
        drawPose(pose);
    }

    const predictPitchLeft = async () => {
        // Prediction #1: run input through posenet
        // estimatePose can take in an image, video or canvas html element

        const { pose, posenetOutput } = await modelPitchLeft.estimatePose(webcam.canvas);
        const predictionPitchLeft = await modelPitchLeft.predict(posenetOutput);
        poseDecoderPitchLeft(predictionPitchLeft);

        // finally draw the poses
        drawPose(pose);
    }

    const predictPitchRight = async () => {
        // Prediction #1: run input through posenet
        // estimatePose can take in an image, video or canvas html element

        const { pose, posenetOutput } = await modelPitchRight.estimatePose(webcam.canvas);
        const predictionPitchRight = await modelPitchRight.predict(posenetOutput);
        poseDecoderPitchRight(predictionPitchRight);

        // finally draw the poses
        drawPose(pose);
    }

    const predictDetecJugador = async () => {
        // Prediction #1: run input through posenet
        // estimatePose can take in an image, video or canvas html element

        const { pose, posenetOutput } = await modelDetecJugador.estimatePose(webcam.canvas);
        const predictionDetecJugador = await modelDetecJugador.predict(posenetOutput);
        poseDecoderDetecJugador(predictionDetecJugador);

        // finally draw the poses
        drawPose(pose);
    }

    const drawPose = async (pose) => {
        if (webcam.canvas) {
            ctx.drawImage(webcam.canvas, 0, 0);
            ctx2.drawImage(webcam.canvas, 0, 0);
            // draw the keypoints and skeleton
            if (pose) {
                const minPartConfidence = 0.5;
                tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
                tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx2);
                tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
                tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx2);
            }
        }
    }

    const [finished, setFinished] = React.useState(false);


    React.useEffect(() => {
        if (finished) {
            audioController.stop();
            poseController.pauseController();
            navigate('/game-resume', {
                state: {
                    points: puntaje,
                    gesturesCompleted: posesCount,
                    accuracyRate: precision,
                    idConcert: response.idConcert,
                    symphonyName: response.name
                },
                replace: true
            })
        }
    }, [finished]);

    const poseDecoderLeft = async (predictionLeft) => {
        if (predictionLeft) {
            const aux = [];
            for (let i = 0; i < maxPredictionsLeft; i++) {
                if (predictionLeft[i].probability > 0.97) {
                    aux.push(predictionLeft[i].className);
                    if (aux[aux.length] == aux[aux.length - 1]) {
                        aux.pop();
                    }
                }

                if (audioController.state() === 'stopped') {
                    setFinished(true);
                }
                if (aux.length > 0) {
                    let punzadaBpm = poseController.checkPunzada(aux[0]);
                    let trianguloBpm = poseController.checkTriangulo(aux[0]);
                    let cruzBpm = poseController.checkCruz(aux[0]);
                    if (punzadaBpm) {
                        setPosesCount((prevCount) => prevCount + 1);
                        calcularPuntajePrecision(poseController.getDesviation(), 'punzada');
                        calcularPuntajeBpm(punzadaBpm);
                        setNewBPM(punzadaBpm);
                        calcularVolumen(poseController.getVolume() / 1000, "left")
                    }
                    if (trianguloBpm) {
                        setPosesCount((prevCount) => prevCount + 1);
                        calcularPuntajePrecision(poseController.getDesviation(), 'triangulo');
                        calcularPuntajeBpm(trianguloBpm);
                        setNewBPM(trianguloBpm)
                        calcularVolumen(poseController.getVolume() / 1000, "left")
                    }
                    if (cruzBpm) {
                        setPosesCount((prevCount) => prevCount + 1);
                        calcularPuntajePrecision(poseController.getDesviation(), 'cruz');
                        calcularPuntajeBpm(cruzBpm);
                        setNewBPM(cruzBpm);
                        calcularVolumen(poseController.getVolume() / 1000, "left")
                    }

                }

            }

        }
    }

    const poseDecoderRight = async (predictionRight) => {
        if (predictionRight) {
            const aux = [];
            for (let i = 0; i < maxPredictionsRight; i++) {
                if (predictionRight[i].probability > 0.97) {
                    aux.push(predictionRight[i].className);
                    if (aux[aux.length] == aux[aux.length - 1]) {
                        aux.pop();
                    }
                }

                //console.log(aux, 'predict right');
                if (aux.length > 0) {
                    let punzadaBpmRight = poseController.checkPunzadaRight(aux[0]);
                    let trianguloBpmRight = poseController.checkTrianguloRight(aux[0]);
                    let cruzBpmRight = poseController.checkCruzRight(aux[0]);
                    if (punzadaBpmRight) {
                        setPosesCount((prevCount) => prevCount + 1);
                        calcularPuntajePrecision(poseController.getDesviation(), 'punzada');
                        calcularPuntajeBpm(punzadaBpmRight);
                        setNewBPM(punzadaBpmRight);
                        calcularVolumen(poseController.getVolume() / 1000, "right")
                        //hacer algo con el volumen
                        //console.log(poseController.getVolume() / 1000, 'volumen')
                        //setCurrentVolume(poseController.getVolume())
                    }
                    if (trianguloBpmRight) {
                        setPosesCount((prevCount) => prevCount + 1);
                        calcularPuntajePrecision(poseController.getDesviation(), 'triangulo');
                        calcularPuntajeBpm(trianguloBpmRight);
                        setNewBPM(trianguloBpmRight)
                        calcularVolumen(poseController.getVolume() / 1000, "right")
                        //setCurrentVolume(poseController.getVolume())
                    }
                    if (cruzBpmRight) {
                        setPosesCount((prevCount) => prevCount + 1);
                        calcularPuntajePrecision(poseController.getDesviation(), 'cruz');
                        calcularPuntajeBpm(cruzBpmRight);
                        setNewBPM(cruzBpmRight);
                        calcularVolumen(poseController.getVolume() / 1000, "right")
                    }


                }

            }

        }
    }


    const poseDecoderPitchRight = async (predictionPitchRight) => {
        if (predictionPitchRight) {
            const aux = [];
            for (let i = 0; i < maxPredictionsPitchRight; i++) {
                if (predictionPitchRight[i].probability > 0.99) {
                    aux.push(predictionPitchRight[i].className);
                    if (aux[aux.length] == aux[aux.length - 1]) {
                        aux.pop();
                    }
                }

                if (aux.length > 0) {
                    //console.log(aux[0], 'predict pitch right')

                    let pitchRight = poseController.checkPitchRight(aux[0]);

                    if (pitchRight === 'up') {
                        //audio controller pitch
                        audioController.increasePitch();
                    } else if (pitchRight === 'down') {
                        //audio controller pitch
                        audioController.decreasePitch();
                    } else if (pitchRight === 'reset') {
                        //reset pitch
                        audioController.resetPitch();
                    }


                }

            }

        }
    }

    const poseDecoderPitchLeft = async (predictionPitchLeft) => {
        if (predictionPitchLeft) {
            const aux = [];
            for (let i = 0; i < maxPredictionsPitchLeft; i++) {
                if (predictionPitchLeft[i].probability > 0.97) {
                    aux.push(predictionPitchLeft[i].className);
                    if (aux[aux.length] == aux[aux.length - 1]) {
                        aux.pop();
                    }
                }


                if (aux.length > 0) {
                    //console.log(aux[0], 'predict pitch left')

                    let pitchLeft = poseController.checkPitchLeft(aux[0]);

                    if (pitchLeft === 'up') {
                        //audio controller pitch
                        audioController.increasePitch();
                    } else if (pitchLeft === 'down') {
                        //audio controller pitch
                        audioController.decreasePitch();
                    } else if (pitchLeft === 'reset') {
                        //reset pitch
                        audioController.resetPitch();
                    }


                }

            }

        }
    }

    const [cameraDenied, setCameraDenied] = useState(false);

    const poseDecoderDetecJugador = async (predictionDetecJugador) => {
        if (predictionDetecJugador) {
            const aux = [];
            for (let i = 0; i < maxPredictionsDetecJugador; i++) {
                if (predictionDetecJugador[i].probability === 1) {
                    aux.push(predictionDetecJugador[i].className);
                    if (aux[aux.length] == aux[aux.length - 1]) {
                        aux.pop();
                    }
                }


                if (aux.length > 0) {
                    let checkPlayer = poseController.checkPlayer(aux[0])

                    if (checkPlayer === 'NotPlaying') {
                        setCameraDenied(true);
                        pause(true);
                    } else if (checkPlayer === 'Resume') {
                        newCalibration();
                        setCameraDenied(false);
                    }


                }

            }

        }
    }



    const poseDecoderTPose = async (predictionTPose) => {
        if (predictionTPose) {
            const aux = [];
            for (let i = 0; i < maxPredictionsTPose; i++) {
                if (predictionTPose[i].probability > 0.97) {
                    aux.push(predictionTPose[i].className);
                    if (aux[aux.length] == aux[aux.length - 1]) {
                        aux.pop();
                    }
                }

                let tpose = poseController.checkTPose(aux[0]);

                if (tpose === 'Start') {
                    startGame();
                }
                if (tpose === 'Continue') {
                    setOpen(false);
                    setTimerOnCountDown(true);
                }

            }

        }
    }
    navigator.permissions.query({ name: "camera" }).then(res => {
        if (res.state !== "granted") {
            setCameraDenied(true);
            //console.log('checkeando')
        }
    });

    const changeSpeed = (newBpm) => {
        setProgressSpeed((newBpm * 18) / response.initialBpm);
        audioController.setBPM(newBpm);
        setCurrentBPM(newBpm);
        //console.log((newBpm * 10) / response.initialBpm)
    }

    const setNewBPM = (newBpm) => {
        let upperLimit = response.initialBpm + 70
        let lowerLimit = response.initialBpm - 70
        if (newBpm > upperLimit) {
            //alert('EL BPM EXCEDE LOS LIMITES')
            changeSpeed(upperLimit);
        } else if (newBpm < lowerLimit) {
            //alert('EL BPM EXCEDE LOS LIMITES INFERIORES')
            changeSpeed(lowerLimit);
        } else {
            changeSpeed(newBpm);
        }
    }

    const pause = (isCameraDenied) => {
        audioController.setBPM(1);
        poseController.pauseController();
        setProgressSpeed((1 * 10) / response.initialBpm);
        stopAnimationLeft();
        stopAnimationRight();
        setLoading(true);
        if (!isCameraDenied) {
            setOpenDialog(true);
        }
    }

    const resume = () => {
        audioController.setBPM(currentBPM);
        poseController.startController(response.initialBpm);
        setProgressSpeed((currentBPM * 13) / response.initialBpm);
        animateRight();
        animateLeft();
    }



    const newCalibration = () => {
        setOpenDialog(false);
        setOpen(true);
        init()
    }


    const navigate2Menu = () => {
        navigate('/menu')
    }

    const calcularPuntajePrecision = (desviacion, patron) => {
        if (patron === 'punzada') {
            if (desviacion > 1.5) {
                setPuntaje((prevPuntaje) => prevPuntaje + 2);
                setPrecision((prevPrecision) => (prevPrecision + 1.5) / 2)
                newPuntajeSnack(2)
            } else if (desviacion > 0.8 && desviacion < 1.5) {
                setPuntaje((prevPuntaje) => prevPuntaje + 5)
                setPrecision((prevPrecision) => (prevPrecision + desviacion) / 2)
                newPuntajeSnack(5)
            } else if (desviacion > 0.2 && desviacion < 0.8) {
                setPuntaje((prevPuntaje) => prevPuntaje + 7)
                setPrecision((prevPrecision) => (prevPrecision + desviacion) / 2)
                newPuntajeSnack(7)
            } else if (desviacion < 0.2) {
                setPuntaje((prevPuntaje) => prevPuntaje + 10)
                setPrecision((prevPrecision) => (prevPrecision + desviacion) / 2)
                newPuntajeSnack(10)
            }
        } else if (patron === 'triangulo') {
            if (desviacion > 1.5) {
                setPuntaje((prevPuntaje) => prevPuntaje + 4)
                setPrecision((prevPrecision) => (prevPrecision + 1.5) / 2)
                newPuntajeSnack(4)
            } else if (desviacion > 0.8 && desviacion < 1.5) {
                setPuntaje((prevPuntaje) => prevPuntaje + 8)
                setPrecision((prevPrecision) => (prevPrecision + desviacion) / 2)
                newPuntajeSnack(8)
            } else if (desviacion > 0.2 && desviacion < 0.8) {
                setPrecision((prevPrecision) => (prevPrecision + desviacion) / 2)
                setPuntaje((prevPuntaje) => prevPuntaje + 12)
                newPuntajeSnack(12)
            } else if (desviacion < 0.2) {
                setPrecision((prevPrecision) => (prevPrecision + desviacion) / 2)
                setPuntaje((prevPuntaje) => prevPuntaje + 15)
                newPuntajeSnack(15)
            }
        } else if (patron === 'cruz') {
            if (desviacion > 1.5) {
                setPuntaje((prevPuntaje) => prevPuntaje + 6)
                setPrecision((prevPrecision) => (prevPrecision + 1.5) / 2)
                newPuntajeSnack(6)
            } else if (desviacion > 0.8 && desviacion < 1.5) {
                setPuntaje((prevPuntaje) => prevPuntaje + 10)
                setPrecision((prevPrecision) => (prevPrecision + desviacion) / 2)
                newPuntajeSnack(10)
            } else if (desviacion > 0.2 && desviacion < 0.8) {
                setPuntaje((prevPuntaje) => prevPuntaje + 15)
                setPrecision((prevPrecision) => (prevPrecision + desviacion) / 2)
                newPuntajeSnack(15)
            } else if (desviacion < 0.2) {
                setPuntaje((prevPuntaje) => prevPuntaje + 20)
                setPrecision((prevPrecision) => (prevPrecision + desviacion) / 2)
                newPuntajeSnack(20)
            }
        }

    }

    const calcularPuntajeBpm = (nuevoBpm) => {
        //calculamos puntaje de limite
        if (nuevoBpm > (response.initialBpm - 10) && (nuevoBpm < (response.initialBpm + 10))) {
            setPuntaje((prevPuntaje) => prevPuntaje + 5);
            newPuntajeSnack(5)
        } else if (nuevoBpm > (response.initialBpm - 20) && (nuevoBpm < (response.initialBpm + 20))) {
            setPuntaje((prevPuntaje) => prevPuntaje + 3)
            newPuntajeSnack(3)
        } else if (nuevoBpm > (response.initialBpm - 40) && (nuevoBpm < (response.initialBpm + 40))) {
            setPuntaje((prevPuntaje) => prevPuntaje + 1)
            newPuntajeSnack(1)
        } else if (nuevoBpm > (response.initialBpm - 70 + (70 * 0.2)) && (nuevoBpm < (response.initialBpm + 70 + (70 * 0.2)))) {
            setPuntaje((prevPuntaje) => prevPuntaje - 5)
            newPuntajeSnack(-5)
        } else if (nuevoBpm > (response.initialBpm - 70 + (70 * 0.5)) && (nuevoBpm < (response.initialBpm + 70 + (70 * 0.5)))) {
            setPuntaje((prevPuntaje) => prevPuntaje - 7)
            newPuntajeSnack(-7)
        } else if (nuevoBpm > (response.initialBpm - 70 + (70 * 0.8)) && (nuevoBpm < (response.initialBpm + 70 + (70 * 0.8)))) {
            setPuntaje((prevPuntaje) => prevPuntaje - 10)
            newPuntajeSnack(-10)
        } else {
            setPuntaje((prevPuntaje) => prevPuntaje - 13)
            newPuntajeSnack(-13)
        }
    }

    const calcularVolumen = (newVolumen, hand) => {
        let volumePercentage = 0;

        if (newVolumen < 0.05) {
            //logica de puntos
            volumePercentage = 100
            hand === "right" ? animateRight() : animateLeft();
            setPuntaje((prevPuntaje) => prevPuntaje - 15);
        } else if (newVolumen > 0.05 && newVolumen < 0.17) {
            volumePercentage = 100;
            hand === "right" ? animateRight() : animateLeft();
        } else if (newVolumen > 0.17 && newVolumen < 0.29) {
            volumePercentage = 86;
            hand === "right" ? animateRight() : animateLeft();

        } else if (newVolumen > 0.29 && newVolumen < 0.42) {
            volumePercentage = 72;
            hand === "right" ? animateRight() : animateLeft();
        } else if (newVolumen > 0.42 && newVolumen < 0.54) {
            volumePercentage = 58;
            hand === "right" ? animateRight() : animateLeft();
            setPuntaje((prevPuntaje) => prevPuntaje - 0)
        } else if (newVolumen > 0.54 && newVolumen < 0.65) {
            volumePercentage = 44;
            hand === "right" ? stopAnimationRight() : stopAnimationLeft();
            setPuntaje((prevPuntaje) => prevPuntaje - 15)
        } else {
            volumePercentage = 30;
            hand === "right" ? stopAnimationRight() : stopAnimationLeft();
            setPuntaje((prevPuntaje) => prevPuntaje - 30)
        }

        setCurrentVolume(volumePercentage)
        audioController.setVolume(volumePercentage, hand)
    }

    //seteo variables iniciales de juego
    React.useEffect(() => {
        startConcert();
    }, []);

    React.useEffect(() => {
        if (response) {
            init()
        }
    }, [response]);

    const [timeCountdown, setTimeCountdown] = React.useState(3500);
    const [timerOnCountDown, setTimerOnCountDown] = React.useState(false);
    const [tres, setTres] = React.useState(false);
    const [dos, setDos] = React.useState(false);
    const [uno, setUno] = React.useState(false);
    const [comienza, setComienza] = React.useState(false);

    React.useEffect(() => {
        let interval = null;

        if (timerOnCountDown) {
            interval = setInterval(() => {
                setTimeCountdown((prevTime) => prevTime - 10);
            }, 10);
        } else if (!timerOnCountDown) {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [timerOnCountDown]);


    React.useEffect(() => {
        let interval = null;

        if (timerOnCountDown && timeCountdown < 0) {
            setTimeCountdown(3500);
            setTimerOnCountDown(false);
            setTres(false);
            setDos(false);
            setUno(false);
            setComienza(false);
            resume();
        } else if (!timerOnCountDown) {
            clearInterval(interval);
        }

        if (Math.floor((timeCountdown / 1000) % 60) === 3 && timerOnCountDown) {
            setTres(true);
        } else if (Math.floor((timeCountdown / 1000) % 60) === 2) {
            setTres(false);
            setDos(true);
        } else if (Math.floor((timeCountdown / 1000) % 60) === 1) {
            setTres(false);
            setDos(false);
            setUno(true);
        } else if (Math.floor((timeCountdown / 1000) % 60) === 0 && timerOnCountDown) {
            setTres(false);
            setDos(false);
            setUno(false);
            setComienza(true);
        }

        return () => clearInterval(interval);
    }, [timeCountdown]);

    const transition = { duration: 0.3, yoyo: Infinity, ease: 'easeInOut' };
    const transition2 = { duration: 1.5, yoyo: Infinity, ease: 'easeInOut' };
    const transition3 = { duration: 0.3, yoyo: Infinity, ease: 'easeInOut' };
    const [stack, setStack] = React.useState([]);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setStack((stackRes) =>
                stackRes.map((st) => {
                    return new Date(st.expirationTime) > new Date()
                        ? st
                        : { ...st, visibility: false };
                })
            );
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);


    const newPuntajeSnack = (newPuntaje) => {
        var t = new Date();
        t.setSeconds(t.getSeconds() + 1);

        let newTack = {
            visibility: true,
            left: `${Math.floor(Math.random() * 85) + 10}%`,
            top: `${Math.floor(Math.random() * 25) + 10}%`,
            value: newPuntaje.toString(),
            id: Math.floor(Math.random() * 100),
            expirationTime: t,
        };

        setStack([...stack, newTack]);
    };

    return (
        <React.Fragment>
            <Paper square={true} sx={{ backgroundColor: 'primary.light', height: '100%', width: '100%', padding: '10px' }} elevation={0}>
                <Dialog PaperProps={{ style: { borderRadius: '50px', backgroundColor: '#FFED66', padding: '30px', display: 'flex', alignItems: 'center' } }} open={open} fullWidth maxWidth="lg">

                    <div style={{ width: '100%', marginBottom: '20px' }}>
                        <Typography fontWeight='600' fontSize="30px!important"> Por favor, calibre su cuerpo con la silueta de la cámara:</Typography>
                    </div>
                    {loading && <CircularProgress style={{ marginTop: '30px' }}></CircularProgress>}

                    <canvas style={{ height: '300px!important', width: '300px!important' }} className="canvas"></canvas>
                    {!loading && <img style={{ position: 'absolute', height: '400px', width: '400px', top: '95px' }} src={calibracion} />}
                    <div id="label-container"></div>
                </Dialog>

                <CameraDeniedDialog open={cameraDenied} isCameraDenied={false}></CameraDeniedDialog>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography fontWeight='600' fontSize='30px' style={{ flex: 1, display: 'flex' }}> Ahora tocando: {response ? response.name : '--'}</Typography>


                    <Box sx={{ width: '30%' }}>
                        {/* <Typography color='secondary' fontSize="30px" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}> {Math.round((Math.floor((time / 1000)) / songDuration) * 100)}%</Typography> */}
                        {/* <Typography color='secondary' fontSize="30px" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}> {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:{("0" + Math.floor((time / 1000) % 60)).slice(-2)}</Typography> */}
                        {/* <LinearProgress variant="determinate" value={(Math.floor((time / 1000)) / songDuration) * 100} style={{ height: '10px', borderRadius: 5 }} /> */}
                    </Box>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <Box className="hover" onClick={() => { pause(false) }} style={{ backgroundColor: '#FF5E5B', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50px', width: '50px' }}>
                            <PauseRounded style={{ color: '#FFF', fontSize: '50px' }} />
                        </Box>
                        <PauseMenu open={openDialog} resume={newCalibration} exit={navigate2Menu}></PauseMenu>
                    </div>
                </div>
                {response && response.instruments.map((instrument, idx) => (
                    <div key={idx}>{renderSwitch(instrument)}</div>
                ))}

                <AnimatePresence>
                    {stack.map(
                        (element, idx) =>
                            element.visibility && (
                                <motion.div
                                    key={idx}
                                    style={{
                                        position: 'absolute',
                                        top: element.top,
                                        left: element.left,
                                    }}
                                    className="point"
                                    initial={{ translateY: -10 }}
                                    animate={{ translateY: 0, opacity: 1 }}
                                    exit={{ translateY: 20, opacity: 0 }}
                                >
                                    {element.value} puntos
                                </motion.div>
                            )
                    )}
                </AnimatePresence>


                <div className="container-control">
                    <div className="container-svg">
                        <motion.svg
                            width="24"
                            height="24"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            initial={{ scale: 1 }}
                            animate={{ scale: 1.1 }}
                            transition={transition}
                        >
                            <motion.path
                                d="M22 8.86222C22 10.4087 21.4062 11.8941 20.3458 12.9929C17.9049 15.523 15.5374 18.1613 13.0053 20.5997C12.4249 21.1505 11.5042 21.1304 10.9488 20.5547L3.65376 12.9929C1.44875 10.7072 1.44875 7.01723 3.65376 4.73157C5.88044 2.42345 9.50794 2.42345 11.7346 4.73157L11.9998 5.00642L12.2648 4.73173C13.3324 3.6245 14.7864 3 16.3053 3C17.8242 3 19.2781 3.62444 20.3458 4.73157C21.4063 5.83045 22 7.31577 22 8.86222Z"
                                stroke="currentColor"
                                initial={{ width: 24, height: 24 }}
                                animate={{ width: 34, height: 34 }}
                                strokeLinejoin="round"
                                transition={transition}
                            />
                        </motion.svg>
                    </div>
                    <MechanicalCounter height={30} text={`${Math.round(currentBPM, 0)} bpm`} />
                </div>
                <div className="container-control2">
                    <div className="container-svg2">
                        <motion.svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ scale: 1 }}
                            animate={{ scale: 1.1 }}
                            transition={transition3}
                        >
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                        </motion.svg>
                    </div>
                    <span>{currentVolume}%</span>
                </div>

                <div className="container-control-points">
                    <div className="container-points-svg">
                        <motion.svg
                            width="28"
                            height="28"
                            stroke-width="1.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <motion.path
                                d="M1.5 12.5L5.57574 16.5757C5.81005 16.8101 6.18995 16.8101 6.42426 16.5757L9 14"
                                stroke="currentColor"
                                strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={transition2}
                            />
                            <motion.path
                                d="M16 7L12 11"
                                stroke="currentColor"
                                stroke-linecap="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={transition2}
                            />
                            <motion.path
                                d="M7 12L11.5757 16.5757C11.8101 16.8101 12.1899 16.8101 12.4243 16.5757L22 7"
                                stroke="currentColor"
                                strokeLinejoin="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={transition2}
                            />
                        </motion.svg>
                    </div>
                    <span>{puntaje} puntos</span>
                </div>

                <canvas style={{ position: 'absolute', left: '40%', bottom: '3%', borderRadius: '10px', visibility: !open ? 'visible' : 'hidden' }} className={`canvas ${!open ? "canvasAnimation" : ""}`}></canvas>
                <span style={{ position: 'absolute', left: '43%', bottom: '40%', fontSize: '200px', visibility: tres ? 'visible' : 'hidden' }} className={`${tres ? 'canvasAnimation' : ''}`}>3</span>
                <span style={{ position: 'absolute', left: '43%', bottom: '40%', fontSize: '200px', visibility: dos ? 'visible' : 'hidden' }} className={`${dos ? 'canvasAnimation' : ''}`}>2</span>
                <span style={{ position: 'absolute', left: '43%', bottom: '40%', fontSize: '200px', visibility: uno ? 'visible' : 'hidden' }} className={`${uno ? 'canvasAnimation' : ''}`}>1</span>
                <span style={{ position: 'absolute', left: '33%', bottom: '40%', fontSize: '150px', visibility: comienza ? 'visible' : 'hidden' }} className={`${comienza ? 'canvasAnimation' : ''}`}>Comienza!</span>

            </Paper>
        </React.Fragment>
    )


}

export default Game;