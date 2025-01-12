import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <div className="relative">
          {/* Hero Section */}
          <div
            className="h-96 bg-cover bg-center flex items-center justify-center"
            style={{
              backgroundImage: "url('/assets/images/p6.jpg')", 
            }}
          >
            <div className="bg-white/50 backdrop-blur-md px-16 py-12 rounded-2xl shadow-lg text-center max-w-3xl mx-auto">
              <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                Contact <span className="text-green-600">Us</span>
              </h1>
              <p className="text-lg text-gray-700 leading-relaxed">
              We value your feedback and inquiries. Please don't hesitate to contact us using the details provided below or send us a message directly.
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-green-600 mb-6">Contact Information</h2>
                <ul className="text-gray-700 space-y-6 text-lg leading-relaxed">
                  <li>
                    <strong>Email:</strong> <a href="mailto:support@pistachiohut.com" className="text-green-600 hover:underline">support@pistachiohut.com</a>
                  </li>
                  <li>
                    <strong>Phone:</strong> +1 (555) 123-4567
                  </li>
                  <li>
                    <strong>Customer Service Hours:</strong> <br />
                    Monday - Friday: 9:00 AM - 6:00 PM GMT+3
                  </li>
                  <li>
                    <strong>Business Address:</strong> <br />
                    PistachioHut Headquarters <br />
                    123 Pistachio Lane <br />
                    Siirt, Turkey
                  </li>
                  <li>
                    <strong>Wholesale Inquiries:</strong> <br />
                    <a href="mailto:wholesale@pistachiohut.com" className="text-green-600 hover:underline">wholesale@pistachiohut.com</a>
                  </li>
                </ul>
              </div>

              {/* Contact Form */}
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-green-600 mb-6">Send Us a Message</h2>
                <form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Your Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                      placeholder="johndoe@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                      placeholder="Write your message here..."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-transform transform hover:scale-105"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
