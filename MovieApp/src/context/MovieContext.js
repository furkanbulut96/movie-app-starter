import React, { createContext, useEffect, useState } from "react";
import axios from "axios"
export const MovieContext = createContext();
const API_KEY = process.env.REACT_APP_TMDB_KEY;
const FEATURED_API = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}`;


const MovieContextProvider = ({ children }) => {

    const [movies, setMovies] = useState([])
    //!bir dize olarak dönüyor  [] verdik
    const [loading, setLoading] = useState(false)


    useEffect(() => {
//? ana sayfada featured apı ile çektik
     getMovies(FEATURED_API)
    }, [])
    
  const getMovies = (API) => {
    //? Get moviese hangi url gönderirsem o datayı çekicek
    setLoading(true)
    axios
      .get(API)
      .then((res) => setMovies(res.data.results))
      .catch((err) => console.log(err)).finally(()=>setLoading(false));//! hata veya başarılı yani her türlü olduğunda finally metodu
  };

  const values = {movies,getMovies,loading};
  return (
    <MovieContext.Provider value={values}>{children}</MovieContext.Provider>
  );
};

export default MovieContextProvider;


//* data gelene kadar loading true geldikten sonra finally metoduile false çevirdik