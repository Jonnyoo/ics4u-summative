import { createContext, useState, useContext, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Map } from 'immutable';
import { auth } from "../firebase";

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    //user info
    const [user, setUser] = useState(null);
    //cart
    const [cart, setCart] = useState(Map());
    //genres
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [currentGenre, setCurrentGenre] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        onAuthStateChanged(auth, user => {
            if (user) {
                setUser(user);
                const sessionCart = localStorage.getItem(user.uid);
                if (sessionCart) {
                    setCart(Map(JSON.parse(sessionCart)));
                }
            }
            setLoading(false);
        });
    }, [])

    if (loading) {
        return <h1>Loading...</h1>
    }

    return (
        <StoreContext.Provider value={{
            cart, setCart,
            user, setUser,
            selectedGenres, setSelectedGenres,
            currentGenre, setCurrentGenre,
        }}>
            {children}
        </StoreContext.Provider>
    );
}

export const useStoreContext = () => {
    return useContext(StoreContext);
}