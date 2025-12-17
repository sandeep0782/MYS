'use client'

import NoData from '@/components/NoData'
import { toggleLoginDialog } from '@/store/slice/userSlice'
import { RootState } from '@/store/store'
import { useDispatch, useSelector } from 'react-redux'
import AccountSidebar from './AccountSidebar'
import AccountNavbar from './AccountNavbar'

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
    const user = useSelector((state: RootState) => state.user.user)
    const dispatch = useDispatch()

    if (!user) {
        return (
            <NoData
                message="Please log in to access"
                description="You need to be logged in"
                buttonText="Login"
                imageUrl="/images/login.jpg"
                onClick={() => dispatch(toggleLoginDialog())}
            />
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navbar */}
            {/* <AccountNavbar /> */}

            {/* Content Area */}
            <div className="grid gap-4 p-4 lg:grid-cols-[360px_1fr]">
                {/* Sidebar */}
                <AccountSidebar />

                {/* Main Content */}
                <main className="bg-white rounded-xl shadow-sm">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default AccountLayout
