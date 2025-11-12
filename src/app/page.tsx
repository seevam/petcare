import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PawPrint, Heart, Calendar, MapPin, Sparkles, Shield } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <PawPrint className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">PawCare</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Your Pet's Health,
          <br />
          <span className="text-green-600">Simplified</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Track vaccinations, manage health records, get AI-powered diet recommendations,
          and find trusted pet services - all in one place.
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Link href="/sign-up">
            <Button size="lg" className="text-lg">
              Start Free Today
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="text-lg">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for Pet Care
          </h2>
          <p className="text-xl text-gray-600">
            Powerful features to keep your pets healthy and happy
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered Breed ID</h3>
            <p className="text-gray-600">
              Upload a photo and let AI identify your pet's breed, age, and characteristics.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Reminders</h3>
            <p className="text-gray-600">
              Never miss a vaccination or medication with automated email reminders.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Heart className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Health Records</h3>
            <p className="text-gray-600">
              Store all medical records, documents, and notes in one secure place.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Find Services</h3>
            <p className="text-gray-600">
              Locate nearby vets, groomers, trainers, and other pet services instantly.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="bg-pink-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <PawPrint className="h-6 w-6 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Diet Plans</h3>
            <p className="text-gray-600">
              Get personalized nutrition recommendations based on breed, age, and weight.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
            <p className="text-gray-600">
              Your pet's data is encrypted and protected with industry-standard security.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Give Your Pet the Best Care?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of pet parents who trust PawCare
          </p>
          <Link href="/sign-up">
            <Button size="lg" variant="secondary" className="text-lg">
              Get Started - It's Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t">
        <div className="text-center text-gray-600">
          <p>&copy; 2025 PawCare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
