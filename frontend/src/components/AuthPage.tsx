import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AnimatePresence, motion } from 'framer-motion';
import { Input } from './ui/input';
import { useForm } from "react-hook-form"
import { CheckCircle, Eye, EyeOff, Loader2, Lock, Mail, User } from 'lucide-react';
import { Button } from './ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { useForgotPasswordMutation, useLoginMutation, useRegisterMutation } from '@/store/authApi';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { authstatus, toggleLoginDialog } from '@/store/slice/userSlice';
import { useRouter } from 'next/navigation';
import { BASE_URL } from '@/store/api';

interface LoginProps {
    isLoginOpen: boolean;
    setIsLoginOpen: (open: boolean) => void
}
const AuthPage: React.FC<LoginProps> = ({ isLoginOpen, setIsLoginOpen }) => {
    const [currentTab, setCurrentTab] = useState<"login" | "signup" | "forgot">("login")
    const [showPassword, setShowPassword] = useState(false)
    const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false)
    const [loginLoading, setLoginLoading] = useState(false)
    const [signupLoading, setsignupLoading] = useState(false)
    const [googleLoading, setgoogleLoading] = useState(false)
    const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false)
    const dispatch = useDispatch()
    const [register] = useRegisterMutation()
    const [login] = useLoginMutation()
    const [forgotPassword] = useForgotPasswordMutation()
    const router = useRouter()

    interface LoginFormData {
        email: string;
        password: string;
    }
    interface SignupFormData {
        name: string;
        email: string;
        password: string;
        agreeTerms: boolean;
    }
    interface ForgotPasswordFormData {
        email: string;
    }

    const { register: registerLogin, handleSubmit: handleLoginSubmit, formState: { errors: loginError } } = useForm<LoginFormData>()
    const { register: registerSignup, handleSubmit: handleSignupSubmit, formState: { errors: signupError } } = useForm<SignupFormData>()
    const { register: registerForgotPassword, handleSubmit: handleForgotPasswordSubmit, formState: { errors: forgotPasswordError }, reset: resetForgotPasswordForm } = useForm<ForgotPasswordFormData>()

    const onSubmitSignUp = async (data: SignupFormData) => {
        setsignupLoading(true)
        try {
            const { email, password, name, agreeTerms } = data
            const result = await register({ email, password, name, agreeTerms }).unwrap()
            if (result.success) {
                toast.success('Verification Link is sent to your email, please verigy')
                dispatch(toggleLoginDialog())
            }
        } catch (error) {
            toast.error('Email already registered')
        } finally {
            setsignupLoading(false)
        }
    }

    const onSubmitLogin = async (data: LoginFormData) => {
        setLoginLoading(true)
        try {
            const result = await login(data).unwrap()
            if (result.success) {
                toast.success('Login Sucessfully')
                dispatch(toggleLoginDialog())
                dispatch(authstatus())
                window.location.reload()
            }
        } catch (error) {
            toast.error('Email or password incorrect')
        } finally {
            setLoginLoading(false)
        }
    }
    const handleGoogleLogin = async () => {
        setgoogleLoading(true)
        try {
            window.location.href = `${BASE_URL}/auth/google`;
            dispatch(authstatus())
            dispatch(toggleLoginDialog())
            setTimeout(() => {
                toast.success('Google Login successfull')
                setIsLoginOpen(false)
            }, 3000)
        } catch (error) {
            toast.error('Email or password incorrect')
        } finally {
            setgoogleLoading(false)
        }
    }
    const onSubmitForgotPassword = async (data: ForgotPasswordFormData) => {
        setForgotPasswordLoading(true);
        try {
            const result = await forgotPassword({ email: data.email }).unwrap();
            if (result.success) {
                toast.success("Reset Password link sent to your email successfully");
                setForgotPasswordSuccess(true);
                // Reset the form and state after 5 seconds
                setTimeout(() => {
                    setForgotPasswordSuccess(false);
                    resetForgotPasswordForm(); // Reset the form fields
                }, 5000);
            }
        } catch (error) {
            toast.error("Failed to send Reset Password Link, please try later");
        } finally {
            setForgotPasswordLoading(false);
        }
    };


    return (
        <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
            <DialogContent className='sm:max-w-[425px] p-6'>
                <DialogHeader className="text-center">
                    <DialogTitle className="flex flex-col items-center justify-center text-2xl font-bold space-y-2">
                        <Image src="/logo.png" alt="MYSMME Logo" width={60} height={60} />
                        <span>
                            <span className="mr-1">Welcome to</span>
                            <span className="text-red-600">MYSMME</span>
                        </span>
                    </DialogTitle>
                </DialogHeader>
                <Tabs
                    value={currentTab}
                    onValueChange={(value) =>
                        setCurrentTab(value as "login" | "signup" | "forgot")
                    }
                    className="mt-4"
                >
                    <TabsList className='grid w-full grid-cols-3 mb-6'>
                        <TabsTrigger value='login' className='cursor-pointer'>Login</TabsTrigger>
                        <TabsTrigger value='signup' className='cursor-pointer'>Sign Up</TabsTrigger>
                        <TabsTrigger value='forgot' className='cursor-pointer'>Forgot Password</TabsTrigger>
                    </TabsList>
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={currentTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <TabsContent value="login" className="space-y-4">
                                <form className="space-y-4" onSubmit={handleLoginSubmit(onSubmitLogin)}>
                                    {/* Email */}
                                    <div className="relative">
                                        <Input
                                            {...registerLogin("email", { required: "Email is required" })}
                                            placeholder="Enter Email"
                                            type="email"
                                            className="pl-10"
                                        />
                                        <Mail
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                                            size={20}
                                        />
                                    </div>
                                    {loginError.email && (
                                        <p className="text-red-500 text-sm">{loginError.email.message}</p>
                                    )}

                                    {/* Password */}
                                    <div className="relative">
                                        <Input
                                            {...registerLogin("password", { required: "Password is required" })}
                                            placeholder="Enter Password"
                                            type={showPassword ? "text" : "password"}
                                            className="pl-10 pr-10"
                                        />

                                        {/* Left Lock Icon */}
                                        <Lock
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                                            size={20}
                                        />

                                        {/* Right Eye Toggle */}
                                        {showPassword ? (
                                            <EyeOff
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                                                size={20}
                                                onClick={() => setShowPassword(false)}
                                            />
                                        ) : (
                                            <Eye
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                                                size={20}
                                                onClick={() => setShowPassword(true)}
                                            />
                                        )}
                                    </div>
                                    {loginError.password && (
                                        <p className="text-red-500 text-sm">{loginError.password.message}</p>
                                    )}

                                    <Button type='submit' className='w-full font-bold cursor-pointer'>
                                        {loginLoading ? (
                                            <Loader2 className='animate-spin mr-2' size={20} />
                                        ) : (
                                            "Login"
                                        )}
                                    </Button>
                                </form>
                                <div className='flex items-center my-4'>
                                    <div className='flex-1 h-px bg-gray-300'></div>
                                    <p className='mx-2 text-gray-500 text-sm'>or</p>
                                    <div className='flex-1 h-px bg-gray-300'></div>
                                </div>
                                <Button onClick={handleGoogleLogin} className='w-full flex items-center justify-center gap-2 bg-white text-gray-700 border font-bold border-gray-300 hover:bg-gray-20 cursor-pointer'>
                                    {googleLoading ? (
                                        <>
                                            <Loader2 className='animate-spin mr-2' size={20} />
                                        </>
                                    ) : (
                                        <>
                                            <Image src='/icons/google.svg' alt='google' height={20} width={20} />
                                            Login with Google
                                        </>
                                    )}

                                </Button>
                            </TabsContent>
                            <TabsContent value='signup' className='space-y-4'>
                                <form className="space-y-4" onSubmit={handleSignupSubmit(onSubmitSignUp)}>
                                    {/* Name */}
                                    <div className="relative">
                                        <Input
                                            {...registerSignup("name", { required: "Name is required" })}
                                            placeholder="Enter Name"
                                            type="text"
                                            className="pl-10"
                                        />
                                        <User
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                                            size={20}
                                        />
                                    </div>
                                    {signupError.name && (
                                        <p className="text-red-500 text-sm">{signupError.name.message}</p>
                                    )}
                                    {/* Email */}
                                    <div className="relative">
                                        <Input
                                            {...registerSignup("email", { required: "Email is required" })}
                                            placeholder="Enter Email"
                                            type="email"
                                            className="pl-10"
                                        />
                                        <Mail
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                                            size={20}
                                        />
                                    </div>
                                    {signupError.email && (
                                        <p className="text-red-500 text-sm">{signupError.email.message}</p>
                                    )}

                                    {/* Password */}
                                    <div className="relative">
                                        <Input
                                            {...registerSignup("password", { required: "Password is required" })}
                                            placeholder="Enter Password"
                                            type={showPassword ? "text" : "password"}
                                            className="pl-10 pr-10"
                                        />

                                        {/* Left Lock Icon */}
                                        <Lock
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                                            size={20}
                                        />

                                        {/* Right Eye Toggle */}
                                        {showPassword ? (
                                            <EyeOff
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                                                size={20}
                                                onClick={() => setShowPassword(false)}
                                            />
                                        ) : (
                                            <Eye
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                                                size={20}
                                                onClick={() => setShowPassword(true)}
                                            />
                                        )}
                                    </div>
                                    {signupError.password && (
                                        <p className="text-red-500 text-sm">{signupError.password.message}</p>
                                    )}
                                    <div className='flex items-center'>
                                        <input
                                            type='checkbox'
                                            {...registerSignup("agreeTerms", { required: true })}
                                            className='mr-2'
                                        />
                                        <label className='text-sm text-gray-700'>I agree to the terms and conditions</label>
                                    </div>
                                    {signupError.agreeTerms && (
                                        <p className="text-red-500 text-sm">{signupError.agreeTerms.message}</p>
                                    )}

                                    <Button type='submit' className='w-full font-bold cursor-pointer'>
                                        {signupLoading ? (
                                            <Loader2 className='animate-spin mr-2' size={20} />
                                        ) : (
                                            "Sign Up"
                                        )}
                                    </Button>
                                </form>
                            </TabsContent>
                            <TabsContent value="forgot" className="space-y-4">
                                {!forgotPasswordSuccess ? (
                                    <form className="space-y-4" onSubmit={handleForgotPasswordSubmit(onSubmitForgotPassword)}>
                                        {/* Email */}
                                        <div className="relative">
                                            <Input
                                                {...registerForgotPassword("email", { required: "Email is required" })}
                                                placeholder="Enter Email"
                                                type="email"
                                                className="pl-10"
                                            />
                                            <Mail
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                                                size={20}
                                            />
                                        </div>
                                        {forgotPasswordError.email && (
                                            <p className="text-red-500 text-sm">{forgotPasswordError.email.message}</p>
                                        )}
                                        <Button type='submit' className='w-full font-bold cursor-pointer'>
                                            {forgotPasswordLoading ? (
                                                <Loader2 className='animate-spin mr-2' size={20} />
                                            ) : (
                                                "Send Reset Link"
                                            )}
                                        </Button>
                                    </form>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className='text-center space-y-4'
                                    >
                                        <CheckCircle className='w-16 h-16 text-green-500 mx-auto' />
                                        <h3 className='text-xl font-semibold text-gray-700'>
                                            Reset Link Sent
                                        </h3>
                                        <p className='text-gray-500'>We've sent a password reset link to your email. Please
                                            check your inbox and follow the instructions to reset your
                                            password.</p>
                                        <Button onClick={() => setForgotPasswordSuccess(false)} className='w-full cursor-pointer'> Send Another Link</Button>
                                    </motion.div>
                                )}
                            </TabsContent>
                        </motion.div>
                    </AnimatePresence>
                </Tabs>
                <p className='text-sm text-center mt-2 text-gray-600'>
                    By clicking "agree", you agree to our{" "}
                    <Link href='/terms-of-use' className=' text-blue-500 hover:underline'>Terms of Use</Link>,{" "} and {" "}
                    <Link href='/privacy-policy' className=' text-blue-500 hover:underline'>Privacy Policy</Link>

                </p>
            </DialogContent>
        </Dialog>
    )
}

export default AuthPage

