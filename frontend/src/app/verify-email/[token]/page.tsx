'use client'
import { useVerifyEmailMutation } from '@/store/authApi'
import { authstatus, setEmailVerified } from '@/store/slice/userSlice'
import { RootState } from '@/store/store'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { CheckCircle, Loader2 } from 'lucide-react'

const Page: React.FC = () => {
    const { token } = useParams<{ token: string }>()
    const dispatch = useDispatch()
    const [verifyEmail] = useVerifyEmailMutation()
    const isVerifyEmail = useSelector((state: RootState) => state.user.isEmailVerified)
    const [verificationStatus, setVerificationStatus] = useState<
        'loading' | 'success' | 'alreadyVerified' | 'failed'
    >('loading')

    useEffect(() => {
        if (!token) return

        const verify = async () => {
            if (isVerifyEmail) {
                setVerificationStatus('alreadyVerified')
                return
            }

            setVerificationStatus('loading')
            try {
                const result = await verifyEmail(token).unwrap()
                if (result.success) {
                    dispatch(setEmailVerified(true))
                    setVerificationStatus('success')
                    dispatch(authstatus())
                    toast.success('Email verified successfully')
                    setTimeout(() => {
                        window.location.href = '/'
                    }, 3000)
                } else {
                    throw new Error(result.message || 'verification failed')
                }
            } catch (error: any) {
                console.log(error)
            }
        }

        verify()
    }, [token, verifyEmail, dispatch, isVerifyEmail])

    return (
        <div className="p-20 flex items-center justify-center min-h-screen bg-gray-100">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full"
            >
                {verificationStatus === 'loading' && (
                    <div className="flex flex-col items-center">
                        <Loader2 className="h-16 w-16 text-blue-500 animate-spin mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-800">Verifying your email...</h2>
                        <p className="text-gray-500">Please wait while we verify your email address.</p>
                    </div>
                )}

                {verificationStatus === 'success' && (
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                    >
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-green-600">Email verified successfully!</h2>
                        <p className="text-gray-500 mt-2">
                            Your email has been successfully verified and is now redirecting to the homepage...
                        </p>
                    </motion.div>
                )}

                {verificationStatus === 'alreadyVerified' && (
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                    >
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-green-600">Email already verified!</h2>
                        <p className="text-gray-500 mt-2">Your email is already verified and continu using our services.</p>
                    </motion.div>
                )}

                {verificationStatus === 'failed' && (
                    <div className="flex flex-col items-center">
                        <h2 className="text-2xl font-semibold text-red-600 mb-4">
                            Verification failed. Please try again.
                        </h2>
                        <button
                            onClick={() => setVerificationStatus('loading')}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Retry
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    )
}

export default Page
