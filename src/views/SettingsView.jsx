import React, { useState } from 'react';
import { useStoreContext } from '../Context/context';
import Header from '../Components/Header';
import './SettingsView.css';

const SettingsView = () => {
    const { firstName, setFirst, lastName, setLast, email, selectedGenres, setSelected } = useStoreContext();
    const [isEditingFirstName, setIsEditingFirstName] = useState(false);
    const [isEditingLastName, setIsEditingLastName] = useState(false);
    const [newFirstName, setNewFirstName] = useState(firstName);
    const [newLastName, setNewLastName] = useState(lastName);
    const [newSelectedGenres, setNewSelectedGenres] = useState(selectedGenres);

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

    function handleSave() {
        setFirst(newFirstName);
        setLast(newLastName);
        setSelected(newSelectedGenres);
        setIsEditingFirstName(false);
        setIsEditingLastName(false);
    };

    function handleGenreChange(genre) {
        setNewSelectedGenres(prev =>
            prev.some(g => g.id === genre.id) ? prev.filter(g => g.id !== genre.id) : [...prev, genre]
        );
    };

    function handleFirstNameChange(e) {
        setNewFirstName(e);
        setFirst(e);
    }

    function handleLastNameChange(e) {
        setNewLastName(e);
        setLast(e);
    }

    return (
        <div>
            <Header />
            <h1 className="settings-title">Settings</h1>
            <div className="settings-view">
                <label className="settings-label">First name</label>
                <div className="settings-section">
                    <label className="settings-info-value">
                        {isEditingFirstName ? (
                            <input type="text" value={newFirstName} onChange={(e) => handleFirstNameChange(e.target.value)} />
                        ) : (
                            <span>{firstName}</span>
                        )}
                        <button className="edit-button" onClick={() => setIsEditingFirstName(!isEditingFirstName)}>
                            {isEditingFirstName ? 'Save' : 'Edit'}
                        </button>
                    </label>
                </div>
                <label className="settings-label">Last name</label>
                <div className="settings-section">
                    <label className="settings-info-value">
                        {isEditingLastName ? (
                            <input type="text" value={newLastName} onChange={(e) => handleLastNameChange(e.target.value)} />
                        ) : (
                            <span>{lastName}</span>
                        )}
                        <button className="edit-button" onClick={() => setIsEditingLastName(!isEditingLastName)}>
                            {isEditingLastName ? 'Save' : 'Edit'}
                        </button>
                    </label>
                </div>
                <label className="settings-label">Email</label>
                <div className="settings-section">
                    <span className="settings-info-value">{email}</span>
                </div>
                <label className="settings-label">Favorite Genres</label>
                <div className="settings-section">
                    <div className="settings-genre-checkboxes">
                        {genresList.map((genre) => (
                            <div key={genre.id}>
                                <input
                                    type="checkbox"
                                    id={`genre-${genre.id}`}
                                    checked={newSelectedGenres.some(g => g.id === genre.id)}
                                    onChange={() => handleGenreChange(genre)}
                                />
                                <label htmlFor={`genre-${genre.id}`}>
                                    {genre.genre}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
                <button className="save-button" onClick={handleSave}>Save Changes</button>
            </div>
        </div>
    );
};

export default SettingsView;