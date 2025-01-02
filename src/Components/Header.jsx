import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useStoreContext } from '../Context/context.jsx';
import './Header.css';

function Header() {
    const { firstName } = useStoreContext();
    const { user } = useStoreContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        setLoggedIn(false);
        navigate('/');
    };

    return (
        <div className="header">
            <h1 className="header-title"><Link to={`/`} className="header-title">MANGOFLIX</Link></h1>
            <div className="nav-links">
                <a className="nav-link"><Link to={`/`} className="nav-link">Home</Link></a>
                <a className="nav-link"><Link to={`/movies`} className="nav-link">Movies</Link></a>
            </div>
            <div className="welcome-container">
                {user ? (
                    <> <p className="welcome-message">Hello, {firstName}!</p> </>
                ) : (
                    <></>
                )}
            </div>
            <div className="button-container">
                {user ? (
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