'use client'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'
import { books, filters } from '@/lib/Constant'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import Spinner from '@/lib/Spinner'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { SelectValue } from '@radix-ui/react-select'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import Pagination from '@/components/Pagination'
import NoData from '@/components/NoData'
import { useRouter } from 'next/navigation'
import { useGetProductsQuery } from '@/store/productApi'
import { ProductDetails } from '@/lib/types/type'

const Products = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedBrand, setSelectedBrand] = useState<string[]>([])
    const [selectedGender, setSelectedGender] = useState<string[]>([])
    const [selectedColor, setSelectedColor] = useState<string[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string[]>([])
    const [sortOption, setSortOption] = useState('newest')
    // const [isloading, setIsLoading] = useState(false)
    const router = useRouter()
    const { data: apiResponse = {}, isLoading } = useGetProductsQuery({})
    const [products, setProducts] = useState<ProductDetails[]>([])
    const productPerPage = 8

    useEffect(() => {
        if (apiResponse.success) {
            setProducts(apiResponse.data)
        }
    }, [apiResponse])

    const toggleFilter = (section: string, item: string) => {
        const updateFilter = (prev: string[]) =>
            prev.includes(item)
                ? prev.filter((i) => i !== item)
                : [...prev, item];

        switch (section) {
            case "brand":
                setSelectedBrand((prev) => updateFilter(prev));
                break;
            case "gender":
                setSelectedGender((prev) => updateFilter(prev));
                break;
            case "color":
                setSelectedColor((prev) => updateFilter(prev));
                break;
            case "category":
                setSelectedCategory((prev) => updateFilter(prev));
                break;
        }

        setCurrentPage(1);
    };
    const filterProducts = products.filter((product) => {
        const brandMatch =
            selectedBrand.length === 0 ||
            selectedBrand
                .map(cond => cond.toLowerCase())
                .includes(product.brand?.toString().toLowerCase() || '');

        const genderMatch =
            selectedGender.length === 0 ||
            selectedGender
                .map(cond => cond.toLowerCase())
                .includes(product.gender?.toLowerCase() || '');

        const colorMatch =
            selectedColor.length === 0 ||
            selectedColor
                .map(cond => cond.toLowerCase())
                .includes(product.colors?.toLowerCase() || '');

        const categoryMatch =
            selectedCategory.length === 0 ||
            selectedCategory
                .map(cond => cond.toLowerCase())
                .includes(product.category?.toString().toLowerCase() || '');

        return brandMatch && genderMatch && colorMatch && categoryMatch;
    });


    const sortedProducts = [...filterProducts].sort((a, b) => {
        switch (sortOption) {
            case 'newest':
                return (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            case 'oldest':
                return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            case 'price-low':
                return a.finalPrice - b.finalPrice
            case 'price-high':
                return b.finalPrice - a.finalPrice
            default:
                return 0
        }
    })
    const totalPages = Math.ceil(sortedProducts.length / productPerPage)
    const paginatedProducts = sortedProducts.slice((currentPage - 1) * productPerPage, currentPage * productPerPage)
    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const calculateDiscount = (price: number, finalPrice: number): number => {
        if (price > finalPrice && price > 0) {
            return Math.round(((price - finalPrice) / price) * 100);
        }
        return 0;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return formatDistanceToNow(date, { addSuffix: true })
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <nav className="mb-4 flex items-center gap-2 text-muted-foreground">
                    <Link href="/" className="text-blue-500 hover:underline">
                        Home
                    </Link>
                    <span>/</span>
                    <span>Products</span>
                </nav>

                {/* Page Title */}
                <h1 className="mb-8 text-2xl font-bold text-gray-800">Products</h1>
                <div className='grid gap-8 md:grid-cols-[280px_1fr]'>
                    <div className='space-y-6'>
                        <Accordion type='multiple' className='bg-white p-6 border'>
                            {Object.entries(filters).map(([key, values]) => (
                                <AccordionItem key={key} value={key}>
                                    <AccordionTrigger className='text-lg font-semibold text-blue-500'>
                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className='mt-2 space-y-2'>
                                            {values.map((value) => (
                                                <div key={value} className='flex items-center space-x-2'>
                                                    <Checkbox id={value} checked={
                                                        key === 'brand' ? selectedBrand.includes(value)
                                                            : key === 'gender' ? selectedGender.includes(value)
                                                                : key === 'color' ? selectedColor.includes(value)
                                                                    : selectedCategory.includes(value)}
                                                        onCheckedChange={() => toggleFilter(key, value)}
                                                    />
                                                    <label htmlFor={value} className='text-sm font-medium leading-none'>{value}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}

                        </Accordion>
                    </div>
                    <div className='space-y-6'>
                        {isLoading ? (
                            <Spinner />
                        ) : paginatedProducts.length ? (<>

                            <div className='flex justify-between'>
                                <div className='mb-8 text-xl font-semibold'>
                                    Lorem ipsum dolor sit amet.
                                </div>
                                <Select value={sortOption} onValueChange={setSortOption}>
                                    <SelectTrigger className='w-[180px]'>
                                        <SelectValue placeholder="Sort By" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='newest'>Newest First</SelectItem>
                                        <SelectItem value='oldest'>Oldest First</SelectItem>
                                        <SelectItem value='price-low'>Price Low to High</SelectItem>
                                        <SelectItem value='price-high'>Price High to Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
                                {paginatedProducts.map((product) => (
                                    <motion.div key={product._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}>
                                        <Card className='group relative overflow-hidden rounded transition-shadow duration-300 hover:shadow-2xl bg-white border-0'>
                                            <CardContent className='p-0'>
                                                <Link href={`/products/${product.slug}`}>
                                                    <div className='relative'>
                                                        <Image src={product.images[0]}
                                                            alt={product.name}
                                                            width={400}
                                                            height={300}
                                                            className='h-[175px] w-full object-cover transition-transform duration-300 group-hover:scale-105' />
                                                        <div className='absolute left-0 top-0 z-10 flex  flex-col gap-2 p-2'>
                                                            {calculateDiscount(product.price, product.finalPrice) > 0 && (
                                                                <Badge className='bg-orange-600/90 text-white hover:bg-orange-700'>
                                                                    {calculateDiscount(product.price, product.finalPrice)}% off
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <Button size='icon' variant='ghost' className='absolute right-2 top-2 h-8 w-8 rounded-r-full bg-white/80 backdrop-blur-sm transition-opacity duration-300 hover:bg-white group-hover:opacity-100'>
                                                            <Heart className='h-4 w-4 text-red-500' />
                                                        </Button>
                                                    </div>
                                                    <div className='p-4 space-y-2'>
                                                        <div className='flex items-start justify-between'>
                                                            <h3 className='text-lg font-semibold text-orange-500 line-clamp-1'>{product.name}</h3>
                                                        </div>
                                                        <p className='text-sm text-zinc-400 line-clamp-1'>{product.description}</p>
                                                        <div className="flex items-baseline gap-2">
                                                            <span className="text-2xl font-bold text-black">
                                                                ₹ {product.finalPrice}
                                                            </span>
                                                            {product.price && (
                                                                <span className="text-sm text-zinc-500 line-through">
                                                                    ₹ {product.price}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className='flex justify-between text-center text-xs text-zinc-400'>
                                                            <span>{formatDate(product.createdAt)}</span>
                                                            <span>{product.brand}</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </CardContent>
                                            <div className='absolute -right-8 -top-8 h-24 w-24 rounded-full bg-orange-500/10 blur-2xl' />
                                            <div className='absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-orange-500/10 blur-2xl' />
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange} />
                        </>
                        ) : (
                            <>
                                <NoData
                                    imageUrl="/images/outofstock.png"
                                    message="No Products are available please try later."
                                    description="Try adjusting your filters or search criteria to find what you're looking for."
                                    onClick={() => router.push("/product-sell")}
                                    buttonText="Browse More products "
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div >

    )
}

export default Products
