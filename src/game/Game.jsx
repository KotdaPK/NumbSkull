import React, { useState, useEffect, useRef, useReducer } from 'react';
import { Button, TextField, IconButton } from '@mui/material';
//import { AlarmIcon, WhatshotIcon, FlagIcon } from '@mui/icons-material';
import styled from 'styled-components';


const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;
// loop deck / shuffle after finished !!

const c = console.log;
var deck;


function reducer(state, action) {
    switch (action.type) {
        case 'start':
            return {
                ...state,
                phase: 1,
                card: action.next,

            };
        case 'next':
            return { ...state, phase: 2, };
        case 'end': {
            let newRound;
            if (state.player === state.players.length - 1)
                newRound = state.round + 1;
            else newRound = state.round;
            c(newRound);
            const newState = {
                ...state,
                player: (state.player + 1) % state.players.length,
                round: newRound,
                phase: 1,
                card: action.next,
            }
            localStorage.setItem('state', JSON.stringify(newState));
            return newState;
        }
        case 'over':
            return { ...state, phase: 3, };
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
        c("read ", state);
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
        dispatch({ type: 'start', next: deck[index + 1] });
        setIndex(index + 1);
    }
    const nextTurn = () => { // Player's turn
        dispatch({ type: 'next' });
        setTimerStarted(true);
    }
    const endTurn = () => { // Store Player's turn and prepare for next turn
        if (state.round === seed.round)
            dispatch({ type: 'over', });
        else
            dispatch({ type: 'end', next: deck[index + 1], });
        setIndex(index + 1);
        localStorage.setItem('index', JSON.stringify(index));
    }

    const play = (p) => {
        dispatch({
            type: 'play',
            points: p,
            played: state.card,
            next: deck[index + 1],
        }); c("nextcard", state.card, deck[index + 1], index);
        setIndex(index + 1);
        localStorage.setItem('index', JSON.stringify(index));
    }
    const prev = () => {
        // go back to previous card for correction !!
    }

    // Timer
    const [roundEnded, setRoundEnded] = useState(false);
    const [roundTime, setRoundTime] = useState(seed.seconds); // CHANGE LATER
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
            setRoundTime(seed.seconds); // CHANGE LATER

            console.log('bang');
            endTurn();
        }
        return () => clearTimeout(timer);
    }, [timerStarted, roundEnded, roundTime, isPaused]);


    useEffect(() => {
        if (localStorage.getItem("state") !== null) {
            setIndex(JSON.parse(localStorage.getItem('index')));
            deck = JSON.parse(localStorage.getItem('deck'));
        } else {
            deck =
                [
                    { "s": "Ice", "l": "Ice Cream" },
                    { "s": "Cat", "l": "Cool Cat" },
                    { "s": "Banana", "l": "Banana Bread" },
                    { "s": "Picture", "l": "Picture Frame" },
                    { "s": "Milk", "l": "Milky Way" },
                    { "s": "Tea", "l": "Tea Leaves" },
                    { "s": "Pot", "l": "Potting Soil" },
                    { "s": "Plate", "l": "Home Plate" },
                    { "s": "Lamp", "l": "Floor Lamp" },
                    { "s": "Bar", "l": "Energy Bar" },
                    { "s": "Puzzle", "l": "Jigsaw" },
                    { "s": "Life", "l": "Life Span" },
                    { "s": "Paper", "l": "Term Paper" },
                    { "s": "Education", "l": "Physical Education" },
                    { "s": "Rock", "l": "Rock Band" },
                    { "s": "Walk", "l": "Walking Stick" },
                    { "s": "Wait", "l": "Waiting Room" },
                    { "s": "Engine", "l": "Search Engine" },
                    { "s": "Time", "l": "Timeline" },
                    { "s": "Square", "l": "Square Root" },
                    { "s": "Oven", "l": "Oven Mitt" },
                    { "s": "Bomb", "l": "Dirty Bomb" },
                    { "s": "Drug", "l": "Drug Bust" },
                    { "s": "House", "l": "House of Cards" },
                    { "s": "Gin", "l": "Gin and Tonic" },
                    { "s": "Croquet", "l": "Croquet Mallet" },
                    { "s": "Monkey", "l": "Monkey Bars" },
                    { "s": "Rein", "l": "Reindeer" },
                    { "s": "Lady", "l": "Lady Lumps" },
                    { "s": "Ship", "l": "Shipmate" },
                    { "s": "Car", "l": "Racecar" },
                    { "s": "Fire", "l": "Firewood" },
                    { "s": "Space", "l": "Spaceshuttle" },
                    { "s": "Peanut", "l": "Peanut Butter" },
                    { "s": "Zoo", "l": "Petting Zoo" },
                    { "s": "Phone", "l": "Cell Phone" },
                    { "s": "Flower", "l": "Flowerbed" },
                    { "s": "Sun", "l": "Sunglasses" },
                    { "s": "Rocket", "l": "Rocket Launcher" },
                    { "s": "Ball", "l": "Ballpit" },
                    { "s": "Whiskey", "l": "Whiskey Sour" },
                    { "s": "Beer", "l": "Beer Belly" },
                    { "s": "Sun", "l": "Sunflower" },
                    { "s": "Tiki", "l": "Tiki Bar" },
                    { "s": "Straw", "l": "Strawberry" },
                    { "s": "Guard", "l": "Bodyguard" },
                    { "s": "Ice", "l": "Ice Cream" },
                    { "s": "Bike", "l": "Bike Rack" },
                    { "s": "Black", "l": "Blackhole" },
                    { "s": "Angel", "l": "Angelfish" },
                    { "s": "Candle", "l": "Candlestick" },
                    { "s": "Dragon", "l": "Dragonfly" },
                    { "s": "Time", "l": "Timeline" },
                    { "s": "Walk", "l": "Jaywalk" },
                    { "s": "Queen", "l": "Drag Queen" },
                    { "s": "Scotch", "l": "Hopscotch" },
                    { "s": "Web", "l": "Cobweb" },
                    { "s": "Plate", "l": "License Plate" },
                    { "s": "Game", "l": "Gamecube" },
                    { "s": "Cabbage", "l": "Cabbage Patch" },
                    { "s": "Sticks", "l": "Cinnamon Sticks" },
                    { "s": "Goat", "l": "Scapegoat" },
                    { "s": "Dough", "l": "Donut" },
                    { "s": "Honey", "l": "Honeymoon" },
                    { "s": "Lock", "l": "Wedlock" },
                    { "s": "Egg", "l": "Eggplant" },
                    { "s": "Pony", "l": "Ponytail" },
                    { "s": "Paw", "l": "Papa" },
                    { "s": "Hog", "l": "Hogwash" },
                    { "s": "Graham", "l": "Graham Cracker" },
                    { "s": "Car", "l": "Carwash" },
                    { "s": "Bull", "l": "Bull's Eye" },
                    { "s": "Corona", "l": "Coronavirus" },
                    { "s": "Pink", "l": "Pinky" },
                    { "s": "Pill", "l": "Pill Pocket" },
                    { "s": "Man", "l": "Best Man" },
                    { "s": "Burn", "l": "Sunburn" },
                    { "s": "Port", "l": "Teleport" },
                    { "s": "Card", "l": "Credit Card" },
                    { "s": "Saw", "l": "Chainsaw" },
                    { "s": "Rock", "l": "Rockstar" },
                    { "s": "Ham", "l": "Hammer" },
                    { "s": "Cash", "l": "Johnny Cash" },
                    { "s": "Taco", "l": "Tacotime" },
                    { "s": "Germ", "l": "Germiphobe" },
                    { "s": "Pine", "l": "Pine Tree" },
                    { "s": "Blue", "l": "Blueberry" },
                    { "s": "Green", "l": "Greenbean" },
                    { "s": "Home", "l": "Homework" },
                    { "s": "Nap", "l": "Naptime" },
                    { "s": "Apple", "l": "Pineapple" },
                    { "s": "Sun", "l": "Sunscreen" },
                    { "s": "Pot", "l": "Flowerpot" },
                    { "s": "Work", "l": "Workout" },
                    { "s": "Yark", "l": "Yardwork" },
                    { "s": "Wheel", "l": "Wheelbarrow" },
                    { "s": "Dust", "l": "Dustbowl" },
                    { "s": "Fire", "l": "Fire Alarm" },
                    { "s": "Swim", "l": "Swimsuit" },
                    { "s": "Pea", "l": "Peanut" },
                    { "s": "Marsh", "l": "Marshmallow" },
                    { "s": "Sweat", "l": "Sweater" },
                    { "s": "Crow", "l": "Scarecrow" },
                    { "s": "Toe", "l": "Tiptoes" },
                    { "s": "Butt", "l": "Butthead" },
                    { "s": "Apple", "l": "Caramel Apple" },
                    { "s": "Tennis", "l": "Tennis Shoe" },
                    { "s": "Cat", "l": "Bobcat" },
                    { "s": "Cracker", "l": "Cracker Jacks" },
                    { "s": "Back", "l": "Diamondbacks" },
                    { "s": "Space", "l": "Spacedeck" },
                    { "s": "Wind", "l": "Windmill" },
                    { "s": "Cab", "l": "Cab Driver" },
                    { "s": "Fur", "l": "Furby" },
                    { "s": "Melon", "l": "Watermelon" },
                    { "s": "Fruit", "l": "Grapefruit" },
                    { "s": "Tea", "l": "Teaspoon" },
                    { "s": "Tail", "l": "Tailgate" },
                    { "s": "Wood", "l": "Woodard" },
                    { "s": "Fish", "l": "Starfish" },
                    { "s": "Coat", "l": "Raincoat" },
                    { "s": "Dumb", "l": "Dumbo" },
                    { "s": "Super", "l": "Superman" },
                    { "s": "Moon", "l": "Moonwalk" },
                    { "s": "War", "l": "Warden" },
                    { "s": "Bowl", "l": "Fishbowl" },
                    { "s": "Ring", "l": "Nosering" },
                    { "s": "Dog", "l": "Doghouse" },
                    { "s": "Storm", "l": "Brainstorm" },
                    { "s": "Hang", "l": "Hangover" },
                    { "s": "Car", "l": "Cartwheel" },
                    { "s": "Rattle", "l": "Rattlesnake" },
                    { "s": "Fast", "l": "Breakfast" },
                    { "s": "Pillar", "l": "Caterpillar" },
                    { "s": "Barbie", "l": "Barbeque" },
                    { "s": "Boy", "l": "Waterboy" },
                    { "s": "Ship", "l": "Shipwreck" },
                    { "s": "Pole", "l": "Northpole" },
                    { "s": "Dog", "l": "Hotdog" },
                    { "s": "Light", "l": "Lightbulb" },
                    { "s": "Stick", "l": "Matchstick" },
                    { "s": "Teen", "l": "Teenager" },
                    { "s": "Butter", "l": "Butterfly" },
                    { "s": "Grade", "l": "Upgrade" },
                    { "s": "Give", "l": "Forgive" },
                    { "s": "Roll", "l": "Bankroll" },
                    { "s": "Rail", "l": "Railway" },
                    { "s": "Daughter", "l": "Granddaughter" },
                    { "s": "Down", "l": "Touchdown" },
                    { "s": "Moon", "l": "Moonshine" },
                    { "s": "Stand", "l": "Standby" },
                    { "s": "Boat", "l": "Lifeboat" },
                    { "s": "Wide", "l": "Widespread" },
                    { "s": "Breed", "l": "Crossbreed" },
                    { "s": "Wood", "l": "Woodshop" },
                    { "s": "Quarter", "l": "Headquarters" },
                    { "s": "Water", "l": "Watercraft" },
                    { "s": "Hand", "l": "Handout" },
                    { "s": "Pepper", "l": "Peppermint" },
                    { "s": "Fire", "l": "Fireproof" },
                    { "s": "Sun", "l": "Sunfish" },
                    { "s": "Market", "l": "Supermarket" },
                    { "s": "Ball", "l": "Gumball" },
                    { "s": "Soft", "l": "Software" },
                    { "s": "Beam", "l": "Moonbeam" },
                    { "s": "Horse", "l": "Horseplay" },
                    { "s": "Off", "l": "Turnoff" },
                    { "s": "Person", "l": "Spokesperson" },
                    { "s": "Back", "l": "Backlog" },
                    { "s": "Walk", "l": "Boardwalk" },
                    { "s": "Spin", "l": "Backspin" },
                    { "s": "Shed", "l": "Watershed" },
                    { "s": "Flies", "l": "Fireflies" },
                    { "s": "Human", "l": "Superhuman" },
                    { "s": "Rest", "l": "Footrest" },
                    { "s": "Finger", "l": "Forefinger" },
                    { "s": "Coat", "l": "Tailcoat" },
                    { "s": "Stand", "l": "Grandstand" },
                    { "s": "Berry", "l": "Blueberry" },
                    { "s": "Root", "l": "Uproot" },
                    { "s": "Line", "l": "Headline" },
                    { "s": "Turn", "l": "Upturn" },
                    { "s": "Structure", "l": "Infrastructure" },
                    { "s": "Gun", "l": "Handgun" },
                    { "s": "Bee", "l": "Honeybee" },
                    { "s": "Room", "l": "Wardroom" },
                    { "s": "Ball", "l": "Snowball" },
                    { "s": "Yard", "l": "Courtyard" },
                    { "s": "Power", "l": "Horsepower" },
                    { "s": "Cab", "l": "Taxicab" },
                    { "s": "River", "l": "Riverbank" },
                    { "s": "Duck", "l": "Duckbill" },
                    { "s": "Port", "l": "Passport" },
                    { "s": "Honey", "l": "Honeydew" },
                    { "s": "Lid", "l": "Eyelid" },
                    { "s": "Chair", "l": "Highchair" },
                    { "s": "Cart", "l": "Cartwheel" },
                    { "s": "Go", "l": "Cargo" },
                    { "s": "Home", "l": "Homemade" },
                    { "s": "Flies", "l": "Fireflies" }
                ];

            for (let i = deck.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [deck[i], deck[j]] = [deck[j], deck[i]];
            }
            localStorage.setItem('deck', JSON.stringify(deck));
        }
        c('startGame');
        startGame();

    }, []);






    return (
        <> 
            <h1>Num Skul</h1>
            {state.phase === 1 || state.phase === 2 ? (
                <div>
                    <div>Round {state.round}</div>
                    <div>Player {state.player + 1}</div>
                    <div>Time {roundTime}</div>

                    {state.phase === 1 ? (
                        <Container>
                            {/* card history previous turn */}
                            <Button onClick={nextTurn}>start turn</Button>
                        </Container>
                    ) : (
                        <Container>
                            {/* play area, current card */}
                            <br /><br /><br /><br /><br />
                            <Button onClick={() => play(1)}>{state.card.s} 1</Button>
                            <br /><br /><br /><br /><br />
                            <Button onClick={() => play(3)}>{state.card.l} 3</Button>
                            <br /><br /><br /><br /><br />
                            <Button onClick={() => play(-1)}>FAIL -1</Button>
                        </Container>
                    )}

                </div>
            ) : (
                <div>
                    <div>Game Over</div>
                    <div>Team Evens: {state.teams[0]}</div>
                    <div>Team Odds: {state.teams[1]}</div>
                    {
                        // continueGame onlick : button says => start p1's turn !!
                    }
                </div>
            )}
        </>
    );



};

export default Game;
