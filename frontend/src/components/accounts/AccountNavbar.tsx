'use client'

import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { RootState } from '@/store/store'
import { useSelector } from 'react-redux'
import { Bell, Search } from 'lucide-react'

const AccountNavbar = () => {
    const user = useSelector((state: RootState) => state.user.user)

    const userPlaceholder = user?.name
        ? user.name
            .split(' ')
            .map((word: string) => word[0])
            .join('')
            .toUpperCase()
        : ''

    return (
        <header className="sticky top-0 z-50 bg-white border-b">
            <div className="flex items-center justify-between h-16 px-4 lg:px-8">
                {/* Left: Logo / Title */}
                <Link
                    href="/"
                    className="text-xl font-semibold text-black hover:opacity-80 transition"
                >
                    Account
                </Link>

                {/* Center: Search (optional) */}
                <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-[320px]">
                    <Search className="h-4 w-4 text-gray-500 mr-2" />
                    <input
                        type="text"
                        placeholder="Search orders, products..."
                        className="bg-transparent outline-none text-sm w-full"
                    />
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <button className="relative text-gray-600 hover:text-black transition">
                        <Bell className="h-5 w-5" />
                        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
                    </button>

                    {/* User Avatar */}
                    <div className="flex items-center gap-2">
                        <Avatar className="h-9 w-9 cursor-pointer">
                            {user?.profilePicture ? (
                                <AvatarImage src={user.profilePicture} alt="user" />
                            ) : (
                                <AvatarFallback>{userPlaceholder}</AvatarFallback>
                            )}
                        </Avatar>

                        <div className="hidden sm:block">
                            <p className="text-sm font-medium text-black leading-none">
                                {user?.name}
                            </p>
                            <p className="text-xs text-gray-500">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default AccountNavbar
