"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Upload,
  X,
  ArrowLeft,
  Check,
  Loader2,
  Sparkles,
  Plus,
  PawPrint,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

type FlowStep = "upload" | "preview" | "analyzing" | "results" | "form" | "success";

export default function AddPetPage() {
  const router = useRouter();
  const [step, setStep] = useState<FlowStep>("upload");
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [aiResults, setAiResults] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    species: "DOG",
    breed: "",
    dateOfBirth: "",
    weight: "",
    weightUnit: "lbs",
    gender: "",
    microchipNumber: "",
    isSpayedNeutered: "",
    specialConditions: "",
  });

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setStep("preview");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    setStep("analyzing");

    try {
      // Call the actual AI API
      const response = await fetch("/api/ai/analyze-pet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: photoPreview,
          species: formData.species,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze pet photo");
      }

      const analysis = await response.json();

      // Map size category to estimated weight ranges
      const weightEstimates: Record<string, number> = {
        SMALL: 15,
        MEDIUM: 35,
        LARGE: 65,
        EXTRA_LARGE: 90,
      };

      const results = {
        breed: analysis.isMixedBreed && analysis.breedSecondary
          ? `${analysis.breed} / ${analysis.breedSecondary} Mix`
          : analysis.breed,
        confidence: analysis.breedConfidence,
        ageEstimateMonths: analysis.ageEstimateMonths,
        estimatedWeight: weightEstimates[analysis.sizeCategory] || 35,
        size: analysis.sizeCategory.replace("_", " "),
        coatColor: analysis.coatColors?.join(", ") || "Unknown",
      };

      setAiResults(results);
      setFormData((prev) => ({
        ...prev,
        breed: results.breed,
        weight: results.estimatedWeight.toString(),
        breedConfidence: analysis.breedConfidence,
        breedSecondary: analysis.breedSecondary,
        isMixedBreed: analysis.isMixedBreed,
        ageEstimateMonths: analysis.ageEstimateMonths,
        sizeCategory: analysis.sizeCategory,
        coatType: analysis.coatType,
        coatColors: analysis.coatColors,
        aiAnalysisData: analysis,
      }));
      setStep("results");
    } catch (error) {
      console.error("Error analyzing pet photo:", error);
      // Fallback to form if analysis fails
      alert("We couldn't analyze the photo. Please fill in the details manually.");
      setStep("form");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Implement API call to create pet
    console.log("Creating pet:", formData);

    // Simulate API call
    setTimeout(() => {
      setStep("success");
      // After celebration, redirect to pets list
      setTimeout(() => {
        router.push("/pets");
      }, 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      {step !== "success" && (
        <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => {
                if (step === "upload") {
                  router.back();
                } else if (step === "preview") {
                  setStep("upload");
                } else if (step === "results" || step === "form") {
                  setStep("preview");
                }
              }}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm sm:inline hidden">Back</span>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Add Your Pet</h1>
            <button
              onClick={() => router.back()}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
        {step === "upload" && (
          <UploadStep onPhotoSelect={handlePhotoSelect} />
        )}

        {step === "preview" && (
          <PreviewStep
            photoPreview={photoPreview}
            onAnalyze={handleAnalyze}
            onRetake={() => setStep("upload")}
          />
        )}

        {step === "analyzing" && <AnalyzingStep photoPreview={photoPreview} />}

        {step === "results" && aiResults && (
          <ResultsStep
            aiResults={aiResults}
            photoPreview={photoPreview}
            onContinue={() => setStep("form")}
            onEdit={() => setStep("form")}
          />
        )}

        {step === "form" && (
          <FormStep
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            photoPreview={photoPreview}
            aiResults={aiResults}
          />
        )}

        {step === "success" && (
          <SuccessStep petName={formData.name} photoPreview={photoPreview} />
        )}
      </div>
    </div>
  );
}

// Upload Step Component
function UploadStep({ onPhotoSelect }: { onPhotoSelect: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-2">
          <Camera className="h-8 w-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Let's start with a photo
        </h2>
        <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto">
          This helps us identify the breed and personalize care tips
        </p>
      </div>

      <div className="space-y-3 mt-8">
        <label htmlFor="camera-input">
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1 active:scale-98">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Camera className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900">Camera</h3>
                <p className="text-sm text-gray-600">Take a new photo</p>
              </div>
            </CardContent>
          </Card>
        </label>
        <input
          id="camera-input"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={onPhotoSelect}
          className="hidden"
        />

        <label htmlFor="gallery-input">
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1 active:scale-98">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Upload className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900">Gallery</h3>
                <p className="text-sm text-gray-600">Choose from your photos</p>
              </div>
            </CardContent>
          </Card>
        </label>
        <input
          id="gallery-input"
          type="file"
          accept="image/*"
          onChange={onPhotoSelect}
          className="hidden"
        />
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex space-x-2 text-sm text-blue-800">
          <Sparkles className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Tip for best results:</p>
            <p className="text-blue-700 mt-1">
              Face visible, good lighting, and one pet at a time
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => {}}
        className="w-full text-center text-sm text-gray-600 hover:text-gray-900 py-2"
      >
        Skip for now
      </button>
    </div>
  );
}

// Preview Step Component
function PreviewStep({
  photoPreview,
  onAnalyze,
  onRetake,
}: {
  photoPreview: string;
  onAnalyze: () => void;
  onRetake: () => void;
}) {
  const [checklist, setChecklist] = useState({
    faceVisible: true,
    goodLighting: true,
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Perfect!</h2>
        <p className="text-gray-600 mt-1">Let's make sure this photo works well</p>
      </div>

      <div className="relative rounded-2xl overflow-hidden shadow-xl">
        <img
          src={photoPreview}
          alt="Pet preview"
          className="w-full h-auto max-h-96 object-cover"
        />
      </div>

      <div className="space-y-2">
        <div
          className={`flex items-center space-x-3 p-3 rounded-lg ${
            checklist.faceVisible ? "bg-green-50" : "bg-gray-50"
          }`}
        >
          <div
            className={`flex-shrink-0 w-5 h-5 rounded flex items-center justify-center ${
              checklist.faceVisible
                ? "bg-green-500"
                : "border-2 border-gray-300"
            }`}
          >
            {checklist.faceVisible && <Check className="h-3 w-3 text-white" />}
          </div>
          <span className="text-sm font-medium text-gray-700">
            Face is visible
          </span>
        </div>

        <div
          className={`flex items-center space-x-3 p-3 rounded-lg ${
            checklist.goodLighting ? "bg-green-50" : "bg-gray-50"
          }`}
        >
          <div
            className={`flex-shrink-0 w-5 h-5 rounded flex items-center justify-center ${
              checklist.goodLighting
                ? "bg-green-500"
                : "border-2 border-gray-300"
            }`}
          >
            {checklist.goodLighting && <Check className="h-3 w-3 text-white" />}
          </div>
          <span className="text-sm font-medium text-gray-700">
            Good lighting
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          onClick={onAnalyze}
          className="w-full h-14 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          Analyze with AI
          <Sparkles className="ml-2 h-5 w-5" />
        </Button>

        <Button
          onClick={onRetake}
          variant="outline"
          className="w-full h-12 text-base"
        >
          Take Another Photo
        </Button>
      </div>
    </div>
  );
}

// Analyzing Step Component
function AnalyzingStep({ photoPreview }: { photoPreview: string }) {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    "Uploading photo",
    "Identifying breed",
    "Estimating age",
    "Detecting features",
  ];

  // Use useEffect for side effects
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-fadeIn">
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden shadow-xl border-4 border-blue-200 animate-pulse">
          <img
            src={photoPreview}
            alt="Analyzing"
            className="w-full h-full object-cover opacity-80"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        </div>
      </div>

      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold text-gray-900 animate-pulse">
          Analyzing your pet...
        </h2>

        <div className="space-y-2">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`flex items-center justify-center space-x-2 text-sm transition-all duration-300 ${
                index <= currentStep
                  ? "text-blue-600 font-medium"
                  : "text-gray-400"
              }`}
            >
              {index < currentStep ? (
                <Check className="h-4 w-4" />
              ) : index === currentStep ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <div className="h-4 w-4" />
              )}
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-500">This usually takes 3-5 seconds</p>
    </div>
  );
}

