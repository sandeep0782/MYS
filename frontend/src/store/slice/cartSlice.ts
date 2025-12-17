import { CartItem } from "@/lib/types/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartSlice {
    _id: string;
    user: string;
    items: CartItem[];
    createdAt: string;
    updated: string;
}

const initialState: CartSlice = {
    _id: "",
    user: "",
    items: [],
    createdAt: "",
    updated: "",
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCart: (state, action: PayloadAction<Partial<CartSlice>>) => {
            return { ...state, ...action.payload };
        },
        addToCart: (state, action: PayloadAction<Partial<CartSlice>>) => {
            return { ...state, ...action.payload };
        },
        clearCart: () => initialState,
    },
});

export const { setCart, addToCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
