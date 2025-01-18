import React, { useState, useEffect, useRef } from 'react';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import Header from "../Components/Header";
import { auth, firestore } from "../firebase";
import "./SettingsView.css";
import { useStoreContext } from '../Context/context.jsx';

function SettingsView() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [newFirstName, setNewFirstName] = useState("");
    const [newLastName, setNewLastName] = useState("");
    const [isEditingFirstName, setIsEditingFirstName] = useState(false);
    const [isEditingLastName, setIsEditingLastName] = useState(false);
    const { selectedGenres, setSelectedGenres } = useStoreContext();
    const [isGoogleUser, setIsGoogleUser] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isPasswordSectionExpanded, setIsPasswordSectionExpanded] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [toastMessage, setToastMessage] = useState("");
    const toastTimeoutRef = useRef(null);
    const [signInMethod, setSignInMethod] = useState("");

    const user = auth.currentUser;

    const genresList = [
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

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                const userDoc = await getDoc(doc(firestore, "users", user.uid));
                const userData = userDoc.data();
                // if (userDoc.exists()) {
                //     const userData = userDoc.data();
                //     setSignInMethod(userData.signInMethod);
                //     console.log("sign in method");
                //     console.log(userData.signInMethod);
                // } else {
                //     return;
                // }

                if (userData.signInMethod == "google") {
                    console.log("google user");
                    setFirstName(user.displayName.split(' ')[0]);
                    setLastName(user.displayName.split(' ')[1]);
                    setNewFirstName(user.displayName.split(' ')[0]);
                    setNewLastName(user.displayName.split(' ')[1]);
                    setEmail(user.email);
                    console.log("email");
                    console.log(user.email);
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setSelectedGenres(userData.selectedGenres || []);
                    }`  `
                    return;
                }
                
                if (userData.signInMethod == "email") {
                    console.log("not google user");
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setFirstName(userData.firstName);
                        setLastName(userData.lastName);
                        setEmail(userData.email);
                        setNewFirstName(userData.firstName);
                        setNewLastName(userData.lastName);
                        setSelectedGenres(userData.selectedGenres || []);
                    }
                    return;
                }
            }
        };

        fetchUserData();
    }, [user, firestore, setSelectedGenres]);

    const handleFirstNameChange = (e) => {
        setNewFirstName(e.target.value);
    };

    const handleLastNameChange = (e) => {
        setNewLastName(e.target.value);
    };

    const handleGenreChange = (genre) => {
        setSelectedGenres((prevGenres) =>
            prevGenres.some((g) => g.id === genre.id)
                ? prevGenres.filter((g) => g.id !== genre.id)
                : [...prevGenres, genre]
        );
    };

    const handlePasswordChange = async () => {
        setIsPasswordSectionExpanded(true);
    };

    const handleCancelPasswordChange = () => {
        setIsPasswordSectionExpanded(false);
        setCurrentPassword("");
        setNewPassword("");
        setErrorMessage("");
    };

    const handleUpdatePassword = async () => {
        if (user && currentPassword) {
            try {
                const credential = EmailAuthProvider.credential(user.email, currentPassword);
                await reauthenticateWithCredential(user, credential);
            } catch (error) {
                setErrorMessage("Your current password is incorrect!");
                showToast("Your current password is incorrect!");
                return;
            }
        } else {
            setErrorMessage("Please enter your current password!");
            showToast("Please enter your current password!");
            return;
        }

        if (!newPassword) {
            setErrorMessage("Please enter a new password!");
            showToast("Please enter a new password!");
            return;
        }

        if (newPassword.length < 6) {
            setErrorMessage("New password should be at least 6 characters!");
            showToast("New password should be at least 6 characters!");
            return;
        }

        if (currentPassword === newPassword) {
            setErrorMessage("New password should be different from the current password!");
            showToast("New password should be different from the current password!");
            return;
        }

        try {
            await updatePassword(user, newPassword);
            showToast("Saved!");
            setIsPasswordSectionExpanded(false);
            setCurrentPassword("");
            setNewPassword("");
        } catch (error) {
            console.error("Error updating password: ", error);
            setErrorMessage("Failed to update password.");
            showToast("Failed to update password.");
        }
    };

    const handleSaveFirstName = async () => {
        if (user) {
            try {
                await updateDoc(doc(firestore, "users", user.uid), {
                    firstName: newFirstName
                });
                setFirstName(newFirstName);
                setIsEditingFirstName(false);
                showToast("Saved!");
            } catch (error) {
                console.error("Error updating first name: ", error);
                showToast("Failed to update first name.");
            }
        }
    };

    const handleSaveLastName = async () => {
        if (user) {
            try {
                await updateDoc(doc(firestore, "users", user.uid), {
                    lastName: newLastName
                });
                setLastName(newLastName);
                setIsEditingLastName(false);
                showToast("Saved!");
            } catch (error) {
                console.error("Error updating last name: ", error);
                showToast("Failed to update last name.");
            }
        }
    };

    const handleSaveGenres = async () => {
        if (user) {
            try {
                await updateDoc(doc(firestore, "users", user.uid), {
                    selectedGenres
                });
                showToast("Saved!");
            } catch (error) {
                console.error("Error updating favorite genres: ", error);
                alert("Failed to update favorite genres.");
            }
        }
    };

    const handleCancelFirstNameChange = () => {
        setNewFirstName(firstName);
        setIsEditingFirstName(false);
    };

    const handleCancelLastNameChange = () => {
        setNewLastName(lastName);
        setIsEditingLastName(false);
    };

    const showToast = (message) => {
        if (toastTimeoutRef.current) {
            clearTimeout(toastTimeoutRef.current);
        }
        setToastMessage("");
        setTimeout(() => {
            setToastMessage(message);
            toastTimeoutRef.current = setTimeout(() => {
                setToastMessage("");
            }, 5000);
        }, 100); // Small delay to reset the animation
    };

    return (
        <div>
            <Header />
            <h1 className="settings-title">Settings</h1>
            <div className="settings-view">
                <label className="settings-label">First name</label>
                <div className="settings-section">
                    <label className="settings-info-value">
                        {isGoogleUser ? (
                            <span>{user.displayName.split(' ')[0]}</span>
                        ) : (
                            isEditingFirstName ? (
                                <input type="text" value={newFirstName} onChange={handleFirstNameChange} />
                            ) : (
                                <span>{firstName}</span>
                            )
                        )}
                    </label>
                    {!isGoogleUser && (
                        <>
                            {!isEditingFirstName && (
                                <button className="edit-button" onClick={() => setIsEditingFirstName(true)}>Edit</button>
                            )}
                            {isEditingFirstName && (
                                <>
                                    <div className="edit-buttons">
                                        <button className="edit-button" onClick={handleSaveFirstName}>Save</button>
                                        <button className="edit-button" onClick={handleCancelFirstNameChange}>Cancel</button>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
                <label className="settings-label">Last name</label>
                <div className="settings-section">
                    <label className="settings-info-value">
                        {isGoogleUser ? (
                            <span>{user.displayName.split(' ')[1]}</span>
                        ) : (
                            isEditingLastName ? (
                                <input type="text" value={newLastName} onChange={handleLastNameChange} />
                            ) : (
                                <span>{lastName}</span>
                            )
                        )}
                    </label>
                    {!isGoogleUser && (
                        <>
                            {!isEditingLastName && (
                                <button className="edit-button" onClick={() => setIsEditingLastName(true)}>Edit</button>
                            )}
                            {isEditingLastName && (
                                <>
                                    <div className="edit-buttons">
                                        <button className="edit-button" onClick={handleSaveLastName}>Save</button>
                                        <button className="edit-button" onClick={handleCancelLastNameChange}>Cancel</button>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
                <label className="settings-label">Email</label>
                <div className="settings-section">
                    <span className="settings-info-value">{email}</span>
                </div>
                {!isGoogleUser && (
                    <>
                        <label className="settings-label">Password</label>
                        <div className="settings-section">
                            {isPasswordSectionExpanded ? (
                                <>
                                    <div className="change-password-section">
                                        <div className="current-password-section">
                                            <input
                                                type="password"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                placeholder="Current password"
                                            />
                                            <button className="edit-button" onClick={handleCancelPasswordChange}>Cancel</button>
                                        </div>
                                        <div className="new-password-section">
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="New password"
                                            />
                                            <button className="edit-button" onClick={handleUpdatePassword}>Update</button>
                                        </div>
                                        {errorMessage && <div className="error-message">{errorMessage}</div>}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <span className="settings-info-value">••••••••</span>
                                    <button className="edit-button" onClick={handlePasswordChange}>Change</button>
                                </>
                            )}
                        </div>
                    </>
                )}
                <label className="settings-label">Favorite Genres</label>
                <div className="settings-section">
                    <div className="settings-genre-checkboxes">
                        {genresList.map((genre) => (
                            <div key={genre.id}>
                                <input
                                    type="checkbox"
                                    id={`genre-${genre.id}`}
                                    checked={selectedGenres.some(g => g.id === genre.id)}
                                    onChange={() => handleGenreChange(genre)}
                                />
                                <label htmlFor={`genre-${genre.id}`}>{genre.genre}</label>
                            </div>
                        ))}
                    </div>
                    <button className="edit-button" onClick={handleSaveGenres}>Save</button>
                </div>
            </div>
            {toastMessage && (
                <div className="toast">
                    {toastMessage}
                </div>
            )}
        </div>
    );
}

export default SettingsView;