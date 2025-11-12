"use client";

import { useState } from "react";
import { auth } from "@clerk/nextjs";
import {
  MapPin,
  Search,
  Filter,
  Phone,
  Globe,
  Navigation,
  Heart,
  Star,
  Clock,
  X,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    serviceType: "all",
    distance: "25",
    rating: "all",
    hours: "all",
    species: "all",
  });
  const [savedProviders, setSavedProviders] = useState<Set<string>>(new Set());

  // Mock provider data
  const providers = [
    {
      id: "1",
      name: "Happy Paws Veterinary Clinic",
      type: "Veterinarian",
      rating: 4.8,
      reviewCount: 234,
      distance: 2.3,
      address: "123 Main Street, San Francisco, CA 94102",
      phone: "(555) 123-4567",
      website: "www.happypaws.com",
      services: ["General Care", "Surgery", "Emergency Care", "Dental"],
      hours: "Mon-Fri: 8am-6pm, Sat: 9am-4pm",
      species: ["Dogs", "Cats"],
      description: "Full-service veterinary clinic with experienced staff and modern facilities.",
      image: null,
    },
    {
      id: "2",
      name: "Pampered Pets Grooming",
      type: "Groomer",
      rating: 4.9,
      reviewCount: 156,
      distance: 1.8,
      address: "456 Oak Avenue, San Francisco, CA 94103",
      phone: "(555) 234-5678",
      website: "www.pamperedpetsgrooming.com",
      services: ["Bathing", "Haircuts", "Nail Trimming", "Teeth Cleaning"],
      hours: "Mon-Sat: 9am-6pm",
      species: ["Dogs", "Cats"],
      description: "Premium grooming services for your furry friends.",
      image: null,
    },
    {
      id: "3",
      name: "Bay Area Emergency Vet",
      type: "Emergency Vet",
      rating: 4.7,
      reviewCount: 189,
      distance: 5.2,
      address: "789 Emergency Lane, San Francisco, CA 94104",
      phone: "(555) 345-6789",
      website: "www.bayareaemergencyvet.com",
      services: ["24/7 Emergency", "Critical Care", "Surgery", "Diagnostics"],
      hours: "24/7",
      species: ["Dogs", "Cats", "Small Animals"],
      description: "24/7 emergency veterinary care when your pet needs it most.",
      image: null,
    },
    {
      id: "4",
      name: "Canine Training Academy",
      type: "Trainer",
      rating: 4.9,
      reviewCount: 98,
      distance: 3.7,
      address: "321 Training Road, San Francisco, CA 94105",
      phone: "(555) 456-7890",
      website: "www.caninetrainingacademy.com",
      services: ["Obedience Training", "Puppy Classes", "Behavioral Therapy", "Agility"],
      hours: "Mon-Sat: 7am-7pm",
      species: ["Dogs"],
      description: "Professional dog training with certified trainers.",
      image: null,
    },
  ];

  const toggleSaveProvider = (providerId: string) => {
    const newSaved = new Set(savedProviders);
    if (newSaved.has(providerId)) {
      newSaved.delete(providerId);
    } else {
      newSaved.add(providerId);
    }
    setSavedProviders(newSaved);
  };

  const filteredProviders = providers.filter(provider => {
    // Search filter
    if (searchQuery && !provider.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !provider.type.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !provider.address.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Service type filter
    if (filters.serviceType !== "all" && provider.type !== filters.serviceType) {
      return false;
    }

    // Distance filter
    if (filters.distance !== "all" && provider.distance > parseInt(filters.distance)) {
      return false;
    }

    // Rating filter
    if (filters.rating !== "all" && provider.rating < parseFloat(filters.rating)) {
      return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Find Services</h1>
              <p className="text-gray-600 mt-1">
                Discover veterinarians, groomers, trainers, and more near you
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                onClick={() => setViewMode("list")}
                size="sm"
              >
                List
              </Button>
              <Button
                variant={viewMode === "map" ? "default" : "outline"}
                onClick={() => setViewMode("map")}
                size="sm"
              >
                Map
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-6 flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for services, providers, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {Object.values(filters).some(v => v !== "all") && (
                <span className="ml-1 bg-blue-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {Object.values(filters).filter(v => v !== "all").length}
                </span>
              )}
            </Button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilters({
                    serviceType: "all",
                    distance: "25",
                    rating: "all",
                    hours: "all",
                    species: "all",
                  })}
                >
                  Clear All
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Service Type</label>
                  <Select
                    value={filters.serviceType}
                    onValueChange={(value) => setFilters({...filters, serviceType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Veterinarian">Veterinarian</SelectItem>
                      <SelectItem value="Emergency Vet">Emergency Vet</SelectItem>
                      <SelectItem value="Groomer">Groomer</SelectItem>
                      <SelectItem value="Trainer">Trainer</SelectItem>
                      <SelectItem value="Boarding">Boarding</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Distance</label>
                  <Select
                    value={filters.distance}
                    onValueChange={(value) => setFilters({...filters, distance: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Distance</SelectItem>
                      <SelectItem value="5">Within 5 miles</SelectItem>
                      <SelectItem value="10">Within 10 miles</SelectItem>
                      <SelectItem value="25">Within 25 miles</SelectItem>
                      <SelectItem value="50">Within 50 miles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Rating</label>
                  <Select
                    value={filters.rating}
                    onValueChange={(value) => setFilters({...filters, rating: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Rating</SelectItem>
                      <SelectItem value="4.5">4.5+ Stars</SelectItem>
                      <SelectItem value="4.0">4.0+ Stars</SelectItem>
                      <SelectItem value="3.5">3.5+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Hours</label>
                  <Select
                    value={filters.hours}
                    onValueChange={(value) => setFilters({...filters, hours: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Hours</SelectItem>
                      <SelectItem value="24/7">24/7 Open</SelectItem>
                      <SelectItem value="weekend">Weekend Hours</SelectItem>
                      <SelectItem value="evening">Evening Hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Species</label>
                  <Select
                    value={filters.species}
                    onValueChange={(value) => setFilters({...filters, species: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Species</SelectItem>
                      <SelectItem value="Dogs">Dogs</SelectItem>
                      <SelectItem value="Cats">Cats</SelectItem>
                      <SelectItem value="Birds">Birds</SelectItem>
                      <SelectItem value="Small Animals">Small Animals</SelectItem>
                      <SelectItem value="Exotic">Exotic Pets</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-700">
            Found <span className="font-semibold">{filteredProviders.length}</span> service providers
          </p>
        </div>

        {/* List View */}
        {viewMode === "list" && (
          <div className="space-y-4">
            {filteredProviders.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                isSaved={savedProviders.has(provider.id)}
                onToggleSave={() => toggleSaveProvider(provider.id)}
              />
            ))}
          </div>
        )}

        {/* Map View Placeholder */}
        {viewMode === "map" && (
          <Card>
            <CardContent className="p-8">
              <div className="text-center">
                <MapPin className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Map View Coming Soon
                </h3>
                <p className="text-gray-600 mb-4">
                  Map integration with Google Maps will be available soon.
                  <br />
                  You'll be able to see all service providers on an interactive map.
                </p>
                <Button onClick={() => setViewMode("list")}>
                  View List Instead
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Results */}
        {filteredProviders.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Search className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No providers found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search or filters to find more results.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setFilters({
                    serviceType: "all",
                    distance: "25",
                    rating: "all",
                    hours: "all",
                    species: "all",
                  });
                }}
              >
                Clear Search & Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Provider Card Component
interface ProviderCardProps {
  provider: any;
  isSaved: boolean;
  onToggleSave: () => void;
}

function ProviderCard({ provider, isSaved, onToggleSave }: ProviderCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {provider.name}
                </h3>
                <div className="flex items-center space-x-3 text-sm">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                    {provider.type}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-gray-900">{provider.rating}</span>
                    <span className="text-gray-600">({provider.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{provider.distance} mi away</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleSave}
                className={isSaved ? "text-red-600" : "text-gray-400"}
              >
                <Heart className={`h-5 w-5 ${isSaved ? "fill-red-600" : ""}`} />
              </Button>
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-4">{provider.description}</p>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex items-start space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{provider.address}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-700">{provider.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Globe className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <a href={`https://${provider.website}`} className="text-blue-600 hover:underline">
                    {provider.website}
                  </a>
                </div>
                <div className="flex items-start space-x-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{provider.hours}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Services:</p>
                  <div className="flex flex-wrap gap-1">
                    {provider.services.map((service: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Accepts:</p>
                  <div className="flex flex-wrap gap-1">
                    {provider.species.map((species: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs"
                      >
                        {species}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <Button className="flex-1">
                <Phone className="h-4 w-4 mr-2" />
                Call Now
              </Button>
              <Button variant="outline" className="flex-1">
                <Navigation className="h-4 w-4 mr-2" />
                Directions
              </Button>
              <Button variant="outline">
                View Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
