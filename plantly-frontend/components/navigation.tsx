"use client"

import { useState } from "react"
import { Leaf, Menu, X, Home, Search, BookOpen, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavigationProps {
  onNavigate: (section: "home" | "identify" | "guide" | "settings") => void
  currentSection: "home" | "identify" | "guide" | "settings"
}

export function Navigation({ onNavigate, currentSection }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleNavigation = (section: "home" | "identify" | "guide" | "settings") => {
    onNavigate(section)
    setMobileMenuOpen(false)
  }

  return (
    <nav className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavigation("home")}>
            <div className="relative">
              <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white/30">
                <Leaf className="h-7 w-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse" />
            </div>
            <div>
              <span className="text-3xl font-bold text-white drop-shadow-lg">Plantly</span>
              <div className="text-xs text-white/80 font-medium">AI Plant Identifier</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleNavigation("home")}
              className={`group flex items-center space-x-2 font-semibold relative transition-all duration-200 ${
                currentSection === "home" ? "text-white" : "text-white/80 hover:text-white"
              }`}
            >
              <Home className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span>Home</span>
              {currentSection === "home" && (
                <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-white rounded-full" />
              )}
            </button>
            <button
              onClick={() => handleNavigation("identify")}
              className={`group flex items-center space-x-2 font-medium transition-all duration-200 ${
                currentSection === "identify" ? "text-white" : "text-white/80 hover:text-white"
              }`}
            >
              <Search className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span>Identify</span>
              {currentSection === "identify" && (
                <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-white rounded-full" />
              )}
            </button>
            <button
              onClick={() => handleNavigation("guide")}
              className={`group flex items-center space-x-2 font-medium transition-all duration-200 ${
                currentSection === "guide" ? "text-white" : "text-white/80 hover:text-white"
              }`}
            >
              <BookOpen className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span>Plant Guide</span>
              {currentSection === "guide" && (
                <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-white rounded-full" />
              )}
            </button>
            <button
              onClick={() => handleNavigation("settings")}
              className={`group flex items-center space-x-2 font-medium transition-all duration-200 ${
                currentSection === "settings" ? "text-white" : "text-white/80 hover:text-white"
              }`}
            >
              <Settings className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span>Settings</span>
              {currentSection === "settings" && (
                <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-white rounded-full" />
              )}
            </button>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button
              onClick={() => handleNavigation("identify")}
              className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/30"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-white/20 bg-white/10 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => handleNavigation("home")}
                className={`flex items-center space-x-3 py-3 px-4 rounded-xl transition-all duration-200 text-left ${
                  currentSection === "home"
                    ? "text-white font-semibold bg-white/20"
                    : "text-white/80 hover:text-white hover:bg-white/20"
                }`}
              >
                <Home className="h-5 w-5" />
                <span>Home</span>
              </button>
              <button
                onClick={() => handleNavigation("identify")}
                className={`flex items-center space-x-3 py-3 px-4 rounded-xl transition-all duration-200 text-left ${
                  currentSection === "identify"
                    ? "text-white font-semibold bg-white/20"
                    : "text-white/80 hover:text-white hover:bg-white/20"
                }`}
              >
                <Search className="h-5 w-5" />
                <span>Identify</span>
              </button>
              <button
                onClick={() => handleNavigation("guide")}
                className={`flex items-center space-x-3 py-3 px-4 rounded-xl transition-all duration-200 text-left ${
                  currentSection === "guide"
                    ? "text-white font-semibold bg-white/20"
                    : "text-white/80 hover:text-white hover:bg-white/20"
                }`}
              >
                <BookOpen className="h-5 w-5" />
                <span>Plant Guide</span>
              </button>
              <button
                onClick={() => handleNavigation("settings")}
                className={`flex items-center space-x-3 py-3 px-4 rounded-xl transition-all duration-200 text-left ${
                  currentSection === "settings"
                    ? "text-white font-semibold bg-white/20"
                    : "text-white/80 hover:text-white hover:bg-white/20"
                }`}
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </button>
              <div className="pt-4 border-t border-white/20">
                <Button
                  onClick={() => handleNavigation("identify")}
                  className="w-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/30"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
