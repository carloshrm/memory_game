import "../styles/Board.css";

function GameBoard({ children, scores, total }) {
  return (
    <>
      <h3 className="game_header">
        You have guessed: {scores.current} so far. <p>{total} cards total.</p>
        <p>Highest Score: {scores.highest}</p>
      </h3>
      <div className="game_board">{children}</div>
    </>
  );
}

export default GameBoard;
