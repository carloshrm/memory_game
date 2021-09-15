import { useEffect, useState } from "react";
import "./styles/App.css";
import Card from "./components/Card";
import GameOver from "./components/GameOver";
import GameBoard from "./components/GameBoard";

function App() {
  const [rawData, setRawData] = useState([]);
  const [animeList, setAnimeList] = useState([]);
  const [playerScore, setPlayerScore] = useState({ current: 0, highest: 0 });
  const [difficulty, setDifficulty] = useState(10);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("animeList") === null) {
      setData();
    } else {
      setAnimeList(JSON.parse(localStorage.getItem("animeList")));
      setRawData(JSON.parse(localStorage.getItem("rawData")));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("animeList", JSON.stringify(animeList));
  }, [animeList]);

  function checkSeason() {
    const currentTime = new Date();
    let seasonByName = Array(12)
      .fill("winter", 0, 3)
      .fill("spring", 3, 6)
      .fill("summer", 6, 9)
      .fill("fall", 9, 12);
    return [currentTime.getFullYear(), seasonByName[currentTime.getMonth() - 1]];
  }
  async function fetchFromAPI() {
    let [year, season] = checkSeason();
    const fetchAnime = await fetch(`https://api.jikan.moe/v3/season/${year}/${season}`);
    const animeData = await fetchAnime.json();
    console.error("!! >> FETCHED");
    return animeData;
  }

  async function setData() {
    const response = await fetchFromAPI();
    const filteredData = setupList(response.anime);
    setRawData(response.anime);
    localStorage.setItem("rawData", JSON.stringify(response.anime));
    localStorage.setItem("dataAge", JSON.stringify(Date.now()));
    setAnimeList(filteredData.slice(0, Math.floor(filteredData.length / difficulty)));
  }

  function setupList(unfilteredData) {
    let newList = unfilteredData.reduce((array, entry) => {
      if (entry.score > 5 && entry.r18 === false) {
        array.push({
          title: entry.title,
          coverImage: entry.image_url,
          clicked: false,
        });
      }
      return array;
    }, []);
    return newList;
  }

  function clickHandler(id) {
    if (animeList[id].clicked) {
      setGameOver(true);
    } else {
      setPlayerScore({
        current: playerScore.current + 1,
        highest:
          playerScore.current + 1 > playerScore.highest
            ? playerScore.current + 1
            : playerScore.highest,
      });
      let updatedList = [...animeList];
      updatedList[id].clicked = true;
      shuffleArray(updatedList);
      setAnimeList(updatedList);
    }
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let randomInd = Math.floor(Math.random() * (i + 1));
      let current = array[i];
      array[i] = array[randomInd];
      array[randomInd] = current;
    }
  }

  function resetGame() {
    setPlayerScore({ current: 0, highest: playerScore.highest });
    setGameOver(false);
    if (
      localStorage.getItem("rawData") === [] ||
      Date.now() - localStorage.getItem("dataAge") > 86400 * 1000
    ) {
      setData();
    } else {
      let freshList = setupList(rawData);
      shuffleArray(freshList);
      setAnimeList(freshList.slice(0, Math.floor(freshList.length / difficulty)));
    }
  }

  return (
    <div className="App">
      <header>
        <h2>Anime Memory Game!</h2>
        <div>
          <label htmlFor="diff">Power Level:</label>
          <select name="diff" onChange={(e) => setDifficulty(e.target.value)}>
            <option value="10">Normie</option>
            <option value="8">Seen AOT</option>
            <option value="6">Seasonal</option>
            <option value="2">８０００以上だ！</option>
          </select>
          <button onClick={resetGame}>Reset/Refresh</button>
        </div>
      </header>
      {gameOver || playerScore.current === animeList.length ? (
        <GameOver scores={playerScore} didLose={gameOver} />
      ) : (
        <GameBoard currentScore={playerScore.current} total={animeList.length}>
          {animeList.map((entry, i) => (
            <Card
              key={i}
              id={i}
              name={entry.title}
              image={entry.coverImage}
              clickHandler={clickHandler}
            />
          ))}
        </GameBoard>
      )}
      <footer>
        <p>Made By Carlos Moraes, 2021.</p>
        <a href="https://github.com/carloshrm/memory_game">Source on Github.</a>
        <p>
          Seasonal anime data from MyAnimeList.net through{" "}
          <a href="https://jikan.moe">Jikan API.</a>{" "}
        </p>
      </footer>
    </div>
  );
}

export default App;