// Results Step Component
function ResultsStep({
  aiResults,
  photoPreview,
  onContinue,
  onEdit,
}: {
  aiResults: any;
  photoPreview: string;
  onContinue: () => void;
  onEdit: () => void;
}) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          ✨ We found your pet! ✨
        </h2>
      </div>

      <Card className="relative overflow-hidden border-2 border-blue-300 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-50" />
        <CardContent className="relative p-6 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src={photoPreview}
                alt="Pet"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {aiResults.breed}
              </h3>
              <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-semibold">
                <Check className="h-4 w-4 mr-1" />
                {Math.round(aiResults.confidence * 100)}% confident
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="flex items-center space-x-2 text-sm">
              <PawPrint className="h-4 w-4 text-gray-600" />
              <span className="text-gray-700">
                ~{Math.floor(aiResults.ageEstimateMonths / 12)} years old
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-700">
                {aiResults.size} breed (~{aiResults.estimatedWeight} lbs)
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <Button
          onClick={onContinue}
          className="w-full h-14 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          Looks perfect! Continue
        </Button>

        <Button
          onClick={onEdit}
          variant="outline"
          className="w-full h-12 text-base"
        >
          Let me make changes
        </Button>
      </div>

      <p className="text-center text-xs text-gray-500">
        Not quite right? We'll learn from your corrections!
      </p>
    </div>
  );
}

