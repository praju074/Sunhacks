"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Upload,
  FileText,
  ImageIcon,
  type File,
  CheckCircle,
  Clock,
  Brain,
  BookMarked,
  HelpCircle,
  Eye,
  Trash2,
  Sparkles,
} from "lucide-react"

interface UploadedNote {
  id: string
  name: string
  type: string
  size: string
  uploadDate: string
  status: "processing" | "completed" | "failed"
  summary?: string
  flashcards?: Array<{ question: string; answer: string }>
  quiz?: Array<{ question: string; options: string[]; correct: number }>
}

interface NotesUploadSystemProps {
  apiKey?: string
}

export function NotesUploadSystem({ apiKey }: NotesUploadSystemProps) {
  const [uploadedNotes, setUploadedNotes] = useState<UploadedNote[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState("upload")

  const processNote = async (note: UploadedNote): Promise<UploadedNote> => {
    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // In a real implementation, this would use the Google AI API with the provided key
    console.log("[v0] Processing note with API key:", apiKey ? "API key provided" : "No API key")

    const mockSummary = `This note covers key concepts in ${note.name.split(".")[0]}. Main topics include fundamental principles, practical applications, and important definitions. The content provides a comprehensive overview suitable for exam preparation and quick review.`

    const mockFlashcards = [
      {
        question: "What is the main concept discussed?",
        answer: "The fundamental principles and applications covered in the study material.",
      },
      {
        question: "Key takeaway from this topic?",
        answer: "Understanding the practical applications and theoretical foundations.",
      },
      { question: "Important definition to remember?", answer: "Core terminology and concepts essential for mastery." },
    ]

    const mockQuiz = [
      {
        question: "Which of the following best describes the main concept?",
        options: [
          "Option A: Basic principle",
          "Option B: Advanced theory",
          "Option C: Practical application",
          "Option D: All of the above",
        ],
        correct: 3,
      },
      {
        question: "What is the most important aspect to remember?",
        options: ["Memorization", "Understanding", "Application", "All three"],
        correct: 3,
      },
    ]

    return {
      ...note,
      status: "completed",
      summary: mockSummary,
      flashcards: mockFlashcards,
      quiz: mockQuiz,
    }
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files)
      await handleFiles(files)
    }
  }, [])

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      await handleFiles(files)
    }
  }

  const handleFiles = async (files: File[]) => {
    setProcessing(true)

    for (const file of files) {
      const newNote: UploadedNote = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type || "application/octet-stream",
        size: (file.size / 1024 / 1024).toFixed(2) + " MB",
        uploadDate: new Date().toLocaleDateString(),
        status: "processing",
      }

      setUploadedNotes((prev) => [...prev, newNote])

      // Process the note with AI
      try {
        const processedNote = await processNote(newNote)
        setUploadedNotes((prev) => prev.map((note) => (note.id === newNote.id ? processedNote : note)))
      } catch (error) {
        setUploadedNotes((prev) => prev.map((note) => (note.id === newNote.id ? { ...note, status: "failed" } : note)))
      }
    }

    setProcessing(false)
    setActiveTab("library")
  }

  const saveAsFlashcards = (note: UploadedNote) => {
    if (note.flashcards) {
      // In a real app, this would save to a flashcard system
      alert(`Saved ${note.flashcards.length} flashcards from "${note.name}" to your flashcard deck!`)
    }
  }

  const downloadQuiz = (note: UploadedNote) => {
    if (note.quiz) {
      // In a real app, this would generate and download a quiz file
      alert(`Generated quiz with ${note.quiz.length} questions from "${note.name}"`)
    }
  }

  const deleteNote = (noteId: string) => {
    setUploadedNotes((prev) => prev.filter((note) => note.id !== noteId))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Notes Upload & Processing</h2>
          <p className="text-muted-foreground mt-2">
            Upload your study notes and let AI create summaries, flashcards, and quizzes automatically
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {apiKey ? "AI-Powered (Connected)" : "AI-Powered (Demo)"}
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload Notes</TabsTrigger>
          <TabsTrigger value="library">Notes Library ({uploadedNotes.length})</TabsTrigger>
          <TabsTrigger value="text-input">Text Input</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Your Study Notes
              </CardTitle>
              <CardDescription>Supported formats: PDF, DOC, DOCX, TXT, PNG, JPG, JPEG</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Drop your files here</h3>
                    <p className="text-muted-foreground">or click to browse</p>
                  </div>
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button asChild variant="outline">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      Choose Files
                    </label>
                  </Button>
                </div>
              </div>

              {processing && (
                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Processing with AI...</span>
                    <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                  </div>
                  <Progress value={66} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library" className="space-y-6">
          {uploadedNotes.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No notes uploaded yet</h3>
                <p className="text-muted-foreground mb-4">
                  Upload your first note to get started with AI-powered summarization
                </p>
                <Button onClick={() => setActiveTab("upload")}>Upload Notes</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {uploadedNotes.map((note) => (
                <Card key={note.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {note.type.includes("image") ? (
                            <ImageIcon className="h-5 w-5 text-primary" />
                          ) : (
                            <FileText className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{note.name}</CardTitle>
                          <CardDescription>
                            {note.size} • Uploaded {note.uploadDate}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {note.status === "processing" && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Processing
                          </Badge>
                        )}
                        {note.status === "completed" && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Ready
                          </Badge>
                        )}
                        {note.status === "failed" && <Badge variant="destructive">Failed</Badge>}
                      </div>
                    </div>
                  </CardHeader>

                  {note.status === "completed" && (
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Brain className="h-4 w-4" />
                          AI Summary
                        </h4>
                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">{note.summary}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => saveAsFlashcards(note)}
                          className="flex items-center gap-1"
                        >
                          <BookMarked className="h-4 w-4" />
                          Save as Flashcards ({note.flashcards?.length})
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadQuiz(note)}
                          className="flex items-center gap-1"
                        >
                          <HelpCircle className="h-4 w-4" />
                          Generate Quiz ({note.quiz?.length})
                        </Button>
                        <Button size="sm" variant="outline" className="flex items-center gap-1 bg-transparent">
                          <Eye className="h-4 w-4" />
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteNote(note.id)}
                          className="flex items-center gap-1 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="text-input" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Direct Text Input</CardTitle>
              <CardDescription>Paste your notes directly and get instant AI processing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea placeholder="Paste your study notes here..." className="min-h-[200px]" />
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  AI will automatically generate summaries, flashcards, and quizzes
                </p>
                <Button className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Process with AI
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
