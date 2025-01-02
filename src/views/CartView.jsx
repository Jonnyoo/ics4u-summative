import { useStoreContext } from '../Context/context.jsx';
import Header from "../Components/Header";
import "./CartView.css";

function CartView() {
    const { cart, setCart } = useStoreContext();

    return (
        <div>
            <Header />
            <h1 className="cart-title">Shopping Cart</h1>
            <div className="cart-view">
                <div className="cart-items">
                    {
                        cart.entrySeq().map(([key, value]) => {
                            return (
                                <div className="cart-item" key={key}>
                                    <img src={`https://image.tmdb.org/t/p/w500${value.url}`} alt={value.title} />
                                    <h1>{value.title}</h1>
                                    <button onClick={() => setCart((prevCart) => prevCart.delete(key))}>Remove</button>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default CartView;