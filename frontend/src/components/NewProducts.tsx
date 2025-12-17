"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductDetails } from "@/lib/types/type";
import { useGetProductsQuery } from "@/store/productApi"; // ✅ Correct API
import { useAddToCartMutation } from "@/store/cartApi";  // Cart mutation
import { addToCart } from "@/store/slice/cartSlice";
import { Badge, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { RootState } from "@/store/store";

const NewProducts = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [products, setProducts] = useState<ProductDetails[]>([]);
  const { data: apiResponse = {}, isLoading } = useGetProductsQuery({});
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart);

  const [addToCartMutation] = useAddToCartMutation();
  const [addingProductId, setAddingProductId] = useState<string | null>(null);

  // Set products from API
  useEffect(() => {
    if (apiResponse?.success && apiResponse?.data) {
      setProducts(apiResponse.data);
    }
  }, [apiResponse]);

  // Auto-slide logic
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(products.length / 5));
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered, products]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(products.length / 5)) % Math.ceil(products.length / 5));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(products.length / 5));
  };

  // Check if product is new arrival (added in last 7 days)
  const isNewArrival = (product: ProductDetails) => {
    if (!product.createdAt) return false;
    const listedDate = new Date(product.createdAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - listedDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  // Handle Add to Cart
  const handleAddToCart = async (product: ProductDetails) => {
    setAddingProductId(product._id);
    try {
      const result = await addToCartMutation({ productId: product._id, quantity: 1 }).unwrap();
      if (result.success && result.data) {
        dispatch(addToCart(result.data));
        toast.success(result.message || "Added to Cart Successfully");
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
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">New Products</h2>
        <div className="relative">
          {products.length > 0 ? (
            <>
              <div
                className="overflow-hidden"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {Array.from({ length: Math.ceil(products.length / 5) }, (_, slideIndex) => (
                    <div key={slideIndex} className="flex-none w-full">
                      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                        {products
                          .slice(slideIndex * 5, slideIndex * 5 + 5)
                          .map((product) => {
                            const isInCart = cart.items.some(item => item.product._id === product._id);

                            return (
                              <Card key={product._id} className="overflow-hidden rounded-lg relative p-0">
                                <CardContent className="p-0">
                                  <div className="relative w-full aspect-3/4 bg-gray-100 overflow-hidden">
                                    <Link href={`/products/${product.slug}`} className="block w-full h-full">
                                      <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                      />
                                    </Link>
                                  </div>

                                  {isNewArrival(product) && (
                                    <div className="absolute left-2 top-2 z-10 group">
                                      <Badge className="bg-green-600 w-6 h-6 p-0 rounded-full cursor-pointer"></Badge>
                                      <span className="absolute left-6 top-0 hidden group-hover:inline-block bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded shadow-lg">
                                        New Arrival
                                      </span>
                                    </div>
                                  )}

                                  <div className="p-4">
                                    <h3 className="mb-1 line-clamp-1 text-sm font-semibold">{product.name}</h3>
                                    <p className="mb-2 line-clamp-1 text-xs text-gray-600">
                                      {product.shortDescription || product.description}
                                    </p>
                                    <div className="flex items-baseline gap-2">
                                      <span className="text-lg font-bold">₹ {product.finalPrice}</span>
                                      <span className="text-sm text-muted-foreground line-through">₹ {product.price}</span>
                                    </div>
                                    <div className="mt-3 flex justify-end">
                                      <Button
                                        className="bg-orange-500 hover:bg-orange-600 cursor-pointer"
                                        onClick={() => handleAddToCart(product)}
                                        disabled={addingProductId === product._id || isInCart}
                                      >
                                        {addingProductId === product._id
                                          ? "Adding..."
                                          : isInCart
                                            ? "Added to Cart"
                                            : "Buy Now"}
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <button
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md cursor-pointer"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md cursor-pointer"
                onClick={nextSlide}
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Dot Navigation */}
              <div className="m-8 flex justify-center space-x-2">
                {Array.from({ length: Math.ceil(products.length / 5) }, (_, dot) => (
                  <button
                    key={dot}
                    onClick={() => setCurrentSlide(dot)}
                    className={`h-3 w-3 rounded-full ${currentSlide === dot ? "bg-blue-600" : "bg-gray-300"}`}
                  ></button>
                ))}
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">No Products to display</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewProducts;
