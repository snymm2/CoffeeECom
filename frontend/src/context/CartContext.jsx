import { createContext, useContext, useEffect, useReducer } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "code-n-coffee-cart";

function loadCart() {
    try {
        const savedCart = localStorage.getItem(STORAGE_KEY)

        if (!savedCart) {
            return [];
        }
        
        const parsedCart = JSON.parse(savedCart);

        if (!Array.isArray(parsedCart)) {
            return [];
        }

        return parsedCart.filter((item) => 
            item &&
            typeof item.id === "string" &&
            typeof item.name === "string" &&
            Number.isFinite(item.price) &&
            item.price >= 0 &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0
        );
    } catch {
        return [];
    }
}

function cartReducer(cartItems, action) {
    switch (action.type) {
        case "ADD_ITEM": {
            const product = action.product;

            const existingItem = cartItems.find((item) => item.id === product.id);

            if (existingItem) {
                return cartItems.map((item) => item.id === product.id 
                    ? {...item, quantity: item.quantity + action.quantity}
                    : item
            );
            }

            return [
                ...cartItems,
                {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    imageUrl: product.imageUrl || "",
                    quantity: action.quantity,
                },
            ];
        }

        case "REMOVE_ITEM": {
            return cartItems.filter((item) => item.id !== action.id)
        }

        case "UPDATE_QUANTITY": {

            return cartItems
                .map((item) => item.id === action.id
                    ? { ...item, quantity: action.quantity }
                    : item)
                .filter((item) => item.quantity > 0)
        }

        case "CLEAR_CART": {
            return [];
        }

        default: {
            return cartItems;
        }
    }
}

export function CartProvider({children}) {
    const [cartItems, dispatch] = useReducer(cartReducer, undefined, loadCart);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
        } catch {

        }
    }, [cartItems])

    function addToCart(product, quantity = 1) {
        if (!product ||
            product.id == null ||
            typeof product.name !== "string" ||
            !Number.isFinite(product.price) ||
            product.price < 0 ||
            !Number.isInteger(quantity) ||
            quantity < 1) {
                return;
            }
        
        dispatch({
            type: "ADD_ITEM",
            product: {
                ...product,
                id: String(product.id),
            },
            quantity,
        });
    }

    function removeFromCart(id) {

        dispatch({
            type: "REMOVE_ITEM",
            id: String(id)
        });
    }

    function updateQuantity(id, quantity) {
        if (!Number.isInteger(quantity)) {
            return;
        }

        dispatch({
            type: "UPDATE_QUANTITY",
            id: String(id),
            quantity,
        });
    }

    function clearCart() {
        dispatch({
            type: "CLEAR_CART"
        });
    }

    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const cartSubtotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const value = {
        cartItems,
        cartCount,
        cartSubtotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
    };

    return (
        <CartContext value={value}>
            {children}
        </CartContext>
    );
}

export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCart must be used inside a CartProvider");
    }

    return context;
}