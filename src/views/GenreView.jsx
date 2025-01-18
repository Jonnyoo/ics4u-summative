import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useStoreContext } from '../Context/context';
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import "./GenreView.css";

const genres = [
    { genre: "Sci-Fi", id: 878 },
    { genre: "Thriller", id: 53 },
    { genre: "Adventure", id: 12 },
    { genre: "Family", id: 10751 },
    { genre: "Animation", id: 16 },
    { genre: "Action", id: 28 },
    { genre: "History", id: 36 },
    { genre: "Fantasy", id: 14 },
    { genre: "Horror", id: 27 },
    { genre: "Comedy", id: 35 },
    { genre: "Crime", id: 80 },
    { genre: "Music", id: 10402 },
    { genre: "Mystery", id: 9648 },
    { genre: "War", id: 10752 },
    { genre: "Western", id: 37 }
];

function GenreView() {
    const { genre_id } = useParams();
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const selectedGenre = genres.find(genre => genre.id === parseInt(genre_id));
    const genreName = selectedGenre ? selectedGenre.genre : "Movies in Genre";
    const { id } = useParams();
    const { cart, setCart } = useStoreContext();
    const { user } = useStoreContext();
    const { showToast } = useStoreContext();
    const [previousPurchases, setPreviousPurchases] = useState([]);

    useEffect(() => {
        async function fetchMovies() {
            try {
                setLoading(true);
                const response = await axios.get(
                    `https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_KEY}&with_genres=${genre_id}&page=${page}`
                );
                setMovies(response.data.results);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching movies:", error);
                showToast("Error fetching movies");
                setLoading(false);
            }
        }
        fetchMovies();
    }, [genre_id, page]);

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

    const handleAddToCart = (movie) => {
        if (previousPurchases.some(purchase => purchase.id === movie.id.toString())) {
            showToast('You have already purchased this movie!');
            return;
        }
        setCart((prevCart) => prevCart.set(movie.id.toString(), { title: movie.original_title, url: movie.poster_path }));
        showToast('Added to cart!');
    };

    return (
        <div className="hero">
            <h2>{genreName}</h2>
            <div className="genre-view-container">
                {movies.length > 0 ? (
                    movies.map((movie) => {
                        const isInCart = cart.has(movie.id.toString());
                        return (
                            <div key={movie.id} className="genre-view-item">
                                <Link to={`/movies/details/${movie.id}`}>
                                    {movie.poster_path ? (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                            alt={movie.title}
                                            className="genre-view-image"
                                        />
                                    ) : (
                                        <div className="no-image">No Image Available</div>
                                    )}
                                </Link>
                                {!loading && (
                                    <div className="genre-view-details">
                                        <h3>{movie.title}</h3>
                                        <button
                                            onClick={() => handleAddToCart(movie)}
                                            className="buy-button"
                                            disabled={isInCart}
                                        >
                                            {isInCart ? 'Added' : 'Buy'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <p>No movies available for this genre.</p>
                )}
            </div>
            <div className="genre-view-pagination-container">
                <button
                    className="genre-view-pagination-button"
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                >
                    Prev
                </button>
                <button
                    className="genre-view-pagination-button"
                    onClick={() => setPage((p) => p + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default GenreView;