"use client";

import { useState } from "react";
import {
  Calendar,
  Plus,
  Check,
  Clock,
  AlertCircle,
  Bell,
  Repeat,
  ChevronRight,
  Syringe,
  Pill,
  Stethoscope,
  Scissors,
  PawPrint
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

export default function RemindersPage() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isNewReminderOpen, setIsNewReminderOpen] = useState(false);
  const [completedReminders, setCompletedReminders] = useState<Set<string>>(new Set());

  // Mock reminders data
  const reminders = [
    {
      id: "1",
      petId: "pet1",
      petName: "Max",
      title: "Rabies Vaccine Due",
      type: "vaccination",
      dueDate: "2024-11-15",
      dueTime: "10:00 AM",
      priority: "high",
      description: "Annual rabies vaccination due",
      recurring: "yearly",
      notifyEmail: true,
      notifyApp: true,
    },
    {
      id: "2",
      petId: "pet1",
      petName: "Max",
      title: "Heartgard Medication",
      type: "medication",
      dueDate: "2024-11-12",
      dueTime: "8:00 AM",
      priority: "medium",
      description: "Monthly heartworm prevention",
      recurring: "monthly",
      notifyEmail: false,
      notifyApp: true,
    },
    {
      id: "3",
      petId: "pet2",
      petName: "Luna",
      title: "Vet Checkup",
      type: "appointment",
      dueDate: "2024-11-20",
      dueTime: "2:30 PM",
      priority: "medium",
      description: "Annual wellness exam with Dr. Smith",
      recurring: "none",
      notifyEmail: true,
      notifyApp: true,
    },
    {
      id: "4",
      petId: "pet2",
      petName: "Luna",
      title: "Grooming Appointment",
      type: "grooming",
      dueDate: "2024-11-18",
      dueTime: "11:00 AM",
      priority: "low",
      description: "Bath and haircut at Pampered Pets",
      recurring: "none",
      notifyEmail: false,
      notifyApp: true,
    },
    {
      id: "5",
      petId: "pet1",
      petName: "Max",
      title: "Flea & Tick Treatment",
      type: "medication",
      dueDate: "2024-11-10",
      dueTime: "9:00 AM",
      priority: "high",
      description: "Monthly flea and tick prevention",
      recurring: "monthly",
      notifyEmail: true,
      notifyApp: true,
    },
  ];

  const toggleComplete = (reminderId: string) => {
    const newCompleted = new Set(completedReminders);
    if (newCompleted.has(reminderId)) {
      newCompleted.delete(reminderId);
    } else {
      newCompleted.add(reminderId);
    }
    setCompletedReminders(newCompleted);
  };

  const filterReminders = (reminders: any[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (selectedFilter) {
      case "today":
        return reminders.filter(r => {
          const dueDate = new Date(r.dueDate);
          return dueDate.toDateString() === today.toDateString();
        });
      case "upcoming":
        return reminders.filter(r => {
          const dueDate = new Date(r.dueDate);
          return dueDate > today;
        });
      case "completed":
        return reminders.filter(r => completedReminders.has(r.id));
      case "vaccination":
        return reminders.filter(r => r.type === "vaccination");
      case "medication":
        return reminders.filter(r => r.type === "medication");
      case "appointment":
        return reminders.filter(r => r.type === "appointment");
      case "grooming":
        return reminders.filter(r => r.type === "grooming");
      default:
        return reminders.filter(r => !completedReminders.has(r.id));
    }
  };

  const filteredReminders = filterReminders(reminders);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Sidebar - Mobile Responsive: Hidden on mobile, shown as sidebar on lg+ */}
          <aside className="hidden lg:block lg:w-64 lg:flex-shrink-0">
            <Card>
              <CardContent className="p-4">
                <Button
                  className="w-full mb-4"
                  onClick={() => setIsNewReminderOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Reminder
                </Button>

                <nav className="space-y-1">
                  <SidebarItem
                    icon={<Calendar className="h-5 w-5" />}
                    label="All Reminders"
                    count={reminders.filter(r => !completedReminders.has(r.id)).length}
                    active={selectedFilter === "all"}
                    onClick={() => setSelectedFilter("all")}
                  />
                  <SidebarItem
                    icon={<AlertCircle className="h-5 w-5" />}
                    label="Today"
                    count={filterReminders([...reminders]).filter(r => {
                      const today = new Date();
                      const dueDate = new Date(r.dueDate);
                      return dueDate.toDateString() === today.toDateString();
                    }).length}
                    active={selectedFilter === "today"}
                    onClick={() => setSelectedFilter("today")}
                  />
                  <SidebarItem
                    icon={<Clock className="h-5 w-5" />}
                    label="Upcoming"
                    count={reminders.filter(r => {
                      const today = new Date();
                      const dueDate = new Date(r.dueDate);
                      return dueDate > today && !completedReminders.has(r.id);
                    }).length}
                    active={selectedFilter === "upcoming"}
                    onClick={() => setSelectedFilter("upcoming")}
                  />
                  <SidebarItem
                    icon={<Check className="h-5 w-5" />}
                    label="Completed"
                    count={completedReminders.size}
                    active={selectedFilter === "completed"}
                    onClick={() => setSelectedFilter("completed")}
                  />

                  <div className="pt-4 mt-4 border-t">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3">
                      By Type
                    </p>
                    <SidebarItem
                      icon={<Syringe className="h-5 w-5" />}
                      label="Vaccinations"
                      count={reminders.filter(r => r.type === "vaccination").length}
                      active={selectedFilter === "vaccination"}
                      onClick={() => setSelectedFilter("vaccination")}
                    />
                    <SidebarItem
                      icon={<Pill className="h-5 w-5" />}
                      label="Medications"
                      count={reminders.filter(r => r.type === "medication").length}
                      active={selectedFilter === "medication"}
                      onClick={() => setSelectedFilter("medication")}
                    />
                    <SidebarItem
                      icon={<Stethoscope className="h-5 w-5" />}
                      label="Appointments"
                      count={reminders.filter(r => r.type === "appointment").length}
                      active={selectedFilter === "appointment"}
                      onClick={() => setSelectedFilter("appointment")}
                    />
                    <SidebarItem
                      icon={<Scissors className="h-5 w-5" />}
                      label="Grooming"
                      count={reminders.filter(r => r.type === "grooming").length}
                      active={selectedFilter === "grooming"}
                      onClick={() => setSelectedFilter("grooming")}
                    />
                  </div>
                </nav>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content - Mobile Responsive */}
          <main className="flex-1">
            {/* Mobile Filter Dropdown - Visible only on mobile */}
            <div className="lg:hidden mb-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">Filter Reminders</h3>
                    <Button
                      size="sm"
                      onClick={() => setIsNewReminderOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      New
                    </Button>
                  </div>
                  <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Reminders ({reminders.filter(r => !completedReminders.has(r.id)).length})</SelectItem>
                      <SelectItem value="today">Today ({filterReminders([...reminders]).filter(r => {
                        const today = new Date();
                        const dueDate = new Date(r.dueDate);
                        return dueDate.toDateString() === today.toDateString();
                      }).length})</SelectItem>
                      <SelectItem value="upcoming">Upcoming ({reminders.filter(r => {
                        const today = new Date();
                        const dueDate = new Date(r.dueDate);
                        return dueDate > today && !completedReminders.has(r.id);
                      }).length})</SelectItem>
                      <SelectItem value="completed">Completed ({completedReminders.size})</SelectItem>
                      <SelectItem value="vaccination">Vaccinations ({reminders.filter(r => r.type === "vaccination").length})</SelectItem>
                      <SelectItem value="medication">Medications ({reminders.filter(r => r.type === "medication").length})</SelectItem>
                      <SelectItem value="appointment">Appointments ({reminders.filter(r => r.type === "appointment").length})</SelectItem>
                      <SelectItem value="grooming">Grooming ({reminders.filter(r => r.type === "grooming").length})</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>

            <div className="mb-4 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {selectedFilter === "all" && "All Reminders"}
                {selectedFilter === "today" && "Today's Reminders"}
                {selectedFilter === "upcoming" && "Upcoming Reminders"}
                {selectedFilter === "completed" && "Completed Reminders"}
                {selectedFilter === "vaccination" && "Vaccination Reminders"}
                {selectedFilter === "medication" && "Medication Reminders"}
                {selectedFilter === "appointment" && "Appointment Reminders"}
                {selectedFilter === "grooming" && "Grooming Reminders"}
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                {filteredReminders.length} {filteredReminders.length === 1 ? "reminder" : "reminders"}
              </p>
            </div>

            {filteredReminders.length > 0 ? (
              <div className="space-y-3">
                {filteredReminders.map((reminder) => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    isCompleted={completedReminders.has(reminder.id)}
                    onToggleComplete={() => toggleComplete(reminder.id)}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No reminders found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {selectedFilter === "completed"
                      ? "You haven't completed any reminders yet."
                      : "Create a new reminder to get started."}
                  </p>
                  {selectedFilter !== "completed" && (
                    <Button onClick={() => setIsNewReminderOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      New Reminder
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>

      {/* New Reminder Modal */}
      <NewReminderModal
        isOpen={isNewReminderOpen}
        onClose={() => setIsNewReminderOpen(false)}
      />
    </div>
  );
}

// Sidebar Item Component
interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  count?: number;
  active?: boolean;
  onClick: () => void;
}

function SidebarItem({ icon, label, count, active, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? "bg-blue-50 text-blue-700"
          : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center space-x-3">
        <span className={active ? "text-blue-600" : "text-gray-400"}>
          {icon}
        </span>
        <span>{label}</span>
      </div>
      {count !== undefined && (
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
            active
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

// Reminder Card Component
interface ReminderCardProps {
  reminder: any;
  isCompleted: boolean;
  onToggleComplete: () => void;
}

function ReminderCard({ reminder, isCompleted, onToggleComplete }: ReminderCardProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "vaccination":
        return <Syringe className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />;
      case "medication":
        return <Pill className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />;
      case "appointment":
        return <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />;
      case "grooming":
        return <Scissors className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />;
      default:
        return <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-4 border-l-red-500";
      case "medium":
        return "border-l-4 border-l-yellow-500";
      case "low":
        return "border-l-4 border-l-green-500";
      default:
        return "border-l-4 border-l-gray-300";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  return (
    <Card className={`${getPriorityColor(reminder.priority)} ${isCompleted ? "opacity-60" : ""} hover:shadow-md transition-shadow`}>
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start space-x-2 sm:space-x-4 flex-1 min-w-0">
            {/* Checkbox */}
            <button
              onClick={onToggleComplete}
              className={`mt-0.5 sm:mt-1 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                isCompleted
                  ? "bg-green-600 border-green-600"
                  : "border-gray-300 hover:border-green-600"
              }`}
            >
              {isCompleted && <Check className="h-4 w-4 text-white" />}
            </button>

            {/* Content - Mobile Responsive */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                {getTypeIcon(reminder.type)}
                <h3 className={`text-sm sm:text-base font-semibold text-gray-900 truncate ${isCompleted ? "line-through" : ""}`}>
                  {reminder.title}
                </h3>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-xs sm:text-sm text-gray-600 mb-2">
                <div className="flex items-center space-x-1">
                  <PawPrint className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">{reminder.petName}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">{formatDate(reminder.dueDate)} at {reminder.dueTime}</span>
                </div>
                {reminder.recurring !== "none" && (
                  <div className="flex items-center space-x-1">
                    <Repeat className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="capitalize">{reminder.recurring}</span>
                  </div>
                )}
              </div>

              <p className="text-xs sm:text-sm text-gray-700 line-clamp-2">{reminder.description}</p>

              {!isCompleted && (
                <div className="flex items-center space-x-2 mt-2 sm:mt-3">
                  <Button size="sm" variant="outline" className="h-8 text-xs">
                    <Clock className="h-3 w-3 sm:mr-1" />
                    <span className="hidden sm:inline">Snooze</span>
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 text-xs">
                    Edit
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Priority Indicator - Mobile Responsive */}
          <div className="flex-shrink-0">
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                reminder.priority === "high"
                  ? "bg-red-100 text-red-700"
                  : reminder.priority === "medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {reminder.priority}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// New Reminder Modal Component
interface NewReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function NewReminderModal({ isOpen, onClose }: NewReminderModalProps) {
  const [formData, setFormData] = useState({
    petId: "",
    title: "",
    type: "vaccination",
    date: "",
    time: "",
    priority: "medium",
    recurring: "none",
    description: "",
    notifyEmail: true,
    notifyApp: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating reminder:", formData);
    // TODO: Implement API call to create reminder
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-full sm:max-w-2xl sm:rounded-lg">
        <DialogHeader>
          <DialogTitle>Create New Reminder</DialogTitle>
          <DialogDescription>
            Set up a reminder for pet care tasks
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pet Selection */}
          <div className="space-y-2">
            <Label htmlFor="petId">Pet *</Label>
            <Select
              value={formData.petId}
              onValueChange={(value) => setFormData({ ...formData, petId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a pet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pet1">Max (Dog)</SelectItem>
                <SelectItem value="pet2">Luna (Cat)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reminder Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Reminder Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vaccination">Vaccination</SelectItem>
                <SelectItem value="medication">Medication</SelectItem>
                <SelectItem value="appointment">Appointment</SelectItem>
                <SelectItem value="grooming">Grooming</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Rabies Vaccine Due"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* Date and Time - Mobile Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Priority and Recurring - Mobile Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="recurring">Recurring</Label>
              <Select
                value={formData.recurring}
                onValueChange={(value) => setFormData({ ...formData, recurring: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add any additional details..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          {/* Notifications */}
          <div className="space-y-3">
            <Label>Notifications</Label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.notifyEmail}
                  onChange={(e) => setFormData({ ...formData, notifyEmail: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Email notification</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.notifyApp}
                  onChange={(e) => setFormData({ ...formData, notifyApp: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">In-app notification</span>
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Reminder
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
