import React from "react";

import { Button, TextField, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

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
    const [rounds, setRounds] = React.useState(2);
    const [seconds, setSeconds] = React.useState(2);

    // Players
    const handleIncrement = () => {
        setPlayers((n) => n + 2);
    };
    const handleDecrement = () => {
        setPlayers((n) => Math.max(n - 2, 4));
    };

    // Rounds
    const handleIncrement2 = () => {
        setRounds((n) => n + 1);
    };
    const handleDecrement2 = () => {
        setRounds((n) => Math.max(n - 1, 1));
    };

    // Seconds
    const handleSecondsChange = (event) => {
        // const inputValue = parseInt(event.target.value, 10);
        // if (!isNaN(inputValue)) {
        //     setSeconds(inputValue);
        // } else {
        //     setSeconds(0);
        // }

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



                    <div id="inputs">
                        <SettingsRoundedIcon id="settingsicon" />
                        <span id="players">
                            <span>Players:</span>
                            <span className="players-controls">
                                <IconButton onClick={handleDecrement} sx={{ color: "white" }}>
                                    <KeyboardArrowLeftIcon />
                                </IconButton>
                                <span>{players}</span>
                                <IconButton onClick={handleIncrement} sx={{ color: "white" }}>
                                    <KeyboardArrowRightIcon />
                                </IconButton>
                            </span>
                        </span>

                        <span id="rounds">
                            <span>Rounds:</span>
                            <span className="rounds-controls">
                                <IconButton onClick={handleDecrement2} sx={{ color: "white" }}>
                                    <KeyboardArrowLeftIcon />
                                </IconButton>
                                <span>{rounds}</span>
                                <IconButton onClick={handleIncrement2} sx={{ color: "white" }}>
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
                                value={isNaN(seconds) ? 0 : seconds}
                                onChange={handleSecondsChange}
                            />

                            <div className="text" id="est-time"> Est. Time: {estimatedTime} min.</div>
                        </div>
                    </div>

                    <div id="about">
                        About: In the beginning God created the heavens and the earth. Now the earth was formless and empty, darkness was over the surface of the deep
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;