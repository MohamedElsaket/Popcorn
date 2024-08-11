import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import styled from "styled-components";

// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = 'bf42a98c';

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);


  function handleSelectedMovie(id) {
    setSelected(selected => selected === id ? null : id)
  }

  function handleBackBtn() {
    setSelected(null)
  }

  useEffect(function () {
    async function fetchMoives() {
    try {
    setIsLoading(true)
    setError('')
    const res = await fetch(`https://www.omdbapi.com/?apikey=${KEY}&s=${query}`);
    const data = await res.json();
    console.log(data.Search)
    
    if (!res.ok) throw new Error('Somthing went wrong with fetching data');
    if (data.Response === 'False') throw new Error('Movie is Not Found');
    
    setMovies(data.Search)
    } catch (err) { 
      setError(err.message)
    } finally {
      setIsLoading(false)
    }  
  }

  if(!query.length) {
    setMovies([]);
    setError('');
    return;
  }
    fetchMoives()
  }, [query])

  return (
    <div>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResault movies={movies} />
      </Navbar>

      <Main>
        <Box>
          {/* {isLoading ? <Loading /> : <MovieList movies={movies} />} */}
          {isLoading && <Loading />}
          {!isLoading && !error && <MovieList onSelectMovie={handleSelectedMovie} movies={movies} />}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selected ? <SelectedMovie onBackBtn={handleBackBtn} selected={selected} /> : 
          <>
          <Summary watched={watched} />
          <WatchedList watched={watched} />
          </>}
        </Box>
      </Main>
    </div>
  );
}

const Loading = () => {
  return ( 
    <p className="loader text-5xl text-center pt-16"> loading... </p>
   );
}

const ErrorMessage = ({message}) => {
  return ( 
    <p className="error">
      {message}
    </p>
   );
}
  
const Navbar = ({children}) => { 
  return ( 
    <nav className="nav-bar grid grid-cols-12 items-center justify-between bg-[#6741d9] rounded-xl py-6 px-16">
      {children}
    </nav>
   );
}
  
const Logo = () => {
  return ( 
    <div className="logo col-start-1 col-span-3 flex gap-3 items-center">
      <span role="img" className="text-5xl">☕</span>
      <h1 className="text-slate-50 text-4xl">Popcorn</h1>
    </div>
  );
}
  
  const Search = ({query, setQuery}) => {
  return ( 
    <input
    className="search sm:col-end-10 col-span-5 col-end-13 py-4 px-4 rounded-xl bg-[#7950f2] w-full placeholder:text-3xl outline-none text-3xl"
    type="text"
    placeholder="Search movies..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
  />
   );
}

const NumResault = ({movies}) => {
  return ( 
    <p className="num-results col-end-13 col-span-3 text-end text-3xl m-0 hidden sm:block">
      Found <strong>{movies.length}</strong> results
    </p>
   );
}

const Main = ({children}) => {
  return ( 
    <main className="main h-[580px] grid grid-cols-12 p-8 gap-10 justify-center">    
      {children}
    </main>
   );
}

const Box = ({children}) => {
  const [isOpen, setIsOpen] = useState(true);

  return ( 
    <div className="box bg-[#2b3035] overflow-scroll h-[350px] sm:h-full p-8 rounded-2xl col-start-1 col-span-12 sm:col-span-6 relative">
          <button
            className="btn-toggle bg-[#212529] rounded-full w-[30px] h-[30px] absolute right-8"
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? "–" : "+"}
          </button>
          {isOpen && (
            <>
              {children}
            </>
          )}
        </div>
   );
}

const MovieList = ({movies, onSelectMovie}) => {
  return ( 
    <ul className="list list-movies rounded-2xl p-0">
      {movies?.map((movie) => (
        <Movie key={movie.imdbID} movie={movie} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
   );
}

const Movie = ({movie, onSelectMovie}) => {
  return ( 
    <li className="p-8 hover:bg-[#343a40] duration-300 border-b-2 rounded-2xl cursor-pointer border-[#343a40]" onClick={() => onSelectMovie(movie.imdbID)}>
      <div className="flex gap-10 items-center">
        <img src={movie.Poster} alt={`${movie.Title} poster`} className="max-h-[100px] w-[70px]" />
        <div>
          <h3>{movie.Title}</h3>
          <p>
            <span>🗓</span>
            <span>{movie.Year}</span>
          </p>
        </div>
      </div>
    </li>
   );
}
 
const SelectedMovie = ({selected, onBackBtn}) => {
  const [movie, setMovie] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre
  } = movie;

  useEffect(function() {
    async function getMoviesDetails() {
      setIsLoading(true)
      const res = await fetch(`https://www.omdbapi.com/?apikey=${KEY}&i=${selected}`);
      const data = await res.json();
      setMovie(data)
      setIsLoading(false)
    }
    getMoviesDetails()
  }, [selected])

  return ( <>
    {isLoading ? <Loading /> : <div className="details">
      <header>
        <button onClick={onBackBtn} className="btn-back bg-slate-50 rounded-full w-[25px] h-[25px] items-center absolute border-1 border-slate-950 font-extrabold text-slate-950 text-2xl">&larr;</button>
        <div className="flex flex-col sm:flex-row gap-4 md:gap-16 mb-8 items-center">
          <img src={poster} alt={`Poster of ${movie} movie`} className="h-[250px] w-[170px] rounded-2xl" />
          <div className="details-overview text-2xl leading-loose sm:pt-16">
            <h2 className="text-4xl">{title}</h2>
            <p>
              {released} &bull; {runtime}
            </p>
            <p>{genre}</p>
            <p><span>⭐</span>{imdbRating} IMDB Rating</p>
          </div>
        </div>
      </header>
      <section>
        <StarRating />
        <p className="mt-8">
          <em>{plot}</em>
        </p>
        <p>Starring {actors}</p>
        <p>Directed by {director}</p>
      </section>
    </div>}
  </>
   );
}
  
const Summary = ({watched}) => {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return ( 
    <div className="summary bg-[#343a40] p-4 rounded-2xl shadow-zinc-950">
      <h2 className="uppercase">Movies you watched</h2>
      <div className="flex text-2xl justify-around items-center py-4">
        <p className="flex gap-3">
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
  </div>
   );
}

const WatchedList = ({watched}) => {
  return ( 
    <ul className="list">
          {watched.map((movie) => (
            <li key={movie.imdbID}>
              <img src={movie.Poster} alt={`${movie.Title} poster`} />
              <h3>{movie.Title}</h3>
              <div>
                <p>
                  <span>⭐️</span>
                  <span>{movie.imdbRating}</span>
                </p>
                <p>
                  <span>🌟</span>
                  <span>{movie.userRating}</span>
                </p>
                <p>
                  <span>⏳</span>
                  <span>{movie.runtime} min</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
   );
}
