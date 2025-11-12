"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Plus,
  Syringe,
  Weight,
  Pill,
  FolderOpen,
  Calendar,
  Heart,
  Activity,
  Upload,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function HealthRecordsPage() {
  const [view, setView] = useState<"categories" | "timeline">("categories");
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  // Fetch all pets first
  const { data: pets, isLoading: petsLoading } = useQuery({
    queryKey: ["pets"],
    queryFn: async () => {
      const res = await fetch("/api/pets");
      if (!res.ok) throw new Error("Failed to fetch pets");
      return res.json();
    },
  });

  // Auto-select first pet if available
  const petId = selectedPetId || pets?.[0]?.id;

  // Fetch selected pet data
  const { data: pet, isLoading: petLoading } = useQuery({
    queryKey: ["pet", petId],
    queryFn: async () => {
      const res = await fetch(`/api/pets/${petId}`);
      if (!res.ok) throw new Error("Failed to fetch pet");
      return res.json();
    },
    enabled: !!petId,
  });

  // Fetch health records
  const { data: healthData, isLoading: recordsLoading } = useQuery({
    queryKey: ["health-records", petId],
    queryFn: async () => {
      const res = await fetch(`/api/health/records?petId=${petId}`);
      if (!res.ok) throw new Error("Failed to fetch health records");
      return res.json();
    },
    enabled: !!petId,
  });

  if (petLoading || recordsLoading) {
    return (
      <div className="space-y-6">
        <div className="h-20 bg-gray-100 animate-pulse rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-40 bg-gray-100 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Pet not found</p>
        <Link href="/pets">
          <Button className="mt-4">Back to Pets</Button>
        </Link>
      </div>
    );
  }

  const summaryData = {
    vaccinations: { current: 4, total: 6, status: "up-to-date" },
    weight: { current: 45.2, change: 0.3, lastMeasured: "3d ago" },
    medications: { active: 2, todayTaken: true },
    documents: { count: 12, latest: "2d ago" },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/pets">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {pet.name}'s Health Records
                </h1>
                <p className="text-sm text-gray-600">
                  {pet.breed} • Last vet visit: 2 weeks ago
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Record
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Vaccinations Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Syringe className="h-6 w-6 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">
                  Vaccinations
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {summaryData.vaccinations.current} / {summaryData.vaccinations.total}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1 mb-2">
                <div
                  className="bg-blue-600 h-1 rounded-full"
                  style={{
                    width: `${(summaryData.vaccinations.current / summaryData.vaccinations.total) * 100}%`,
                  }}
                ></div>
              </div>
              <p className="text-xs text-green-600 font-medium">
                {summaryData.vaccinations.status}
              </p>
            </CardContent>
          </Card>

          {/* Weight Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Weight className="h-6 w-6 text-purple-600" />
                <span className="text-sm font-medium text-gray-600">Weight</span>
              </div>
              <div className="flex items-baseline space-x-2 mb-2">
                <span className="text-3xl font-bold text-gray-900">
                  {summaryData.weight.current}
                </span>
                <span className="text-sm text-gray-600">lbs</span>
                <span className="text-sm text-green-600 font-medium">
                  ↗ +{summaryData.weight.change}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                Last: {summaryData.weight.lastMeasured}
              </p>
            </CardContent>
          </Card>

          {/* Medications Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Pill className="h-6 w-6 text-green-600" />
                <span className="text-sm font-medium text-gray-600">
                  Medications
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {summaryData.medications.active} Active
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1 mb-2">
                <div className="bg-green-600 h-1 rounded-full w-full"></div>
              </div>
              <p className="text-xs text-green-600 font-medium">
                Today: ✓ taken
              </p>
            </CardContent>
          </Card>

          {/* Documents Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <FolderOpen className="h-6 w-6 text-orange-600" />
                <span className="text-sm font-medium text-gray-600">
                  Documents
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {summaryData.documents.count}
              </div>
              <p className="text-xs text-gray-600">
                Latest: {summaryData.documents.latest}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Health History</CardTitle>
                <CardDescription>
                  View and manage all health records for {pet.name}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={view === "categories" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setView("categories")}
                >
                  Categories
                </Button>
                <Button
                  variant={view === "timeline" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setView("timeline")}
                >
                  Timeline
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {view === "categories" ? (
              <CategoriesView
                petId={petId}
                onRecordClick={(record) => {
                  setSelectedRecord(record);
                  setIsDetailModalOpen(true);
                }}
              />
            ) : (
              <TimelineView
                petId={petId}
                onRecordClick={(record) => {
                  setSelectedRecord(record);
                  setIsDetailModalOpen(true);
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Record Modal */}
      <AddRecordModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        petId={petId}
        petName={pet?.name}
      />

      {/* Record Detail Modal */}
      <RecordDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedRecord(null);
        }}
        record={selectedRecord}
        petName={pet?.name}
      />
    </div>
  );
}

