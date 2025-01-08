import './LoginView.css';
import { useStoreContext } from "../Context/context.jsx";
import { Link, useNavigate } from 'react-router-dom';
import Header from "../Components/Header";
import { useState, useRef } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';


function LoginView() {
  const email = useRef('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUser } = useStoreContext();

  async function loginByEmail(event) {
    event.preventDefault();

    try {
      const user = (await signInWithEmailAndPassword(auth, email.current.value, password)).user;
      navigate('/movies');
      setUser(user);
    } catch (error) {
      console.log(error);
      alert("Error signing in!");
    }
  }

  async function loginByGoogle() {
    try {
      const user = (await signInWithPopup(auth, new GoogleAuthProvider())).user;
      navigate('/movies');
      setUser(user);
    } catch (error) {
      console.log(error);
      alert("Error signing in!");
    }
  }

  return (
    <div className="login-container">
      <Header />
      <div className="form-container">
        <h2>Login to Your Account</h2>
        <form onSubmit={(event) => { loginByEmail(event) }}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" ref={email} required />

          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={password} onChange={(event) => { setPassword(event.target.value) }} required />

          <button type="submit" className="login-button">Login</button>
        </form>
        <button onClick={() => loginByGoogle()} type="submit" className="login-button">Login by Google</button>
        <p className="register-link">New to Netflix? <a href="#"><Link to={`/register`} className="register-link">Register Now</Link></a></p>
      </div>
    </div>
  );
}

export default LoginView;