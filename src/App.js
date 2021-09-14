import { useEffect, useState } from "react";
import "./styles/App.css";
import Card from "./components/Card";

function App() {
  const [rawData, setRawData] = useState([]);
  const [animeList, setAnimeList] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [difficulty, setDifficulty] = useState(12);
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
    localStorage.setItem("rawData", JSON.stringify(rawData));
    setAnimeList(filteredData.slice(0, difficulty));
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
      setPlayerScore(playerScore + 1);
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
    setPlayerScore(0);
    let freshList = setupList(rawData);
    shuffleArray(freshList);
    setAnimeList(freshList.slice(0, difficulty));
  }

  return (
    <div className="App">
      <div>
        <h1>{playerScore}</h1>
        <button onClick={resetGame}>Reset</button>
      </div>
      <div>
        {animeList.map(
          (entry, i) =>
            i < 10 && (
              <Card
                key={i}
                id={i}
                name={entry.title}
                image={entry.coverImage}
                clickHandler={clickHandler}
              />
            )
        )}
      </div>
    </div>
  );
}

export default App;
