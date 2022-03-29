import React, {useEffect, useState} from 'react';
import './App.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import ItemList from './components/ItemList';

const API_ENDPOINT = "https://itunes.apple.com/search?term=";
const DEBOUNCE_DELAY = 1500;

function App() {
  
  const [userInput, setUserInput] = useState<string>("");
  const [songList, setSongList] = useState<Array<any>>([]);
  const [temp, setTemp] = useState<string[]>(["A", "B", "C", "D", "E"]);
  const [isDebounced, setIsDebounced] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState(null);

  const [didMount, setDidMount] = useState(false);
  const debouncedUserInput = useDebounce(userInput, DEBOUNCE_DELAY);

  useEffect(() => {
    if (!didMount) {
      // required to not call API on initial render
      setDidMount(true);
      return;
    }
    fetchQuery(debouncedUserInput);
  }, [debouncedUserInput])

  function fetchQuery(debouncedUserInput: string) {
    setIsLoading(true);
    setIsDebounced(false);

    console.log("debouncedUserInput: " + API_ENDPOINT + debouncedUserInput);

    fetch(API_ENDPOINT + debouncedUserInput)
      .then((res) => res.json())
      .then((json) => {
        json.results.sort((a: any, b: any) => (a.collectionName > b.collectionName) ? 1 : ((b.collectionName > a.collectionName) ? -1 : 0))
        const uniqueNames: string[] = Array.from(new Set(json.results.map((song: any) => song.collectionName)))
        setSongList(uniqueNames.slice(0, 5));
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }

  useEffect(() => {
    let a = 0;
    const timer = setInterval(() => {
      let arrTemp: string[] = temp;
      arrTemp.push(arrTemp.shift()!)
      if(songList.length > 0){
        arrTemp[4] = songList[a];
        a = (a + 1) % songList.length;
      }
      setTemp([...arrTemp]);
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [songList])

  function handleUserInputChange(event: React.ChangeEvent<HTMLInputElement>){
    setUserInput(event.target.value);
    setIsDebounced(true);
  }

  return (
    <div className="App">
      <Box
        sx={{
          "& > :not(style)": { m: 1, width: "250px" },
        }}
      >
        <TextField hiddenLabel id="search-band" label="Search Band" variant="outlined" sx={{borderRadius: 2}} onChange={handleUserInputChange} />
      </Box>
      <Box sx={{background: "lightgrey", width: "250px", margin: "auto", border: "1px solid grey", borderRadius: 2}}>
        <ItemList data={temp}></ItemList>
      </Box>
    </div>
  );
}

function useDebounce(value: string, wait = 500) {
  const [debounceValue, setDebounceValue] = useState<string>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(value);
    }, wait);
    return () => clearTimeout(timer); // cleanup when unmounted
  }, [value, wait]);

  return debounceValue;
}

export default App;