// Form Step Component (simplified - full implementation would be larger)
function FormStep({
  formData,
  setFormData,
  onSubmit,
  photoPreview,
  aiResults,
}: {
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  photoPreview: string;
  aiResults: any;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6 animate-fadeIn">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Complete Profile</h2>
        <p className="text-gray-600 text-sm mt-1">Step 2 of 2</p>
      </div>

      <div className="flex justify-center">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg">
          <img src={photoPreview} alt="Pet" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-semibold">
            Pet Name *
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Max"
            className="h-12 text-base"
            required
          />
          <p className="text-xs text-gray-500">Give your pet a name you'll use every day</p>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold">Species *</Label>
          <div className="grid grid-cols-2 gap-3">
            {["DOG", "CAT"].map((species) => (
              <button
                key={species}
                type="button"
                onClick={() => setFormData({ ...formData, species })}
                className={`h-12 rounded-xl font-medium transition-all ${
                  formData.species === species
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {species === "DOG" ? "🐕 Dog" : "🐈 Cat"}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="breed" className="text-sm font-semibold">
            Breed
          </Label>
          <Input
            id="breed"
            value={formData.breed}
            onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
            placeholder="e.g., Golden Retriever"
            className="h-12 text-base"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="weight" className="text-sm font-semibold">
              Weight
            </Label>
            <div className="flex space-x-2">
              <Input
                id="weight"
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="65"
                className="h-12 text-base flex-1"
              />
              <Select
                value={formData.weightUnit}
                onValueChange={(value) =>
                  setFormData({ ...formData, weightUnit: value })
                }
              >
                <SelectTrigger className="h-12 w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lbs">lbs</SelectItem>
                  <SelectItem value="kg">kg</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="text-sm font-semibold">
              Birthday
            </Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) =>
                setFormData({ ...formData, dateOfBirth: e.target.value })
              }
              className="h-12 text-base"
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-14 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 mt-8"
      >
        Create Profile
      </Button>
    </form>
  );
}

// Success Step Component
function SuccessStep({ petName, photoPreview }: { petName: string; photoPreview: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 animate-fadeIn text-center">
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl animate-bounceIn">
          <img src={photoPreview} alt="Pet" className="w-full h-full object-cover" />
        </div>
        <div className="absolute -top-4 -right-4 text-6xl animate-spin-slow">✨</div>
        <div className="absolute -bottom-4 -left-4 text-6xl animate-spin-slow">🎉</div>
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Welcome to the family!
        </h1>
        <p className="text-lg text-gray-600 max-w-md">
          {petName ? `${petName}'s` : "Your pet's"} profile is ready and we've already created{" "}
          {petName ? "their" : "a"} first care plan
        </p>
      </div>

      <div className="flex items-center space-x-2 text-green-600">
        <Check className="h-6 w-6" />
        <span className="font-semibold">Profile Created Successfully!</span>
      </div>
    </div>
  );
}
