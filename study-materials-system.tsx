"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Search,
  Star,
  Clock,
  Users,
  Play,
  Download,
  ExternalLink,
  Award,
  TrendingUp,
  Target,
} from "lucide-react"

interface StudyMaterial {
  id: string
  title: string
  description: string
  type: "course" | "book" | "video" | "article" | "practice"
  level: "beginner" | "intermediate" | "advanced"
  duration: string
  rating: number
  students: number
  price: "free" | "paid"
  provider: string
  tags: string[]
  careerPath: string
  url: string
}

interface LearningPath {
  id: string
  title: string
  description: string
  totalDuration: string
  modules: number
  difficulty: "beginner" | "intermediate" | "advanced"
  materials: StudyMaterial[]
  progress: number
}

export function StudyMaterialsSystem() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "free" | "paid" | "beginner" | "intermediate" | "advanced"
  >("all")
  const [selectedPath, setSelectedPath] = useState<string>("software-engineering")

  const studyMaterials: StudyMaterial[] = [
    {
      id: "1",
      title: "Complete Python Programming Course",
      description: "Learn Python from basics to advanced concepts with hands-on projects",
      type: "course",
      level: "beginner",
      duration: "40 hours",
      rating: 4.8,
      students: 125000,
      price: "paid",
      provider: "TechEdu",
      tags: ["Python", "Programming", "Backend"],
      careerPath: "software-engineering",
      url: "#",
    },
    {
      id: "2",
      title: "Data Structures and Algorithms",
      description: "Master fundamental CS concepts essential for technical interviews",
      type: "course",
      level: "intermediate",
      duration: "60 hours",
      rating: 4.9,
      students: 89000,
      price: "paid",
      provider: "CodeMaster",
      tags: ["Algorithms", "Data Structures", "Interview Prep"],
      careerPath: "software-engineering",
      url: "#",
    },
    {
      id: "3",
      title: "Introduction to Machine Learning",
      description: "Free course covering ML fundamentals and practical applications",
      type: "course",
      level: "beginner",
      duration: "25 hours",
      rating: 4.6,
      students: 200000,
      price: "free",
      provider: "ML Academy",
      tags: ["Machine Learning", "Python", "Statistics"],
      careerPath: "data-science",
      url: "#",
    },
    {
      id: "4",
      title: "System Design Interview Guide",
      description: "Comprehensive guide to acing system design interviews",
      type: "book",
      level: "advanced",
      duration: "15 hours",
      rating: 4.7,
      students: 45000,
      price: "paid",
      provider: "Tech Books",
      tags: ["System Design", "Interviews", "Architecture"],
      careerPath: "software-engineering",
      url: "#",
    },
    {
      id: "5",
      title: "React.js Complete Tutorial",
      description: "Build modern web applications with React and its ecosystem",
      type: "video",
      level: "intermediate",
      duration: "30 hours",
      rating: 4.5,
      students: 75000,
      price: "free",
      provider: "WebDev Pro",
      tags: ["React", "JavaScript", "Frontend"],
      careerPath: "software-engineering",
      url: "#",
    },
  ]

  const learningPaths: LearningPath[] = [
    {
      id: "software-engineering",
      title: "Software Engineering Path",
      description: "Complete roadmap to become a professional software engineer",
      totalDuration: "6-12 months",
      modules: 8,
      difficulty: "beginner",
      materials: studyMaterials.filter((m) => m.careerPath === "software-engineering"),
      progress: 25,
    },
    {
      id: "data-science",
      title: "Data Science Path",
      description: "Master data analysis, machine learning, and statistical modeling",
      totalDuration: "8-14 months",
      modules: 10,
      difficulty: "intermediate",
      materials: studyMaterials.filter((m) => m.careerPath === "data-science"),
      progress: 0,
    },
  ]

  const filteredMaterials = studyMaterials.filter((material) => {
    const matchesSearch =
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesFilter =
      selectedFilter === "all" || material.price === selectedFilter || material.level === selectedFilter

    return matchesSearch && matchesFilter
  })

  const currentPath = learningPaths.find((path) => path.id === selectedPath)

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-500"
      case "intermediate":
        return "bg-yellow-500"
      case "advanced":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "course":
        return Play
      case "book":
        return BookOpen
      case "video":
        return Play
      case "article":
        return BookOpen
      case "practice":
        return Target
      default:
        return BookOpen
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Study Materials</h2>
          <p className="text-muted-foreground mt-2">
            Curated learning resources tailored to your career path and goals
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-sm">
            {filteredMaterials.length} Resources
          </Badge>
          <Badge variant="outline" className="text-sm">
            Path-Optimized
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="materials" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="materials">Browse Materials</TabsTrigger>
          <TabsTrigger value="paths">Learning Paths</TabsTrigger>
          <TabsTrigger value="progress">My Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="materials" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses, books, videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {["all", "free", "paid", "beginner", "intermediate", "advanced"].map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter as any)}
                  className="capitalize"
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>

          {/* Materials Grid */}
          <div className="grid gap-4">
            {filteredMaterials.map((material) => {
              const TypeIcon = getTypeIcon(material.type)
              return (
                <Card key={material.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <TypeIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{material.title}</CardTitle>
                          <CardDescription className="mt-1">{material.description}</CardDescription>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {material.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {material.students.toLocaleString()} students
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              {material.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${getLevelColor(material.level)}`} />
                          <span className="text-xs text-muted-foreground capitalize">{material.level}</span>
                        </div>
                        <Badge variant={material.price === "free" ? "secondary" : "outline"} className="text-xs">
                          {material.price === "free" ? "Free" : "Paid"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {material.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button size="sm">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Start Learning
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="paths" className="space-y-6">
          {/* Path Selection */}
          <div className="flex gap-2">
            {learningPaths.map((path) => (
              <Button
                key={path.id}
                variant={selectedPath === path.id ? "default" : "outline"}
                onClick={() => setSelectedPath(path.id)}
                size="sm"
              >
                {path.title}
              </Button>
            ))}
          </div>

          {currentPath && (
            <div className="space-y-6">
              {/* Path Overview */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{currentPath.title}</CardTitle>
                      <CardDescription className="mt-1">{currentPath.description}</CardDescription>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {currentPath.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{currentPath.modules}</p>
                      <p className="text-xs text-muted-foreground">Modules</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-secondary">{currentPath.totalDuration}</p>
                      <p className="text-xs text-muted-foreground">Duration</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-accent">{currentPath.materials.length}</p>
                      <p className="text-xs text-muted-foreground">Resources</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">{currentPath.progress}%</p>
                      <p className="text-xs text-muted-foreground">Complete</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Path Progress</span>
                      <span>{currentPath.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${currentPath.progress}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Path Materials */}
              <div className="grid gap-4">
                <h3 className="text-lg font-semibold">Recommended Learning Sequence</h3>
                {currentPath.materials.map((material, index) => {
                  const TypeIcon = getTypeIcon(material.type)
                  return (
                    <Card key={material.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full text-sm font-semibold text-primary">
                            {index + 1}
                          </div>
                          <div className="p-2 bg-muted rounded-lg">
                            <TypeIcon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{material.title}</h4>
                            <p className="text-sm text-muted-foreground">{material.description}</p>
                            <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                              <span>{material.duration}</span>
                              <span>{material.rating} ⭐</span>
                              <span className="capitalize">{material.level}</span>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            Start
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Learning Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Courses Completed</span>
                  <span className="text-sm font-semibold">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Hours Studied</span>
                  <span className="text-sm font-semibold">45</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Current Streak</span>
                  <span className="text-sm font-semibold">7 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Certificates Earned</span>
                  <span className="text-sm font-semibold">2</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Award className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">First Course Complete</p>
                    <p className="text-xs text-muted-foreground">Completed your first course</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Target className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Week Warrior</p>
                    <p className="text-xs text-muted-foreground">7-day learning streak</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 opacity-50">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Star className="h-4 w-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Path Master</p>
                    <p className="text-xs text-muted-foreground">Complete a learning path</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Current Focus
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm font-medium">Data Structures Course</p>
                  <p className="text-xs text-muted-foreground mb-2">Module 3 of 8 • 65% complete</p>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: "65%" }} />
                  </div>
                </div>
                <Button className="w-full" size="sm">
                  Continue Learning
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
