import { useStoreContext } from '../Context/context.jsx';
import Header from "../Components/Header";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import { Map } from 'immutable';
import "./CartView.css";

function CartView() {
    const { user } = useStoreContext();
    const { cart, setCart } = useStoreContext();
    const { showToast } = useStoreContext();

    const handleRemoveCart = (key) => {
        setCart((prevCart) => {
            const newCart = prevCart.delete(key);
            localStorage.setItem(user.uid, JSON.stringify(newCart.toJS()));
            return newCart;
        });
        showToast('Removed from cart!');
    };

    const handleCheckout = async () => {
        try {
            if (cart.size === 0) {
                showToast('Cart is empty!');
                return;
            }
            const userDocRef = doc(firestore, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const previousPurchases = userData.previousPurchases || [];

                const newPurchases = cart.toArray().map(([key, value]) => ({
                    id: key,
                    title: value.title,
                    url: value.url
                }));

                const updatedPurchases = [...previousPurchases, ...newPurchases];

                await updateDoc(userDocRef, {
                    previousPurchases: updatedPurchases
                });

                setCart(Map());
                localStorage.removeItem(user.uid);
                showToast('Thank you for your purchase!');
            }
        } catch (error) {
            console.error("Error during checkout: ", error);
            showToast('Error during checkout!');
        }
    };

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
                                    <div className="cart-item-content">
                                        <h1>{value.title}</h1>
                                        <button onClick={() => handleRemoveCart(key)}>Remove</button>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <button className="checkout-button" onClick={handleCheckout}>Checkout</button>
        </div>
    )
}

export default CartView;