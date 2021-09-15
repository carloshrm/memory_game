import "../styles/Over.css";

function GameOver({ scores, didLose }) {
  let result = didLose ? "You lost..." : "You won!!";
  return (
    <div id="game_over">
      <h2>{result}</h2>
      <h3>You scored: {scores.current}</h3>
      <h3>Highest Score: {scores.highest}</h3>
    </div>
  );
}

export default GameOver;
