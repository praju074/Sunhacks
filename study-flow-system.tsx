"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Target, TrendingUp, Clock, CheckCircle, AlertCircle, Brain, BarChart3, Zap } from "lucide-react"

interface Subject {
  name: string
  strength: number // 0-100
  timeSpent: number // minutes this week
  targetTime: number // minutes per week
  priority: "high" | "medium" | "low"
  lastStudied: Date
}

interface StudySession {
  id: string
  subject: string
  duration: number
  date: Date
  completed: boolean
  type: "review" | "new" | "practice"
}

interface WeeklyPlan {
  week: string
  subjects: Subject[]
  sessions: StudySession[]
  totalTargetTime: number
  completedTime: number
}

export function StudyFlowSystem() {
  const [currentWeek, setCurrentWeek] = useState<WeeklyPlan>({
    week: "Week of " + new Date().toLocaleDateString(),
    subjects: [
      {
        name: "Mathematics",
        strength: 45,
        timeSpent: 120,
        targetTime: 300,
        priority: "high",
        lastStudied: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        name: "Computer Science",
        strength: 75,
        timeSpent: 180,
        targetTime: 240,
        priority: "medium",
        lastStudied: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        name: "Biology",
        strength: 85,
        timeSpent: 90,
        targetTime: 180,
        priority: "low",
        lastStudied: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        name: "Physics",
        strength: 60,
        timeSpent: 60,
        targetTime: 240,
        priority: "high",
        lastStudied: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
    ],
    sessions: [
      {
        id: "1",
        subject: "Mathematics",
        duration: 60,
        date: new Date(),
        completed: true,
        type: "review",
      },
      {
        id: "2",
        subject: "Computer Science",
        duration: 45,
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        completed: false,
        type: "new",
      },
      {
        id: "3",
        subject: "Physics",
        duration: 90,
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        completed: false,
        type: "practice",
      },
    ],
    totalTargetTime: 960,
    completedTime: 450,
  })

  const generateWeeklyPlan = () => {
    // Mock AI-generated plan based on strengths and weaknesses
    alert("Generating personalized 7-day study plan based on your performance data...")
    // In a real app, this would call an AI service to generate an optimized plan
  }

  const completeSession = (sessionId: string) => {
    setCurrentWeek((prev) => ({
      ...prev,
      sessions: prev.sessions.map((session) => (session.id === sessionId ? { ...session, completed: true } : session)),
      completedTime: prev.completedTime + (prev.sessions.find((s) => s.id === sessionId)?.duration || 0),
    }))
  }

  const getStrengthColor = (strength: number) => {
    if (strength >= 80) return "text-green-600"
    if (strength >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getStrengthBg = (strength: number) => {
    if (strength >= 80) return "bg-green-500"
    if (strength >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getDaysOfWeek = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const today = new Date()
    const currentDay = today.getDay()
    const monday = new Date(today.setDate(today.getDate() - currentDay + 1))

    return days.map((day, index) => {
      const date = new Date(monday)
      date.setDate(monday.getDate() + index)
      return {
        name: day,
        date: date.getDate(),
        isToday: date.toDateString() === new Date().toDateString(),
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Weekly Study Flow</h2>
          <p className="text-muted-foreground mt-2">
            AI-powered 7-day study plans optimized for your learning strengths and weaknesses
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-sm">
            {Math.round((currentWeek.completedTime / currentWeek.totalTargetTime) * 100)}% Complete
          </Badge>
          <Button onClick={generateWeeklyPlan} className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Generate New Plan
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schedule">7-Day Schedule</TabsTrigger>
          <TabsTrigger value="subjects">Subject Analysis</TabsTrigger>
          <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Weekly Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Weekly Progress
              </CardTitle>
              <CardDescription>{currentWeek.week}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Study Time Progress</span>
                  <span>
                    {Math.round(currentWeek.completedTime / 60)}h / {Math.round(currentWeek.totalTargetTime / 60)}h
                  </span>
                </div>
                <Progress value={(currentWeek.completedTime / currentWeek.totalTargetTime) * 100} className="w-full" />
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {currentWeek.sessions.filter((s) => s.completed).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Sessions Completed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-secondary">{currentWeek.sessions.length}</p>
                  <p className="text-xs text-muted-foreground">Total Sessions</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-accent">{currentWeek.subjects.length}</p>
                  <p className="text-xs text-muted-foreground">Active Subjects</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Focus */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Today's Focus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentWeek.sessions
                  .filter((session) => session.date.toDateString() === new Date().toDateString())
                  .map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${session.completed ? "bg-green-500" : "bg-yellow-500"}`}
                        />
                        <div>
                          <p className="font-medium">{session.subject}</p>
                          <p className="text-sm text-muted-foreground">
                            {session.duration} min • {session.type}
                          </p>
                        </div>
                      </div>
                      {!session.completed && (
                        <Button size="sm" onClick={() => completeSession(session.id)}>
                          Start Session
                        </Button>
                      )}
                      {session.completed && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Complete
                        </Badge>
                      )}
                    </div>
                  ))}
                {currentWeek.sessions.filter((session) => session.date.toDateString() === new Date().toDateString())
                  .length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No sessions scheduled for today</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Priority Subjects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Priority Subjects
              </CardTitle>
              <CardDescription>Subjects that need extra attention this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentWeek.subjects
                  .filter((subject) => subject.priority === "high" || subject.strength < 60)
                  .map((subject) => (
                    <div key={subject.name} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(subject.priority)}`} />
                        <div>
                          <p className="font-medium">{subject.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Strength: <span className={getStrengthColor(subject.strength)}>{subject.strength}%</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {Math.round(subject.timeSpent / 60)}h / {Math.round(subject.targetTime / 60)}h
                        </p>
                        <p className="text-xs text-muted-foreground">This week</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          {/* 7-Day Calendar View */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                7-Day Study Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {getDaysOfWeek().map((day) => (
                  <div
                    key={day.name}
                    className={`p-3 rounded-lg border text-center ${
                      day.isToday ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <p className="font-medium text-sm">{day.name}</p>
                    <p className="text-xs opacity-75">{day.date}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-3">
                {currentWeek.sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${session.completed ? "bg-green-500" : "bg-blue-500"}`} />
                      <div>
                        <p className="font-medium">{session.subject}</p>
                        <p className="text-sm text-muted-foreground">
                          {session.date.toLocaleDateString()} • {session.duration} min • {session.type}
                        </p>
                      </div>
                    </div>
                    <Badge variant={session.completed ? "secondary" : "outline"}>
                      {session.completed ? "Completed" : "Scheduled"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-6">
          <div className="grid gap-4">
            {currentWeek.subjects.map((subject) => (
              <Card key={subject.name} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${getPriorityColor(subject.priority)}`} />
                      <div>
                        <CardTitle className="text-lg">{subject.name}</CardTitle>
                        <CardDescription>Last studied: {subject.lastStudied.toLocaleDateString()}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {subject.priority} Priority
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Strength Level</span>
                      <span className={getStrengthColor(subject.strength)}>{subject.strength}%</span>
                    </div>
                    <Progress value={subject.strength} className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Weekly Progress</span>
                      <span>
                        {Math.round(subject.timeSpent / 60)}h / {Math.round(subject.targetTime / 60)}h
                      </span>
                    </div>
                    <Progress value={(subject.timeSpent / subject.targetTime) * 100} className="w-full" />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      Recommended: {subject.strength < 60 ? "Extra practice needed" : "Maintain current pace"}
                    </div>
                    <Button size="sm" variant="outline">
                      Study Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Weekly Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Average Study Time</span>
                    <span className="text-sm font-semibold">{Math.round(currentWeek.completedTime / 7)} min/day</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Consistency Score</span>
                    <span className="text-sm font-semibold text-green-600">85%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Improvement Rate</span>
                    <span className="text-sm font-semibold text-blue-600">+12%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Subject Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentWeek.subjects
                    .sort((a, b) => a.strength - b.strength)
                    .map((subject) => (
                      <div key={subject.name} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{subject.name}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-muted rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getStrengthBg(subject.strength)}`}
                              style={{ width: `${subject.strength}%` }}
                            />
                          </div>
                          <span className={`text-sm font-semibold ${getStrengthColor(subject.strength)}`}>
                            {subject.strength}%
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Study Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Recommendations
              </CardTitle>
              <CardDescription>Personalized suggestions based on your performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">Focus on Mathematics</p>
                  <p className="text-xs text-blue-700">
                    Your strength is below 50%. Consider spending 30 extra minutes daily on problem-solving.
                  </p>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-900">Great Progress in Biology</p>
                  <p className="text-xs text-green-700">
                    You're doing well! Maintain your current study schedule to keep your 85% strength level.
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-medium text-yellow-900">Physics Needs Attention</p>
                  <p className="text-xs text-yellow-700">
                    You're behind on your weekly target. Try to catch up with 2 focused sessions this weekend.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
