"use client"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Users,
  Calendar,
  Trophy,
  ArrowRight,
  Sparkles,
  Target,
  Zap,
  Menu,
  X,
} from "lucide-react"

export default function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-10">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer home-logo"
            onClick={() => scrollToSection("home")}
          >
            <div className="flex items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 p-1 shadow-md">
              <Users className="h-8 w-8 text-white" />
            </div>
            <span className="font-extrabold tracking-tight bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent select-none">
              Club Connect
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex desktop-menu items-center space-x-8 text-gray-700 font-medium tracking-wide">
            {["home", "features", "process", "about"].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className="relative px-2 py-1 hover:text-cyan-600 transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-cyan-600 after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100"
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="signup-btn rounded-md bg-cyan-500 font-semibold text-white shadow-md hover:bg-cyan-600 transition"
            >
              Sign Up
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="container mx-auto flex flex-col space-y-2 py-4 px-6 text-lg font-medium">
              {["home", "features", "process", "about"].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className="w-full text-left py-2 rounded hover:bg-gray-100 transition"
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  navigate("/login")
                }}
                className="w-full text-left py-2 rounded hover:bg-gray-100 transition"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Home Section */}
      <section
        id="home"
        className="relative py-20 overflow-hidden bg-white flex-grow"
      >
        {/* Decorative Blurs */}
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-cyan-200 rounded-full filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute -bottom-16 -right-10 w-72 h-72 bg-blue-200 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

        <div className="container mx-auto max-w-4xl text-center px-6">
          <div className="inline-flex items-center mb-5 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold tracking-wide shadow-md hero-badge">
            <Sparkles className="w-5 h-5 mr-2" />
            Connect • Recruit • Grow
          </div>
          <h1 className="hero-heading font-extrabold leading-tight max-w-3xl mx-auto text-gray-900">
            Where College Clubs Meet Their Perfect{" "}
            <span className="block mt-2 text-cyan-600">Members</span>
          </h1>
          <p className="hero-subheading mt-6 max-w-2xl mx-auto text-gray-700">
            Streamline your club recruitment process from application to acceptance. Connect with passionate students and build thriving communities on campus.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="hero-button mt-12 inline-flex items-center gap-3 rounded-full bg-cyan-500 px-8 py-4 font-semibold text-white shadow-md hover:bg-cyan-600 transition transform hover:scale-105"
          >
            Connect with Us <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
              Everything you need for club management
            </h2>
            <p className="text-gray-600 text-lg max-w-xl mx-auto">
              From recruitment to member management, we've got you covered
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <div className="group rounded-2xl bg-white p-8 shadow-lg hover:shadow-xl transition duration-300 border border-transparent hover:border-cyan-400 cursor-pointer">
              <div className="w-14 h-14 mb-6 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white transition-transform group-hover:scale-110">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Smart Recruitment</h3>
              <p className="text-gray-600">
                Automated application processing with customizable forms and approval workflows.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group rounded-2xl bg-white p-8 shadow-lg hover:shadow-xl transition duration-300 border border-transparent hover:border-blue-400 cursor-pointer">
              <div className="w-14 h-14 mb-6 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white transition-transform group-hover:scale-110">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Event Management</h3>
              <p className="text-gray-600">
                Easy event scheduling, notifications, and attendee tracking.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group rounded-2xl bg-white p-8 shadow-lg hover:shadow-xl transition duration-300 border border-transparent hover:border-cyan-400 cursor-pointer">
              <div className="w-14 h-14 mb-6 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white transition-transform group-hover:scale-110">
                <Trophy className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Achievements & Rewards</h3>
              <p className="text-gray-600">
                Track and celebrate member milestones and accomplishments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Our Process</h2>
            <p className="text-gray-600 text-lg max-w-xl mx-auto">
              Simple, effective, and transparent recruitment and management.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
            {[
              {
                icon: Zap,
                title: "Step 1",
                desc: "Join the platform and create your club profile",
                color: "text-cyan-500",
              },
              {
                icon: Target,
                title: "Step 2",
                desc: "Post recruitment events and application forms",
                color: "text-blue-500",
              },
              {
                icon: Users,
                title: "Step 3",
                desc: "Connect with interested members and grow your community",
                color: "text-cyan-500",
              },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="text-center p-8 rounded-xl bg-gray-50 shadow-md hover:shadow-lg transition cursor-default"
              >
                <Icon className={`mx-auto mb-5 w-12 h-12 ${color}`} />
                <h3 className="text-2xl font-semibold mb-2 text-gray-900">{title}</h3>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-6">About Club Connect</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Club Connect was built to bridge the gap between student organizations and eager
            participants. Our mission is to simplify the recruitment process and foster vibrant,
            connected communities.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto max-w-7xl px-6 text-center text-gray-500 text-sm select-none">
          &copy; {new Date().getFullYear()} Club Connect. All rights reserved.
        </div>
      </footer>

      {/* Animations and custom styles */}
      <style>{`
      @media (max-width: 350px) {
  .signup-btn {
    display: none !important;
  }
}

        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -20px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }

        /* Fluid font sizes */
        .home-logo {
          font-size: clamp(1.125rem, 4vw, 1.5rem); /* 18px to 24px */
        }
        .desktop-menu button {
          font-size: clamp(0.875rem, 3vw, 1.125rem); /* 14px to 18px */
        }
        .signup-btn {
          font-size: clamp(0.875rem, 3vw, 1rem); /* 14px to 16px */
          padding-left: clamp(0.5rem, 1vw, 1rem);
          padding-right: clamp(0.5rem, 1vw, 1rem);
          padding-top: clamp(0.25rem, 0.5vw, 0.5rem);
          padding-bottom: clamp(0.25rem, 0.5vw, 0.5rem);
        }

        /* Hero Section Fluid Text */
        .hero-badge {
          font-size: clamp(0.75rem, 2vw, 1rem); /* 12px to 16px */
          padding-left: clamp(0.5rem, 1vw, 1rem);
          padding-right: clamp(0.5rem, 1vw, 1rem);
          padding-top: clamp(0.25rem, 0.5vw, 0.5rem);
          padding-bottom: clamp(0.25rem, 0.5vw, 0.5rem);
        }
        .hero-heading {
          font-size: clamp(2.25rem, 5vw, 3.75rem); /* 36px to 60px */
          line-height: 1.1;
        }
        .hero-heading span {
          font-size: clamp(2.5rem, 5vw, 4rem); /* Slightly bigger highlight */
        }
        .hero-subheading {
          font-size: clamp(1rem, 2.5vw, 1.25rem); /* 16px to 20px */
          margin-top: 1.5rem;
        }
        .hero-button {
          font-size: clamp(1rem, 2.5vw, 1.25rem); /* 16px to 20px */
          padding-left: clamp(1.5rem, 3vw, 2rem);
          padding-right: clamp(1.5rem, 3vw, 2rem);
          padding-top: clamp(0.75rem, 1.5vw, 1rem);
          padding-bottom: clamp(0.75rem, 1.5vw, 1rem);
        }

        /* Ensure nav container keeps padding from edges */
        nav > div.container {
          padding-left: 1rem; /* 16px */
          padding-right: 1rem;
        }
      `}</style>
    </div>
  )
}
