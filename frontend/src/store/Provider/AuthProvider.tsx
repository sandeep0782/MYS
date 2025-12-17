import { ReactNode, useEffect, useState } from "react";
import { useVerifyAuthMutation } from "../authApi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { logout, setEmailVerified, setUser } from "../slice/userSlice";
import Spinner from "@/lib/Spinner";

export default function AuthCheck({ children }: { children: React.ReactNode }) {
    const [verifyAuth, { isLoading }] = useVerifyAuthMutation()
    const [isCheckingAuth, setIsCheckingAuth] = useState(true)
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.user.user)
    const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await verifyAuth({}).unwrap()
                if (response.success) {
                    dispatch(setUser(response.data))
                    dispatch(setEmailVerified(response.data.isVerified))
                } else (dispatch(logout()))
            } catch (error) {
                (dispatch(logout()))
            } finally { setIsCheckingAuth(false) }
        }
        if (!user && isLoggedIn) {
            checkAuth()
        } else {
            setIsCheckingAuth(false)
        }
    }, [verifyAuth, dispatch, user])
    if (isLoading || isCheckingAuth) {
        return <Spinner />
    }
    return <>{children}</>
}