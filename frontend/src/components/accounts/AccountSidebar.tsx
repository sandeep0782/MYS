'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { RootState } from '@/store/store'
import { logout } from '@/store/slice/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { LogOut, Heart, ShoppingCart, User } from 'lucide-react'
import { useLogoutMutation } from '@/store/authApi'
import { error } from 'console'

const navigation = [
    { title: 'My Profile', href: '/account/profile', icon: User },
    { title: 'My Orders', href: '/account/orders', icon: ShoppingCart },
    { title: 'Wishlist', href: '/account/wishlist', icon: Heart },
]

const AccountSidebar = () => {
    const pathname = usePathname()
    const router = useRouter()
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.user.user)
    const [logoutMutation] = useLogoutMutation()

    const userPlaceholder = user?.name
        ? user.name
            .split(' ')
            .map((word: string) => word[0])
            .join('')
            .toUpperCase()
        : ''

    const handleLogout = async () => {
        try {
            await logoutMutation({}).unwrap()
            dispatch(logout())
            router.push('/')
            toast.success('Logged out successfully')
        } catch {
            console.error
            toast.error('Failed to logout')
        }
    }

    return (
        <aside className="hidden lg:flex sticky top-20 h-[90vh] flex-col w-[360px] bg-white rounded-xl shadow-sm border p-4">
            {/* Top Section */}
            <div>
                {/* User Info */}
                <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-11 w-11">
                        {user?.profilePicture ? (
                            <AvatarImage src={user.profilePicture} />
                        ) : (
                            <AvatarFallback>{userPlaceholder}</AvatarFallback>
                        )}
                    </Avatar>
                    <div>
                        <p className="text-sm font-semibold text-black">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                </div>

                <Separator />

                {/* Navigation */}
                <nav className="mt-4 space-y-1">
                    {navigation.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
                  ${isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                {item.title}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            {/* Bottom Section */}
            <div className="mt-auto">
                <Separator className="mb-3" />

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition cursor-pointer"
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </button>
            </div>
        </aside>
    )
}

export default AccountSidebar
