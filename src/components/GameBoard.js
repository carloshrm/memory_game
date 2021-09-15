import "../styles/Board.css";

function GameBoard({ children, currentScore, total }) {
  return (
    <>
      <h3 className="game_header">
        You have guessed: {currentScore} so far. <p>{total} cards total.</p>
      </h3>
      <div className="game_board">{children}</div>
    </>
  );
}

export default GameBoard;
