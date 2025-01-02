import { Outlet } from "react-router-dom";
import Header from "../Components/Header";
import Genres from "../Components/Genres";
import Foooter from "../Components/Footer";
import { useStoreContext } from "../Context/context.jsx";
import "./MoviesView.css";

function MoviesView() {
    const { selectedGenres } = useStoreContext();

    return (
        <div className="app-container">
            <Header />
            <h1 className="movieview-title">Movies by Genre</h1>
            <div className="genre-container">
                <div className="genre-list">
                    <Genres genresList={selectedGenres} />
                </div>
                <div className="genre-movies">
                    <Outlet />
                </div>
            </div>
            <Foooter />
        </div>
    );
}

export default MoviesView;