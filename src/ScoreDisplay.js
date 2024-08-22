
import React, { useEffect, useState } from 'react';

// a Component that displays the header row at the top of the table
function ScoreHeader() {
    return (
        <tr>
            <th>Rank</th>
            <th>Score</th>
            <th>Max Combo</th>
            <th>Perfect</th>
            <th>Great</th>
            <th>Okay</th>
            <th>Miss</th>
            <th></th>
        </tr>
    )
}

// a Component to handle displaying a score on the scoreboard
function Score({ score, remove }) {
    return (
        <tr> 
            <td>{score.rank}</td>
            <td>{score.score}</td>
            <td>{score.max_combo}/{score.max_possible_combo}</td>
            <td>{score.perfect}</td>
            <td>{score.great}</td>
            <td>{score.okay}</td>
            <td>{score.miss}</td>
            <td><button onClick={() => remove(score.score)}>Remove</button></td>
        </tr>
    );
}

// a Component that handles retrieving scores and displaying the scoreboard
// we pass in a list of scores and the remove function from ScoreDisplay to provide to each Score Component
function ScoreList({ scores, remove }) {     
    let output = []
    // iterate through each score and create a Score Component
    // provide each one a score and the remove function to handle the Remove button
    Array.from(scores).forEach((s, i) => {
        output.push(<Score 
            score = {s}
            remove = {remove}
            key = {i}
        />);
    });

    // render the ScoreHeader and the list of Scores we created above
    return (
        <table>
            <tbody>
                <ScoreHeader />
                {output}
            </tbody>
        </table>
    );
}

// a Component that displays the score submission section
// in the real world this wouldn't be a button and would be handled when the user submits a score in the rhythm game
// but use a button for development purposes
function SubmitScore({ onclick }) {
    return (
    <>
    <table>
        <tbody>
            <tr>
                <th>Rank</th>
                <th>Score</th>
                <th>Max Combo</th>
                <th>Max Possible Combo</th>
                <th>Perfect</th>
                <th>Great</th>
                <th>Okay</th>
                <th>Miss</th>
            </tr>
            <tr>
                <td>
                    <select id="rank">
                        <option value="S">S</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="F">F</option>
                    </select>
                </td>
                <td>
                    <input type="number" id="score"></input>
                </td>
                <td>
                    <input type="number" id="max_combo"></input>
                </td>
                <td>
                    <input type="number" id="max_possible_combo"></input>
                </td>
                <td>
                    <input type="number" id="perfect"></input>
                </td>
                <td>
                    <input type="number" id="great"></input>
                </td>
                <td>
                    <input type="number" id="okay"></input>
                </td>
                <td>
                    <input type="number" id="miss"></input>
                </td>
            </tr>
        </tbody>
    </table>
    <button onClick={onclick}>Submit Score</button>
    </>
    );
}

// the main Component that displays both the header and the scoreboard
export default function ScoreDisplay() { 
    // store the list of scores in a state so we can dynamically update the scoreboard without having to reload   
    const [scores, setScores] = useState([]);

    // sync retreiving the scores to when the webpage loads
    useEffect(() => {
        fetch('http://localhost:8000/api/scores/')
            .then(response => response.json())
            .then(data => setScores(data));
    }, []);

    // a function that handles when the submit score button is clicked
    function submit() {
        // This should have error/value checks to prevent empty or invalid inputs in a production environment
        let rank = document.getElementById("rank").value;
        let score = document.getElementById("score").value;
        let maxCombo = document.getElementById("max_combo").value;
        let maxPossCombo = document.getElementById("max_possible_combo").value;
        let perfect = document.getElementById("perfect").value;
        let great = document.getElementById("great").value;
        let okay = document.getElementById("okay").value;
        let miss = document.getElementById("miss").value;

        let json = {
            rank: rank,
            score: score,
            max_combo: maxCombo,
            max_possible_combo: maxPossCombo,
            perfect: perfect,
            great: great,
            okay: okay,
            miss: miss
        }

        // POST the score to the backend's scores endpoint
        fetch('http://localhost:8000/api/scores/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(json),
            })
            .then(response => response.json())
            .then(data => {
                // refresh the list of scores displayed
                let clone = [...scores];
                clone.push(data);
                return setScores(clone);
            })
            .catch(error => {
                console.error("Failed to submit score: " + error);
            });
    }

    // a function that handles when the Remove button is clicked on a score
    function remove(score) {
        // send a DELETE request to the scores/delete endpoint
        fetch(`http://localhost:8000/api/scores/delete/${score}/`, {
            method: 'DELETE',
        })
        .then(() => {
            // refresh the list of scores displayed
            let clone = [...scores];
            clone = clone.filter(s => s.score !== score);
            setScores(clone);
        })
        .catch(error => {
            console.error("Failed to delete score: " + error);
        });
    }

    // pass the remove and submit functions into each Component so inner components can utilize them
    return (
        <>
        <div>
            <h2>Your Scores:</h2>
            <ScoreList 
                scores = {scores}
                remove = {remove}
            />
        </div>
        <div>
            <h2>Score Submission</h2>
            <SubmitScore onclick = {submit} />
        </div>
        </>
    );
}