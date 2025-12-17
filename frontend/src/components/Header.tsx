'use client'
import Image from "next/image";
import Link from "next/link";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { BookLock, ChevronRight, FileTerminal, Heart, HelpCircle, Lock, LogOut, LogOutIcon, Menu, Package, PiggyBank, Search, ShoppingBag, ShoppingCart, User, User2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { logout, toggleLoginDialog } from "@/store/slice/userSlice";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import AuthPage from "./AuthPage";
import { useLogoutMutation } from "@/store/authApi";
import toast from "react-hot-toast";
import { useGetCartQuery } from "@/store/cartApi";
import { setCart } from "@/store/slice/cartSlice";

export default function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const isLoginOpen = useSelector((state: RootState) => state.user.isLoginDialogOpen)
    const router = useRouter()
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.user.user)
    const userPlaceholder = user?.name?.split(" ").map((name: string) => name[0]).join("")
    const [logOutMutation] = useLogoutMutation()
    const cartItemCount = useSelector((state: RootState) => state.cart.items.length)
    const { data: cartData } = useGetCartQuery(user?._id, { skip: !user })
    const [searchTerms, setSearchTerms] = useState("")

    const handleSearch = () => {
        router.push(`/products?search=${encodeURIComponent(searchTerms)}`)
    }

    const handleLoginClick = () => {
        dispatch(toggleLoginDialog())
        setIsDropdownOpen(false)
    }

    useEffect(() => {
        if (cartData?.success && cartData?.data) {
            dispatch(setCart(cartData.data))
        }
    })
    const handleLogoutClick = async () => {
        try {
            await logOutMutation({}).unwrap()
            dispatch(logout())
            toast.success('User logout successfully')
            setIsDropdownOpen(false)
        } catch (error) {
            toast.success('Failed to logout')
        }
    }
    const handleProtectedNavigation = (href: string) => {
        if (user) {
            router.push(href)
            setIsDropdownOpen(false)
        } else {
            dispatch(toggleLoginDialog())
            setIsDropdownOpen(false)
        }
    }

    const menuItems = [
        ...(user && user ? [{
            href: '/account/profile',
            content: (
                <div className="flex space-x-4 items-center p-2 border-b">
                    <Avatar className="w-12 h-12  -ml-2 rounded-full">
                        {user?.profilePicture ? (
                            <AvatarImage alt="user_image" src={user?.profilePicture} className=""></AvatarImage>
                        ) : (
                            <AvatarFallback>{userPlaceholder}</AvatarFallback>
                        )
                        }
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-semibold text-md">
                            {user.name}
                        </span>
                        <span className="font-xs text-gray-500">
                            {user.email}
                        </span>
                    </div>
                </div>
            )
        }
        ] : [
            {
                icon: <Lock className="h-5 w-5" />,
                lable: "Login/Sign up",
                onClick: handleLoginClick
            }
        ]),
        // {
        //     icon: <Lock className="h-5 w-5" />,
        //     lable: "Login/Sign up",
        //     onClick: handleLoginClick
        // },
        {
            icon: <Lock className="h-5 w-5" />,
            lable: "My Profile",
            onClick: () => handleProtectedNavigation('/account/profile')
        },
        {
            icon: <Package className="h-5 w-5" />,
            lable: "My Order",
            onClick: () => handleProtectedNavigation('/account/orders')
        },
        {
            icon: <PiggyBank className="h-5 w-5" />,
            lable: "My Selling Orders",
            onClick: () => handleProtectedNavigation('/account/selling-products')
        },
        {
            icon: <ShoppingBag className="h-5 w-5" />,
            lable: "Bag",
            onClick: () => handleProtectedNavigation('/checkout/cart')
        },
        {
            icon: <Heart className="h-5 w-5" />,
            lable: "My Wishlist",
            onClick: () => handleProtectedNavigation('/account/wishlist')
        },
        {
            icon: <User2 className="h-5 w-5" />,
            lable: "About Us",
            href: '/about-us'
        },
        {
            icon: <FileTerminal className="h-5 w-5" />,
            lable: "Terms of Use",
            href: '/terms-of-use'
        },
        {
            icon: <BookLock className="h-5 w-5" />,
            lable: "Privacy Policy",
            href: '/privacy-policy'
        },
        {
            icon: <HelpCircle className="h-5 w-5" />,
            lable: "Help",
            href: '/how-it-works'
        },
        ...(user && user ? [
            {
                icon: <LogOutIcon className="h-5 w-5" />,
                lable: "Logout",
                onClick: () => handleLogoutClick()
            },
        ] : [])
    ]

    // const MenuItems = ({ className = "" }) => (
    //     <div className={className}>
    //         {menuItems?.map((item, index) =>
    //             item?.href ? (
    //                 <Link key={index} href={item.href} className="flex items-center gap-3 px-4 py-3 text-sm rounded-lg hover:bg-gray-200" onClick={() => setIsDropdownOpen(false)}>{item.icon}
    //                     <span>{item?.lable}</span>
    //                     {item.content && <div className="mt-1">{item?.content}</div>}
    //                     <ChevronRight className="h-4 w-4 ml-auto" />
    //                 </Link>
    //             ) : (
    //                 <button key={index} className="flex w-full items-center gap-3 px-4 py-3 text-sm rounded-lg hover:bg-gray-200" onClick={item.onClick}>{item.icon}
    //                     <span>{item?.lable}</span>
    //                     <ChevronRight className="h-4 w-4 ml-auto" />
    //                 </button>
    //             ))}
    //     </div>

    const MenuItems = ({ className = "" }) => (
        <div className={className}>
            {menuItems?.map((item, index) =>
                item?.href ? (
                    <Link
                        key={index}
                        href={item.href}
                        onClick={() => setIsDropdownOpen(false)}
                        className="cursor-pointer flex items-center gap-3 px-4 py-3 text-sm rounded-lg hover:bg-gray-200"
                    >
                        {item.icon}
                        <span>{item?.lable}</span>
                        {item.content && <div className="mt-1">{item?.content}</div>}
                        <ChevronRight className="h-4 w-4 ml-auto" />
                    </Link>
                ) : (
                    <button
                        key={index}
                        onClick={item.onClick}
                        className="cursor-pointer flex w-full items-center gap-3 px-4 py-3 text-sm rounded-lg hover:bg-gray-200"
                    >
                        {item.icon}
                        <span>{item?.lable}</span>
                        <ChevronRight className="h-4 w-4 ml-auto" />
                    </button>
                )
            )}
        </div>
    )
    return (
        <header className="border-b bg-white sticky top-0 z-50 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
            {/* Desktop Header */}
            <div className="w-[95%] mx-auto hidden lg:flex items-center justify-between p-4">
                {/* <div className="container mx-auto hidden lg:flex items-center justify-between p-4"> */}
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <Image
                        src="/logo.png"
                        alt="MYSMME Logo"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="h-12 w-auto object-contain"
                    />

                    <span className="text-2xl font-semibold text-red-600">MYSMME</span>
                </Link>

                {/* Search Bar */}
                <div className="flex flex-1 items-center justify-center max-w- px-4">
                    <div className="relative w-full">
                        <Input type="text" placeholder="women / Kurta / Saree " className="w-full pr-10"
                            value={searchTerms}
                            onChange={(e) => {
                                setSearchTerms(e.target.value);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSearch();
                                }
                            }} />
                        <Button size='icon' variant='ghost' className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer"
                            onClick={() => {
                                handleSearch();
                            }}><Search className="h-5 w-5" /></Button>
                    </div>
                </div>

                {/* Dropdown Menu */}
                <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="cursor-pointer flex items-center gap-2">
                            <Avatar className="w-8 h-8 rounded-full">
                                {user?.profilePicture ? (
                                    <AvatarImage alt="user_image" src={user?.profilePicture} />
                                ) : userPlaceholder ? (
                                    <AvatarFallback>{userPlaceholder}</AvatarFallback>
                                ) : (
                                    <User className="mx-auto my-auto" />
                                )}
                            </Avatar>
                            <span>My Account</span>
                        </Button>

                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-80 p-2">
                        <MenuItems />
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Cart  */}
                <Link href='/checkout/cart'>
                    <div className="relative">
                        <Button variant='ghost' className="relative cursor-pointer">
                            <ShoppingBag className="h-5 w-5 mr-1" />
                            Bag
                        </Button>
                        {user && cartItemCount > 0 && (
                            <span className="absolute top-2 left-4 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white w-4 h-4 rounded-full text-xs flex items-center justify-center">
                                {cartItemCount}
                            </span>
                        )}
                    </div>
                </Link>
            </div >


            {/* Mobile View */}
            <div className="container mx-auto flex lg:hidden items-center justify-between p-4">
                {/* Mobile Sidebar (Menu Button) */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 p-0">
                        <SheetHeader>
                            <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
                        </SheetHeader>

                        {/* Logo inside the sheet */}
                        <div className="flex items-center justify-between border-b px-4 py-2 relative -top-4">
                            <div className="flex gap-4">
                                <Link href="/">
                                    <Image
                                        src="/logo.png"
                                        alt="Mobile Logo"
                                        width={0}
                                        height={0}
                                        sizes="100vw"
                                        className="h-10 w-auto object-contain"
                                    />

                                </Link>
                                <span className=" lg:inline text-2xl font-semibold text-red-600">
                                    MYSMME
                                </span>
                            </div>
                            <div>

                            </div>
                        </div>

                        {/* Menu Items Component */}
                        <MenuItems className="-mt-4" />
                    </SheetContent>
                </Sheet>

                {/* Brand Logo */}
                <Link href="/" className="flex items-center space-x-6">
                    <Image
                        src="/logo.png"
                        alt="MYSMME Logo"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="h-6 w-auto md:h-10 md:w-auto object-contain"
                    />

                    <span className="hidden lg:inline text-2xl font-semibold text-red-600">
                        MYSMME
                    </span>
                </Link>


                {/* Search Bar */}
                <div className="flex flex-1 items-center justify-center max-w-xs px-4">
                    <div className="relative w-full">
                        <Input type="text" placeholder="Search..." className="w-full pr-10"
                            value={searchTerms}
                            onChange={(e) => {
                                setSearchTerms(e.target.value);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSearch();
                                }
                            }}
                        />
                        <Button
                            size="icon"
                            variant="ghost"
                            className="absolute right-0 top-1/2 -translate-y-1/2"
                            onClick={handleSearch}
                        >
                            <Search className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Cart */}
                <Link href="/checkout/cart">
                    <div className="relative">
                        <Button variant="ghost" className="relative flex items-center">
                            <ShoppingCart className="h-5 w-5 mr-2" />
                        </Button>
                        {user && cartItemCount > 0 && (
                            <span className="absolute -top-1 left-7 bg-red-500 text-white rounded-full px-1 text-xs">
                                {cartItemCount}
                            </span>
                        )}
                    </div>
                </Link>
            </div>
            <AuthPage isLoginOpen={isLoginOpen} setIsLoginOpen={handleLoginClick} />
        </header >
    );
}
