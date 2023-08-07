import React from "react";

import { Button, TextField, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import './Home.css';

const Home = () => {

    // Players
    const [players, setPlayers] = React.useState(4);
    const handleIncrement = () => {
        setPlayers((prevNumber) => prevNumber + 1);
    };
    const handleDecrement = () => {
        setPlayers((prevNumber) => prevNumber - 1);
    };

    // Rounds
    const [rounds, setRounds] = React.useState(3);
    const handleIncrement2 = () => {
        setRounds((prevNumber) => prevNumber + 1);
    };
    const handleDecrement2 = () => {
        setRounds((prevNumber) => prevNumber - 1);
    };

    // Seconds
    const [seconds, setSeconds] = React.useState(90);
    const handleSecondsChange = (event) => {
        setSeconds(parseInt(event.target.value, 10));
    };

    const begin = () => {
        const seed = {
            players: players,
            rounds: rounds,
            seconds: seconds,
        };
        localStorage.setItem('seed', JSON.stringify(seed));
        console.log(seed);
    };

    const estimatedTime = Math.round(rounds * players * (seconds + 15) / 60);


    // <div className="container">
    //     <div className="components">
    //         <h1>Smooth Brain</h1>

    //         <span>Players: </span>
    //         <IconButton onClick={handleDecrement}>
    //             <KeyboardArrowLeftIcon />
    //         </IconButton>
    //         <span>{players}</span>
    //         <IconButton onClick={handleIncrement}>
    //             <KeyboardArrowRightIcon />
    //         </IconButton>
    //         <br />

    //         <span>Rounds: </span>
    //         <IconButton onClick={handleDecrement2}>
    //             <KeyboardArrowLeftIcon />
    //         </IconButton>
    //         <span>{rounds}</span>
    //         <IconButton onClick={handleIncrement2}>
    //             <KeyboardArrowRightIcon />
    //         </IconButton>

    //         <br />
    //         <TextField
    //             label="Seconds"
    //             type="number"
    //             variant="standard"
    //             value={seconds}
    //             onChange={handleSecondsChange}
    //         />

    //         <span>Estimated Time: {rounds * players * (seconds + 15) / 60} minutes</span><br />


    //         <Link to="/game">
    //             <Button onClick={begin} variant="contained">Begin</Button>
    //         </Link>


    //         <br /><br />

    //         <div>
    //             <ul>If odd # of players, 1 of the lesser team goes again (the most mid player)</ul>
    //             <ul>Each player gets 90 minute to get their team to guess as many words as possible.</ul>

    //             Rules: You can't use ... <br />
    //             <ul>words with more than 1 syllable</ul>
    //             <ul>any word, part of any word, or any form of a word that is on the Poetry Card (unless someone on your team has already said it out loud). </ul>
    //             <ul>gestures/charades. </ul>
    //             <ul>"sounds like" or "rhymes with". </ul>
    //             <ul>initials or abbreviations. </ul>
    //             <ul>other languages. </ul>
    //         </div>


    //     </div>
    // </div>


    return (
        <>
            <div className="container">
                <h1>Numb Skull</h1>

                <div className="section">
                    <span>Players:</span>
                    <div className="players-controls">
                        <IconButton onClick={handleDecrement}>
                            <KeyboardArrowLeftIcon />
                        </IconButton>
                        <span>{players}</span>
                        <IconButton onClick={handleIncrement}>
                            <KeyboardArrowRightIcon />
                        </IconButton>
                    </div>
                </div>

                <div className="section">
                    <span>Rounds:</span>
                    <div className="rounds-controls">
                        <IconButton onClick={handleDecrement2}>
                            <KeyboardArrowLeftIcon />
                        </IconButton>
                        <span>{rounds}</span>
                        <IconButton onClick={handleIncrement2}>
                            <KeyboardArrowRightIcon />
                        </IconButton>
                    </div>
                </div>

                <div className="section">
                    <TextField
                        label="Seconds"
                        type="number"
                        variant="outlined"
                        value={seconds}
                        onChange={handleSecondsChange}
                        className="neumorphic-input"
                    />
                    <span className="estimated-time">Estimated Time: {estimatedTime} minutes</span>
                </div>

                <Link to="/game" className="button-link">
                    <Button onClick={begin} variant="contained" className="neumorphic-button">
                        Begin
                    </Button>
                </Link>

                <div className="rules-section">
                    <ul>If odd # of players, 1 of the lesser team goes again (the most mid player)</ul>
                    <ul>Each player gets 90 minutes to get their team to guess as many words as possible.</ul>
                    <p>Rules:</p>
                    <ul>Words with more than 1 syllable are not allowed.</ul>
                    <ul>Any word, part of any word, or any form of a word that is on the Poetry Card (unless someone on your team has already said it out loud) is not allowed.</ul>
                    <ul>Gestures/charades are not allowed.</ul>
                    <ul>"Sounds like" or "rhymes with" are not allowed.</ul>
                    <ul>Initials or abbreviations are not allowed.</ul>
                    <ul>Other languages are not allowed.</ul>
                </div>

            </div>
        </>
    );

};

export default Home;