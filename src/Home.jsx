import React from "react";

import { Button, TextField, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

import NumbSkull from './assets/NumbSkull.svg';
import setup from './assets/setup.svg';
import dont from './assets/dont.svg';
import play from './assets/play.svg';
import settings from './assets/settings.svg';

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';

import './Home.css';

const Home = () => {
    const [players, setPlayers] = React.useState(4);
    const [rounds, setRounds] = React.useState(3);
    const [seconds, setSeconds] = React.useState(90);

    // Players
    const handleIncrement = () => {
        setPlayers((n) => n + 2);
    };
    const handleDecrement = () => {
        setPlayers((n) => n - 2);
    };

    // Rounds
    const handleIncrement2 = () => {
        setRounds((n) => n + 1);
    };
    const handleDecrement2 = () => {
        setRounds((n) => n - 1);
    };

    // Seconds
    const handleSecondsChange = (event) => {
        setSeconds(parseInt(event.target.value, 10));
    };

    const navigate = useNavigate();
    const begin = () => {
        const seed = {
            players: players,
            rounds: rounds,
            seconds: seconds,
        };
        localStorage.setItem('seed', JSON.stringify(seed));
        navigate('/game');
    };

    const estimatedTime = Math.round(rounds * players * (seconds + 15) / 60);

    localStorage.getItem('react') !== null; //!!


    return (
        <>
            <div className="container">
                <div className="container2">
                    <img src={NumbSkull} id="title" />
                    <img src={setup} id="setup" />
                    <img src={dont} id="dont" />
                    <img src={play} id="play" onClick={begin} />
                    <img src={settings} id="settings" />
                    <KeyboardArrowRightIcon id="settingsicon" />


                    <div id="inputs">
                        <span id="players">
                            <span>Players:</span>
                            <span className="players-controls">
                                <IconButton onClick={handleDecrement}>
                                    <KeyboardArrowLeftIcon />
                                </IconButton>
                                <span>{players}</span>
                                <IconButton onClick={handleIncrement}>
                                    <KeyboardArrowRightIcon />
                                </IconButton>
                            </span>
                        </span>

                        <span id="rounds">
                            <span>Rounds:</span>
                            <span className="rounds-controls">
                                <IconButton onClick={handleDecrement2}>
                                    <KeyboardArrowLeftIcon />
                                </IconButton>
                                <span>{rounds}</span>
                                <IconButton onClick={handleIncrement2}>
                                    <KeyboardArrowRightIcon />
                                </IconButton>
                            </span>
                        </span>
                        <br /><br />

                        <div id="time">
                            <TextField id="seconds"
                                label="Seconds"
                                type="number"
                                variant="outlined"
                                value={seconds}
                                onChange={handleSecondsChange}
                            />

                            <div className="text" id="est-time"> Est. Time: {estimatedTime} min.</div>
                        </div>
                    </div>

                    <div id="about">
                        
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;