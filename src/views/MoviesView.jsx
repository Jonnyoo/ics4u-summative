import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../Components/Header";
import Genres from "../Components/Genres";
import Footer from "../Components/Footer";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase";

import "./MoviesView.css";

function MoviesView() {
    const [selectedGenres, setSelectedGenres] = useState([]);
    const user = auth.currentUser;

    useEffect(() => {
        const fetchSelectedGenres = async () => {
            if (user) {
                const userDoc = await getDoc(doc(firestore, "users", user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setSelectedGenres(userData.selectedGenres || []);
                }
            }
        };

        fetchSelectedGenres();
    }, [user, firestore]);

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
            <Footer />
        </div>
    );
}

export default MoviesView;