/**
 * Header Component - Logo simple
 * Header minimalista solo con el logo de FoodLink
 */

"use client";

import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 w-full bg-[#faf8f5] shadow-soft py-2 h-16 flex items-center z-50">
      <nav className="max-w-[1366px] mx-auto px-4 sm:px-6 md:px-8 w-full">
        <div className="flex justify-center items-center">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center transition-transform hover:scale-105 duration-200"
          >
            <Image
              src="/icons/web-app-manifest-192x192.png"
              alt="FoodLink"
              width={50}
              height={50}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg"
            />
            <span className="ml-3 text-2xl sm:text-3xl md:text-4xl font-bold font-display leading-none">
              <span className="text-primary-500">Food</span>
              <span className="text-secondary-500">Link</span>
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
