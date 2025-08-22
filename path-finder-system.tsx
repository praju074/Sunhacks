"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  Compass,
  Target,
  TrendingUp,
  Award,
  MapPin,
  DollarSign,
  Users,
  Lightbulb,
  Code,
  Stethoscope,
  Calculator,
  Palette,
  Briefcase,
} from "lucide-react"

interface AssessmentQuestion {
  id: string
  question: string
  options: { value: string; label: string }[]
  category: "interests" | "skills" | "values" | "personality"
}

interface CareerPath {
  id: string
  title: string
  description: string
  match: number
  icon: React.ComponentType<{ className?: string }>
  category: string
  averageSalary: string
  growthRate: string
  education: string
  skills: string[]
  workEnvironment: string
  jobOutlook: "excellent" | "good" | "average" | "limited"
}

export function PathFinderSystem() {
  const [currentStep, setCurrentStep] = useState<"assessment" | "results" | "details">("assessment")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [selectedPath, setSelectedPath] = useState<CareerPath | null>(null)
  const [activeSection, setActiveSection] = useState<string>("overview")

  const assessmentQuestions: AssessmentQuestion[] = [
    {
      id: "q1",
      question: "What type of activities do you enjoy most?",
      category: "interests",
      options: [
        { value: "problem-solving", label: "Solving complex problems and puzzles" },
        { value: "helping-others", label: "Helping and supporting other people" },
        { value: "creating", label: "Creating and designing new things" },
        { value: "analyzing", label: "Analyzing data and finding patterns" },
      ],
    },
    {
      id: "q2",
      question: "Which work environment appeals to you most?",
      category: "values",
      options: [
        { value: "collaborative", label: "Collaborative team environment" },
        { value: "independent", label: "Independent work with minimal supervision" },
        { value: "fast-paced", label: "Fast-paced, dynamic environment" },
        { value: "structured", label: "Structured, organized workplace" },
      ],
    },
    {
      id: "q3",
      question: "What motivates you most in your work?",
      category: "values",
      options: [
        { value: "impact", label: "Making a positive impact on society" },
        { value: "innovation", label: "Innovation and cutting-edge technology" },
        { value: "stability", label: "Job security and stable income" },
        { value: "growth", label: "Personal growth and learning opportunities" },
      ],
    },
    {
      id: "q4",
      question: "Which of these best describes your strongest skills?",
      category: "skills",
      options: [
        { value: "technical", label: "Technical and analytical skills" },
        { value: "communication", label: "Communication and interpersonal skills" },
        { value: "creative", label: "Creative and artistic abilities" },
        { value: "leadership", label: "Leadership and management skills" },
      ],
    },
    {
      id: "q5",
      question: "How do you prefer to approach challenges?",
      category: "personality",
      options: [
        { value: "systematic", label: "Systematic, step-by-step approach" },
        { value: "intuitive", label: "Trust intuition and experience" },
        { value: "collaborative", label: "Work with others to find solutions" },
        { value: "research", label: "Research thoroughly before acting" },
      ],
    },
  ]

  const careerPaths: CareerPath[] = [
    {
      id: "software-engineer",
      title: "Software Engineer",
      description: "Design, develop, and maintain software applications and systems",
      match: 95,
      icon: Code,
      category: "Technology",
      averageSalary: "$95,000 - $150,000",
      growthRate: "+22%",
      education: "Bachelor's in Computer Science or related field",
      skills: ["Programming", "Problem Solving", "System Design", "Testing"],
      workEnvironment: "Office or remote, collaborative teams",
      jobOutlook: "excellent",
    },
    {
      id: "data-scientist",
      title: "Data Scientist",
      description: "Analyze complex data to help organizations make informed decisions",
      match: 88,
      icon: Calculator,
      category: "Technology",
      averageSalary: "$100,000 - $165,000",
      growthRate: "+31%",
      education: "Bachelor's/Master's in Statistics, Math, or Computer Science",
      skills: ["Statistics", "Machine Learning", "Python/R", "Data Visualization"],
      workEnvironment: "Office, research-focused environment",
      jobOutlook: "excellent",
    },
    {
      id: "healthcare-professional",
      title: "Healthcare Professional",
      description: "Provide medical care and support to improve patient health outcomes",
      match: 82,
      icon: Stethoscope,
      category: "Healthcare",
      averageSalary: "$75,000 - $200,000",
      growthRate: "+15%",
      education: "Medical degree or healthcare certification",
      skills: ["Patient Care", "Medical Knowledge", "Communication", "Empathy"],
      workEnvironment: "Hospitals, clinics, healthcare facilities",
      jobOutlook: "excellent",
    },
    {
      id: "ux-designer",
      title: "UX/UI Designer",
      description: "Create intuitive and engaging user experiences for digital products",
      match: 76,
      icon: Palette,
      category: "Design",
      averageSalary: "$70,000 - $120,000",
      growthRate: "+13%",
      education: "Bachelor's in Design, HCI, or related field",
      skills: ["Design Thinking", "Prototyping", "User Research", "Visual Design"],
      workEnvironment: "Creative studios, tech companies",
      jobOutlook: "good",
    },
    {
      id: "business-analyst",
      title: "Business Analyst",
      description: "Bridge the gap between business needs and technology solutions",
      match: 71,
      icon: Briefcase,
      category: "Business",
      averageSalary: "$65,000 - $110,000",
      growthRate: "+11%",
      education: "Bachelor's in Business, Economics, or related field",
      skills: ["Analysis", "Communication", "Project Management", "Problem Solving"],
      workEnvironment: "Corporate offices, consulting firms",
      jobOutlook: "good",
    },
  ]

  const handleAnswerChange = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [assessmentQuestions[currentQuestion].id]: value,
    }))
  }

  const nextQuestion = () => {
    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setCurrentStep("results")
    }
  }

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const restartAssessment = () => {
    setCurrentStep("assessment")
    setCurrentQuestion(0)
    setAnswers({})
    setSelectedPath(null)
    setActiveSection("overview")
  }

  const getJobOutlookColor = (outlook: string) => {
    switch (outlook) {
      case "excellent":
        return "text-green-600"
      case "good":
        return "text-blue-600"
      case "average":
        return "text-yellow-600"
      case "limited":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getJobOutlookBg = (outlook: string) => {
    switch (outlook) {
      case "excellent":
        return "bg-green-500"
      case "good":
        return "bg-blue-500"
      case "average":
        return "bg-yellow-500"
      case "limited":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Career Path Finder</h2>
          <p className="text-muted-foreground mt-2">
            Discover your ideal career path with AI-powered recommendations based on your interests and skills
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-sm">
            AI-Powered
          </Badge>
          {currentStep === "results" && (
            <Button onClick={restartAssessment} variant="outline" size="sm">
              Retake Assessment
            </Button>
          )}
        </div>
      </div>

      {currentStep === "assessment" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Career Assessment
              </CardTitle>
              <Badge variant="outline" className="text-sm">
                Question {currentQuestion + 1} of {assessmentQuestions.length}
              </Badge>
            </div>
            <CardDescription>Answer these questions to find your perfect career match</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Progress value={((currentQuestion + 1) / assessmentQuestions.length) * 100} className="w-full" />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{assessmentQuestions[currentQuestion].question}</h3>
              <RadioGroup
                value={answers[assessmentQuestions[currentQuestion].id] || ""}
                onValueChange={handleAnswerChange}
              >
                {assessmentQuestions[currentQuestion].options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={previousQuestion} disabled={currentQuestion === 0}>
                Previous
              </Button>
              <Button
                onClick={nextQuestion}
                disabled={!answers[assessmentQuestions[currentQuestion].id]}
                className="flex items-center gap-2"
              >
                {currentQuestion === assessmentQuestions.length - 1 ? (
                  <>
                    <Compass className="h-4 w-4" />
                    Find My Path
                  </>
                ) : (
                  "Next"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === "results" && (
        <Tabs defaultValue="matches" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="matches">Career Matches</TabsTrigger>
            <TabsTrigger value="insights">Assessment Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="matches" className="space-y-6">
            <div className="grid gap-4">
              {careerPaths.map((path) => (
                <Card
                  key={path.id}
                  className="hover:shadow-lg transition-all duration-200 cursor-pointer"
                  onClick={() => {
                    setSelectedPath(path)
                    setCurrentStep("details")
                  }}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <path.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{path.title}</CardTitle>
                          <CardDescription>{path.category}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-2xl font-bold text-primary">{path.match}%</span>
                          <span className="text-sm text-muted-foreground">match</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {path.jobOutlook} outlook
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{path.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span>{path.averageSalary}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <span>{path.growthRate} growth</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-purple-600" />
                        <span>{path.education}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-orange-600" />
                        <span>{path.workEnvironment}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Progress value={path.match} className="w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Your Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Problem Solving</span>
                    <span className="text-sm font-semibold">95%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Technical Skills</span>
                    <span className="text-sm font-semibold">88%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Analytical Thinking</span>
                    <span className="text-sm font-semibold">82%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Innovation</span>
                    <span className="text-sm font-semibold">76%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Career Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Work Environment</span>
                    <span className="text-sm font-semibold">Collaborative</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Primary Motivation</span>
                    <span className="text-sm font-semibold">Innovation</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Approach Style</span>
                    <span className="text-sm font-semibold">Systematic</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Interest Area</span>
                    <span className="text-sm font-semibold">Problem Solving</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Recommended Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">Explore Software Engineering</p>
                    <p className="text-xs text-blue-700">
                      Your top match! Consider taking programming courses and building projects to strengthen your
                      profile.
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-900">Develop Technical Skills</p>
                    <p className="text-xs text-green-700">
                      Focus on programming languages, system design, and problem-solving methodologies.
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-sm font-medium text-purple-900">Network with Professionals</p>
                    <p className="text-xs text-purple-700">
                      Connect with software engineers and data scientists to learn about their career journeys.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {currentStep === "details" && selectedPath && (
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => setCurrentStep("results")}>
              ← Back to Results
            </Button>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                {React.createElement(selectedPath.icon, { className: "h-6 w-6 text-primary" })}
              </div>
              <div>
                <h3 className="text-2xl font-bold">{selectedPath.title}</h3>
                <p className="text-muted-foreground">{selectedPath.category}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Career Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{selectedPath.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPath.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Work Environment</h4>
                    <p className="text-sm text-muted-foreground">{selectedPath.workEnvironment}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Career Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Match Score</span>
                    <span className="text-lg font-bold text-primary">{selectedPath.match}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Salary Range</span>
                    <span className="text-sm font-semibold">{selectedPath.averageSalary}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Growth Rate</span>
                    <span className="text-sm font-semibold text-green-600">{selectedPath.growthRate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Job Outlook</span>
                    <span className={`text-sm font-semibold capitalize ${getJobOutlookColor(selectedPath.jobOutlook)}`}>
                      {selectedPath.jobOutlook}
                    </span>
                  </div>
                </div>
                <Button className="w-full" onClick={() => setActiveSection("study-materials")}>
                  View Study Materials
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
