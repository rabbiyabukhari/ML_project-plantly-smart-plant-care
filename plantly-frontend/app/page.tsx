"use client"

import type React from "react"

import { useState, useRef } from "react"
import {
  Upload,
  Camera,
  Loader2,
  Leaf,
  Info,
  Lightbulb,
  Sparkles,
  CheckCircle,
  BookOpen,
  SettingsIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Navigation } from "@/components/navigation"

interface PlantResult {
  plant_name: string
  common_names: string[]
  wiki_url: string
  description: string
  care_tips: string[]
}

const validateFile = (file: File): string | null => {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

  if (file.size > maxSize) {
    return "File size must be less than 10MB"
  }

  if (!allowedTypes.includes(file.type.toLowerCase())) {
    return "Please upload a valid image file (JPG, PNG, or WebP)"
  }

  return null
}

export default function PlantIdentifier() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [result, setResult] = useState<PlantResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentSection, setCurrentSection] = useState<"home" | "identify" | "guide" | "settings">("home")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  // Sample plant guide data
  const plantGuideData = [
    {
      name: "Rose",
      scientificName: "Rosa rubiginosa",
      description: "Beautiful flowering plant with thorny stems",
      care: ["Water regularly", "Full sun exposure", "Prune in winter"],
    },
    {
      name: "Sunflower",
      scientificName: "Helianthus annuus",
      description: "Large yellow flowers that follow the sun",
      care: ["Deep watering", "Full sun", "Rich soil"],
    },
    {
      name: "Lavender",
      scientificName: "Lavandula",
      description: "Aromatic herb with purple flowers",
      care: ["Well-drained soil", "Full sun", "Minimal watering"],
    },
  ]

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setResult(null)
    setError(null)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)
  }

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })
      setStream(mediaStream)
      setShowCamera(true)
      setError(null)

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
          videoRef.current.play()
        }
      }, 100)
    } catch (err) {
      console.error("Camera error:", err)
      setError("Unable to access camera. Please check permissions and try again.")
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) {
      setError("Camera not ready. Please try again.")
      return
    }

    const canvas = canvasRef.current
    const video = videoRef.current

    if (video.readyState !== 4) {
      setError("Camera is still loading. Please wait a moment and try again.")
      return
    }

    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480

    const ctx = canvas.getContext("2d")
    if (!ctx) {
      setError("Unable to capture photo. Please try again.")
      return
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `plant-photo-${Date.now()}.jpg`, {
            type: "image/jpeg",
          })
          handleFileSelect(file)
          stopCamera()
        } else {
          setError("Failed to capture photo. Please try again.")
        }
      },
      "image/jpeg",
      0.9,
    )
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setShowCamera(false)
  }

  const identifyPlant = async () => {
    if (!selectedFile) {
      setError("Please select an image first")
      return
    }

    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append("file", selectedFile)

    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        setResult(data)
      }
    } catch (err) {
      console.error("API Error:", err)
      setError("Failed to connect to the server. Make sure the backend is running on http://localhost:8000")
    } finally {
      setLoading(false)
    }
  }

  const clearUpload = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setResult(null)
    setError(null)
    setShowCamera(false)
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }

  const navigateToSection = (section: "home" | "identify" | "guide" | "settings") => {
    setCurrentSection(section)
    if (section === "identify") {
      setTimeout(() => {
        const element = document.getElementById("identify-section")
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      }, 100)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop")`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-green-800/30 to-teal-900/50" />
        <div className="absolute inset-0 backdrop-blur-[1px]" />
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-green-300/30 rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-3 h-3 bg-emerald-400/20 rounded-full animate-bounce" />
        <div className="absolute bottom-40 left-20 w-2 h-2 bg-teal-300/40 rounded-full animate-pulse" />
        <div className="absolute bottom-20 right-10 w-4 h-4 bg-green-200/30 rounded-full animate-bounce" />
      </div>

      {/* Content */}
      <div className="relative z-20">
        {/* Navigation Bar */}
        <Navigation onNavigate={navigateToSection} currentSection={currentSection} />

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Home Section */}
          {currentSection === "home" && (
            <div className="text-center mb-12 py-16">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium mb-6 animate-pulse border border-white/30">
                <Sparkles className="h-4 w-4" />
                AI-Powered Plant Recognition
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
                Discover the
                <span className="bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
                  {" "}
                  Magic{" "}
                </span>
                of Plants
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-lg mb-8">
                Upload a photo or capture an image to instantly identify any plant species and unlock expert care
                guidance
              </p>
              <Button
                onClick={() => navigateToSection("identify")}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-lg"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Get Started
              </Button>
            </div>
          )}

          {/* Identify Section */}
          {currentSection === "identify" && (
            <div id="identify-section" className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Plant Identification</h2>
                <p className="text-white/90 text-lg">Upload or capture a plant image to get started</p>
              </div>

              {!showCamera ? (
                <Card className="mb-8 border-0 shadow-2xl bg-white/95 backdrop-blur-lg">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Upload className="h-6 w-6 text-green-600" />
                      </div>
                      Upload Plant Image
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`
                        relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer
                        ${
                          isDragOver
                            ? "border-green-400 bg-green-50 scale-105"
                            : "border-gray-300 hover:border-green-400 hover:bg-green-50/50"
                        }
                      `}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-emerald-400/5 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300" />

                      {previewUrl ? (
                        <div className="space-y-6 relative z-10">
                          <div className="relative inline-block">
                            <img
                              src={previewUrl || "/placeholder.svg"}
                              alt="Preview"
                              className="max-h-80 mx-auto rounded-xl shadow-lg ring-4 ring-green-100"
                            />
                            <div className="absolute -top-2 -right-2 bg-green-500 text-white p-2 rounded-full">
                              <CheckCircle className="h-5 w-5" />
                            </div>
                          </div>
                          <div>
                            <p className="text-lg font-medium text-gray-700 mb-2">Image Ready for Analysis</p>
                            <p className="text-sm text-gray-500">Click to change image or drag and drop a new one</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6 relative z-10">
                          <div className="relative">
                            <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
                              <Upload className="h-12 w-12 text-green-600" />
                            </div>
                            {isDragOver && (
                              <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75" />
                            )}
                          </div>
                          <div>
                            <p className="text-2xl font-semibold text-gray-800 mb-2">Drop your plant image here</p>
                            <p className="text-gray-500">or click to browse files • JPG, PNG, WebP up to 10MB</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="h-14 text-lg font-medium border-2 hover:border-green-400 hover:bg-green-50 transition-all duration-200"
                      >
                        <Upload className="h-5 w-5 mr-3" />
                        Choose File
                      </Button>
                      <Button
                        onClick={startCamera}
                        variant="outline"
                        className="h-14 text-lg font-medium border-2 hover:border-green-400 hover:bg-green-50 transition-all duration-200"
                      >
                        <Camera className="h-5 w-5 mr-3" />
                        Take Photo
                      </Button>
                    </div>

                    {selectedFile && (
                      <Button
                        onClick={identifyPlant}
                        disabled={loading}
                        className="w-full mt-8 h-16 text-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                            <span className="animate-pulse">Analyzing Plant...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-6 w-6 mr-3" />
                            Identify Plant with AI
                          </>
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="mb-8 border-0 shadow-2xl bg-white/95 backdrop-blur-lg">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Camera className="h-6 w-6 text-green-600" />
                      </div>
                      Camera Capture
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="relative">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full max-w-lg mx-auto rounded-2xl shadow-lg bg-gray-100 ring-4 ring-green-100"
                          style={{ aspectRatio: "4/3" }}
                        />
                        {!stream && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl">
                            <div className="text-center">
                              <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
                              <p className="text-gray-600 font-medium">Initializing Camera...</p>
                            </div>
                          </div>
                        )}

                        {stream && (
                          <div className="absolute inset-4 border-2 border-white/50 rounded-xl pointer-events-none">
                            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white rounded-tl-lg" />
                            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white rounded-tr-lg" />
                            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white rounded-bl-lg" />
                            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white rounded-br-lg" />
                          </div>
                        )}
                      </div>
                      <canvas ref={canvasRef} className="hidden" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button
                          onClick={capturePhoto}
                          disabled={!stream}
                          className="h-14 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Camera className="h-5 w-5 mr-3" />
                          {!stream ? "Loading Camera..." : "Capture Photo"}
                        </Button>
                        <Button
                          onClick={stopCamera}
                          variant="outline"
                          className="h-14 text-lg font-medium border-2 hover:border-red-400 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {error && (
                <Alert className="mb-8 border-red-200 bg-red-50/90 backdrop-blur-sm shadow-lg">
                  <AlertDescription className="text-red-700 font-medium">{error}</AlertDescription>
                </Alert>
              )}

              {result && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
                  <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-1">
                      <div className="bg-white rounded-t-lg">
                        <CardHeader className="pb-6">
                          <CardTitle className="flex items-center gap-3 text-2xl">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <Leaf className="h-6 w-6 text-green-600" />
                            </div>
                            Plant Identification Results
                            <div className="ml-auto">
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                <Sparkles className="h-3 w-3 mr-1" />
                                AI Identified
                              </Badge>
                            </div>
                          </CardTitle>
                        </CardHeader>
                      </div>
                    </div>
                    <CardContent className="pt-6">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-3xl font-bold text-gray-900 mb-4">{result.plant_name}</h2>
                          {result.common_names.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                              {result.common_names.map((name, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="px-3 py-1 text-sm bg-green-100 text-green-800 hover:bg-green-200"
                                >
                                  {name}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        {result.description && (
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                            <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-800 mb-3">
                              <Info className="h-5 w-5 text-blue-600" />
                              Description
                            </h3>
                            <p className="text-gray-700 leading-relaxed text-lg">{result.description}</p>
                          </div>
                        )}

                        {result.wiki_url && (
                          <div>
                            <a
                              href={result.wiki_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-lg hover:underline transition-colors"
                            >
                              Learn more on Wikipedia →
                            </a>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {result.care_tips.length > 0 && (
                    <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-lg overflow-hidden">
                      <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-1">
                        <div className="bg-white rounded-t-lg">
                          <CardHeader className="pb-6">
                            <CardTitle className="flex items-center gap-3 text-2xl">
                              <div className="p-2 bg-amber-100 rounded-lg">
                                <Lightbulb className="h-6 w-6 text-amber-600" />
                              </div>
                              Expert Care Tips
                            </CardTitle>
                          </CardHeader>
                        </div>
                      </div>
                      <CardContent className="pt-6">
                        <div className="grid gap-4">
                          {result.care_tips.map((tip, index) => (
                            <div
                              key={index}
                              className="group p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-l-4 border-green-400 hover:shadow-md transition-all duration-200 hover:scale-105"
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                                  {index + 1}
                                </div>
                                <p className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">
                                  {tip}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Plant Guide Section */}
          {currentSection === "guide" && (
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Plant Care Guide</h2>
                <p className="text-white/90 text-lg">Learn how to care for different types of plants</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plantGuideData.map((plant, index) => (
                  <Card
                    key={index}
                    className="border-0 shadow-xl bg-white/95 backdrop-blur-lg hover:scale-105 transition-all duration-300"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-700">
                        <BookOpen className="h-5 w-5" />
                        {plant.name}
                      </CardTitle>
                      <p className="text-sm text-gray-500 italic">{plant.scientificName}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">{plant.description}</p>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-800">Care Tips:</h4>
                        <ul className="space-y-1">
                          {plant.care.map((tip, tipIndex) => (
                            <li key={tipIndex} className="text-sm text-gray-600 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Settings Section */}
          {currentSection === "settings" && (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Settings</h2>
                <p className="text-white/90 text-lg">Manage your plant identification preferences</p>
              </div>

              <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <SettingsIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    Application Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-gray-800">Clear Upload Data</h3>
                        <p className="text-sm text-gray-600">Remove all uploaded images and results</p>
                      </div>
                      <Button
                        onClick={clearUpload}
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                      >
                        Clear Data
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-gray-800">Image Quality</h3>
                        <p className="text-sm text-gray-600">High quality for better identification</p>
                      </div>
                      <Badge variant="secondary">High</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-gray-800">Auto-save Results</h3>
                        <p className="text-sm text-gray-600">Automatically save identification results</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <Button
                      onClick={() => navigateToSection("identify")}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Go to Plant Identification
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
