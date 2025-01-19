import { createContext, useState, useContext, useEffect, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Map } from 'immutable';
import { auth } from "../firebase";
import Toast from '../Components/Toast';
import "./context.css";

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState(Map());
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [currentGenre, setCurrentGenre] = useState([]);
    const [loading, setLoading] = useState(true);

    const [toast, setToast] = useState(null);
    const toastTimeoutRef = useRef(null);

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
        return <h1 className="loading-message">Loading...</h1>
    }

    const showToast = (message) => {
        if (toastTimeoutRef.current) {
            clearTimeout(toastTimeoutRef.current);
        }
        setToast(null);
        setTimeout(() => {
            setToast({ message });
            toastTimeoutRef.current = setTimeout(() => {
                setToast(null);
            }, 5000);
        }, 100);
    };

    const updateCart = (newCart) => {
        const updatedCart = typeof newCart === 'function' ? newCart(cart) : newCart;
        const immutableCart = Map.isMap(updatedCart) ? updatedCart : Map(updatedCart);
        setCart(immutableCart);
        if (user) {
            localStorage.setItem(user.uid, JSON.stringify(immutableCart.toJS()));
        }
    };

    return (
        <StoreContext.Provider value={{
            cart, setCart: updateCart,
            user, setUser,
            selectedGenres, setSelectedGenres,
            currentGenre, setCurrentGenre,
            toast, showToast
        }}>
            {children}
            {toast && <Toast message={toast.message} />}
        </StoreContext.Provider>
    );
}

export const useStoreContext = () => {
    return useContext(StoreContext);
}