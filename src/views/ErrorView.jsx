import Header from "../Components/Header"
import "./ErrorView.css"

function ErrorView() {
    return (
        <div>
            <Header />
            <h1 className="error-message">This page does not exist</h1>
        </div>
    )
}

export default ErrorView;