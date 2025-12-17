'use client';

import Spinner from "@/lib/Spinner";
import AuthCheck from "@/store/Provider/AuthProvider";
import { persistor, store } from "@/store/store";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

interface LayoutWrapperProps {
    children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
    return (
        <Provider store={store}>
            <PersistGate loading={<Spinner />} persistor={persistor}>
                <Toaster />
                <AuthCheck>
                    {children}
                </AuthCheck>
            </PersistGate>
        </Provider>
    );
}
