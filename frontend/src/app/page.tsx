'use client'
import { Button } from "@/components/ui/button";
import { BookOpen, Camera, CreditCard, Library, Search, Store, Tag, Truck, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProductsPage from "./products/page";
import HowToSell from "./how-to-sell/page";
import NewProducts from "@/components/NewProducts";

export default function Home() {
  const bannerData = [
    {
      src: "/images/book1.jpg",
      title: "Discover Your Next look",
      subtitle: "Explore our wide range of women's collection and genres",
      buttonText: "Shop Now",
    },
    {
      src: "/images/book2.jpg",
      title: "Inspire Your Mind",
      subtitle: "Get inspired by the world’s greatest authors",
      buttonText: "Browse Collection",
    },
    {
      src: "/images/book3.jpg",
      title: "Unleash Your Imagination",
      subtitle: "Find stories that captivate your soul",
      buttonText: "Start Shopping",
    },
  ];

  const blogPosts = [
    {
      imageSrc:
        "https://images.unsplash.com/photo-1604866830893-c13cafa515d5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8b25saW5lJTIwc2VsbCUyMGJvb2tzfGVufDB8fDB8fHww",
      title: "Where and how to sell old books online?",
      description:
        "Get started with selling your used books online and earn money from your old books.",
      icon: <BookOpen className="w-6 h-6 text-primary" />,
    },
    {
      imageSrc:
        "https://media.istockphoto.com/id/910384920/photo/kid-reading-near-locked-door.webp?a=1&b=1&s=612x612&w=0&k=20&c=J3FL4ZVORItw_bkLzlVo4WO-xUy22S7Qqbuq2xusNnc=",
      title: "What to do with old books?",
      description:
        "Learn about different ways to make use of your old books and get value from them.",
      icon: <Library className="w-6 h-6 text-primary" />,
    },
    {
      imageSrc:
        "https://images.unsplash.com/photo-1492539438225-2666b2a98f93?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fG9sZCUyMCUyMGJvb2tzfGVufDB8fDB8fHww",
      title: "What is BookKart?",
      description:
        "Discover how BookKart helps you buy and sell used books online easily.",
      icon: <Store className="w-6 h-6 text-primary" />,
    },
  ];



  const buySteps = [
    {
      step: "Step 1",
      title: "Select the used books you want",
      description: "Search from over thousands of used books listed on BookKart.",
      icon: <Search className="h-8 w-8 text-primary" />,
    },
    {
      step: "Step 2",
      title: "Place the order by making payment",
      description:
        "Then simply place the order by clicking on the 'Buy Now' button.",
      icon: <CreditCard className="h-8 w-8 text-primary" />,
    },
    {
      step: "Step 3",
      title: "Get the books delivered at your doorstep",
      description: "The books will be delivered to you at your doorstep!",
      icon: <Truck className="h-8 w-8 text-primary" />,
    },
  ];
  const [currentImage, setCurrentImage] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % bannerData.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const { src, title, subtitle, buttonText } = bannerData[currentImage];

  return (
    <main className="min-h-screen">
      <section className="relative h-[600px] overflow-hidden">
        {bannerData.map((image, index) => (
          <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${currentImage === index ? 'opacity-100' : 'opacity-0'}`}
          >
            <Image
              src={src}
              alt={title}
              fill
              className="object-cover transition-all duration-700"
              priority
            />
            <div className="absolute inset-0 bg-black/50">
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center text-white px-6">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">{title}</h1>
              <p className="text-lg md:text-xl mb-6 text-gray-200">{subtitle}</p>
              <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 text-lg cursor-pointer">
                <Link href='/shop'>
                  {buttonText}
                </Link>
              </Button>
            </div>

          </div>
        ))}
      </section>
      <NewProducts />
      <Link href="/products">
        <Button
          size="lg"
          className="flex mt-10 mb-10 mx-auto font-semibold bg-red-500 px-8 py-6 rounded-lg hover:bg-red-600 cursor-pointer"
        >
          <div className="text-sm">Explore All Products</div>
        </Button>
      </Link>

      <HowToSell />
    </main>
  );
}
