'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Mail, Twitter, Linkedin, Facebook } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <Image
                src="/logo.png"
                alt="Zenfru Logo"
                width={108}
                height={32}
                className="rounded-xl"
              />
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed max-w-md">
              Zenfru is HIPAA compliant and secure. Trusted by dental practices across the US and Canada for streamlined patient management.
            </p>
            
            {/* Contact Info */}
            <div className="flex items-center space-x-3 mb-6">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">info@zenfru.com</span>
            </div>

            {/* HIPAA Badge */}
            <div className="flex items-center space-x-3 bg-blue-50 rounded-lg px-4 py-3 w-fit">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">H</span>
              </div>
              <div>
                <div className="text-xs text-blue-600 uppercase tracking-wider font-medium">HIPAA</div>
                <div className="text-xs text-gray-600">COMPLIANT</div>
              </div>
            </div>
          </div>          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-gray-900 uppercase tracking-wider">Product</h3>
            <div className="space-y-3">
              <Link href="/#features" className="block text-gray-600 hover:text-gray-900 transition-colors text-sm">
                Features
              </Link>
              <Link href="/#integration" className="block text-gray-600 hover:text-gray-900 transition-colors text-sm">
                Integration
              </Link>
              <Link href="/#results" className="block text-gray-600 hover:text-gray-900 transition-colors text-sm">
                Results
              </Link>
              <Link href="/#faq" className="block text-gray-600 hover:text-gray-900 transition-colors text-sm">
                FAQ
              </Link>
            </div>
          </div>

          {/* Legal & Contact */}
          <div>            <h3 className="text-sm font-semibold mb-4 text-gray-900 uppercase tracking-wider">Legal</h3>
            <div className="space-y-3 mb-6">
              <Link href="/privacy" className="block text-gray-600 hover:text-gray-900 transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-gray-600 hover:text-gray-900 transition-colors text-sm">
                Terms of Service
              </Link>
              <Link href="/support" className="block text-gray-600 hover:text-gray-900 transition-colors text-sm">
                Contact Us
              </Link>
            </div>

            {/* Social Links */}

          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 mt-8 border-t border-gray-200">
         

          <div className="text-center md:text-right">
            <p className="text-gray-500 text-sm">
              © 2025 Key Eye Technologies. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
