'use client'

import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import toast from 'react-hot-toast'

const ProfileUpdatePage = () => {
    const user = useSelector((state: RootState) => state.user.user)
    const dispatch = useDispatch()

    const [name, setName] = useState(user?.name || '')
    const [phone, setPhone] = useState(user?.phone || '')
    const [email] = useState(user?.email || '')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    // For image upload & preview
    const [image, setImage] = useState<File | null>(null)
    const [preview, setPreview] = useState<string>(user?.image || '')

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setImage(file)
            setPreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password && password !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        // Example: send form data including image
        // const formData = new FormData()
        // formData.append('name', name)
        // formData.append('phone', phone)
        // if (password) formData.append('password', password)
        // if (image) formData.append('image', image)
        // await updateUserAPI(formData)

        toast.success("Profile updated successfully")
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-6">Update Profile</h2>

            {/* Profile Image */}
            <div className="mb-6 flex flex-col items-center">
                <div className="w-24 h-24 mb-2 rounded-full overflow-hidden border border-gray-300">
                    {preview ? (
                        <img
                            src={preview}
                            alt="Profile Preview"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                            No Image
                        </div>
                    )}
                </div>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-sm text-gray-500"
                />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        value={email}
                        disabled
                        className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>

                <hr className="my-4" />

                <div>
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                        placeholder="Leave blank to keep current password"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                        placeholder="Confirm new password"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                    Update Profile
                </button>
            </form>
        </div>
    )
}

export default ProfileUpdatePage
