"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Languages, ArrowRight, Copy, Volume2, Download } from "lucide-react"

interface MultiLanguageSystemProps {
  apiKey?: string
}

export function MultiLanguageSystem({ apiKey }: MultiLanguageSystemProps) {
  const [sourceText, setSourceText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [sourceLang, setSourceLang] = useState("en")
  const [targetLang, setTargetLang] = useState("es")
  const [isTranslating, setIsTranslating] = useState(false)

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "de", name: "German", flag: "🇩🇪" },
    { code: "it", name: "Italian", flag: "🇮🇹" },
    { code: "pt", name: "Portuguese", flag: "🇵🇹" },
    { code: "ru", name: "Russian", flag: "🇷🇺" },
    { code: "ja", name: "Japanese", flag: "🇯🇵" },
    { code: "ko", name: "Korean", flag: "🇰🇷" },
    { code: "zh", name: "Chinese", flag: "🇨🇳" },
  ]

  const translateText = async () => {
    if (!sourceText.trim()) return

    setIsTranslating(true)

    console.log("[v0] Translating with API key:", apiKey ? "API key provided" : "No API key")

    // Simulate translation API call
    setTimeout(() => {
      const mockTranslations = {
        "Hello, how are you?": "Hola, ¿cómo estás?",
        "I am studying for my exam": "Estoy estudiando para mi examen",
        "The quick brown fox jumps over the lazy dog": "El zorro marrón rápido salta sobre el perro perezoso",
      }

      setTranslatedText(
        mockTranslations[sourceText as keyof typeof mockTranslations] ||
          `[Translated to ${languages.find((l) => l.code === targetLang)?.name}]: ${sourceText}`,
      )
      setIsTranslating(false)
    }, 1500)
  }

  const recentTranslations = [
    { source: "Hello, how are you?", target: "Hola, ¿cómo estás?", from: "en", to: "es" },
    { source: "Good morning", target: "Bonjour", from: "en", to: "fr" },
    { source: "Thank you", target: "Danke", from: "en", to: "de" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Multi-Language Translator</h2>
          <p className="text-muted-foreground mt-2">Translate your study materials into multiple languages</p>
        </div>
        <Badge variant="secondary">{apiKey ? "Connected" : "Demo Mode"}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Languages className="h-5 w-5 mr-2" />
                Translator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Select value={sourceLang} onValueChange={setSourceLang}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <ArrowRight className="h-4 w-4 text-muted-foreground" />

                <Select value={targetLang} onValueChange={setTargetLang}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Source Text</label>
                  <Textarea
                    placeholder="Enter text to translate..."
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value)}
                    className="min-h-32"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Translation</label>
                  <Textarea
                    placeholder="Translation will appear here..."
                    value={translatedText}
                    readOnly
                    className="min-h-32 bg-muted"
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  onClick={translateText}
                  disabled={!sourceText.trim() || isTranslating}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isTranslating ? "Translating..." : "Translate"}
                </Button>

                {translatedText && (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm">
                      <Volume2 className="h-4 w-4 mr-2" />
                      Listen
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Translations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentTranslations.map((translation, index) => (
                <div key={index} className="p-3 bg-muted rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {languages.find((l) => l.code === translation.from)?.flag}{" "}
                      {languages.find((l) => l.code === translation.from)?.name}
                    </span>
                    <ArrowRight className="h-3 w-3" />
                    <span>
                      {languages.find((l) => l.code === translation.to)?.flag}{" "}
                      {languages.find((l) => l.code === translation.to)?.name}
                    </span>
                  </div>
                  <p className="text-sm font-medium">{translation.source}</p>
                  <p className="text-sm text-muted-foreground">{translation.target}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Languages className="h-4 w-4 mr-2" />
                Translate Document
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Volume2 className="h-4 w-4 mr-2" />
                Voice Translation
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Export Translations
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
