import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useStoreContext } from '../Context/context';
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import "./DetailView.css"

function DetailMovieView() {
    const [trailers, setTrailers] = useState([]);
    const [movie, setMovie] = useState([]);
    const { id } = useParams();
    const { cart, setCart } = useStoreContext();
    const { user } = useStoreContext();
    const [previousPurchases, setPreviousPurchases] = useState([]);
    const isInCart = cart.has(id);
    const isPurchased = previousPurchases.some(purchase => purchase.id === id);
    const { showToast } = useStoreContext();

    useEffect(() => {
        async function fetchMovieDetails() {
            const movieResponse = await axios.get(
                `https://api.themoviedb.org/3/movie/${id}?api_key=${import.meta.env.VITE_TMDB_KEY}`
            );
            setMovie(movieResponse.data);

            const videosResponse = await axios.get(
                `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${import.meta.env.VITE_TMDB_KEY}`
            );
            setTrailers(videosResponse.data.results.filter((video) => video.type === "Trailer"));
        }

        fetchMovieDetails();
    }, [id]);

    useEffect(() => {
        async function fetchPreviousPurchases() {
            const userDocRef = doc(firestore, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setPreviousPurchases(userData.previousPurchases || []);
            }
        }
        fetchPreviousPurchases();
    }, [user]);

    const handleAddToCart = () => {
        if (isPurchased) {
            showToast('You have already purchased this movie!');
            return;
        }
        setCart((prevCart) => prevCart.set(id, { title: movie.original_title, url: movie.poster_path }));
        showToast('Added to cart!');
    };

    return (
        <div className="movie-detail">
            <div className="movie-content">
                <div className="movie-info">
                    <h1 className="movie-title">{movie.original_title}</h1>
                    <p className="movie-overview">{movie.overview}</p>
                    <div className="movie-info">
                        <p><strong>Release Date:</strong> {movie.release_date}</p>
                        <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
                        <p><strong>Language:</strong> {movie.original_language}</p>
                        <p><strong>Rating:</strong> {movie.vote_average}</p>
                        <p><strong>Popularity:</strong> {movie.popularity}</p>
                        <p><strong>Box Office:</strong> {movie.revenue}$</p>
                        <button
                            onClick={() => handleAddToCart()}
                            className="buy-button"
                            disabled={isInCart || isPurchased}
                        >
                            {isInCart ? 'Added' : isPurchased ? 'Purchased' : 'Buy'}
                        </button>
                    </div>
                </div>
                {movie.poster_path && (
                    <img
                        className="movie-poster"
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.original_title}
                    />
                )}
            </div>

            <div className="trailers-section">
                <h2>Trailers</h2>
                <div className="trailers-grid">
                    {trailers.map((trailer) => (
                        <div key={trailer.id} className="trailer-tile">
                            <a
                                href={`https://www.youtube.com/watch?v=${trailer.key}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img
                                    className="trailer-thumbnail"
                                    src={`https://img.youtube.com/vi/${trailer.key}/0.jpg`}
                                    alt={trailer.name}
                                />
                                <h3>{trailer.name}</h3>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DetailMovieView;