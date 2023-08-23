import React, { useState, useEffect, useRef, useReducer } from 'react';
import { Button, IconButton } from '@mui/material';
import { useNavigate } from "react-router-dom";

import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';

import './Game.css';
import rawdeck from './deck.json';

import fuse from '../assets/fuse.svg';
import short from '../assets/short.svg';
import long from '../assets/long.svg';
import fail from '../assets/fail.svg';
import quitgame from '../assets/quit.svg';
import startround from '../assets/startround.svg';

import best from '../assets/best.svg';
import worst from '../assets/worst.svg';
import mvp from '../assets/mvp.svg';
import lvp from '../assets/lvp.svg';
import winner from '../assets/winner.svg';
import endgame from '../assets/endgame.svg';
import cont from '../assets/continue.svg';



const c = console.log;
var deck;

function reducer(state, action) {
    switch (action.type) {
        case 'start':
            return {
                ...state,
                phase: (state.phase === 3) ? 3 : 1,
                card: action.next,
            };
        case 'next':
            return { ...state, phase: 2, };
        case 'end': {
            let newRound;
            if (state.player === state.players.length - 1)
                newRound = state.round + 1;
            else
                newRound = state.round;
            let player = (state.player + 1) % state.players.length;
            const newState = {
                ...state,
                player,
                round: newRound,
                phase: (state.round === action.rounds && player === 0) ? 3 : 1,
                card: action.next,
            }

            localStorage.setItem('state', JSON.stringify(newState));
            return newState;
        }
        case 'play': {
            const played = {
                ...action.played,
                points: action.points,
            }

            const players = [...state.players];
            players[state.player] = {
                ...state.players[state.player],
                cards: [...state.players[state.player].cards, played],
            }

            const teams = [...state.teams];
            teams[state.player % 2] += action.points;

            return {
                ...state,
                teams,
                card: action.next,
                players,
            }
        }

        default:
            throw new Error();
    }
}


const Game = () => {
    const seed = JSON.parse(localStorage.getItem('seed'));

    const [index, setIndex] = useState(() => {
        const index = JSON.parse(localStorage.getItem('index'));
        if (index !== null) return index;
        return 0;
    });

    const [state, dispatch] = useReducer(reducer, null, () => {
        const state = JSON.parse(localStorage.getItem('state'));
        if (state !== null) return state;

        const players = [];
        for (let i = 0; i < seed.players; i++) {
            players.push({
                name: 'Player ' + (i + 1),
                score: 0,
                cards: []
            });
        }
        if (players.length % 2 === 1) {
            players.push({
                name: 'Player ' + (players.length + .5),
                score: 0,
                cards: []
            });
        }

        return {
            round: 1,
            player: 0,
            card: undefined,
            teams: [0, 0],
            players,
            phase: 0,
        }
    });


    const startGame = () => {
        dispatch({ type: 'start', next: nextCard() });
    }
    const nextTurn = () => { // Player's turn
        dispatch({ type: 'next' });
        setTimerStarted(true);
    }
    const endTurn = () => { // Store Player's turn and prepare for next turn   
        dispatch({ type: 'end', next: nextCard(), rounds: seed.rounds, });
        nextCard();
    }

    const navigate = useNavigate();
    const quit = () => {
        localStorage.removeItem('state');
        localStorage.removeItem('seed');
        navigate('/'); // sure? !!
    }

    const play = (p) => {
        dispatch({
            type: 'play',
            points: p,
            played: state.card,
            next: nextCard(),
        });
    }
    const nextCard = () => {
        setIndex((index + 1) % deck.length);
        if (index === deck.length - 1)
            shuffledeck();
        localStorage.setItem('index', JSON.stringify(index));
        return deck[index];
    }

    const shuffledeck = () => {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        localStorage.setItem('deck', JSON.stringify(deck));
    }


    // Timer
    const [roundEnded, setRoundEnded] = useState(false);
    const [roundTime, setRoundTime] = useState(seed.seconds);
    const [isPaused, setIsPaused] = useState(false);
    const [timerStarted, setTimerStarted] = useState(false);
    useEffect(() => {
        let timer;
        if (timerStarted && roundTime > 0 && !isPaused) {
            timer = setTimeout(() => {
                setRoundTime(prevTime => prevTime - 1);
            }, 1000);
        } else if (roundTime === 0) {
            setRoundEnded(true);
            setTimerStarted(false);
            setRoundTime(seed.seconds);

            endTurn();
        }
        return () => clearTimeout(timer);
    }, [timerStarted, roundEnded, roundTime, isPaused]);


    useEffect(() => {
        if (localStorage.getItem("state") !== null) {
            setIndex(JSON.parse(localStorage.getItem('index')));
            deck = JSON.parse(localStorage.getItem('deck'));
        } else {
            deck = rawdeck;
            shuffledeck();
        }

        // if (localStorage.getItem('seed') === null)
        //     navigate('/'); !!
        startGame();

    }, []);


    return (
        <>
            <div className='container'>\
                {state.phase === 1 || state.phase === 2 ? (
                    <div className="container2">
                        <div className='text' id='round'>Round</div>
                        <div className='text' id='roundnum'>{state.round}</div>

                        <div className='text' id='player'>Player</div>
                        <div className='text' id='playernum'>{state.player + 1}</div>

                        <img className='fuse' src={fuse} />
                        <div className='text' id='time'>{roundTime} s</div>

                        {state.phase === 1 ? (
                            <>
                                {/* card history previous turn */}
                                <img src={quitgame} className="quit" onClick={() => quit()} />
                                <img src={startround} className="startround" onClick={nextTurn} />
                            </>
                        ) : (
                            <>
                                <IconButton className="control" onClick={() => setIsPaused(!isPaused)}>
                                    {isPaused ? (
                                        <PlayArrowRoundedIcon className='icon' />
                                    ) : (
                                        <PauseRoundedIcon className='icon' />
                                    )}
                                </IconButton>
                                <img src={short} className="short" />
                                <img src={long} className="long" />
                                <img src={fail} className="fail" onClick={() => play(-1)} />

                                <div className='word' id='shortword' onClick={() => play(1)}>{state.card.s}</div>
                                <div className='word' id='longword' onClick={() => play(3)}>{state.card.l}</div>

                            </>
                        )}

                    </div>
                ) : (
                    <div className='container2'>
                        <div id='drumroll'>
                            And the team with the Numbest Skulls is . . .
                        </div>
                        <img src={best} id='best' />
                        <img src={worst} id='worst' />
                        <img src={mvp} id='mvp' />
                        <img src={lvp} id='lvp' />
                        <img src={winner} id='winner' />
                        <img src={cont} id='cont' />
                        <img src={endgame} id='endgame' onClick={() => quit()} />

                        {/* <div>Game Over</div>
                        <div>Team Evens: {state.teams[0]}</div>
                        <div>Team Odds: {state.teams[1]}</div> */}
                        {
                            // continueGame onlick : button says => start p1's turn !!
                        }
                    </div>
                )}
            </div>
        </>
    );



};

export default Game;
