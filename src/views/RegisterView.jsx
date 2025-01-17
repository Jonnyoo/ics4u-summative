import "./RegisterView.css";
import Header from "../Components/Header";
import { Link, useNavigate } from 'react-router-dom';
import { getFirestore, doc, setDoc } from "firebase/firestore"; 
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { useStoreContext } from '../Context/context.jsx';
import { useState, useRef } from 'react';

function RegisterView() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { setUser } = useStoreContext();
  const navigate = useNavigate();
  const checkBoxesRef = useRef({});
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

  const db = getFirestore();
  const auth = getAuth();

  function displayError(error) {
    console.error("Error creating user with email and password:")
    console.error(error.message);
    // setErrorMessage(`Error creating user with email and password! ${error.message}`);
    if (error.message === "Firebase: Error (auth/email-already-in-use).") {
      setErrorMessage("This email is already in use!");
    } else if (error.message === "Firebase: Password should be at least 6 characters (auth/weak-password).") {
      setErrorMessage("Password should be at least 6 characters!");
    }
  }

  const registerByEmail = async (event) => {
    event.preventDefault();

    try {
      if (confirmPassword != password) {
        setErrorMessage("Your passwords don't match!");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: `${firstName} ${lastName}` });

      const selectedGenresIds = Object.keys(checkBoxesRef.current)
        .filter((genreId) => checkBoxesRef.current[genreId].checked)
        .map(Number);

        const selectedGenres = genres.filter((genre) => selectedGenresIds.includes(genre.id));

      if (selectedGenresIds.length < 10) {
        setErrorMessage("You need at least 10 genres!");
        return;
      }

      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        email,
        selectedGenres
      });

      await updateProfile(user, { displayName: `${firstName} ${lastName}` });
      setUser(user);

      navigate('/movies');
      console.log(user);
    } catch (error) {
      displayError(error);
    }
  };

  const registerByGoogle = async () => {
    try {
      const selectedGenresIds = Object.keys(checkBoxesRef.current)
        .filter((genreId) => checkBoxesRef.current[genreId].checked)
        .map(Number);

      if (selectedGenresIds.length < 10) {
        setErrorMessage("You need at least 10 genres!");
        return;
      }

      const user = (await signInWithPopup(auth, new GoogleAuthProvider())).user;
      const selectedGenres = genres.filter((genre) => selectedGenresIds.includes(genre.id));

      await setDoc(doc(db, "users", user.uid), {
        firstName: user.displayName.split(' ')[0],
        lastName: user.displayName.split(' ')[1] || '',
        email: user.email,
        selectedGenres
      });

      console.log("signed in with google");
      setUser(user);
      console.log("set user");
      navigate('/movies');
      console.log("navigated");
      console.log(user);
    } catch {
      alert("Error creating user with Google!");
    }
  }

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
        <button onClick={() => registerByGoogle()} className="register-button">Register with Google</button>
        <p className="login-link">
          <Link to={`/login`} className="login-link">Already have an account? Login</Link>
        </p>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
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