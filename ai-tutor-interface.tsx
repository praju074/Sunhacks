"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Send,
  Mic,
  MicOff,
  HelpCircle,
  Lightbulb,
  Target,
  MessageSquare,
  User,
  Bot,
  Sparkles,
  TrendingUp,
  Volume2,
  VolumeX,
} from "lucide-react"

interface Message {
  id: string
  type: "user" | "tutor"
  content: string
  timestamp: Date
  context?: string
  tutorMode?: "explain" | "quiz" | "practice" | "help"
}

interface TutorSession {
  id: string
  subject: string
  duration: number
  messagesCount: number
  startTime: Date
  topics: string[]
}

interface AITutorInterfaceProps {
  apiKey?: string
}

export function AITutorInterface({ apiKey }: AITutorInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "tutor",
      content:
        "Hello! I'm your AI tutor. I've analyzed your uploaded notes and I'm here to help you learn more effectively. What would you like to study today?",
      timestamp: new Date(),
      tutorMode: "help",
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [recognition, setRecognition] = useState<any>(null)
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null)
  const [tutorMode, setTutorMode] = useState<"explain" | "quiz" | "practice" | "help">("help")
  const [currentSession, setCurrentSession] = useState<TutorSession>({
    id: "session-1",
    subject: "General",
    duration: 0,
    messagesCount: 1,
    startTime: new Date(),
    topics: [],
  })
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Initialize Speech Recognition
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const recognitionInstance = new SpeechRecognition()

      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.lang = "en-US"

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputMessage(transcript)
        setIsListening(false)
        console.log("[v0] Voice input received:", transcript)
      }

      recognitionInstance.onerror = (event: any) => {
        console.error("[v0] Speech recognition error:", event.error)
        setIsListening(false)
      }

      recognitionInstance.onend = () => {
        setIsListening(false)
      }

      setRecognition(recognitionInstance)
    }

    // Initialize Speech Synthesis
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSpeechSynthesis(window.speechSynthesis)
    }
  }, [])

  const generateTutorResponse = async (userMessage: string, mode: string): Promise<string> => {
    // Simulate AI processing delay
    setIsTyping(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsTyping(false)

    console.log("[v0] AI Tutor processing with API key:", apiKey ? "API key provided" : "No API key")

    const responses = {
      explain: [
        "Let me break this down for you step by step. Based on your notes, I can see you're working on this concept. Here's a clear explanation that I'll also speak aloud for better understanding...",
        "Great question! From what I've learned about your study materials, this topic connects to several concepts you've already covered. Listen as I explain the connections...",
        "I notice from your uploaded notes that you might find this easier if we approach it from a different angle. Let me explain this concept in a way that's easy to follow...",
      ],
      quiz: [
        "Perfect! Let me test your understanding with a question based on your notes. You can answer by speaking or typing: What is the main principle behind this concept?",
        "Time for a quick quiz! Based on the material you've uploaded, can you explain how these two concepts relate? Feel free to use voice input for your answer.",
        "Let's see how well you've grasped this. Here's a question from your study materials. You can respond using voice or text...",
      ],
      practice: [
        "Excellent! Let's practice this together. I'll guide you through a problem similar to what you have in your notes. Listen carefully to my instructions.",
        "Practice makes perfect! Based on your uploaded materials, let's work through this step by step. I'll speak through each step clearly.",
        "Let's apply what you've learned. I'll create a practice scenario using concepts from your notes and guide you through it verbally...",
      ],
      help: [
        "I'm here to help! Based on your study history and notes, I can assist you with explanations, practice problems, or quick quizzes. You can ask me questions using voice or text.",
        "How can I support your learning today? I have access to your uploaded notes and can adapt to your preferred learning style. Try using voice commands for a more interactive experience.",
        "I'm ready to help you master this material. What specific area would you like to focus on? You can speak your questions naturally.",
      ],
    }

    const modeResponses = responses[mode as keyof typeof responses] || responses.help
    return modeResponses[Math.floor(Math.random() * modeResponses.length)]
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")

    // Generate tutor response
    const tutorResponse = await generateTutorResponse(inputMessage, tutorMode)
    const tutorMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "tutor",
      content: tutorResponse,
      timestamp: new Date(),
      tutorMode,
    }

    setMessages((prev) => [...prev, tutorMessage])

    if (voiceEnabled && speechSynthesis) {
      speakText(tutorResponse)
    }

    setCurrentSession((prev) => ({
      ...prev,
      messagesCount: prev.messagesCount + 2,
      duration: Math.floor((Date.now() - prev.startTime.getTime()) / 1000 / 60),
    }))
  }

  const startVoiceInput = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in your browser")
      return
    }

    if (isListening) {
      recognition.stop()
      setIsListening(false)
    } else {
      setIsListening(true)
      recognition.start()
      console.log("[v0] Voice input started with API key:", apiKey ? "Connected" : "Browser API")
    }
  }

  const speakText = (text: string) => {
    if (!speechSynthesis || !voiceEnabled) return

    speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 0.8

    utterance.onstart = () => {
      setIsSpeaking(true)
      console.log("[v0] Text-to-speech started")
    }

    utterance.onend = () => {
      setIsSpeaking(false)
      console.log("[v0] Text-to-speech completed")
    }

    utterance.onerror = (event) => {
      console.error("[v0] Text-to-speech error:", event.error)
      setIsSpeaking(false)
    }

    speechSynthesis.speak(utterance)
  }

  const stopSpeaking = () => {
    if (speechSynthesis) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickActions = [
    { label: "Explain this concept", mode: "explain" as const, icon: Lightbulb },
    { label: "Quiz me", mode: "quiz" as const, icon: HelpCircle },
    { label: "Practice problems", mode: "practice" as const, icon: Target },
    { label: "General help", mode: "help" as const, icon: MessageSquare },
  ]

  const suggestedQuestions = [
    "Can you explain the main concept from my biology notes?",
    "Create a practice problem for mathematics",
    "Quiz me on the topics I studied yesterday",
    "Help me understand this difficult concept",
    "What should I focus on based on my weak areas?",
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">AI Voice Tutor</h2>
          <p className="text-muted-foreground mt-2">
            Your personal AI tutor with voice capabilities - speak naturally and listen to explanations
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-sm flex items-center gap-1">
            <Brain className="h-3 w-3" />
            {apiKey ? "Voice AI-Powered (Connected)" : "Voice AI-Powered (Browser)"}
          </Badge>
          <Badge variant="outline" className="text-sm">
            Session: {currentSession.duration}m
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className="flex items-center gap-1"
          >
            {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            {voiceEnabled ? "Voice On" : "Voice Off"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat">Chat Session</TabsTrigger>
          <TabsTrigger value="history">Session History</TabsTrigger>
          <TabsTrigger value="settings">Tutor Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.mode}
                variant={tutorMode === action.mode ? "default" : "outline"}
                onClick={() => setTutorMode(action.mode)}
                size="sm"
                className="flex items-center gap-2"
              >
                <action.icon className="h-4 w-4" />
                {action.label}
              </Button>
            ))}
          </div>

          <Card className="h-96 flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  AI Voice Tutor Chat
                  {isSpeaking && (
                    <Badge variant="secondary" className="text-xs animate-pulse">
                      Speaking...
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs capitalize">
                    {tutorMode} Mode
                  </Badge>
                  {isSpeaking && (
                    <Button variant="outline" size="sm" onClick={stopSpeaking}>
                      <VolumeX className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.type === "tutor" && <Bot className="h-4 w-4 mt-0.5 text-primary" />}
                        {message.type === "user" && <User className="h-4 w-4 mt-0.5" />}
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs opacity-75">
                              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                            {message.type === "tutor" && voiceEnabled && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => speakText(message.content)}
                                className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                              >
                                <Volume2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted text-muted-foreground rounded-lg p-3 max-w-[80%]">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-4 w-4 text-primary" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                          <div
                            className="w-2 h-2 bg-primary rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="w-2 h-2 bg-primary rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                        <span className="text-xs">AI Tutor is typing...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t p-4 space-y-3">
                <div className="flex space-x-2">
                  <Input
                    placeholder={`Ask your AI tutor anything or use voice input... (${tutorMode} mode)`}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={startVoiceInput}
                    className={`${isListening ? "bg-red-50 text-red-600 animate-pulse" : ""} ${
                      !recognition ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={!recognition}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Button onClick={handleSendMessage} size="sm">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    "Explain photosynthesis using voice",
                    "Quiz me on mathematics",
                    "Help me understand this concept",
                  ].map((question, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={() => setInputMessage(question)}
                      className="text-xs h-7 px-2"
                    >
                      {question}
                    </Button>
                  ))}
                </div>

                {isListening && (
                  <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span>Listening... Speak now</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                AI Voice Context & Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Voice Capabilities</h4>
                  <p className="text-xs text-muted-foreground">
                    {apiKey ? "Google Speech API integrated" : "Browser speech API active"} - Speak naturally and listen
                    to responses
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Learning Style</h4>
                  <p className="text-xs text-muted-foreground">
                    Voice-enhanced learning with audio explanations and speech-to-text input
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Voice Status</h4>
                  <p className="text-xs text-muted-foreground">
                    Voice input: {recognition ? "Available" : "Not supported"} | Voice output:{" "}
                    {speechSynthesis ? "Available" : "Not supported"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <div className="grid gap-4">
            {[
              {
                date: "Today",
                sessions: [
                  { subject: "Mathematics", duration: 25, messages: 12, topics: ["Quadratic Equations", "Factoring"] },
                  { subject: "Biology", duration: 18, messages: 8, topics: ["Photosynthesis", "Cell Structure"] },
                ],
              },
              {
                date: "Yesterday",
                sessions: [
                  {
                    subject: "Computer Science",
                    duration: 35,
                    messages: 16,
                    topics: ["Algorithms", "Data Structures"],
                  },
                ],
              },
            ].map((day) => (
              <Card key={day.date}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{day.date}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {day.sessions.map((session, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Brain className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{session.subject}</p>
                            <p className="text-xs text-muted-foreground">
                              {session.duration}m • {session.messages} messages
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex flex-wrap gap-1 justify-end mb-1">
                            {session.topics.map((topic) => (
                              <Badge key={topic} variant="outline" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Tutor Personality
                </CardTitle>
                <CardDescription>Customize how your AI tutor interacts with you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Teaching Style</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">
                      Patient & Detailed
                    </Button>
                    <Button variant="default" size="sm">
                      Quick & Efficient
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Difficulty Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" size="sm">
                      Beginner
                    </Button>
                    <Button variant="default" size="sm">
                      Intermediate
                    </Button>
                    <Button variant="outline" size="sm">
                      Advanced
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Learning Analytics
                </CardTitle>
                <CardDescription>Your AI tutor's performance insights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Sessions</span>
                  <span className="text-sm font-semibold">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Average Session Length</span>
                  <span className="text-sm font-semibold">22 minutes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Most Discussed Topic</span>
                  <span className="text-sm font-semibold">Mathematics</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Learning Improvement</span>
                  <span className="text-sm font-semibold text-green-600">+18%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
