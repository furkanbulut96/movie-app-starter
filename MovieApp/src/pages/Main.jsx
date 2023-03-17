import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { AuthContext } from "../context/AuthContext";
import { MovieContext } from "../context/MovieContext";
import { toastWarnNotify } from "../helpers/ToastNotify";



const API_KEY = process.env.REACT_APP_TMDB_KEY;
const SEARCH_API = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;

const Main = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const { movies, getMovies, loading } = useContext(MovieContext);
  const {currentUser} = useContext(AuthContext)
 const navigate= useNavigate()

const handleSubmit = (e)=>{
  e.preventDefault()
  if(currentUser && searchTerm){
    getMovies(SEARCH_API+searchTerm)
  }else if (!currentUser){
    toastWarnNotify("please log in to Search a movie")
    navigate("/login")
  }else{
    toastWarnNotify("please enter a text")
  }


}
  return (
    <>
      <form onSubmit={handleSubmit} className="flex justify-center p-2">
        <input
          type="search"
          className="w-80 h-8 rounded-md p-1 m-2"
          placeholder="Serach a movie..."
          onChange={(e)=> setSearchTerm(e.target.value)}
          
        />
        <button className="btn-danger-bordered">Search</button>
      </form>
      <div className="flex justify-center flex-wrap">
        {loading ? (
          <div
            className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600 mt-52"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          movies.map((movie) => <MovieCard key={movie.id} {...movie} />)
        )}
      </div>
    </>
  );
};

export default Main;
//* search api aratmak istediğimiz verileri döndürdü inputa setserch verip
//*valuelerini aldık searchterm+search apıyide genel apiden aldık

//*if(currentUser && searchTerm){  getMovies(SEARCH_API+searchTerm)}
//*bu bize boş serach yaprken enterllamayı ve loginolmama durmunda aratmayı engelledi


