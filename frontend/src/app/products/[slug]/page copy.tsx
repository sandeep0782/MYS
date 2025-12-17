'use client'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Heart, IdCard, Loader2, MapPin, MessageCircle, ShoppingCart, User2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Spinner from '@/lib/Spinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProductDetails } from '@/lib/types/type'
import { useGetProductByIdQuery, useGetProductBySlugQuery } from '@/store/productApi'
import NoData from '@/components/NoData'


const page = () => {
    const { slug } = useParams()
    const [selectedImage, setSelectedImage] = useState(0)
    const router = useRouter()
    const [isAddtoCart, setIsAddtoCart] = useState(false)
    const { data: apiResponse = {}, isLoading, isError } = useGetProductBySlugQuery(slug)

    const [product, setProduct] = useState<ProductDetails | null>(null);
    const productPerPage = 8

    useEffect(() => {
        if (apiResponse?.success && apiResponse?.data) {
            setProduct(apiResponse.data);
        }
    }, [apiResponse]);


    const handleAddToCart = (productId: string) => { }
    const handleAddToWishlist = (productId: string) => { }

    const productImages = product?.images || []
    if (isLoading) {
        return <Spinner />
    }
    if (!product || isError) {
        return (
            <div className="my-10 max-w-3xl justify-center mx-auto">
                <NoData
                    imageUrl="/images/no-book.jpg"
                    message="No books available. Please try again later."
                    description="Try adjusting your filters or check back soon for available listings."
                    onClick={() => router.push("/")}
                    buttonText="Sell your books"
                />
            </div>
        );
    }

    const calculateDiscount = (price: number, finalPrice: number): number => {
        if (price > finalPrice && price > 0) {
            return Math.round(((price - finalPrice) / price) * 100);
        }
        return 0;
    };

    const formatDate = (dateString: string | Date) => {
        const date = new Date(dateString)
        return formatDistanceToNow(date, { addSuffix: true })
    }
    return (
        <div className='min-h-screen '>
            <div className='container mx-auto px-4 py-8'>
                {/* Breadcrumb */}
                <nav className="mb-4 flex items-center gap-2 text-muted-foreground">
                    <Link href="/" className="text-blue-500 hover:underline">
                        Home
                    </Link>
                    <span>/</span>
                    <Link href="/products" className="text-blue-500 hover:underline">
                        Products
                    </Link>
                    <span>/</span>
                    <span>{product.category.name}</span>
                    <span>/</span>
                    <span>{product.name}</span>
                </nav>
                <div className='grid gap-8 md:grid-cols-2'>
                    <div className='space-y-4'>
                        <div className='relative h-[400px] overflow-hidden rounded-lg border bg-white shadow-md'>
                            <Image
                                src={productImages[selectedImage]}
                                alt={product.name}
                                fill
                                className='object-contain'
                            />
                            {/* {calculateDiscount(product.price, product.finalPrice) > 0 && (
                                <span className='absolute left-0 top-2 rounded-r-lg px-2 py-1 text-xs font-medium bg-orange-600/90 text-white hover:bg-orange-700'>
                                    {calculateDiscount(product.price, product.finalPrice)}% off
                                </span>
                            )} */}
                        </div>
                        <div className='flex gap-2 overflow-x-auto'>
                            {productImages.map((images, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border transition-all duration-200 ${selectedImage === index ? 'ring-2 ring-blue-500 scale-105' : "hover:scale-105"}`}
                                >
                                    <Image src={images}
                                        alt={`${product.name} ${index + 1}`}
                                        fill
                                        className='object-cover'
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* {product details} */}
                    <div className='space-y-6'>
                        <div className='flex items-center justify-between'>
                            <div className='space-y-2'>
                                <h1 className='text-2xl font-bold'>{product.name}</h1>
                                <p className='text-sm text-muted-foreground'>Posted: {formatDate(product.createdAt)}</p>
                            </div>
                            <div className='flex gap-2'>
                                <Button variant='outline'>Share</Button>

                                <Button
                                    variant='outline'
                                    size='icon'
                                    onClick={() => handleAddToWishlist(product._id)}
                                >
                                    <Heart className='h-4 w-4 fill-red-500' />
                                    <span className='hidden md:inline'>Add to Wishlist</span>
                                </Button>
                            </div>
                        </div>
                        <div className='space-y-4'>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold">
                                    ₹ {product.finalPrice}
                                </span>
                                {product.price && (
                                    <span className="text-lg text-muted-foreground line-through">
                                        ₹ {product.price}
                                    </span>
                                )}
                                <Badge variant='secondary' className='text-green-600'>Shipping Available</Badge>
                            </div>
                            <Button className='w-60 py-6 bg-blue-700 cursor-pointer'>
                                {isAddtoCart ? (
                                    <>
                                        <Loader2 className='animate-spin mr-2' size={20} />
                                        Adding to Cart
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className='mr-2 h-5 w-5 ' />
                                        Buy Now
                                    </>
                                )}
                            </Button>
                            <Card className=' border border-gray-200 shadow-sm'>
                                <CardHeader>
                                    <CardTitle className='text-lg'>Product Details</CardTitle>
                                </CardHeader>
                                <CardContent className='grid gap-4'>
                                    <div className='grid grid-cols-2 gap-4 text-sm'>
                                        <div className='font-medium text-muted-foreground'>Title:</div>
                                        <div>{product.name}</div>

                                        <div className='font-medium text-muted-foreground'>Category:</div>
                                        <div>{product.name}</div>

                                        <div className='font-medium text-muted-foreground'>Brand:</div>
                                        <div>{product.name}</div>

                                        <div className='font-medium text-muted-foreground'>Edition:</div>
                                        <div>{product.name}</div>

                                        <div className='font-medium text-muted-foreground'>Price:</div>
                                        <div>₹{product.finalPrice}</div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
                <div className='mt-8 grid gap-8 md:grid-cols-2'>
                    <Card className='border-none shadow-md'>
                        <CardHeader>
                            <CardTitle className='text-lg'>Description</CardTitle>
                        </CardHeader>
                        <CardContent className='text-sm text-muted-foreground'>
                            {product.description}
                        </CardContent>
                    </Card>
                    <Card className='border-none shadow-md'>
                        <CardHeader>
                            <CardTitle className='text-lg'>Sold By</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-3'>
                                    <div className='h-12 w-12  rounded-full bg-blue-300 flex items-center justify-center'>
                                        <User2 className='h-6 w-6 text-blue-500' />
                                    </div>
                                    <div>
                                        <div className='flex items-center gap-2'>
                                            <span className='font-medium'>
                                                {product.name}
                                            </span>
                                            <Badge variant='secondary' className='text-green-600'>
                                                <CheckCircle2 className='h-3 w-3 mr-1' />
                                                Verified
                                            </Badge>
                                        </div>
                                        <div className='flex  items-center gap-2 text-sm text-muted-foreground'>
                                            <MapPin className='h-4 w-4' />
                                            Manohar Pur Haryana
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex items-center gap-2 text-sm'>
                                <MessageCircle className='h-4 w-4 text-blue-600' />
                                <span>Contact: {product.name}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div >
    )
}

export default page
