import { useState, useEffect, useReducer } from 'react';
import { IconButton } from '@mui/material';
import { useNavigate } from "react-router-dom";

import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import generateDeck from './AI';

import './Game.css';
import rawdeck from './deck.json';

import fuse from '../assets/fuse.svg';
import short from '../assets/short.svg';
import long from '../assets/long.svg';
import fail from '../assets/fail.svg';
import quitgame from '../assets/quit.svg';
import startround from '../assets/startround.svg';
import dont from '../assets/dont.svg';
import tips from '../assets/tips.svg';

import best from '../assets/best.svg';
import worst from '../assets/worst.svg';
import mvp from '../assets/mvp.svg';
import lvp from '../assets/lvp.svg';
import scores from '../assets/scores.svg';
import endgame from '../assets/endgame.svg';
import cont from '../assets/continue.svg';


const c = console.log;
var deck;

// phase 0: start game
// phase 1: player's turn
// phase 2: player's turn
// phase 3: end of round


function reducer(state, action) {
	switch (action.type) {
		case 'start':
			return {
				...state,
				phase: (state.phase === 3) ? 3 : 1,
				card: action.next,
			};
		case 'next':
			return {
				...state,
				phase: 2,
				addedRounds: state.addedRounds + action.added,
			};
		case 'end': {
			let player = (state.player + 1) % state.players.length;

			let newRound = state.round;
			if (state.player === state.players.length - 1)
				newRound++;

			let thisTurn = 0;
			for (let i = 0; i < state.players[state.player].cards.length; i++) {
				thisTurn += state.players[state.player].cards[i].points;
			}
			const players = [...state.players];
			players[state.player] = {
				...state.players[state.player],
				score: state.players[state.player].score + thisTurn,
				cards: [],
			}

			const newState = {
				...state,
				player,
				round: newRound,
				players,
				phase: (state.round === (action.rounds + state.addedRounds) && player === 0) ? 3 : 1,
				card: action.next,
				bestTurn: (state.bestTurn[1] < thisTurn) ? [state.player, thisTurn] : state.bestTurn,
				worstTurn: (state.worstTurn[1] > thisTurn) ? [state.player, thisTurn] : state.worstTurn,
				mvp: (state.players[state.player].score > state.players[state.mvp].score) ? state.player : state.mvp,
				lvp: (state.players[state.player].score < state.players[state.lvp].score) ? state.player : state.lvp,
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

	const navigate = useNavigate();

	useEffect(() => {
		if (localStorage.getItem("seed") === null)
			navigate('/');
	}, []);



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

		return {
			round: 1,
			player: 0,
			card: undefined,
			teams: [0, 0],
			players,
			phase: 0,
			bestTurn: [0, 0],
			worstTurn: [0, 0],
			mvp: 0,
			lvp: 0,
			addedRounds: 0,
		}
	});

	useEffect(() => {
		const interval = setInterval(() => {
			console.log(state); // Log the game state
		}, 2000);

		return () => {
			clearInterval(interval); // Clean up the interval when the component unmounts
		};
	}, [state]);


	const startGame = () => {
		c("start game")
		dispatch({ type: 'start', next: nextCard() });
	}
	const nextTurn = () => { // Player's turn
		c("next turn")
		dispatch({ type: 'next', added: 0 });
		setTimerStarted(true);
	}
	const endTurn = () => { // Store Player's turn and prepare for next turn   
		c("end turn")
		dispatch({ type: 'end', next: nextCard(), rounds: seed.rounds, });
		nextCard();
	}

	const quit = () => {
		c("quit")
		if (confirm("Quitting deletes this session.") == true) {
			localStorage.removeItem('state');
			localStorage.removeItem('seed');
			navigate('/');
		}
	}
	const addRound = () => {
		c("add round")
		dispatch({ type: 'next', added: 1 });
		setTimerStarted(true);
	}


	const play = (p) => {
		c("play")
		dispatch({
			type: 'play',
			points: p,
			played: state.card,
			next: nextCard(),
		});
	}

	// const goBack = () => {
	//     dispatch({
	//         type: 'back',
	//     });
	// }
	// add turn score to total at end of round

	const initializeDeck = async () => {
		if (localStorage.getItem("deck") !== null) {
			c("loading state")
			setIndex(JSON.parse(localStorage.getItem('index')));
			deck = JSON.parse(localStorage.getItem('deck'));
		} else {
			c("generating deck")
			deck = await generateDeck();
			if (deck === null)
				deck = rawdeck;
			localStorage.setItem('index', JSON.stringify(0));
			localStorage.setItem('deck', JSON.stringify(deck));
			shuffledeck();
		}
		shuffledeck();
		startGame();
	};

	const nextCard = () => {
		c("next card")
		if ( deck == undefined || deck.length === 0 )
			initializeDeck();
		setIndex((index + 1) % deck.length);
		if (index === deck.length - 1)
			initializeDeck();
		localStorage.setItem('index', JSON.stringify(index));
		return deck[index];
	}

	const shuffledeck = () => {
		c("shuffle deck")
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

	const [start, setStart] = useState(false);
	useEffect(() => {
		if (!start) {
			setStart(true);
			initializeDeck();
		}
	}, []);

	const renderPhaseContent = () => {
		switch (state.phase) {
			case 1: // Player's turn
			case 2: // Player's turn
				return (
					<div className="container2">
						<div className='text' id='round'>Round</div>
						<div className='text' id='roundnum'>{state.round}</div>
						<div className='text' id='player'>Player</div>
						<div className='text' id='playernum'>{state.player + 1}</div>
						{/* <img className='fuse' src={fuse} style={{ width: `${roundTime}%`} /> */}
						<img className='fuse' src={fuse} style={{ height: 'auto', transform: `scaleX(${roundTime / 100})`, transformOrigin: 'left center' }} />

						<div className='text' id='time'>{roundTime} s</div>

						{state.phase === 1 ? (
							<>
								<img src={tips} id="tips" />
								<img src={dont} id="dont" />
								<img src={quitgame} className="quit" onClick={() => quit()}/>
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
				);
			case 3: // End of round
				return (
					<div className='container2'>
						<div id='drumroll' className='word'>
							And the team with<br />
							the Numbest Skulls is . . . .<br />
						</div>
						<div id='winner' className='word'>
							Team {state.teams[0] < state.teams[1] ? 'Evens' : 'Odds'}
						</div>
						<div id='mvpPlayer' className='word'>
							{state.players[state.mvp].name} <br />
							{state.players[state.mvp].score} points
						</div>
						<div id='lvpPlayer' className='word'>
							{state.players[state.lvp].name} <br />
							{state.players[state.lvp].score} points
						</div>
						<div id='bestTurn' className='word'>
							{state.players[state.bestTurn[0]].name} <br />
							{state.bestTurn[1]} points
						</div>
						<div id='worstTurn' className='word'>
							{state.players[state.worstTurn[0]].name} <br />
							{state.worstTurn[1]} points
						</div>
						<div id='oddscore' className='word'>{state.teams[0]}</div>
						<div id='evenscore' className='word'>{state.teams[1]}</div>
						<img src={best} id='best' />
						<img src={worst} id='worst' />
						<img src={mvp} id='mvp' />
						<img src={lvp} id='lvp' />
						<img src={scores} id='scores' />
						<img src={cont} id='cont' onClick={() => addRound()} />
						<img src={endgame} id='endgame' onClick={() => quit()} />
					</div>
				);
			default:
				return (
					<div className='container2'>
						<div className='' id=''>Loading ...</div>
						<div className='' id=''>Getting Deck from gemini-1.5-flash</div>
					</div>
				);
		}
	};

	return (
		<div className='container'>
			{renderPhaseContent()}
		</div>
	);

};

export default Game;
