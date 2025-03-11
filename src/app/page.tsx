import React from 'react';
import { Building2, FileText, Bell, Shield, ChevronRight, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: <FileText className="w-8 h-8" />,
    title: "Easy Bill Payments",
    description: "Pay municipal bills in seconds with our secure payment system"
  },
  {
    icon: <Building2 className="w-8 h-8" />,
    title: "Service Requests",
    description: "Report issues and request services with just a few clicks"
  },
  {
    icon: <Bell className="w-8 h-8" />,
    title: "Real-time Updates",
    description: "Stay informed with instant notifications on your requests"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Secure & Transparent",
    description: "Bank-level security for all your transactions and communications"
  }
];

const steps = [
  {
    number: "01",
    title: "Sign Up",
    description: "Create your account in minutes"
  },
  {
    number: "02",
    title: "Choose a Service",
    description: "Pay bills, request services, or stay updated"
  },
  {
    number: "03",
    title: "Track & Stay Notified",
    description: "Get instant updates on your requests"
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Resident",
    content: "UrbanEase has completely transformed how I interact with municipal services. No more waiting in lines!",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80"
  },
  {
    name: "Michael Chen",
    role: "Business Owner",
    content: "Managing multiple property bills has never been easier. The real-time updates are a game-changer.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80"
  }
];

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-6">
            Effortless Municipal Services,
            <br />
            Anytime, Anywhere
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-10">
            UrbanEase makes bill payments, service requests, and municipal communication seamless and hassle-free.
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2">
              Get Started <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-white text-gray-800 rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
              Learn More
            </button>
          </div>
        </div>
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-purple-100/20 to-blue-100/20 -z-10" />
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
              <div className="text-purple-600 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
                  <div className="text-5xl font-bold text-white/20 mb-4">{step.number}</div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-white/80">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <ChevronRight className="w-6 h-6 text-white/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-16">What Our Users Say</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-700">{testimonial.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Join thousands of residents simplifying their city interactions with UrbanEase
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Experience the future of municipal services today
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
              Sign Up for Free
            </button>
            <button className="px-8 py-4 bg-white text-gray-800 rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;