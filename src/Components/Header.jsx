import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useStoreContext } from '../Context/context.jsx';
import { auth, firestore } from "../firebase";
import './Header.css';

function Header() {
    const [firstName, setFirstName] = useState("");
    const { user } = useStoreContext();
    const navigate = useNavigate();
    const currentUser = auth.currentUser;
    const { showToast } = useStoreContext();

    useEffect(() => {
        const fetchUserData = async () => {
            const userDoc = await getDoc(doc(firestore, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();

                if (userData.signInMethod == "email") {
                    setFirstName(userData.firstName);
                    console.log("First name: ", userData.firstName);
                }

                if (userData.signInMethod == "google") {
                    setFirstName(user.displayName.split(' ')[0]);
                }
            }
        };

        fetchUserData();
    }, [currentUser, firestore]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
            showToast('Logged out!');
        } catch (error) {
            showToast('Error logging out!');
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