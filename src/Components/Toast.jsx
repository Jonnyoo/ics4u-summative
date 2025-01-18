import './Toast.css';

const Toast = ({ message }) => {
    return (
        <div className="toast">
            {message}
        </div>
    );
};

export default Toast;