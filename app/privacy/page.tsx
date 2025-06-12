import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Shield, Mail, Globe, Lock, Users, FileText, AlertCircle, Phone } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-green-100 rounded-full p-3">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600">
              Last updated: May 1, 2025
            </p>
          </div>

          {/* Privacy Policy Content */}
          <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-12">
              
              <div className="space-y-8">
                
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</span>
                    Introduction
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    At Kay Eye Technologies (Zenfru), we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we handle your personal data and your privacy rights.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">2</span>
                    Information We Collect
                  </h2>
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <Users className="w-5 h-5 text-blue-600 mr-2" />
                        Personal Data
                      </h3>
                      <p className="text-gray-700">
                        This includes your name, email address, and organization details.
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <FileText className="w-5 h-5 text-purple-600 mr-2" />
                        Usage Data
                      </h3>
                      <p className="text-gray-700">
                        Information about how you use our platform, such as pages visited and features used.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">3</span>
                    Purpose of Use
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We use your personal data to:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="bg-green-100 text-green-600 rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></span>
                      Provide and improve our services.
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-100 text-green-600 rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></span>
                      Communicate with you about updates and offers.
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-100 text-green-600 rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></span>
                      Ensure the security of our platform.
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">4</span>
                    Disclosure of Data
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We will not share your personal data with third parties unless:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start bg-yellow-50 rounded-lg p-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">We have your consent.</span>
                    </div>
                    <div className="flex items-start bg-yellow-50 rounded-lg p-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">It is required by law.</span>
                    </div>
                    <div className="flex items-start bg-yellow-50 rounded-lg p-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">It is necessary for the performance of a contract.</span>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">5</span>
                    Security
                  </h2>
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex items-start">
                      <Lock className="w-6 h-6 text-gray-600 mr-4 mt-1 flex-shrink-0" />
                      <p className="text-gray-700 leading-relaxed">
                        We implement reasonable security practices to safeguard your personal data, including encryption and secure servers. However, no method of transmission or storage is 100% secure.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">6</span>
                    International Transfers
                  </h2>
                  <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <div className="flex items-start">
                      <Globe className="w-6 h-6 text-blue-600 mr-4 mt-1 flex-shrink-0" />
                      <p className="text-gray-700 leading-relaxed">
                        As we target customers abroad, your data may be transferred and stored in locations outside of India. We ensure that adequate safeguards are in place to protect your data.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">7</span>
                    Changes to Privacy Policy
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    We may update our privacy policy from time to time. We will notify you of any changes by posting the new policy on our platform.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">8</span>
                    Contact Us
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    If you have any questions about this privacy policy, please contact us at:
                  </p>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <a
                      href="mailto:info@zenfru.com"
                      className="text-green-600 hover:text-green-700 font-medium flex items-center"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      info@zenfru.com
                    </a>
                  </div>
                </section>

              </div>

              {/* HIPAA Compliance Notice */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-xs font-bold">H</span>
                    </div>
                    <div>
                      <div className="text-sm text-blue-600 uppercase tracking-wider font-medium">HIPAA</div>
                      <div className="text-sm text-gray-600">COMPLIANT</div>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Zenfru is HIPAA compliant and follows strict security measures to protect patient health information in accordance with healthcare privacy regulations.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href="mailto:info@zenfru.com"
                      className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Privacy Team
                    </a>
                    <a
                      href="/support"
                      className="inline-flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Get Support
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
