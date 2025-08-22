"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookMarked,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
} from "lucide-react"

interface Flashcard {
  id: string
  question: string
  answer: string
  subject: string
  difficulty: "easy" | "medium" | "hard"
  lastReviewed?: Date
  nextReview?: Date
  correctCount: number
  incorrectCount: number
  confidence: number
}

export function FlashcardsSystem() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    {
      id: "1",
      question: "What is the fundamental principle of machine learning?",
      answer:
        "Machine learning is based on the idea that systems can learn from data, identify patterns, and make decisions with minimal human intervention.",
      subject: "Computer Science",
      difficulty: "medium",
      correctCount: 3,
      incorrectCount: 1,
      confidence: 75,
      lastReviewed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      nextReview: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: "2",
      question: "Define photosynthesis and its importance",
      answer:
        "Photosynthesis is the process by which plants convert light energy into chemical energy, producing glucose and oxygen. It's crucial for life on Earth as it provides oxygen and forms the base of most food chains.",
      subject: "Biology",
      difficulty: "easy",
      correctCount: 5,
      incorrectCount: 0,
      confidence: 95,
      lastReviewed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      nextReview: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: "3",
      question: "What is the quadratic formula and when is it used?",
      answer:
        "The quadratic formula is x = (-b ± √(b²-4ac)) / 2a. It's used to find the roots of quadratic equations of the form ax² + bx + c = 0.",
      subject: "Mathematics",
      difficulty: "hard",
      correctCount: 1,
      incorrectCount: 3,
      confidence: 25,
      lastReviewed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      nextReview: new Date(),
    },
  ])

  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [studyMode, setStudyMode] = useState<"all" | "due" | "difficult">("all")
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0, total: 0 })

  const filteredCards = flashcards.filter((card) => {
    switch (studyMode) {
      case "due":
        return card.nextReview && card.nextReview <= new Date()
      case "difficult":
        return card.confidence < 50
      default:
        return true
    }
  })

  const currentCard = filteredCards[currentCardIndex]

  const handleCardResponse = (correct: boolean) => {
    if (!currentCard) return

    const updatedCards = flashcards.map((card) => {
      if (card.id === currentCard.id) {
        const newCorrectCount = correct ? card.correctCount + 1 : card.correctCount
        const newIncorrectCount = correct ? card.incorrectCount : card.incorrectCount + 1
        const totalAttempts = newCorrectCount + newIncorrectCount
        const newConfidence = Math.round((newCorrectCount / totalAttempts) * 100)

        // Spaced repetition algorithm
        const baseInterval = correct ? Math.max(1, card.confidence / 25) : 0.5
        const nextReviewDate = new Date(Date.now() + baseInterval * 24 * 60 * 60 * 1000)

        return {
          ...card,
          correctCount: newCorrectCount,
          incorrectCount: newIncorrectCount,
          confidence: newConfidence,
          lastReviewed: new Date(),
          nextReview: nextReviewDate,
        }
      }
      return card
    })

    setFlashcards(updatedCards)
    setSessionStats((prev) => ({
      correct: correct ? prev.correct + 1 : prev.correct,
      incorrect: correct ? prev.incorrect : prev.incorrect + 1,
      total: prev.total + 1,
    }))

    // Move to next card
    nextCard()
  }

  const nextCard = () => {
    setIsFlipped(false)
    if (currentCardIndex < filteredCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
    } else {
      setCurrentCardIndex(0)
    }
  }

  const previousCard = () => {
    setIsFlipped(false)
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
    } else {
      setCurrentCardIndex(filteredCards.length - 1)
    }
  }

  const shuffleCards = () => {
    setCurrentCardIndex(0)
    setIsFlipped(false)
  }

  const resetSession = () => {
    setCurrentCardIndex(0)
    setIsFlipped(false)
    setSessionStats({ correct: 0, incorrect: 0, total: 0 })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500"
      case "medium":
        return "bg-yellow-500"
      case "hard":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600"
    if (confidence >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Smart Flashcards</h2>
          <p className="text-muted-foreground mt-2">
            Study with spaced repetition and track your progress across subjects
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-sm">
            {filteredCards.length} Cards
          </Badge>
          <Badge variant="outline" className="text-sm">
            Session: {sessionStats.total} studied
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="study" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="study">Study Session</TabsTrigger>
          <TabsTrigger value="library">Card Library</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="study" className="space-y-6">
          {/* Study Mode Selection */}
          <div className="flex flex-wrap gap-2">
            <Button variant={studyMode === "all" ? "default" : "outline"} onClick={() => setStudyMode("all")} size="sm">
              All Cards ({flashcards.length})
            </Button>
            <Button variant={studyMode === "due" ? "default" : "outline"} onClick={() => setStudyMode("due")} size="sm">
              Due for Review ({flashcards.filter((c) => c.nextReview && c.nextReview <= new Date()).length})
            </Button>
            <Button
              variant={studyMode === "difficult" ? "default" : "outline"}
              onClick={() => setStudyMode("difficult")}
              size="sm"
            >
              Difficult Cards ({flashcards.filter((c) => c.confidence < 50).length})
            </Button>
          </div>

          {filteredCards.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <BookMarked className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No cards available</h3>
                <p className="text-muted-foreground mb-4">
                  {studyMode === "due"
                    ? "No cards are due for review right now. Great job staying on top of your studies!"
                    : studyMode === "difficult"
                      ? "You don't have any difficult cards. Keep up the excellent work!"
                      : "Upload some notes to generate flashcards automatically."}
                </p>
                <Button onClick={() => setStudyMode("all")}>View All Cards</Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    Card {currentCardIndex + 1} of {filteredCards.length}
                  </span>
                  <span>{Math.round(((currentCardIndex + 1) / filteredCards.length) * 100)}% Complete</span>
                </div>
                <Progress value={((currentCardIndex + 1) / filteredCards.length) * 100} className="w-full" />
              </div>

              {/* Flashcard */}
              <div className="flex justify-center">
                <Card
                  className="w-full max-w-2xl h-80 cursor-pointer transition-all duration-300 hover:shadow-lg"
                  onClick={() => setIsFlipped(!isFlipped)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {currentCard?.subject}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getDifficultyColor(currentCard?.difficulty || "")}`} />
                        <span className="text-xs text-muted-foreground capitalize">{currentCard?.difficulty}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center h-full p-6">
                    <div className="text-center space-y-4">
                      {!isFlipped ? (
                        <>
                          <h3 className="text-xl font-semibold text-foreground">{currentCard?.question}</h3>
                          <p className="text-sm text-muted-foreground">Click to reveal answer</p>
                        </>
                      ) : (
                        <>
                          <h4 className="text-lg font-medium text-muted-foreground mb-4">{currentCard?.question}</h4>
                          <p className="text-lg text-foreground leading-relaxed">{currentCard?.answer}</p>
                          <div className="flex items-center justify-center space-x-2 mt-4">
                            <span className="text-sm text-muted-foreground">Confidence:</span>
                            <span
                              className={`text-sm font-semibold ${getConfidenceColor(currentCard?.confidence || 0)}`}
                            >
                              {currentCard?.confidence}%
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Controls */}
              <div className="flex flex-col space-y-4">
                {/* Navigation Controls */}
                <div className="flex justify-center space-x-4">
                  <Button variant="outline" onClick={previousCard} size="sm">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <Button variant="outline" onClick={shuffleCards} size="sm">
                    <Shuffle className="h-4 w-4 mr-1" />
                    Shuffle
                  </Button>
                  <Button variant="outline" onClick={nextCard} size="sm">
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                  <Button variant="outline" onClick={resetSession} size="sm">
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                </div>

                {/* Response Controls (only show when flipped) */}
                {isFlipped && (
                  <div className="flex justify-center space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => handleCardResponse(false)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Incorrect
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleCardResponse(true)}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Correct
                    </Button>
                  </div>
                )}
              </div>

              {/* Session Stats */}
              {sessionStats.total > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{sessionStats.correct}</p>
                          <p className="text-xs text-muted-foreground">Correct</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-red-600">{sessionStats.incorrect}</p>
                          <p className="text-xs text-muted-foreground">Incorrect</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-foreground">{sessionStats.total}</p>
                          <p className="text-xs text-muted-foreground">Total</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-foreground">
                          {sessionStats.total > 0 ? Math.round((sessionStats.correct / sessionStats.total) * 100) : 0}%
                        </p>
                        <p className="text-xs text-muted-foreground">Accuracy</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="library" className="space-y-6">
          <div className="grid gap-4">
            {flashcards.map((card) => (
              <Card key={card.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getDifficultyColor(card.difficulty)}`} />
                      <div>
                        <CardTitle className="text-lg">{card.question}</CardTitle>
                        <CardDescription>{card.subject}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {card.confidence}% confidence
                      </Badge>
                      {card.nextReview && card.nextReview <= new Date() && (
                        <Badge variant="secondary" className="text-xs">
                          Due
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{card.answer}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {card.correctCount} correct, {card.incorrectCount} incorrect
                    </span>
                    <span>Next review: {card.nextReview ? card.nextReview.toLocaleDateString() : "Not scheduled"}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Overall Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Average Confidence</span>
                    <span className="text-sm font-semibold">
                      {Math.round(flashcards.reduce((acc, card) => acc + card.confidence, 0) / flashcards.length)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Cards Mastered</span>
                    <span className="text-sm font-semibold">
                      {flashcards.filter((card) => card.confidence >= 80).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Need Practice</span>
                    <span className="text-sm font-semibold">
                      {flashcards.filter((card) => card.confidence < 50).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Review Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Due Today</span>
                    <span className="text-sm font-semibold">
                      {flashcards.filter((card) => card.nextReview && card.nextReview <= new Date()).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Due This Week</span>
                    <span className="text-sm font-semibold">
                      {
                        flashcards.filter(
                          (card) =>
                            card.nextReview &&
                            card.nextReview <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) &&
                            card.nextReview > new Date(),
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Future Reviews</span>
                    <span className="text-sm font-semibold">
                      {
                        flashcards.filter(
                          (card) => card.nextReview && card.nextReview > new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                        ).length
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Subject Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Array.from(new Set(flashcards.map((card) => card.subject))).map((subject) => {
                    const subjectCards = flashcards.filter((card) => card.subject === subject)
                    const avgConfidence = Math.round(
                      subjectCards.reduce((acc, card) => acc + card.confidence, 0) / subjectCards.length,
                    )
                    return (
                      <div key={subject} className="flex justify-between">
                        <span className="text-sm text-muted-foreground">{subject}</span>
                        <span className={`text-sm font-semibold ${getConfidenceColor(avgConfidence)}`}>
                          {avgConfidence}%
                        </span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
