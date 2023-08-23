import React, { useState, useEffect, useRef, useReducer } from 'react';
import { Button, TextField, IconButton } from '@mui/material';
//import { AlarmIcon, WhatshotIcon, FlagIcon } from '@mui/icons-material';

var deck;
var teams = [0, 0];

function reducer(state, action) {
    switch (action.type) {
        case 'next':
            return { count: state.count + 1 };
        case 'prev':
            return { count: state.count - 1 };
        default:
            throw new Error();
    }
}

const c = console.log;
const Game = () => {
    c("kms");

    const seed = JSON.parse(localStorage.getItem('seed'));

    const first = useRef(true);
    const [state, dispatch] = useReducer(reducer, null, () => {
        const state = JSON.parse(localStorage.getItem('state')); 
        c("read ", state)
        return state;
    });  

    const [round, setRound] = useState(1);
    const [player, setPlayer] = useState(0);
    const [card, setCard] = useState();
    var players = [];

    const [index, setIndex] = useState(0);


    const clear = () => {
        setRound(1);
        setPlayer(0);
        players = [];
        teams = [0, 0];
        setIndex(0);
    }

    // Local Storage
    const read = () => {
        const state = JSON.parse(localStorage.getItem('state')); c("read ", state)
        setRound(state.round);
        setPlayer(state.player);
        players = state.players;
        teams = state.teams;
        setIndex(state.index);
    };

    // Players
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

    // COMPONENTS
    const [phase, setPhase] = useState(1);
    const startGame = () => {
        c("startFun")
        setPhase(1);
        setCard(deck[index]);
        //read();

    }
    const nextTurn = () => { // Player's turn
        setPhase(2);
        //read();
        setTimerStarted(true);
    }
    const endTurn = () => { // Store Player's turn and prepare for next turn
        setPhase(1);
        setPlayer((player + 1) % players.length);
        if (player === players.length - 1) {
            setRound(round + 1);
            if (round === seed.rounds) {
                endGame();
            }
        }
        //setCard(deck[++index]); !!
        c("indexA " + index); c(card);

    }
    const endGame = () => {
        setPhase(3);
    }

    const reset = () => {
        clear();
        localStorage.removeItem('state');

        startGame();
    }



    // TURN

    // Timer
    const [roundEnded, setRoundEnded] = useState(false);
    const [roundTime, setRoundTime] = useState(5); // CHANGE LATER
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
            setRoundTime(5); // CHANGE LATER

            console.log('bang');
            endTurn();
        }
        return () => clearTimeout(timer);
    }, [timerStarted, roundEnded, roundTime, isPaused]);

    const play = (p) => {
        let spoils = deck[index];
        spoils.points = p;
        players[player].cards.push(spoils);
        teams[player % 2] += p;
        setIndex(index + 1);
        setCard(deck[index + 1]);
        c("index " + index); c(card);

        localStorage.setItem('players', JSON.stringify(players));
        localStorage.setItem('score', JSON.stringify(teams));
    }
    const prev = () => {
        // go back to previous card for correction
    }

    useEffect(() => {
        c("etching", first);
        if (first.current) {
            first.current = false;
        } else {
            const state = {
                round: round,
                player: player,
                players: players,
                teams: teams,
                index: index,
            };
            c("etched ", state);
            localStorage.setItem('state', JSON.stringify(state));
        }
    }, [player]);

    useEffect(() => {
        if (localStorage.getItem("state") !== null) {
            const state = JSON.parse(localStorage.getItem('state'));
            setIndex(state.index);
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
                    { "s": "Y'all", "l": "Hjalmar" },
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
                    { "s": "Fish", "l": "Fishmonger" },
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
            <h1>Smooth Brain</h1>
            {phase === 1 || phase === 2 ? (
                <div>
                    <div>Round {round}</div>
                    <div>Player {player + 1}</div>
                    <div>Time {roundTime}</div>
                    <div>Phase {phase}</div>

                    {phase === 1 ? (
                        <div>
                            {/* card history previous turn */}
                            <Button onClick={nextTurn}>start turn</Button>
                        </div>
                    ) : (
                        <div>
                            {/* play area, current card */}
                            <br />
                            <Button onClick={() => play(1)}>{card.s} 1</Button>
                            <br />
                            <Button onClick={() => play(3)}>{card.l} 3</Button>
                            <br />
                            <Button onClick={() => play(-1)}>FAIL -1</Button>
                        </div>
                    )}

                </div>
            ) : (
                <div>
                    <div>Game Over</div>
                    <div>Team Evens: {teams[0]}</div>
                    <div>Team Odds: {teams[1]}</div>
                    {
                        // continueGame onlick : button says => start p1's turn
                    }
                </div>
            )}
        </>
    );



};

export default Game;