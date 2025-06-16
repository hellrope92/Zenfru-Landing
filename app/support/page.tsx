import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Mail, Phone, MapPin } from 'lucide-react'
import ContactForm from '@/components/ContactForm'

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get in touch with our team. We're here to help you transform your dental practice.
            </p>
          </div>

          {/* Contact Information Cards */}
             {/* Contact Form */}
          <ContactForm />

          {/* Additional Support Section */}
          <div className="mt-12 text-center">
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Need immediate assistance?
              </h3>
              <p className="text-gray-600 mb-6">
                Our support team is available to help you get the most out of Zenfru.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+918585010175"
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Us Now
                </a>
                <a
                  href="mailto:info@zenfru.com"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
