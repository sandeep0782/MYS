'use client'

import { useResetPasswordMutation } from '@/store/authApi'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { CheckCircle, Eye, EyeOff, Lock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AuthPage from '@/components/AuthPage' // Import your dialog component
import { useDispatch } from 'react-redux'
import { authstatus, logout } from '@/store/slice/userSlice'

interface ResetPasswordFormData {
    newPassword: string
    confirmPassword: string
}

const Page: React.FC = () => {
    const { token } = useParams<{ token: string }>()
    const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter();
    const dispatch = useDispatch()
    const [isLoginOpen, setIsLoginOpen] = useState(false) // Control dialog
    const [resetPassword, { isLoading }] = useResetPasswordMutation()
    const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>()

    const onSubmit = async (data: ResetPasswordFormData) => {
        if (data.newPassword !== data.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        try {
            await resetPassword({ token, newPassword: data.newPassword }).unwrap()
            setResetPasswordSuccess(true)
            toast.success('Password reset successfully!')

            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
            dispatch(logout()) // ✅ clears login state

            router.replace('/'); // Replace current URL with home page (or any page)

            // Open login dialog after 2 seconds
            setTimeout(() => {
                setIsLoginOpen(true) // Open dialog
            }, 2000)

        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to reset password')
        }
    }

    return (
        <>
            {/* Reset Password Form */}
            <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md"
                >
                    {!resetPasswordSuccess ? (
                        <>
                            <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
                                Reset Your Password
                            </h2>
                            <p className="text-gray-500 text-center mb-6">
                                Enter your new password below.
                            </p>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                {/* New Password */}
                                <div className="relative">
                                    <Input
                                        {...register("newPassword", { required: "New Password is required" })}
                                        placeholder="New Password"
                                        type={showPassword ? "text" : "password"}
                                        className="pl-10 pr-10"
                                    />
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                    {showPassword ? (
                                        <EyeOff
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer"
                                            size={20}
                                            onClick={() => setShowPassword(false)}
                                        />
                                    ) : (
                                        <Eye
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer"
                                            size={20}
                                            onClick={() => setShowPassword(true)}
                                        />
                                    )}
                                </div>
                                {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}

                                {/* Confirm Password */}
                                <div className="relative">
                                    <Input
                                        {...register("confirmPassword", { required: "Confirm Password is required" })}
                                        placeholder="Confirm Password"
                                        type={showPassword ? "text" : "password"}
                                        className="pl-10 pr-10"
                                    />
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                </div>
                                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 cursor-pointer"
                                >
                                    {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : "Reset Password"}
                                </Button>
                            </form>
                        </>
                    ) : (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
                            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                            <h2 className="text-2xl font-semibold text-green-600">Password Reset Successfully!</h2>
                            <p className="text-gray-500">You will be redirected to login shortly.</p>
                        </motion.div>
                    )}
                </motion.div>
            </div>

            {/* Auth Dialog */}
            <AuthPage isLoginOpen={isLoginOpen} setIsLoginOpen={setIsLoginOpen} />
        </>
    )
}

export default Page
