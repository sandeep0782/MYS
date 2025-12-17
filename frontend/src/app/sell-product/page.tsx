'use client'
import NoData from '@/components/NoData'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { filters } from '@/lib/Constant'
import Spinner from '@/lib/Spinner'
import { ProductDetails } from '@/lib/types/type'
import { useGetBrandsQuery } from '@/store/brandApi'
import { useGetCategoriesQuery } from '@/store/categoryApi'
import { useGetColorsQuery } from '@/store/colorApi'
import { useAddProductMutation } from '@/store/productApi'
import { toggleLoginDialog } from '@/store/slice/userSlice'
import { RootState } from '@/store/store'
import { Book, Camera, ChevronRight, DollarSign, HelpCircle, Link2, Loader2, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'



const page = () => {
    const [uploadImages, setUploadImages] = useState<string[]>([])
    const [addProduct, { isLoading }] = useAddProductMutation();
    const router = useRouter()
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.user.user)
    const { register, handleSubmit, formState: { errors }, setValue, reset, watch, control } = useForm<ProductDetails>({ defaultValues: { images: [] } });
    const { data: colorResponse } = useGetColorsQuery();
    const colors = colorResponse?.data || [];

    const { data: brandResponse } = useGetBrandsQuery();
    const brands = brandResponse?.data || [];

    const { data: categoryResponse } = useGetCategoriesQuery({});
    const category = categoryResponse?.data || [];
    const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            const newFiles = Array.from(files)
            const currentFiles = watch('images') || []
            setUploadImages((prevImages) =>
                [...prevImages, ...newFiles.map((file) => URL.createObjectURL(file))].slice(0, 6)
            );

            setValue(
                'images',
                [...currentFiles, ...newFiles].slice(0, 6)   // Store File objects
            );
        }
    }
    const removeImage = (index: number) => {
        setUploadImages((prev) => prev.filter((_, i) => i !== index))
        const currentFiles = watch('images') || []
        const uploadFiles = currentFiles.filter((_, i) => i !== index)
        setValue('images', uploadFiles)
    }
    const handleOnSubmit = async (data: ProductDetails) => {
        try {
            const formData = new FormData();

            Object.entries(data).forEach(([key, value]) => {
                if (key === "images") return;

                // Skip stringify for sizes
                if (key === "sizes") return;

                if (value !== undefined && value !== null) {
                    formData.append(key, value.toString());
                }
            });

            // Append sizes as separate JSON blob
            formData.append("sizes", JSON.stringify(data.sizes)); // Keep as string here

            // Append images
            if (Array.isArray(data.images) && data.images.length > 0) {
                data.images.forEach((file) => formData.append('images', file));
            }

            const result = await addProduct(formData).unwrap();

            if (result.success) {
                router.push(`products/${result.data._id}`);
                toast.success('Product added successfully');
                reset();
            }
        } catch (error) {
            toast.error('Failed to list the Product');
            console.log(error);
        }
    };

    // const handleOnSubmit = async (data: ProductDetails) => {
    //     try {
    //         const formData = new FormData()
    //         Object.entries(data).forEach(([key, value]) => {
    //             if (key !== "images" && value !== undefined && value !== null) {
    //                 formData.append(key, value.toString());
    //             }
    //         });

    //         if (Array.isArray(data.images) && data.images.length > 0) {
    //             data.images.forEach((file) => formData.append('images', file))
    //         }
    //         const result = await addProduct(formData).unwrap()
    //         if (result.success) {
    //             router.push(`products/${result.data._id}`)
    //             toast.success('Product added successfullY')
    //             reset()
    //         }
    //     } catch (error) {
    //         toast.error('Failed to list the Product')
    //         console.log(error)
    //     }
    // }
    const handleOpenLogin = () => {
        dispatch(toggleLoginDialog())
    }
    if (!user) {
        return (
            <NoData
                message='Please log in to aceess'
                description='You need to be loggned in to your accounf before access cart and checkout'
                buttonText='Login'
                imageUrl='/images/login.png'
                onClick={handleOpenLogin}
            />
        )
    }
    return (
        <div className='min-h-screen bg-white py-12'>
            <div className='container mx-auto px-4 max-w-4xl'>
                <div className='mb-10 text-center'>
                    <h1 className='text-4xl font-bold mb-4 text-blue-500'>List Your Product</h1>
                    <p className='text-xl text-gray-600'>Start listing your Products</p>
                    <Link
                        href='#'
                        className='text-blue-500 hover:underline inline-flex items-center'
                    >
                        Learn How it Works <ChevronRight className='ml-1 h-4 w-4' />
                    </Link>
                </div>

                <form onSubmit={handleSubmit(handleOnSubmit)} className="space-y-8">
                    <Card className="shadow-lg border-t-4 border-t-blue-500">
                        <CardHeader>
                            <CardTitle className="text-2xl text-blue-700 flex items-center">
                                <Book className="mr-2 h-6 w-6" />
                                Product Details
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-6 pt-6">

                            {/* Product Name */}
                            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                <Label
                                    htmlFor="name"
                                    className="md:w-1/4 font-medium text-gray-700"
                                >
                                    Product Name
                                </Label>

                                <div className="md:w-3/4">
                                    <Input
                                        type="text"
                                        {...register("name", { required: "Product name is required" })}
                                        // className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition"
                                        placeholder="Enter product name"
                                    />

                                    {errors.name && (
                                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Product Name */}
                            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                <Label
                                    htmlFor="category"
                                    className="md:w-1/4 font-medium text-gray-700"
                                >
                                    Category
                                </Label>

                                <div className="md:w-3/4 w-full">
                                    <Controller
                                        name="category"
                                        control={control}
                                        rules={{ required: "Category is required" }}
                                        render={({ field }) => (
                                            <Select
                                                onValueChange={(value) => field.onChange(value)}
                                                value={field.value ? String(field.value) : ""} // <-- FIX
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Please select Category" />
                                                </SelectTrigger>

                                                <SelectContent className="w-full">
                                                    {category.map((cate: any) => (
                                                        <SelectItem key={cate._id} value={cate._id}>
                                                            {cate.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>

                                            </Select>
                                        )}
                                    />

                                    {errors.category && (
                                        <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Brand Name */}
                            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                <Label
                                    htmlFor="brand"
                                    className="md:w-1/4 font-medium text-gray-700"
                                >
                                    Brand
                                </Label>

                                <div className="md:w-3/4 w-full">
                                    <Controller
                                        name="brand"
                                        control={control}
                                        rules={{ required: "Brand is required" }}
                                        render={({ field }) => (
                                            <Select
                                                onValueChange={(value) => field.onChange(value)}
                                                value={field.value ? String(field.value) : ""}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Please select  Brand" />
                                                </SelectTrigger>

                                                <SelectContent className="w-full">
                                                    {brands.map((brand) => (
                                                        <SelectItem key={brand._id} value={brand._id}>
                                                            {brand.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />

                                    {errors.category && (
                                        <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Gender */}
                            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                <Label
                                    htmlFor="brand"
                                    className="md:w-1/4 font-medium text-gray-700"
                                >
                                    Gender
                                </Label>

                                <div className="md:w-3/4 w-full">
                                    <Controller
                                        name="gender"
                                        control={control}
                                        rules={{ required: "Gender is required" }}
                                        render={({ field }) => (
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                value={field.value ? String(field.value) : ""}
                                                className="flex space-x-4"
                                            >
                                                {filters.gender.map((gen) => (
                                                    <div key={gen._id} className="flex items-center space-x-2">
                                                        <RadioGroupItem
                                                            value={gen.name}
                                                            id={gen._id}
                                                        />
                                                        <Label htmlFor={gen._id}>{gen.name}</Label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        )}
                                    />
                                    {errors.gender && (
                                        <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
                                    )}
                                </div>

                            </div>

                            {/* Product Short Description */}
                            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                <Label
                                    htmlFor="shortDescription"
                                    className="md:w-1/4 font-medium text-gray-700"
                                >
                                    Product Short Description
                                </Label>

                                <div className="md:w-3/4">
                                    <Input
                                        type="text"
                                        {...register("shortDescription", { required: "Product Short Description is required" })}
                                        // className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition"
                                        placeholder="Enter Product Short Description"
                                    />

                                    {errors.shortDescription && (
                                        <p className="text-red-500 text-sm mt-1">{errors.shortDescription.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Size */}

                            <div className="flex flex-col md:flex-row md:items-start space-y-3 md:space-y-0 md:space-x-4">
                                <Label className="md:w-1/4 font-medium text-gray-700">
                                    Sizes
                                </Label>

                                <div className="md:w-3/4 space-y-3">

                                    <Controller
                                        name="sizes"
                                        control={control}
                                        rules={{ required: "Please select at least one size" }}
                                        render={({ field }) => {
                                            const selectedSizes = field.value || [];

                                            return (
                                                <Select
                                                    onValueChange={(value) => {
                                                        const sizeName = filters.sizes.find(s => s._id === value)?.name;

                                                        if (!sizeName) return;

                                                        // Prevent duplicates
                                                        if (selectedSizes.some(s => s.size === sizeName)) return;

                                                        field.onChange([
                                                            ...selectedSizes,
                                                            { size: sizeName, stock: 0 }
                                                        ]);
                                                    }}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select size(s)" />
                                                    </SelectTrigger>

                                                    <SelectContent>
                                                        {filters.sizes.map((size) => (
                                                            <SelectItem key={size._id} value={size._id}>
                                                                {size.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            );
                                        }}
                                    />

                                    {/* Show Selected Sizes */}
                                    <div className="flex flex-wrap gap-3">
                                        {(watch("sizes") || []).map((sz, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded border"
                                            >
                                                <span>{sz.size}</span>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const updated = (watch("sizes") || []).filter((_, i) => i !== index);
                                                        setValue("sizes", updated);
                                                    }}
                                                    className="text-red-500 font-bold"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {errors.sizes && (
                                        <p className="text-red-500 text-sm">{errors.sizes.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                <Label
                                    htmlFor="size"
                                    className="md:w-1/4 font-medium text-gray-700"
                                >
                                    Size
                                </Label>

                                <div className="md:w-3/4 w-full">
                                    <Controller
                                        name="sizes"
                                        control={control}
                                        rules={{ required: "Size is required" }}
                                        render={({ field }) => (
                                            <Select
                                                onValueChange={(value) => field.onChange(value)}
                                                value={field.value ? String(field.value) : ""} // <-- FIX
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Please select Size" />
                                                </SelectTrigger>

                                                <SelectContent className="w-full">
                                                    {filters.sizes.map((size: any) => (
                                                        <SelectItem key={size._id} value={size._id}>
                                                            {size.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>

                                            </Select>
                                        )}
                                    />

                                    {errors.sizes && (
                                        <p className="text-red-500 text-sm mt-1">{errors.sizes.message}</p>
                                    )}
                                </div>
                            </div> */}


                            {/* Product Long Description */}
                            <div className='space-y-2'>
                                <Label className="block mb-2 font-medium text-gray-700">
                                    Upload Images
                                </Label>

                                <div className='border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50'>

                                    <div className='flex flex-col items-center gap-2'>
                                        <Camera className='h-8 w-8 text-blue-500' />

                                        {/* Clickable text to upload */}
                                        <Label
                                            htmlFor="images"
                                            className="cursor-pointer text-sm font-medium text-blue-600 hover:underline"
                                        >
                                            Click here to upload 6 images (15 MB max each)
                                        </Label>

                                        {/* Hidden Input */}
                                        <input
                                            id="images"
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImagesUpload}
                                            className="hidden"
                                        />

                                        {/* Image previews */}
                                        {uploadImages.length > 0 && (
                                            <div className='mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 w-full'>

                                                {uploadImages.map((image, index) => (
                                                    <div key={index} className='relative'>

                                                        <div className="w-full h-32 rounded-lg overflow-hidden border border-gray-200">
                                                            <Image
                                                                src={image}
                                                                alt={`uploaded-image-${index + 1}`}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>

                                                        <Button
                                                            onClick={() => removeImage(index)}
                                                            size='icon'
                                                            className='absolute -right-2 -top-2 rounded-full'
                                                            variant='destructive'
                                                        >
                                                            <X className='h-4 w-4' />
                                                        </Button>

                                                    </div>
                                                ))}

                                            </div>
                                        )}

                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Optional Details */}
                    <Card className="shadow-lg border-t-4 border-t-green-500">
                        <CardHeader>
                            <CardTitle className="text-2xl text-green-700 flex items-center">
                                <HelpCircle className="mr-2 h-6 w-6" />
                                Optional Details
                            </CardTitle>
                            <CardDescription>(Long Description, MRP, Author ...)</CardDescription>
                        </CardHeader>

                        <CardContent className="pt-6">
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="cursor-pointer">
                                        Product Information
                                    </AccordionTrigger>

                                    <AccordionContent>
                                        <div className="space-y-6">

                                            {/* Product Long Description */}
                                            <div className="flex flex-col md:flex-row md:items-start space-y-2 md:space-y-0 md:space-x-4">
                                                <Label
                                                    htmlFor="description"
                                                    className="md:w-1/4 font-medium text-gray-700"
                                                >
                                                    Product Long Description
                                                </Label>

                                                <div className="md:w-3/4">
                                                    <Textarea
                                                        {...register("description", { required: "Product Description is required" })}
                                                        placeholder="Enter Product Long Description"
                                                        className="w-full"
                                                        rows={6}
                                                    />
                                                </div>
                                            </div>

                                            {/* Collections */}
                                            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                                <Label
                                                    htmlFor="collection"
                                                    className="md:w-1/4 font-medium text-gray-700"
                                                >
                                                    Collection
                                                </Label>

                                                <div className="md:w-3/4 w-full">
                                                    <Controller
                                                        name="collections"
                                                        control={control}
                                                        rules={{ required: "Collection is required" }}
                                                        render={({ field }) => (
                                                            <Select
                                                                onValueChange={(value) => field.onChange(value)}
                                                                value={field.value ? String(field.value) : ""}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Please select Collection" />
                                                                </SelectTrigger>

                                                                <SelectContent className="w-full">
                                                                    {filters.collection.map((collec) => (
                                                                        <SelectItem key={collec._id} value={collec._id}>
                                                                            {collec.name}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                    />

                                                    {errors.collections && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.collections.message}</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Season */}
                                            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                                <Label
                                                    htmlFor="season"
                                                    className="md:w-1/4 font-medium text-gray-700"
                                                >
                                                    Season
                                                </Label>

                                                <div className="md:w-3/4 w-full">
                                                    <Controller
                                                        name="season"
                                                        control={control}
                                                        rules={{ required: "Season is required" }}
                                                        render={({ field }) => (
                                                            <Select onValueChange={field.onChange} value={field.value ? String(field.value) : ""}>

                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Select Season" />
                                                                </SelectTrigger>

                                                                <SelectContent className="w-full">
                                                                    <SelectItem value="ss">Summer-Spring</SelectItem>
                                                                    <SelectItem value="aw">Autumn-Winter</SelectItem>
                                                                    <SelectItem value="all">All Season</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                    />

                                                    {errors.season && (
                                                        <p className="text-red-500 text-sm mt-1">
                                                            {errors.season.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-2">
                                    <AccordionTrigger className="cursor-pointer">
                                        Other Information
                                    </AccordionTrigger>

                                    <AccordionContent>
                                        <div className="space-y-6">
                                            {/* SKU */}
                                            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                                <Label
                                                    htmlFor="sku"
                                                    className="md:w-1/4 font-medium text-gray-700"
                                                >
                                                    SKU
                                                </Label>

                                                <div className="md:w-3/4">
                                                    <Input
                                                        type="text"
                                                        {...register("sku", { required: "SKU is required" })}
                                                        // className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition"
                                                        placeholder="Enter product SKU"
                                                    />

                                                    {errors.sku && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.sku.message}</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Color */}
                                            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                                <Label
                                                    htmlFor="color"
                                                    className="md:w-1/4 font-medium text-gray-700"
                                                >
                                                    Color
                                                </Label>

                                                <div className="md:w-3/4 w-full">
                                                    <Controller
                                                        name="colors"
                                                        control={control}
                                                        rules={{ required: "Color is required" }}
                                                        render={({ field }) => (
                                                            <Select onValueChange={field.onChange} value={field.value ? String(field.value) : ""}>

                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Select Color" />
                                                                </SelectTrigger>

                                                                <SelectContent className="w-full">
                                                                    {colors.map((colo) => (
                                                                        <SelectItem key={colo._id} value={colo._id} className="flex items-center gap-2">
                                                                            <span
                                                                                className="inline-block h-4 w-4 rounded-full border border-gray-300"
                                                                                style={{ backgroundColor: colo.hexCode }}
                                                                            />
                                                                            <span>{colo.name}</span>
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>

                                                            </Select>
                                                        )}
                                                    />

                                                    {errors.colors && (
                                                        <p className="text-red-500 text-sm mt-1">
                                                            {errors.colors.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>

                    {/* Pricw Details */}
                    <Card className="shadow-lg border-t-4 border-t-yellow-500">
                        <CardHeader className="pb-1">   {/* Reduce bottom padding */}
                            <CardTitle className="text-2xl text-yellow-700 flex items-center">
                                <DollarSign className="mr-2 h-6 w-6" />
                                Price Details
                            </CardTitle>
                            <CardDescription className="text-sm">(Long Description, MRP, Author ...)</CardDescription>
                        </CardHeader>

                        <CardContent className="pt-0">   {/* Reduce top padding */}
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="cursor-pointer">
                                        Price
                                    </AccordionTrigger>

                                    <AccordionContent>
                                        <div className="space-y-6">

                                            {/* MRP */}
                                            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                                <Label
                                                    htmlFor="mrp"
                                                    className="md:w-1/4 font-medium text-gray-700"
                                                >
                                                    MRP
                                                </Label>

                                                <div className="md:w-3/4 w-full">
                                                    <Input
                                                        id="mrp"
                                                        type="number"
                                                        {...register("price", { required: "MRP is required" })}
                                                        placeholder="Enter MRP"
                                                    />

                                                    {errors.price && (
                                                        <p className="text-red-500 text-sm mt-1">
                                                            {errors.price.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Final Price */}
                                            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                                <Label
                                                    htmlFor="finalPrice"
                                                    className="md:w-1/4 font-medium text-gray-700"
                                                >
                                                    Final Price
                                                </Label>

                                                <div className="md:w-3/4 w-full">
                                                    <Input
                                                        id="finalPrice"
                                                        type="number"
                                                        {...register("finalPrice", { required: "Final Price is required" })}
                                                        placeholder="Enter Final Price"
                                                    />

                                                    {errors.finalPrice && (
                                                        <p className="text-red-500 text-sm mt-1">
                                                            {errors.finalPrice.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-60 text-md bg-blue-600 text-white hover:bg-blue-800 font-semibold rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin mr-2" size={20} />
                                Saving...
                            </>
                        ) : (
                            "Post your Products"
                        )}
                    </Button>

                    <p className='text-sm text-center mt-2 text-gray-600'>
                        By clicking "Post your Products", you agree to our{" "}
                        <Link href='/terms-of-use' className=' text-blue-500 hover:underline'>Terms of Use</Link>,{" "} and {" "}
                        <Link href='/privacy-policy' className=' text-blue-500 hover:underline'>Privacy Policy</Link>

                    </p>
                </form>

            </div>
        </div >

    )
}

export default page
