import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <div className="relative">
          {/* Hero Section */}
          <div
            className="h-96 bg-cover bg-center flex items-center justify-center"
            style={{
              backgroundImage: "url('/assets/images/p1.jpg')",
            }}
          >
            <div className="bg-white/50 backdrop-blur-md px-16 py-12 rounded-2xl shadow-lg text-center max-w-3xl mx-auto">
              <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                About <span className="text-green-600">PistachioHut</span>
              </h1>
              <p className="text-lg text-gray-700 leading-relaxed">
                Discover our passion for pistachios, sustainability, and excellence.
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div className="container mx-auto px-4 py-16">
            {/* Our Story Section */}
            <section className="mb-16">
              <h2 className="text-4xl font-bold text-center mb-8 text-green-600">Our Story</h2>
              <p className="text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
                At PistachioHut, we are dedicated to bringing you the finest pistachios from our carefully maintained orchards.
                Our journey began with a simple mission: to provide the highest quality pistachios while maintaining sustainable
                and ethical farming practices.
              </p>
            </section>

            {/* Why Choose Us Section */}
            <section className="mb-16">
              <h2 className="text-4xl font-bold text-center mb-8 text-green-600">Why Choose Us?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <ul className="list-disc pl-6 text-gray-700 text-lg leading-relaxed">
                  <li>
                    <strong>Unparalleled Quality:</strong> Our pistachios are carefully handpicked to ensure exceptional freshness
                    and taste, giving you a premium experience in every bite.
                  </li>
                  <li>
                    <strong>Sustainable Practices:</strong> We are committed to using environmentally friendly farming methods,
                    including water conservation, renewable energy and minimal packaging waste.
                  </li>
                  <li>
                    <strong>Fair Trade Partnerships:</strong> Collaborating directly with local farmers ensures fair wages and
                    ethical business practices, empowering our community.
                  </li>
                  <li>
                    <strong>Health and Nutrition:</strong> PistachioHut pistachios are packed with essential nutrients, making them
                    a healthy, guilt-free snack for every occasion and for everyone.
                  </li>
                  <li>
                    <strong>Customer Satisfaction:</strong> Our loyal customers appreciate our dedication to transparency, quality,
                    and unbeatable service.
                  </li>
                </ul>
                <div className="flex justify-center">
                  <img
                    src="/assets/images/p2.jpg"
                    alt="Why Choose Us"
                    className="rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </div>
            </section>

            {/* Our Commitment Section */}
            <section className="mb-16">
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2">
                  <h2 className="text-4xl font-bold mb-6 text-green-600">Our Commitment</h2>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Every package of PistachioHut pistachios represents our dedication to quality, sustainability,
                    and the rich agricultural heritage of our region. We take great care to ensure that our products are not only
                    delicious but also grown and processed with respect for the environment and local communities.
                  </p>
                </div>
                <div className="md:w-1/2">
                  <img
                    src="/assets/images/p3.jpg"
                    alt="Commitment"
                    className="rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
