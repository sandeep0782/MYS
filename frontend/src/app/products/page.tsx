'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useGetProductsQuery } from '@/store/productApi'
import { ProductDetails } from '@/lib/types/type'
import Spinner from '@/lib/Spinner'
import Pagination from '@/components/Pagination'
import NoData from '@/components/NoData'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import ProductFilters from '../../components/ProductFilters'
import TopFilters from '../../components/TopFilters'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useAddToWishlistMutation, useRemoveFromWishlistMutation } from '@/store/wishlistApi'
import { addToWishlistAction, removedFromWishlistAction } from '@/store/slice/wishlistSlice'
import toast from 'react-hot-toast'
import { useAddToCartMutation } from '@/store/cartApi'
import { addToCart } from '@/store/slice/cartSlice'


const Products = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedBrand, setSelectedBrand] = useState<string[]>([])
    const [selectedGender, setSelectedGender] = useState<string[]>([])
    const [selectedColor, setSelectedColor] = useState<string[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string[]>([])
    const [sortOption, setSortOption] = useState('newest')
    const router = useRouter()
    const { data: apiResponse = {}, isLoading } = useGetProductsQuery({})
    const [products, setProducts] = useState<ProductDetails[]>([])
    const wishlist = useSelector((state: RootState) => state.wishlist.items)
    const searchTerms = new URLSearchParams(window.location.search).get('search') || ''
    const productPerPage = 12

    const [addingProductId, setAddingProductId] = useState<string | null>(null);
    const [addedProductIds, setAddedProductIds] = useState<Set<string>>(new Set());
    const [addToCartMutation] = useAddToCartMutation();
    const cart = useSelector((state: RootState) => state.cart);


    useEffect(() => {
        if (apiResponse.success) setProducts(apiResponse.data)
    }, [apiResponse])

    const toggleFilter = (section: string, item: string) => {
        const updateFilter = (prev: string[]) =>
            prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]

        switch (section) {
            case 'brand':
                setSelectedBrand(updateFilter)
                break
            case 'gender':
                setSelectedGender(updateFilter)
                break
            case 'color':
                setSelectedColor(updateFilter)
                break
            case 'category':
                setSelectedCategory(updateFilter)
                break
        }
        setCurrentPage(1)
    }

    const filterProducts = products.filter((product) => {
        const brandMatch =
            selectedBrand.length === 0 ||
            selectedBrand.map(b => b.toLowerCase())
                .includes(product.brand?.name?.toLowerCase() || "");
        const genderMatch = selectedGender.length === 0 || selectedGender.map(c => c.toLowerCase()).includes(product.gender?.toLowerCase() || '')
        const colorMatch =
            selectedColor.length === 0 ||
            selectedColor.includes(product.colors?._id || '');

        const categoryMatch =
            selectedCategory.length === 0 ||
            (product.category ? selectedCategory.includes(product.category._id) : false);

        const normalizedSearch = searchTerms?.toLowerCase() || "";

        const searchMatch = !normalizedSearch || (
            product.name.toLowerCase().includes(normalizedSearch) ||
            product.description?.toLowerCase().includes(normalizedSearch) ||
            product.shortDescription?.toLowerCase().includes(normalizedSearch) ||
            product.sku?.toLowerCase().includes(normalizedSearch) ||
            product.tags?.some(tag => tag.toLowerCase().includes(normalizedSearch)) ||
            product.metaTitle?.toLowerCase().includes(normalizedSearch) ||
            product.metaDescription?.toLowerCase().includes(normalizedSearch) ||
            product.metaKeywords?.some(keyword => keyword.toLowerCase().includes(normalizedSearch)) ||
            product.material?.toLowerCase().includes(normalizedSearch) ||
            product.careInstructions?.toLowerCase().includes(normalizedSearch) ||
            product.gender?.toLowerCase().includes(normalizedSearch) ||
            product.season?.toLowerCase().includes(normalizedSearch) ||
            product.slug?.toLowerCase().includes(normalizedSearch) ||
            product.brand?.name?.toLowerCase().includes(normalizedSearch) ||
            // product.category?.name?.toLowerCase().includes(normalizedSearch) ||
            // product.collections?.some(c => c.name?.toLowerCase().includes(normalizedSearch)) ||
            product.colors?.name?.toLowerCase().includes(normalizedSearch)
        );

        return brandMatch && genderMatch && colorMatch && categoryMatch && searchMatch
    })

    const sortedProducts = [...filterProducts].sort((a, b) => {
        const priceA = a.finalPrice ?? 0;
        const priceB = b.finalPrice ?? 0;

        switch (sortOption) {
            case 'newest':
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'oldest':
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case 'price-low':
                return priceA - priceB;
            case 'price-high':
                return priceB - priceA;
            default:
                return 0;
        }
    })

    const totalPages = Math.ceil(sortedProducts.length / productPerPage)
    const paginatedProducts = sortedProducts.slice((currentPage - 1) * productPerPage, currentPage * productPerPage)
    const handlePageChange = (page: number) => setCurrentPage(page)

    const calculateDiscount = (price: number, finalPrice: number) => price > finalPrice && price > 0 ? Math.round(((price - finalPrice) / price) * 100) : 0
    const formatDate = (dateString: string) => formatDistanceToNow(new Date(dateString), { addSuffix: true })
    const dispatch = useDispatch()

    const [addToWishlist] = useAddToWishlistMutation();
    const [removeFromWishlist] = useRemoveFromWishlistMutation();

    const handleAddToWishlist = async (productId: string) => {
        try {
            const isWishlist = wishlist.some((item) => item.products.includes(productId));
            if (isWishlist) {
                const result = await removeFromWishlist(productId).unwrap();
                if (result.success) {
                    dispatch(removedFromWishlistAction(productId));
                    toast.success(result.message || "Removed from Wishlist successfully");
                } else {
                    throw new Error(result.message || 'Failed to remove from Wishlist');
                }
            } else {
                const result = await addToWishlist({ productId }).unwrap();
                if (result.success) {
                    dispatch(addToWishlistAction(result.data));
                    toast.success(result.message || "Added to Wishlist successfully");
                } else {
                    throw new Error(result.message || 'Failed to add to Wishlist');
                }
            }
        } catch (error: any) {
            const errormessage = error?.data?.message;
            toast.error(errormessage || "Something went wrong");
        }
    };

    const handleAddToCart = async (product: ProductDetails) => {
        setAddingProductId(product._id);
        try {
            const result = await addToCartMutation({ productId: product._id, quantity: 1 }).unwrap();
            if (result.success && result.data) {
                dispatch(addToCart(result.data));
                toast.success(result.message || "Added to Cart Successfully");

                // Mark product as added
                setAddedProductIds(prev => new Set(prev).add(product._id));
            } else {
                throw new Error(result.message || "Failed to add to cart");
            }
        } catch (error: any) {
            const errorMessage = error?.data?.message || error?.message;
            toast.error(errorMessage);
        } finally {
            setAddingProductId(null);
        }
    };


    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-8">
                <nav className="mb-4 flex items-center gap-2 text-muted-foreground">
                    <Link href="/" className="text-blue-500 hover:underline">Home</Link>
                    <span>/</span>
                    <span>Products</span>
                </nav>
                {/* <h1 className="mb-8 text-2xl font-bold text-gray-800">Products</h1> */}

                <div className='flex justify-between'>
                    <h1 className="mb-8 text-2xl font-bold text-gray-800">Products</h1>
                    <TopFilters sortOption={sortOption} setSortOption={setSortOption} />

                </div>
                <div className='grid gap-8 md:grid-cols-[280px_1fr]'>
                    {/* Left Sidebar Filter */}
                    <div className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
                        <ProductFilters
                            selectedBrand={selectedBrand}
                            selectedGender={selectedGender}
                            selectedColor={selectedColor}
                            selectedCategory={selectedCategory}
                            toggleFilter={toggleFilter}
                        />
                    </div>

                    {/* Main Product Area */}
                    <div className='space-y-6'>
                        {isLoading ? <Spinner /> : paginatedProducts.length ? (
                            <>
                                {/* Top Sort Filter */}
                                {/* <TopFilters sortOption={sortOption} setSortOption={setSortOption} /> */}

                                <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>

                                    {paginatedProducts.map((product) => {
                                        const isInCart = cart.items.some(item => item.product._id === product._id);

                                        return (
                                            <motion.div
                                                key={product._id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <Card className="group relative overflow-hidden rounded transition-shadow duration-300 hover:shadow-2xl bg-white border-0 py-0!">
                                                    <CardContent className="p-0">
                                                        <div className="relative w-full" style={{ paddingTop: '153.33%' }}>
                                                            <Link
                                                                href={`/products/${product.slug}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <Image
                                                                    src={product.images[0] as unknown as string}
                                                                    alt={product.name}
                                                                    fill
                                                                    className="absolute top-0 left-0 w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                                                                />
                                                            </Link>

                                                            {/* Discount Badge */}
                                                            {calculateDiscount(product.price, product.finalPrice) > 0 && (
                                                                <div className="absolute left-0 top-0 z-10 flex flex-col gap-2 p-2">
                                                                    <Badge className="bg-orange-600/90 text-white hover:bg-orange-700">
                                                                        {calculateDiscount(product.price, product.finalPrice)}% off
                                                                    </Badge>
                                                                </div>
                                                            )}

                                                            {/* Wishlist Button */}
                                                            <div className="absolute top-2 right-2 z-20">
                                                                <Button
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        handleAddToWishlist(product._id);
                                                                    }}
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    className="h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white cursor-pointer flex items-center justify-center"
                                                                    aria-label={
                                                                        wishlist.some((w) => w.products.includes(product._id))
                                                                            ? "Remove from Wishlist"
                                                                            : "Add to Wishlist"
                                                                    }
                                                                >
                                                                    <Heart
                                                                        className={`h-6 w-6 ${wishlist.some((w) => w.products.includes(product._id)) ? "fill-red-500" : ""
                                                                            }`}
                                                                    />
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        {/* Product Details */}
                                                        <div className="p-4">
                                                            <span className="font-bold text-black line-clamp-1 text-md">
                                                                {product.brand?.name
                                                                    .split(" ")
                                                                    .map((word) => word.toUpperCase())
                                                                    .join(" ") || "No Brand"}
                                                            </span>
                                                            <div className="flex items-start justify-between">
                                                                <h3 className="text-lg font-semibold text-orange-500 line-clamp-1">{product.name}</h3>
                                                                <span>{product.colors?.name}</span>
                                                            </div>
                                                            <p className="text-sm text-zinc-400 line-clamp-1">{product.description}</p>
                                                            <div className="flex items-baseline gap-2">
                                                                <span className="text-2xl font-bold text-black">₹ {product.finalPrice}</span>
                                                                {product.price && <span className="text-sm text-zinc-500 line-through">₹ {product.price}</span>}
                                                            </div>
                                                            <Button
                                                                className="bg-orange-500 hover:bg-orange-600 cursor-pointer w-full mt-2"
                                                                onClick={() => handleAddToCart(product)}
                                                                disabled={addingProductId === product._id || isInCart}
                                                            >
                                                                {addingProductId === product._id
                                                                    ? "Adding..."
                                                                    : isInCart
                                                                        ? "Added to Cart"
                                                                        : "Add to Cart"}
                                                            </Button>

                                                            <div className="flex justify-between text-center text-xs text-zinc-400 mt-2">
                                                                <span>{formatDate(product.createdAt)}</span>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        )
                                    })}

                                </div>

                                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                            </>
                        ) : (
                            <NoData
                                imageUrl="/images/outofstock.png"
                                message="No Products are available please try later."
                                description="Try adjusting your filters or search criteria to find what you're looking for."
                                onClick={() => router.push("/product-sell")}
                                buttonText="Browse More products "
                            />
                        )}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Products
