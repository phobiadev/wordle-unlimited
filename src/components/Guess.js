import { v4 as uuid } from "uuid"

function count(array, item) {
    let c = 0;
    for (let i of array) {
        if (i === item) {
            c++
        }
    }
    return c
}

export default function Guess({ guess, correctWord, colored, lastRow, invalid }) {
    const [green, yellow, grey, red] = [
        "#6aaa64",
        "#c9b458",
        "#666666",
        "#ff6961"
    ]



    let filler = new Array(5).fill("")
    for (let i = 0; i < guess.length; i++) {
        filler[i] = guess[i]
    }

    const getColors = guess => {
        let colors = new Array(5).fill(grey);
        let correct = JSON.parse(JSON.stringify(correctWord))
        let guessCopy = JSON.parse(JSON.stringify(guess))
        let greens = []
        for (let i = 0; i < 5; i++) {
            if (guessCopy[i] === correct[i]) {
                colors[i] = green
                greens.push(guessCopy[i])
                guessCopy[i] = "-"
                correct[i] = "-"
            }
        }
        for (let i = 0; i < 5; i++) {
            if (colors[i] !== green && guessCopy[i] !== "-") {
                if (correct.includes(guessCopy[i])) {
                    colors[i] = yellow
                    correct[correct.indexOf(guessCopy[i])] = "-"
                }
            }
        }
        return colors
    }

    if (!colored) {
        return (
            <div className="guess-container">
                {filler.map((char) => {
                    return (
                        <div style={{ ...(invalid ? { color: red, } : {}) }} className={`guess-character-square ${char !== "" ? "grow" : ""}`}>{char}</div>
                    )
                })}
            </div>
        )
    }

    const guessColors = getColors(guess)

    return (
        <div className="guess-container">
            {filler.map((char, i) => {
                const extraStyling = lastRow ? { animationName: "Reveal", animationDuration: ".4s", animationDelay: `${(i * 300) - 1}ms`, transform: "scale(1,0)", animationIterationCount: 1, animationFillMode: "forwards" } : {}
                return (
                    <div key={Math.random()} className="guess-character-square" style={{ backgroundColor: guessColors[i], color: "white", ...extraStyling }}>{char}</div>
                )
            })}
        </div>
    )



}