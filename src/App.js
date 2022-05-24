import { useState, useEffect } from "react"
import Guess from "./components/Guess"
import { wordlist, curated } from "./WordList"
import "./App.css"

const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]

function getKey(event) {
    event.preventDefault();
    console.log(event.keyCode)
    if (event.keyCode === 8 || event.keyCode === 46) {
        return "delete"
    }
    if (event.keyCode === 13) {
        return "guess"
    }
    return String.fromCharCode(event.keyCode).toLowerCase()
}

function isValid(word) {
    return wordlist.includes(word.join(""))
}

function randChoice(choices) {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index].split("");
}

export default function App() {
    const [green, yellow, grey, red] = [
        "#6aaa64",
        "#c9b458",
        "#a6a4a4",
        "#ff6961"
    ]

    const [correctWord, setCorrectWord] = useState(randChoice(curated))
    const [guesses, setGuesses] = useState([])
    const [currentGuess, setCurrentGuess] = useState([])
    const [gameOver, setGameOver] = useState(false)
    const [message, setMessage] = useState("")
    const [lastRowAnimate, setLastRowAnimate] = useState(false)

    useEffect(() => {
        window.addEventListener("keydown", handleKeyPress)
        return () => window.removeEventListener("keydown", handleKeyPress)
    }, [currentGuess])

    function getKeyboardLetterStyle(letter) {
        let backgroundColor = grey
        for (let guess of guesses) {
            for (let i = 0; i < 5; i++) {
                if (guess[i] === correctWord[i] && guess[i] === letter) {
                    backgroundColor = green
                } else if (correctWord.includes(guess[i]) && guess[i] === letter && backgroundColor !== green) {
                    backgroundColor = yellow
                } else if (guess[i] === letter) {
                    backgroundColor = "#666666"
                }
            }
        }
        let color
        if (backgroundColor === grey) {
            color = "white"
        } else {
            color = "white"
        }

        return {
            backgroundColor, color
        }

    }

    function handleReset() {
        setGuesses([])
        setCurrentGuess([])
        setGameOver(false)
        setMessage("")
        setLastRowAnimate(false)
        let e = randChoice(curated)
        setCorrectWord(e)
        console.log(e.join(""))
    }

    function handleAdd(key) {
        setLastRowAnimate(false)
        let newGuess = JSON.parse(JSON.stringify(currentGuess))
        newGuess.push(key)
        setCurrentGuess(newGuess)
    }

    function handleSetMessage(newMessage, timeout) {
        setTimeout(() => {
            setMessage(newMessage)
            setLastRowAnimate(false)
        }, timeout)
    }

    function handleDelete() {
        setLastRowAnimate(false)
        let newGuess = JSON.parse(JSON.stringify(currentGuess))
        newGuess.pop()
        setCurrentGuess(newGuess)
    }

    function handleGuess() {
        if (currentGuess.length === 5 && !gameOver && isValid(currentGuess)) {
            setLastRowAnimate(true)
            let newGuesses = guesses
            newGuesses.push(currentGuess)
            setGuesses(newGuesses)
            setCurrentGuess([])
            if (guesses.length === 6 || JSON.stringify(currentGuess) === JSON.stringify(correctWord)) {
                setGameOver(true)
                if (JSON.stringify(currentGuess) === JSON.stringify(correctWord)) {
                    handleWin()
                } else {
                    handleSetMessage(`unlucky, the word was ${correctWord.join("")}`, 1400)
                }
            }
        } else if (!isValid(currentGuess) && currentGuess.length === 5) {
            setMessage("not in word list")
            handleSetMessage("", 1000)
        }
    }

    function handleCheat() {
        setLastRowAnimate(false)
        setMessage(correctWord.join(""))
        handleSetMessage("", 1500)
    }

    function handleWin() {
        let messages = [
            "genius!",
            "outstanding!",
            "impressive!",
            "respectable!",
            "you got there!",
            "close one!"
        ]
        handleSetMessage(messages[guesses.length - 1], 1400)
    }

    function handleKeyPress(event) {
        let key = getKey(event)
        if (currentGuess.length < 5 && alphabet.includes(key)) {
            handleAdd(key)
        } else if (key === "delete") {
            handleDelete()
        } else if (key === "guess") {
            handleGuess()
        }
    }

    let filler = []
    for (let i = 0; i < (gameOver ? 6 - guesses.length : 5 - guesses.length); i++) {
        filler.push(<Guess guess={[]} />)
    }

    return (
        <div className="game-container">

            <div className="heading">

                <div className="title">
                    <h1 className="title-word-wordle">wordle</h1>
                    <h1 className="title-word-unlimited">unlimited</h1>
                    <button className="restart-button" onClick={handleReset}>New Game</button>

                </div>



                <div className="divider" />


            </div>


            <div className="message-container">
                <a className="message">{message === "" ? "" : message}</a>
                <a hidden className="message">{correctWord}</a>
            </div>

            <div className="guesses-container">
                {guesses.map((guess, i) => {
                    return (
                        <Guess guess={guess} colored={true} correctWord={correctWord} lastRow={(i === (guesses.length - 1) && lastRowAnimate)} />
                    )
                })}
                {!gameOver && <Guess guess={currentGuess} invalid={currentGuess.length === 5 && !isValid(currentGuess)} correctWord={correctWord} />}

                {filler}
            </div>

            <div className="keyboard-container">
                {[
                    "qwertyuiop".split(""),
                    "asdfghjkl".split(""),
                    "zxcvbnm".split("")

                ].map((row, i) => (
                    <div className="keyboard-row">
                        {i === 2 && <button onClick={handleDelete} className="keyboard-letter">Delete</button>}
                        {i === 1 && <div style={{ width: "17.5px" }} />}
                        {row.map(letter => {
                            return (
                                <button onClick={() => {
                                    if (currentGuess.length !== 5) {
                                        handleAdd(letter)
                                    }
                                }} style={getKeyboardLetterStyle(letter)} className="keyboard-letter">{letter}</button>
                            )
                        })}
                        {i === 2 && <button onClick={() => {
                            if (currentGuess.length === 5) {
                                handleGuess()
                            }
                        }} className="keyboard-letter">Enter</button>}
                    </div>
                ))}
            </div>

        </div>
    )
};