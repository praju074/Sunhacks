"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  BookOpen,
  Brain,
  FileText,
  MessageSquare,
  Calendar,
  Upload,
  Languages,
  GraduationCap,
  BookMarked,
  Compass,
  User,
  BarChart3,
  LogOut,
  Target,
} from "lucide-react"
import { LoginSystem } from "@/components/login-system"
import { NotesUploadSystem } from "@/components/notes-upload-system"
import { FlashcardsSystem } from "@/components/flashcards-system"
import { StudyFlowSystem } from "@/components/study-flow-system"
import { AITutorInterface } from "@/components/ai-tutor-interface"
import { PathFinderSystem } from "@/components/path-finder-system"
import { StudyMaterialsSystem } from "@/components/study-materials-system"
import { CounselingSystem } from "@/components/counseling-system"
import { MultiLanguageSystem } from "@/components/multi-language-system"

interface UserData {
  name: string
  email: string
}

export default function Dashboard() {
  const [user, setUser] = useState<UserData | null>(null)
  const [activeSection, setActiveSection] = useState("dashboard")

  const userStats = [
    { label: "Notes Uploaded", value: "12", icon: FileText },
    { label: "Flashcards Created", value: "48", icon: BookMarked },
    { label: "Study Sessions", value: "23", icon: Brain },
    { label: "Learning Streak", value: "7 days", icon: Target },
  ]

  const handleLogin = (userData: UserData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    setUser(null)
    setActiveSection("dashboard")
  }

  if (!user) {
    return <LoginSystem onLogin={handleLogin} />
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case "notes":
        return <NotesUploadSystem apiKey="AIzaSyCjNCkk_kxL4jwSsb9GoISh4FO41Pd3HvM" />
      case "flashcards":
        return <FlashcardsSystem />
      case "study-flow":
        return <StudyFlowSystem />
      case "ai-tutor":
        return <AITutorInterface apiKey="AIzaSyCjNCkk_kxL4jwSsb9GoISh4FO41Pd3HvM" />
      case "path-finder":
        return <PathFinderSystem />
      case "study-materials":
        return <StudyMaterialsSystem />
      case "counseling":
        return <CounselingSystem />
      case "translator":
        return <MultiLanguageSystem apiKey="AIzaSyCjNCkk_kxL4jwSsb9GoISh4FO41Pd3HvM" />
      default:
        return renderDashboard()
    }
  }

  const renderDashboard = () => (
    <>
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user.name}!</h2>
        <p className="text-muted-foreground text-lg">
          Continue your learning journey with AI-powered tools and personalized study plans
        </p>
      </div>

      {/* Main Feature Cards - Only User Accessible Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {features.map((feature) => (
          <Card
            key={feature.id}
            className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer group"
            onClick={() => setActiveSection(feature.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${feature.color} text-white`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                {feature.status === "new" && (
                  <Badge variant="secondary" className="text-xs">
                    New
                  </Badge>
                )}
                {feature.status === "beta" && (
                  <Badge variant="outline" className="text-xs">
                    Beta
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg group-hover:text-primary transition-colors">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
              <Button className="w-full mt-4" variant={feature.id === "notes" ? "default" : "outline"}>
                {feature.id === "notes" ? "Get Started" : "Open"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )

  const features = [
    {
      id: "notes",
      title: "Upload Notes",
      description: "Upload and automatically summarize your study notes with AI-powered insights",
      icon: Upload,
      status: "active",
      color: "bg-primary",
    },
    {
      id: "flashcards",
      title: "Smart Flashcards",
      description: "Auto-generated flashcards from your notes with spaced repetition",
      icon: BookMarked,
      status: "active",
      color: "bg-secondary",
    },
    {
      id: "study-flow",
      title: "Weekly Study Flow",
      description: "7-day personalized study plans based on your strengths and weaknesses",
      icon: Calendar,
      status: "active",
      color: "bg-accent",
    },
    {
      id: "ai-tutor",
      title: "AI Tutor",
      description: "Interactive AI tutor with voice support that adapts to your learning style",
      icon: Brain,
      status: "active",
      color: "bg-primary",
    },
    {
      id: "path-finder",
      title: "Path Finder",
      description: "Discover your ideal career path with personalized recommendations",
      icon: Compass,
      status: "new",
      color: "bg-secondary",
    },
    {
      id: "study-materials",
      title: "Study Materials",
      description: "Curated study resources based on your chosen path",
      icon: BookOpen,
      status: "active",
      color: "bg-accent",
    },
    {
      id: "counseling",
      title: "Counseling",
      description: "Professional guidance and support for your academic journey",
      icon: MessageSquare,
      status: "active",
      color: "bg-primary",
    },
    {
      id: "translator",
      title: "Multi-Language",
      description: "Translate your study materials into multiple languages",
      icon: Languages,
      status: "beta",
      color: "bg-secondary",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Siksha Sahayak</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              {["Dashboard", "Notes", "Flashcards", "AI Tutor", "Path Finder", "Counseling", "Translator"].map(
                (item) => (
                  <button
                    key={item}
                    onClick={() => setActiveSection(item.toLowerCase().replace(" ", "-"))}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      activeSection === item.toLowerCase().replace(" ", "-") ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {item}
                  </button>
                ),
              )}
            </nav>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
                  <User className="h-4 w-4" />
                  <span>{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>View Statistics</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Your Progress</DropdownMenuLabel>
                {userStats.map((stat, index) => (
                  <DropdownMenuItem key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{stat.label}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {stat.value}
                    </Badge>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="flex items-center space-x-2 text-red-600">
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{renderActiveSection()}</main>
    </div>
  )
}