// Placeholder components - will implement next
function CategoriesView({ petId, onRecordClick }: { petId: string; onRecordClick: (record: any) => void }) {
  return (
    <div className="space-y-6">
      {/* Vaccinations Section */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-b">
          <div className="flex items-center space-x-3">
            <Syringe className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">VACCINATIONS (6)</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4 text-blue-600" />
            </Button>
          </div>
        </div>
        <div className="p-4 space-y-3">
          <RecordCard
            icon={<Syringe className="h-5 w-5 text-blue-600" />}
            title="Rabies"
            status="Due: Soon"
            statusColor="amber"
            primaryInfo="Administered: Oct 15, 2024"
            secondaryInfo="Next: Oct 15, 2025"
            clinic="Dr. Smith • Happy Paws Vet"
            onClick={() => onRecordClick({
              type: "vaccination",
              title: "Rabies",
              vaccineName: "Rabies",
              vaccineDate: "Oct 15, 2024",
              nextDueDate: "Oct 15, 2025",
              batchNumber: "BT-2024-0456",
              status: "Due Soon",
              veterinarianName: "Dr. Smith",
              clinicName: "Happy Paws Vet",
              clinicPhone: "(555) 123-4567",
              cost: "$150.00",
              createdAt: "Oct 15, 2024",
            })}
          />
          <RecordCard
            icon={<Syringe className="h-5 w-5 text-blue-600" />}
            title="DHPP"
            status="Up to date"
            statusColor="green"
            primaryInfo="Administered: Mar 12, 2023"
            secondaryInfo="Next: Mar 12, 2026"
            clinic="Dr. Johnson • Healthy Pets"
            onClick={() => onRecordClick({
              type: "vaccination",
              title: "DHPP",
              vaccineName: "DHPP",
              vaccineDate: "Mar 12, 2023",
              nextDueDate: "Mar 12, 2026",
              batchNumber: "BT-2023-1234",
              status: "Up to date",
              veterinarianName: "Dr. Johnson",
              clinicName: "Healthy Pets",
              clinicPhone: "(555) 987-6543",
              cost: "$125.00",
              createdAt: "Mar 12, 2023",
            })}
          />
        </div>
      </div>

      {/* Vet Visits Section */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-b">
          <div className="flex items-center space-x-3">
            <Heart className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">VET VISITS (8)</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4 text-purple-600" />
            </Button>
          </div>
        </div>
        <div className="p-4 space-y-3">
          <RecordCard
            icon={<Calendar className="h-5 w-5 text-purple-600" />}
            title="Annual Checkup"
            primaryInfo="Nov 1, 2024 • Dr. Johnson"
            secondaryInfo="Healthy Pets Clinic"
            notes="Everything looks great..."
            documents={2}
            onClick={() => onRecordClick({
              type: "vet-visit",
              title: "Annual Checkup",
              visitDate: "Nov 1, 2024",
              visitType: "Annual Checkup",
              diagnosis: "Healthy, no concerns noted. All vital signs normal.",
              treatment: "Continue current diet and exercise routine. Return in 12 months for next annual checkup.",
              weightDuringVisit: "45.2 lbs",
              veterinarianName: "Dr. Johnson",
              clinicName: "Healthy Pets Clinic",
              clinicPhone: "(555) 987-6543",
              cost: "$200.00",
              documents: [{name: "Lab Results.pdf", size: "245 KB", date: "Nov 1, 2024"}, {name: "Checkup Summary.pdf", size: "180 KB", date: "Nov 1, 2024"}],
              createdAt: "Nov 1, 2024",
            })}
          />
        </div>
      </div>

      {/* Medications Section */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-b">
          <div className="flex items-center space-x-3">
            <Pill className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">MEDICATIONS (2 Active)</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4 text-green-600" />
            </Button>
          </div>
        </div>
        <div className="p-4 space-y-3">
          <RecordCard
            icon={<Pill className="h-5 w-5 text-green-600" />}
            title="Heartgard Plus"
            status="Active"
            statusColor="green"
            primaryInfo="68 mg • Once monthly"
            secondaryInfo="Last given: Nov 1, 2024"
            notes="Next: Dec 1, 2024"
            onClick={() => onRecordClick({
              type: "medication",
              title: "Heartgard Plus",
              medicationName: "Heartgard Plus",
              dosage: "68 mg",
              frequency: "Once monthly",
              startDate: "Jan 1, 2024",
              endDate: "Ongoing",
              prescribedBy: "Dr. Johnson",
              status: "Active",
              lastGiven: "Nov 1, 2024",
              veterinarianName: "Dr. Johnson",
              clinicName: "Healthy Pets Clinic",
              clinicPhone: "(555) 987-6543",
              cost: "$85.00",
              notes: "Give with food. Protects against heartworms, roundworms, and hookworms.",
              createdAt: "Jan 1, 2024",
            })}
          />
        </div>
      </div>
    </div>
  );
}

function TimelineView({ petId, onRecordClick }: { petId: string; onRecordClick: (record: any) => void }) {
  return (
    <div className="space-y-8">
      {/* November 2024 */}
      <div>
        <div className="sticky top-0 bg-gray-50 px-4 py-2 font-bold text-sm text-gray-700 uppercase tracking-wide">
          November 2024
        </div>
        <div className="relative border-l-2 border-gray-200 ml-6 mt-4 space-y-6">
          <TimelineEvent
            date="Nov 10"
            title="Annual Checkup"
            details={["Dr. Johnson • Healthy Pets", "Weight: 45.2 lbs"]}
            icon={<Calendar className="h-5 w-5 text-purple-600" />}
            color="purple"
            onClick={() => onRecordClick({
              type: "vet-visit",
              title: "Annual Checkup",
              visitDate: "Nov 10, 2024",
              visitType: "Annual Checkup",
              diagnosis: "Healthy, no concerns noted. All vital signs normal.",
              treatment: "Continue current diet and exercise routine. Return in 12 months for next annual checkup.",
              weightDuringVisit: "45.2 lbs",
              veterinarianName: "Dr. Johnson",
              clinicName: "Healthy Pets",
              clinicPhone: "(555) 987-6543",
              cost: "$200.00",
              createdAt: "Nov 10, 2024",
            })}
          />
          <TimelineEvent
            date="Nov 5"
            title="Medication Refill"
            details={["Heartgard Plus • 6-month supply"]}
            icon={<Pill className="h-5 w-5 text-green-600" />}
            color="green"
            onClick={() => onRecordClick({
              type: "medication",
              title: "Heartgard Plus Refill",
              medicationName: "Heartgard Plus",
              dosage: "68 mg",
              frequency: "Once monthly",
              startDate: "Nov 5, 2024",
              endDate: "May 5, 2025",
              prescribedBy: "Dr. Johnson",
              status: "Active",
              veterinarianName: "Dr. Johnson",
              clinicName: "Healthy Pets",
              cost: "$85.00",
              createdAt: "Nov 5, 2024",
            })}
          />
        </div>
      </div>

      {/* October 2024 */}
      <div>
        <div className="sticky top-0 bg-gray-50 px-4 py-2 font-bold text-sm text-gray-700 uppercase tracking-wide">
          October 2024
        </div>
        <div className="relative border-l-2 border-gray-200 ml-6 mt-4 space-y-6">
          <TimelineEvent
            date="Oct 15"
            title="Rabies Vaccination"
            details={["Dr. Smith • Happy Paws", "Next due: Oct 2025"]}
            icon={<Syringe className="h-5 w-5 text-blue-600" />}
            color="blue"
            onClick={() => onRecordClick({
              type: "vaccination",
              title: "Rabies",
              vaccineName: "Rabies",
              vaccineDate: "Oct 15, 2024",
              nextDueDate: "Oct 15, 2025",
              batchNumber: "BT-2024-0456",
              status: "Up to date",
              veterinarianName: "Dr. Smith",
              clinicName: "Happy Paws",
              clinicPhone: "(555) 123-4567",
              cost: "$150.00",
              createdAt: "Oct 15, 2024",
            })}
          />
        </div>
      </div>
    </div>
  );
}

// Helper Components
interface RecordCardProps {
  icon: React.ReactNode;
  title: string;
  status?: string;
  statusColor?: "green" | "amber" | "red";
  primaryInfo: string;
  secondaryInfo?: string;
  clinic?: string;
  notes?: string;
  documents?: number;
  onClick?: () => void;
}

function RecordCard({
  icon,
  title,
  status,
  statusColor,
  primaryInfo,
  secondaryInfo,
  clinic,
  notes,
  documents,
  onClick,
}: RecordCardProps) {
  const statusColors = {
    green: "bg-green-100 text-green-800",
    amber: "bg-amber-100 text-amber-800",
    red: "bg-red-100 text-red-800",
  };

  return (
    <div
      className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h4 className="font-semibold text-gray-900">{title}</h4>
            {status && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  statusColors[statusColor || "green"]
                }`}
              >
                {status}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-700 mt-1">{primaryInfo}</p>
          {secondaryInfo && (
            <p className="text-sm text-gray-600 mt-1">{secondaryInfo}</p>
          )}
          {clinic && (
            <p className="text-sm text-gray-600 mt-1">{clinic}</p>
          )}
          {notes && (
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">{notes}</p>
          )}
          {documents && (
            <div className="flex items-center space-x-1 mt-2 text-blue-600 text-sm">
              <FolderOpen className="h-4 w-4" />
              <span>{documents} documents</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface TimelineEventProps {
  date: string;
  title: string;
  details: string[];
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}

function TimelineEvent({ date, title, details, icon, color, onClick }: TimelineEventProps) {
  return (
    <div className="relative pl-8">
      <div
        className={`absolute left-0 transform -translate-x-1/2 w-6 h-6 rounded-full bg-${color}-100 border-2 border-white flex items-center justify-center`}
        style={{ marginLeft: "-13px" }}
      >
        {icon}
      </div>
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
        <CardContent className="pt-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">{date}</p>
              <h4 className="font-semibold text-gray-900 mt-1">{title}</h4>
              {details.map((detail, i) => (
                <p key={i} className="text-sm text-gray-700 mt-1">
                  {detail}
                </p>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Add/Edit Record Modal Component
interface AddRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  petId: string;
  petName?: string;
  record?: any; // For editing existing records
}

function AddRecordModal({ isOpen, onClose, petId, petName, record }: AddRecordModalProps) {
  const [recordType, setRecordType] = useState<string>(record?.type || "vaccination");
  const [formData, setFormData] = useState({
    // Vaccination fields
    vaccineName: "",
    vaccineDate: "",
    nextDueDate: "",
    batchNumber: "",

    // Vet Visit fields
    visitDate: "",
    visitReason: "",
    diagnosis: "",
    treatment: "",
    followUpDate: "",

    // Medication fields
    medicationName: "",
    dosage: "",
    frequency: "",
    startDate: "",
    endDate: "",
    prescribedBy: "",

    // Weight fields
    weight: "",
    weightDate: "",
    weightUnit: "lbs",

    // Common fields
    veterinarianName: "",
    clinicName: "",
    clinicPhone: "",
    cost: "",
    notes: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles([...uploadedFiles, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement API call to save health record
      console.log("Submitting health record:", { recordType, formData, uploadedFiles });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Close modal and reset form
      onClose();
      setFormData({
        vaccineName: "",
        vaccineDate: "",
        nextDueDate: "",
        batchNumber: "",
        visitDate: "",
        visitReason: "",
        diagnosis: "",
        treatment: "",
        followUpDate: "",
        medicationName: "",
        dosage: "",
        frequency: "",
        startDate: "",
        endDate: "",
        prescribedBy: "",
        weight: "",
        weightDate: "",
        weightUnit: "lbs",
        veterinarianName: "",
        clinicName: "",
        clinicPhone: "",
        cost: "",
        notes: "",
      });
      setUploadedFiles([]);
    } catch (error) {
      console.error("Error saving health record:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {record ? "Edit Health Record" : "Add Health Record"}
          </DialogTitle>
          <DialogDescription>
            Add a new health record for {petName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Record Type Selector */}
          <div className="space-y-2">
            <Label>Record Type</Label>
            <Select value={recordType} onValueChange={setRecordType}>
              <SelectTrigger>
                <SelectValue placeholder="Select record type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vaccination">
                  <div className="flex items-center space-x-2">
                    <Syringe className="h-4 w-4" />
                    <span>Vaccination</span>
                  </div>
                </SelectItem>
                <SelectItem value="vet-visit">
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4" />
                    <span>Vet Visit</span>
                  </div>
                </SelectItem>
                <SelectItem value="medication">
                  <div className="flex items-center space-x-2">
                    <Pill className="h-4 w-4" />
                    <span>Medication</span>
                  </div>
                </SelectItem>
                <SelectItem value="weight">
                  <div className="flex items-center space-x-2">
                    <Weight className="h-4 w-4" />
                    <span>Weight Record</span>
                  </div>
                </SelectItem>
                <SelectItem value="document">
                  <div className="flex items-center space-x-2">
                    <FolderOpen className="h-4 w-4" />
                    <span>Document</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Vaccination Fields */}
          {recordType === "vaccination" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vaccineName">Vaccine Name *</Label>
                  <Input
                    id="vaccineName"
                    placeholder="e.g., Rabies, DHPP"
                    value={formData.vaccineName}
                    onChange={(e) => updateFormData("vaccineName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="batchNumber">Batch Number</Label>
                  <Input
                    id="batchNumber"
                    placeholder="Batch/Lot number"
                    value={formData.batchNumber}
                    onChange={(e) => updateFormData("batchNumber", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vaccineDate">Date Administered *</Label>
                  <Input
                    id="vaccineDate"
                    type="date"
                    value={formData.vaccineDate}
                    onChange={(e) => updateFormData("vaccineDate", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nextDueDate">Next Due Date</Label>
                  <Input
                    id="nextDueDate"
                    type="date"
                    value={formData.nextDueDate}
                    onChange={(e) => updateFormData("nextDueDate", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Vet Visit Fields */}
          {recordType === "vet-visit" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="visitDate">Visit Date *</Label>
                  <Input
                    id="visitDate"
                    type="date"
                    value={formData.visitDate}
                    onChange={(e) => updateFormData("visitDate", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="followUpDate">Follow-up Date</Label>
                  <Input
                    id="followUpDate"
                    type="date"
                    value={formData.followUpDate}
                    onChange={(e) => updateFormData("followUpDate", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="visitReason">Reason for Visit *</Label>
                <Input
                  id="visitReason"
                  placeholder="e.g., Annual checkup, Injury"
                  value={formData.visitReason}
                  onChange={(e) => updateFormData("visitReason", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Textarea
                  id="diagnosis"
                  placeholder="Veterinarian's diagnosis"
                  value={formData.diagnosis}
                  onChange={(e) => updateFormData("diagnosis", e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="treatment">Treatment/Recommendations</Label>
                <Textarea
                  id="treatment"
                  placeholder="Treatment provided and recommendations"
                  value={formData.treatment}
                  onChange={(e) => updateFormData("treatment", e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Medication Fields */}
          {recordType === "medication" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="medicationName">Medication Name *</Label>
                <Input
                  id="medicationName"
                  placeholder="e.g., Heartgard Plus"
                  value={formData.medicationName}
                  onChange={(e) => updateFormData("medicationName", e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosage *</Label>
                  <Input
                    id="dosage"
                    placeholder="e.g., 68 mg"
                    value={formData.dosage}
                    onChange={(e) => updateFormData("dosage", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency *</Label>
                  <Select
                    value={formData.frequency}
                    onValueChange={(value) => updateFormData("frequency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="twice-daily">Twice daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="as-needed">As needed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => updateFormData("startDate", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date (if applicable)</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => updateFormData("endDate", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="prescribedBy">Prescribed By</Label>
                <Input
                  id="prescribedBy"
                  placeholder="Veterinarian name"
                  value={formData.prescribedBy}
                  onChange={(e) => updateFormData("prescribedBy", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Weight Fields */}
          {recordType === "weight" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight *</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      placeholder="45.2"
                      value={formData.weight}
                      onChange={(e) => updateFormData("weight", e.target.value)}
                      required
                      className="flex-1"
                    />
                    <Select
                      value={formData.weightUnit}
                      onValueChange={(value) => updateFormData("weightUnit", value)}
                    >
                      <SelectTrigger className="w-24">
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
                  <Label htmlFor="weightDate">Date Measured *</Label>
                  <Input
                    id="weightDate"
                    type="date"
                    value={formData.weightDate}
                    onChange={(e) => updateFormData("weightDate", e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Common Fields */}
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-semibold text-sm text-gray-900">
              Clinic/Veterinarian Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="veterinarianName">Veterinarian Name</Label>
                <Input
                  id="veterinarianName"
                  placeholder="Dr. Smith"
                  value={formData.veterinarianName}
                  onChange={(e) => updateFormData("veterinarianName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clinicName">Clinic Name</Label>
                <Input
                  id="clinicName"
                  placeholder="Happy Paws Veterinary"
                  value={formData.clinicName}
                  onChange={(e) => updateFormData("clinicName", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clinicPhone">Clinic Phone</Label>
                <Input
                  id="clinicPhone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.clinicPhone}
                  onChange={(e) => updateFormData("clinicPhone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Cost</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.cost}
                  onChange={(e) => updateFormData("cost", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional information or observations"
              value={formData.notes}
              onChange={(e) => updateFormData("notes", e.target.value)}
              rows={3}
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>Attach Documents/Certificates</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, JPG, PNG up to 10MB
                </p>
              </label>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2 mt-4">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <FolderOpen className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-900">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : record ? "Update Record" : "Add Record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Record Detail Modal Component
interface RecordDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: any;
  petName?: string;
}

function RecordDetailModal({ isOpen, onClose, record }: RecordDetailModalProps) {
  if (!record) return null;

  const getRecordIcon = (type: string) => {
    switch (type) {
      case "vaccination":
        return <Syringe className="h-6 w-6 text-blue-600" />;
      case "vet-visit":
        return <Heart className="h-6 w-6 text-purple-600" />;
      case "medication":
        return <Pill className="h-6 w-6 text-green-600" />;
      case "weight":
        return <Weight className="h-6 w-6 text-orange-600" />;
      default:
        return <FolderOpen className="h-6 w-6 text-gray-600" />;
    }
  };

  const getRecordTitle = (type: string) => {
    switch (type) {
      case "vaccination":
        return "Vaccination Record";
      case "vet-visit":
        return "Veterinary Visit";
      case "medication":
        return "Medication Record";
      case "weight":
        return "Weight Record";
      default:
        return "Health Record";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            {getRecordIcon(record.type)}
            <div>
              <DialogTitle className="text-xl">{record.title}</DialogTitle>
              <DialogDescription>{getRecordTitle(record.type)}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Vaccination Details */}
          {record.type === "vaccination" && (
            <>
              <div className="grid grid-cols-2 gap-6">
                <DetailField label="Vaccine Name" value={record.vaccineName || "Rabies"} />
                <DetailField label="Date Administered" value={record.vaccineDate || "Oct 15, 2024"} />
                <DetailField label="Next Due Date" value={record.nextDueDate || "Oct 15, 2025"} />
                <DetailField label="Batch Number" value={record.batchNumber || "BT-2024-0456"} />
              </div>
              {record.status && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-800">
                    Status: {record.status}
                  </p>
                </div>
              )}
            </>
          )}

          {/* Vet Visit Details */}
          {record.type === "vet-visit" && (
            <>
              <div className="grid grid-cols-2 gap-6">
                <DetailField label="Visit Date" value={record.visitDate || "Nov 1, 2024"} />
                <DetailField label="Visit Type" value={record.visitType || "Annual Checkup"} />
                <DetailField label="Follow-up Date" value={record.followUpDate || "N/A"} />
                <DetailField label="Weight During Visit" value={record.weightDuringVisit || "45.2 lbs"} />
              </div>
              {record.diagnosis && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-gray-700">Diagnosis</h4>
                  <p className="text-gray-900 text-sm bg-gray-50 p-3 rounded-lg">
                    {record.diagnosis || "Healthy, no concerns noted. All vital signs normal."}
                  </p>
                </div>
              )}
              {record.treatment && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-gray-700">Treatment & Recommendations</h4>
                  <p className="text-gray-900 text-sm bg-gray-50 p-3 rounded-lg">
                    {record.treatment || "Continue current diet and exercise routine. Return in 12 months for next annual checkup."}
                  </p>
                </div>
              )}
            </>
          )}

          {/* Medication Details */}
          {record.type === "medication" && (
            <>
              <div className="grid grid-cols-2 gap-6">
                <DetailField label="Medication Name" value={record.medicationName || "Heartgard Plus"} />
                <DetailField label="Dosage" value={record.dosage || "68 mg"} />
                <DetailField label="Frequency" value={record.frequency || "Once monthly"} />
                <DetailField label="Start Date" value={record.startDate || "Jan 1, 2024"} />
                <DetailField label="End Date" value={record.endDate || "Ongoing"} />
                <DetailField label="Prescribed By" value={record.prescribedBy || "Dr. Johnson"} />
              </div>
              {record.status && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-green-800">
                      Status: {record.status}
                    </p>
                    <p className="text-sm text-green-700">
                      Last given: {record.lastGiven || "Nov 1, 2024"}
                    </p>
                  </div>
                </div>
              )}
              {record.notes && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-gray-700">Instructions</h4>
                  <p className="text-gray-900 text-sm bg-gray-50 p-3 rounded-lg">
                    {record.notes}
                  </p>
                </div>
              )}
            </>
          )}

          {/* Weight Details */}
          {record.type === "weight" && (
            <>
              <div className="grid grid-cols-2 gap-6">
                <DetailField label="Weight" value={record.weight || "45.2 lbs"} />
                <DetailField label="Date Measured" value={record.weightDate || "Nov 10, 2024"} />
                <DetailField label="Change from Last" value={record.weightChange || "+0.3 lbs"} />
                <DetailField label="Measured By" value={record.measuredBy || "Dr. Johnson"} />
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-800">
                  Weight Trend: {record.trend || "Healthy, slight increase"}
                </p>
              </div>
            </>
          )}

          {/* Common Fields */}
          <div className="border-t pt-6 space-y-4">
            <h4 className="font-semibold text-gray-900">Clinic & Veterinarian Information</h4>
            <div className="grid grid-cols-2 gap-6">
              <DetailField
                label="Veterinarian"
                value={record.veterinarianName || "Dr. Smith"}
              />
              <DetailField
                label="Clinic"
                value={record.clinicName || "Happy Paws Veterinary"}
              />
              <DetailField
                label="Phone"
                value={record.clinicPhone || "(555) 123-4567"}
              />
              <DetailField label="Cost" value={record.cost || "$150.00"} />
            </div>
          </div>

          {/* Additional Notes */}
          {record.notes && record.type !== "medication" && (
            <div className="border-t pt-6 space-y-2">
              <h4 className="font-semibold text-gray-900">Additional Notes</h4>
              <p className="text-gray-700 text-sm bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                {record.notes || "No additional notes."}
              </p>
            </div>
          )}

          {/* Attached Documents */}
          {record.documents && record.documents.length > 0 && (
            <div className="border-t pt-6 space-y-3">
              <h4 className="font-semibold text-gray-900">Attached Documents</h4>
              <div className="space-y-2">
                {record.documents.map((doc: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <FolderOpen className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {doc.name || `Vaccination Certificate ${index + 1}.pdf`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {doc.size || "245 KB"} • {doc.date || "Uploaded Oct 15, 2024"}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Created: {record.createdAt || "Oct 15, 2024"}</span>
              {record.updatedAt && (
                <span>Last updated: {record.updatedAt || "Nov 1, 2024"}</span>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button type="button">
            Edit Record
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Helper component for displaying field details
interface DetailFieldProps {
  label: string;
  value: string;
}

function DetailField({ label, value }: DetailFieldProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm text-gray-900 font-medium">{value}</p>
    </div>
  );
}
