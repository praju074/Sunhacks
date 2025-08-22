"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { MessageSquare, Calendar, HelpCircle, Clock, User, Video, Send, Star } from "lucide-react"

export function CounselingSystem() {
  const [selectedCounselor, setSelectedCounselor] = useState(null)
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: "counselor",
      message: "Hello! I'm here to help you with any academic or personal concerns. How can I support you today?",
      time: "2:30 PM",
    },
  ])
  const [newMessage, setNewMessage] = useState("")

  const counselors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Academic Guidance",
      rating: 4.9,
      experience: "8 years",
      available: true,
    },
    {
      id: 2,
      name: "Prof. Michael Chen",
      specialty: "Career Counseling",
      rating: 4.8,
      experience: "12 years",
      available: true,
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Mental Health",
      rating: 4.9,
      experience: "6 years",
      available: false,
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      specialty: "Study Skills",
      rating: 4.7,
      experience: "10 years",
      available: true,
    },
  ]

  const upcomingEvents = [
    { id: 1, title: "Study Skills Workshop", date: "Dec 15", time: "2:00 PM", type: "Workshop" },
    { id: 2, title: "Career Fair Prep", date: "Dec 18", time: "10:00 AM", type: "Seminar" },
    { id: 3, title: "Stress Management", date: "Dec 20", time: "3:00 PM", type: "Group Session" },
  ]

  const faqItems = [
    {
      question: "How do I schedule a counseling session?",
      answer: "Click on 'Book Session' and select your preferred counselor and time slot.",
    },
    {
      question: "Are counseling sessions confidential?",
      answer: "Yes, all sessions are completely confidential and follow professional guidelines.",
    },
    {
      question: "Can I change my major?",
      answer: "Yes, our academic counselors can help you explore different majors and guide you through the process.",
    },
    {
      question: "How do I deal with exam anxiety?",
      answer: "Our mental health counselors offer strategies and techniques to manage test anxiety effectively.",
    },
  ]

  const sendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages([
        ...chatMessages,
        {
          id: chatMessages.length + 1,
          sender: "user",
          message: newMessage,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ])
      setNewMessage("")
      // Simulate counselor response
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            sender: "counselor",
            message:
              "Thank you for sharing that with me. I understand your concerns and I'm here to help you work through this.",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ])
      }, 2000)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Counseling & Support</h2>
          <p className="text-muted-foreground mt-2">Professional guidance for your academic and personal journey</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Calendar className="h-4 w-4 mr-2" />
          Book Session
        </Button>
      </div>

      <Tabs defaultValue="counselors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="counselors">Counselors</TabsTrigger>
          <TabsTrigger value="chat">Live Chat</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="counselors" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {counselors.map((counselor) => (
              <Card key={counselor.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{counselor.name}</CardTitle>
                        <CardDescription>{counselor.specialty}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={counselor.available ? "default" : "secondary"}>
                      {counselor.available ? "Available" : "Busy"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        {counselor.rating}
                      </span>
                      <span className="text-muted-foreground">{counselor.experience}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1" disabled={!counselor.available}>
                        <Video className="h-4 w-4 mr-2" />
                        Video Call
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-transparent"
                        disabled={!counselor.available}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Chat
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="chat" className="space-y-6">
          <Card className="h-96">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Live Support Chat</CardTitle>
                <Badge variant="outline" className="text-green-600">
                  Online
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col h-full">
              <div className="flex-1 space-y-4 overflow-y-auto mb-4">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <Button onClick={sendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{event.type}</Badge>
                    <span className="text-sm text-muted-foreground">{event.date}</span>
                  </div>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {event.time}
                    </div>
                    <Button size="sm" variant="outline">
                      Register
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-6">
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                    {item.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
