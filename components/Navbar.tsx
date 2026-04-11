'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface NavbarProps {
  bookingToken?: string
}

export default function Navbar({ bookingToken = '' }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()
  const bookHref = bookingToken ? `/book?t=${encodeURIComponent(bookingToken)}` : '/book'

  useEffect(() => {
    router.prefetch(bookHref)
  }, [bookHref, router])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed top-0 w-full max-w-100vw z-50">
      <nav
        className={`w-full transition-all duration-300 ease-in-out ${
          isScrolled
            ? 'bg-white/85 backdrop-blur-xl border-b border-white/50 shadow-md'
            : 'bg-white/95 backdrop-blur-sm border-b border-gray-200/50'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <div className="relative">
                  <Image
                    src="/logo.png"
                    alt="Zenfru Logo"
                    width={108}
                    height={32}
                    className="rounded-xl"
                  />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
              </Link>
            </div>

            <div className="hidden lg:block">
              <div className="flex items-center space-x-8">
                <Link href="/#features" className={`font-medium transition-colors ${isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-gray-700 hover:text-gray-900'}`}>
                  Features
                </Link>
                <Link href="/#integration" className={`font-medium transition-colors ${isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-gray-700 hover:text-gray-900'}`}>
                  Integration
                </Link>
                <Link href="/#results" className={`font-medium transition-colors ${isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-gray-700 hover:text-gray-900'}`}>
                  Results
                </Link>
                <Link href="/#faq" className={`font-medium transition-colors ${isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-gray-700 hover:text-gray-900'}`}>
                  FAQ
                </Link>
                <Link href="/#support" className={`font-medium transition-colors ${isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-gray-700 hover:text-gray-900'}`}>
                  Support
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <Link
                href="https://calendly.com/kay-zenfru"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold whitespace-nowrap hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <span className="sm:hidden">Call</span>
                <span className="hidden sm:inline">Book Call</span>
              </Link>
              <Link
                href={bookHref}
                prefetch
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold whitespace-nowrap hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <span className="sm:hidden">Appt</span>
                <span className="hidden sm:inline">Book Appointment</span>
              </Link>
            </div>

            <div className="lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`focus:outline-none transition-colors ${isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-gray-700 hover:text-gray-900'}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/90 backdrop-blur-xl border-t border-white/20">
            <Link href="/#features" className="block px-3 py-2 text-gray-600 hover:text-gray-900 font-medium">Features</Link>
            <Link href="/#integration" className="block px-3 py-2 text-gray-600 hover:text-gray-900 font-medium">Integration</Link>
            <Link href="/#results" className="block px-3 py-2 text-gray-600 hover:text-gray-900 font-medium">Results</Link>
            <Link href="/#faq" className="block px-3 py-2 text-gray-600 hover:text-gray-900 font-medium">FAQ</Link>
            <Link href="/#support" className="block px-3 py-2 text-gray-600 hover:text-gray-900 font-medium">Support</Link>
            <Link href={bookHref} prefetch className="block px-3 py-2 text-blue-700 hover:text-blue-800 font-semibold">Book Appointment</Link>
          </div>
        </div>
      )}
    </div>
  )
}
