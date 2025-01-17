import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { useStoreContext } from '../Context/context.jsx';
import './Header.css';

function Header() {
    const [firstName, setFirstName] = useState("");
    const { user } = useStoreContext();
    const navigate = useNavigate();
    const db = getFirestore();
    const auth = getAuth();
    const currentUser = auth.currentUser;

    useEffect(() => {
        const fetchUserData = async () => {
            if (currentUser) {
                const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setFirstName(userData.firstName);
                }
            }
        };

        fetchUserData();
    }, [currentUser, db]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error("Error logging out: ", error);
        }
    };

    return (
        <div className="header">
            <h1 className="header-title"><Link to={`/`} className="header-title">MANGOFLIX</Link></h1>
            <div className="nav-links">
                <a className="nav-link"><Link to={`/`} className="nav-link">Home</Link></a>
                <a className="nav-link"><Link to={`/movies`} className="nav-link">Movies</Link></a>
            </div>
            <div className="welcome-container">
                {currentUser ? (
                    <> <p className="welcome-message">Hello, {firstName}!</p> </>
                ) : (
                    <></>
                )}
            </div>
            <div className="button-container">
                {currentUser ? (
                    <>
                        <button className="buttons" type="button"><Link to={`/cart`} className="button">Cart</Link></button>
                        <button className="buttons" type="button"><Link to={`/settings`} className="button">Settings</Link></button>
                        <button className="buttons" type="button" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <button className="buttons" type="button"><Link to={`/login`} className="button">Login</Link></button>
                        <button className="buttons" type="button"><Link to={`/register`} className="button">Register</Link></button>
                    </>
                )}
            </div>
        </div>
    );
}

export default Header;