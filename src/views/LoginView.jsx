import './LoginView.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoreContext } from "../Context/context.jsx";
import { Link } from 'react-router-dom';
import Header from "../Components/Header";


function LoginView() {
  const { loggedIn, setLoggedIn } = useStoreContext();
  const { email, password } = useStoreContext();
  const [userPassword, setPassword] = useState('');
  const navigate = useNavigate();

  function login(event) {
    event.preventDefault();
    if (userPassword === password) {
      setLoggedIn(true);
      navigate('/movies');
    } else {
      alert("Wrong password!");
    }
  }

  return (
    <div className="login-container">
      <Header />
      <div className="form-container">
        <h2>Login to Your Account</h2>
        <form onSubmit={(event) => { login(event) }}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />

          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={userPassword} onChange={(event) => { setPassword(event.target.value) }} required />

          <button type="submit" className="login-button">Login</button>
        </form>
        <p className="register-link">New to Netflix? <a href="#"><Link to={`/register`} className="register-link">Register Now</Link></a></p>
      </div>
    </div>
  );
}

export default LoginView;