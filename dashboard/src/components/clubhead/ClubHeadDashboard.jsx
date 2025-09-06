"use client"

// src/components/ClubHeadDashboard.tsx
import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import StatsCard from "../StatsCard"

const ClubHeadDashboard = ({ currentView, setCurrentView }) => {
  const { currentUser } = useAuth()
  const [applications, setApplications] = useState([])
  const [recruitmentDrives, setRecruitmentDrives] = useState([])
  const [clubData, setClubData] = useState(null)
  const [selectedApp, setSelectedApp] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Profile management state
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    department: "",
    position: "",
    phone: "",
    bio: "",
    experience: "",
    specializations: "",
  })
  const [profileSaving, setProfileSaving] = useState(false)

  const mockApplications = [
    {
      id: "1",
      studentName: "John Smith",
      studentEmail: "john.smith@student.edu",
      status: "pending",
      createdAt: new Date("2024-01-15"),
      responses: {
        "Why do you want to join this club?":
          "I am passionate about computer science and want to contribute to the community.",
        "What skills can you bring?": "Programming in Python, Java, and web development experience.",
        "Previous experience?": "Led coding workshops at my previous school.",
      },
    },
    {
      id: "2",
      studentName: "Emily Davis",
      studentEmail: "emily.davis@student.edu",
      status: "under_review",
      createdAt: new Date("2024-01-14"),
      responses: {
        "Why do you want to join this club?":
          "I want to improve my technical skills and network with like-minded peers.",
        "What skills can you bring?": "Strong analytical skills and experience with data analysis.",
        "Previous experience?": "Participated in hackathons and coding competitions.",
      },
    },
    {
      id: "3",
      studentName: "Michael Chen",
      studentEmail: "michael.chen@student.edu",
      status: "accepted",
      createdAt: new Date("2024-01-13"),
      responses: {
        "Why do you want to join this club?":
          "Looking to collaborate on innovative projects and learn from experienced members.",
        "What skills can you bring?": "Mobile app development and UI/UX design.",
        "Previous experience?": "Developed several mobile apps and won a design competition.",
      },
    },
  ]

  const mockRecruitmentDrives = [
    {
      id: "1",
      title: "Spring 2024 Recruitment",
      description: "Open recruitment for new members interested in software development and AI projects.",
      isActive: true,
      createdAt: new Date("2024-01-10"),
      deadline: new Date("2024-02-15"),
      currentApplications: 15,
      maxApplications: 50,
      customQuestions: ["Why do you want to join this club?", "What skills can you bring?", "Previous experience?"],
    },
    {
      id: "2",
      title: "Hackathon Team Formation",
      description: "Special recruitment for upcoming inter-university hackathon participation.",
      isActive: false,
      createdAt: new Date("2024-01-05"),
      deadline: new Date("2024-01-20"),
      currentApplications: 8,
      maxApplications: 20,
      customQuestions: ["Programming languages you know?", "Hackathon experience?", "Team role preference?"],
    },
  ]

  const mockClubData = {
    name: "Computer Science Club",
    category: "Technical",
    description:
      "A community of computer science enthusiasts focused on learning, building projects, and fostering innovation in technology.",
    currentMembers: 45,
    maxMembers: 100,
  }

  useEffect(() => {
    const initializeData = async () => {
      if (!currentUser?.clubId) {
        setLoading(false)
        return
      }

      try {
        setError(null)
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setApplications(mockApplications)
        setRecruitmentDrives(mockRecruitmentDrives)
        setClubData(mockClubData)
      } catch (err) {
        setError("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    initializeData()
  }, [currentUser?.clubId])

  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        name: currentUser.name || "",
        email: currentUser.email || "",
        department: currentUser.department || "",
        position: currentUser.position || "Club Head",
        phone: currentUser.phone || "",
        bio: currentUser.bio || "",
        experience: currentUser.experience || "",
        specializations: currentUser.specializations || "",
      })
    }
  }, [currentUser])

  // Profile form handlers
  const handleProfileChange = (field, value) => {
    setProfileForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleProfileSave = async () => {
    setProfileSaving(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("[v0] Profile updated:", profileForm)

      alert("Profile updated successfully!")
      setIsEditingProfile(false)
    } catch (err) {
      alert("Failed to update profile. Please try again.")
    } finally {
      setProfileSaving(false)
    }
  }

  const cancelProfileEdit = () => {
    setProfileForm({
      name: currentUser.name || "",
      email: currentUser.email || "",
      department: currentUser.department || "",
      position: currentUser.position || "Club Head",
      phone: currentUser.phone || "",
      bio: currentUser.bio || "",
      experience: currentUser.experience || "",
      specializations: currentUser.specializations || "",
    })
    setIsEditingProfile(false)
  }

  const updateApplicationStatus = async (appId, newStatus) => {
    try {
      console.log("[v0] Updating application status:", { appId, newStatus })

      setApplications(
        applications.map((app) => (app.id === appId || app._id === appId ? { ...app, status: newStatus } : app)),
      )
      setSelectedApp(null)
      alert("Application status updated successfully!")
    } catch (error) {
      alert("Failed to update application status")
    }
  }

  const toggleDriveStatus = async (driveId, currentStatus) => {
    try {
      console.log("[v0] Toggling drive status:", { driveId, currentStatus })

      setRecruitmentDrives((drives) =>
        drives.map((drive) =>
          drive.id === driveId || drive._id === driveId ? { ...drive, isActive: !currentStatus } : drive,
        ),
      )

      alert(`Drive ${!currentStatus ? "activated" : "deactivated"} successfully!`)
    } catch (error) {
      alert("Failed to update drive status")
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">Loading dashboard...</span>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    )
  }

  // Calculate stats
  const stats = [
    {
      title: "Total Applications",
      value: applications.length.toString(),
      change: "+5",
      trend: "up",
      icon: {
        path: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
        bgColor: "bg-blue-500",
      },
    },
    {
      title: "Pending Review",
      value: applications.filter((app) => app.status === "pending").length.toString(),
      change: "0",
      trend: "up",
      icon: {
        path: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
        bgColor: "bg-yellow-500",
      },
    },
    {
      title: "Accepted",
      value: applications.filter((app) => app.status === "accepted").length.toString(),
      change: "+3",
      trend: "up",
      icon: {
        path: "M5 13l4 4L19 7",
        bgColor: "bg-green-500",
      },
    },
    {
      title: "Current Members",
      value: clubData?.currentMembers?.toString() || "0",
      change: "+8",
      trend: "up",
      icon: {
        path: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z",
        bgColor: "bg-purple-500",
      },
    },
  ]

  // Profile View
  if (currentView === "profile") {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Club Profile</h1>
          <div className="flex space-x-3">
            <button
              onClick={() => setCurrentView("dashboard")}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Back to Dashboard
            </button>
            {!isEditingProfile && (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            {isEditingProfile ? (
              // Edit Profile Form
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => handleProfileChange("name", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => handleProfileChange("email", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department/Faculty</label>
                    <select
                      value={profileForm.department}
                      onChange={(e) => handleProfileChange("department", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select Department</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                      <option value="Electronics & Communication">Electronics & Communication</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Student Affairs">Student Affairs</option>
                      <option value="Administration">Administration</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Position/Role</label>
                    <select
                      value={profileForm.position}
                      onChange={(e) => handleProfileChange("position", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select Position</option>
                      <option value="Club Head">Club Head</option>
                      <option value="Faculty Advisor">Faculty Advisor</option>
                      <option value="Assistant Professor">Assistant Professor</option>
                      <option value="Associate Professor">Associate Professor</option>
                      <option value="Professor">Professor</option>
                      <option value="Student Coordinator">Student Coordinator</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => handleProfileChange("phone", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio/About Me</label>
                  <textarea
                    rows={4}
                    value={profileForm.bio}
                    onChange={(e) => handleProfileChange("bio", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Tell us about yourself and your role as club head..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience & Background</label>
                  <textarea
                    rows={3}
                    value={profileForm.experience}
                    onChange={(e) => handleProfileChange("experience", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Your relevant experience, achievements, and background..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Areas of Expertise/Specializations (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={profileForm.specializations}
                    onChange={(e) => handleProfileChange("specializations", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Leadership, Project Management, Technical Writing, Event Planning"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={cancelProfileEdit}
                    disabled={profileSaving}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProfileSave}
                    disabled={profileSaving}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {profileSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            ) : (
              // View Profile
              <div className="space-y-6">
                <div className="flex items-center space-x-4 pb-6 border-b border-gray-200">
                  <div className="h-20 w-20 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-semibold text-indigo-600">
                      {(currentUser.name || "U").charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800">{currentUser.name || "Unknown User"}</h2>
                    <p className="text-gray-600">
                      {currentUser.position || "Club Head"} • {currentUser.department || "Department not specified"}
                    </p>
                    <p className="text-sm text-gray-500">Managing: {clubData?.name || "No club assigned"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-800">Contact Information</h3>

                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Email Address</span>
                        <p className="text-gray-800">{currentUser.email || "Not provided"}</p>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-gray-500">Phone Number</span>
                        <p className="text-gray-800">{currentUser.phone || "Not provided"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-800">Professional Information</h3>

                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Department/Faculty</span>
                        <p className="text-gray-800">{currentUser.department || "Not specified"}</p>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-gray-500">Position/Role</span>
                        <p className="text-gray-800">{currentUser.position || "Not specified"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {clubData && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Club Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Club Name:</span>
                        <p className="font-medium text-gray-800">{clubData.name}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Category:</span>
                        <p className="font-medium text-gray-800">{clubData.category}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Current Members:</span>
                        <p className="font-medium text-gray-800">
                          {clubData.currentMembers}/{clubData.maxMembers}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="text-gray-500 text-sm">Description:</span>
                      <p className="text-gray-800 text-sm mt-1">{clubData.description}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Recruitment Drive Management View
  if (currentView === "recruitment") {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Recruitment Drives</h1>
          <button
            onClick={() => setCurrentView("dashboard")}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Active Drives</h2>
          {recruitmentDrives.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No recruitment drives created yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recruitmentDrives.map((drive) => (
                <div key={drive._id || drive.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium text-gray-800">{drive.title}</h3>
                      <p className="text-sm text-gray-600">{drive.description}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        drive.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {drive.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Created:</span>
                      <p className="font-medium">{new Date(drive.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Deadline:</span>
                      <p className="font-medium">{new Date(drive.deadline).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Applications:</span>
                      <p className="font-medium">
                        {drive.currentApplications || 0}/{drive.maxApplications}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Questions:</span>
                      <p className="font-medium">{drive.customQuestions?.length || 0} questions</p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => toggleDriveStatus(drive._id || drive.id, drive.isActive)}
                      className={`px-3 py-1 text-sm rounded ${
                        drive.isActive
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                    >
                      {drive.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600">
                      View Applications
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Applications Management View
  if (currentView === "applications") {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Applications</h1>
          <button
            onClick={() => setCurrentView("dashboard")}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Recent Applications</h2>
          </div>

          {applications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No applications yet.</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {applications.map((app) => (
                <div key={app._id || app.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-medium text-gray-800">{app.studentName}</h3>
                      <p className="text-sm text-gray-600">{app.studentEmail}</p>
                      <p className="text-xs text-gray-500">
                        Applied {new Date(app.createdAt || app.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        app.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : app.status === "under_review"
                            ? "bg-blue-100 text-blue-800"
                            : app.status === "accepted"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                      }`}
                    >
                      {app.status?.replace("_", " ") || "pending"}
                    </span>
                  </div>

                  {selectedApp === (app._id || app.id) && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h4 className="font-medium text-gray-800 mb-3">Application Responses</h4>
                      {app.responses &&
                        Object.entries(app.responses).map(([question, answer]) => (
                          <div key={question} className="mb-3">
                            <p className="text-sm font-medium text-gray-700">{question}</p>
                            <p className="text-sm text-gray-600 mt-1">{answer}</p>
                          </div>
                        ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedApp(selectedApp === (app._id || app.id) ? null : app._id || app.id)}
                      className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                    >
                      {selectedApp === (app._id || app.id) ? "Hide Details" : "View Details"}
                    </button>

                    {app.status === "pending" && (
                      <>
                        <button
                          onClick={() => updateApplicationStatus(app._id || app.id, "under_review")}
                          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                        >
                          Under Review
                        </button>
                        <button
                          onClick={() => updateApplicationStatus(app._id || app.id, "accepted")}
                          className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateApplicationStatus(app._id || app.id, "rejected")}
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {app.status === "under_review" && (
                      <>
                        <button
                          onClick={() => updateApplicationStatus(app._id || app.id, "accepted")}
                          className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateApplicationStatus(app._id || app.id, "rejected")}
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  } // <-- THIS IS THE MISSING CLOSING BRACE

  // Main Dashboard View
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Club Head Dashboard</h1>
          <p className="text-gray-600">{clubData?.name || "No club assigned"}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => setCurrentView("applications")}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 text-left"
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                View Applications
              </div>
              <p className="text-sm text-green-100 mt-1 ml-8">Review and manage student applications</p>
            </button>

            <button
              onClick={() => setCurrentView("recruitment")}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-left"
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
                Recruitment Drives
              </div>
              <p className="text-sm text-blue-100 mt-1 ml-8">Manage recruitment campaigns</p>
            </button>

            <button
              onClick={() => setCurrentView("profile")}
              className="w-full px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-left"
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Club Profile
              </div>
              <p className="text-sm text-purple-100 mt-1 ml-8">View and edit club profile</p>
            </button>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Recent Applications</h2>
          {applications.slice(0, 3).length === 0 ? (
            <p className="text-gray-500">No recent applications</p>
          ) : (
            <div className="space-y-3">
              {applications.slice(0, 3).map((app) => (
                <div key={app._id || app.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{app.studentName}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(app.createdAt || app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      app.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : app.status === "accepted"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {app.status?.replace("_", " ") || "pending"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ClubHeadDashboard