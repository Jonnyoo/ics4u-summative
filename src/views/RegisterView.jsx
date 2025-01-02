import "./RegisterView.css";
import Header from "../Components/Header";
import { Link } from 'react-router-dom';
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from 'react-router-dom';
import { useStoreContext } from '../Context/context.jsx';
import { useRef } from 'react';

function RegisterView() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { setUser } = useStoreContext();
  const navigate = useNavigate();

  const registerByEmail = async (event) => {
    event.preventDefault();

    try {
      const user = (await createUserWithEmailAndPassword(auth, email, password)).user;
      await updateProfile(user, { displayName: `${firstName} ${lastName}` });
      setUser(user);
      navigate('/movies');
    } catch (error) {
      alert("Error creating user with email and password!");
    }
  };

  const registerByGoogle = async () => {
    try {
      const user = (await signInWithPopup(auth, new GoogleAuthProvider())).user;
      console.log("signed in with google");
      setUser(user);
      console.log("set user");
      navigate('/movies');
      console.log("navigated");
    } catch {
      alert("Error creating user with email and password!");
    }
  }

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

  const checkBoxesRef = useRef({});

  function handleSubmit(event) {
    event.preventDefault();

    const selectedGenresIds = Object.keys(checkBoxesRef.current)
      .filter((genreId) => checkBoxesRef.current[genreId].checked)
      .map(Number);

    if (selectedGenresIds.length < 10) {
      alert("You need at least 10 genres!");
      return;
    }

    const selectedGenres = genres.filter((genre) => selectedGenresIds.includes(genre.id));

    if (confirmedPassword.current.value != password.current.value) {
      alert("Your passwords don't match!");
      return;
    }

    navigate('/login');
  }

  return (
    <div className="register-container">
      <div className="form-container">
        <Header />
        <h2>Create an Account</h2>
        <form onSubmit={(e) => registerByEmail(e)}>
          <label htmlFor="first-name">First Name</label>
          <input
            type="text"
            id="first-name"
            name="first-name"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required />
          <label htmlFor="last-name">Last Name</label>
          <input
            type="text"
            id="last-name"
            name="last-name"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="register-button">Register</button>
        </form>
        <p className="login-link">
          Already have an account? <Link to={`/login`} className="login-link">Login</Link>
        </p>
        <button onClick={() => registerByGoogle()} className="register-button">Register by Google</button>
      </div>
      <div className="genre-selector">
        <h2>Choose Your Favorite Genres</h2>
        <div className="genre-checkboxes">
          {genres.map((item) => {
            return (
              <div key={item.id}>
                <input
                  type='checkbox'
                  id={`genre-${item.id}`}
                  ref={(el) => (checkBoxesRef.current[item.id] = el)}
                />
                <label htmlFor={`genre-${item.id}`}>
                  {item.genre}
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default RegisterView;