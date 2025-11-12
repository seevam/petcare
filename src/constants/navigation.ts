import { Home, PawPrint, Heart, MapPin, Settings, Calendar } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: any;
  description?: string;
}

export const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    description: "Overview of your pets and reminders",
  },
  {
    title: "My Pets",
    href: "/pets",
    icon: PawPrint,
    description: "Manage your pet profiles",
  },
  {
    title: "Health Records",
    href: "/health",
    icon: Heart,
    description: "Vaccinations, medications, and health history",
  },
  {
    title: "Find Services",
    href: "/services",
    icon: MapPin,
    description: "Locate vets, groomers, and other services",
  },
  {
    title: "Reminders",
    href: "/reminders",
    icon: Calendar,
    description: "View upcoming appointments and tasks",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Account and app preferences",
  },
];
