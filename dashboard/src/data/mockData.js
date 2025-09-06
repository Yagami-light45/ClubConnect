// src/data/mockData.js

// ========================
// Constants & Enums
// ========================
export const ROLES = {
  ADMIN: "admin",
  CLUB_HEAD: "clubhead",
  STUDENT: "student",
};

export const APPLICATION_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

export const CLUB_STATUS = {
  ACTIVE: "active",
  RECRUITING: "recruiting",
  INACTIVE: "inactive",
};

// ========================
// Demo Users (with credentials for auth)
// ========================
export const DEMO_USERS = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@college.edu",
    password: "admin123", // MOCK ONLY, do not use plain text in prod
    role: ROLES.ADMIN,
    avatar:
      "https://ui-avatars.com/api/?name=Admin+User&background=3b82f6&color=white",
  },
  {
    id: 2,
    name: "Tech Club Head",
    email: "tech.head@college.edu",
    password: "tech123",
    role: ROLES.CLUB_HEAD,
    avatar:
      "https://ui-avatars.com/api/?name=Tech+Club+Head&background=10b981&color=white",
    clubId: 1,
  },
  {
    id: 3,
    name: "Drama Club Head",
    email: "drama.head@college.edu",
    password: "drama123",
    role: ROLES.CLUB_HEAD,
    avatar:
      "https://ui-avatars.com/api/?name=Drama+Club+Head&background=f59e0b&color=white",
    clubId: 2,
  },
  {
    id: 4,
    name: "John Student",
    email: "john.student@college.edu",
    password: "student123",
    role: ROLES.STUDENT,
    avatar:
      "https://ui-avatars.com/api/?name=John+Student&background=8b5cf6&color=white",
  },
];

// ========================
// Mock Auth Service
// ========================
export const mockAuthService = {
  login: async (email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = DEMO_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      return {
        success: true,
        token: `mock-token-${user.id}-${Date.now()}`,
        user: { ...user, password: undefined }, // never return password
      };
    }

    return {
      success: false,
      error: "Invalid email or password",
    };
  },

  register: async (userData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!userData.email || !userData.password || !userData.name) {
      return {
        success: false,
        error: "All fields are required",
      };
    }

    const newUser = {
      id: Date.now(),
      email: userData.email,
      name: userData.name,
      password: userData.password,
      role: userData.role || ROLES.STUDENT,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        userData.name
      )}&background=8b5cf6&color=white`,
    };

    DEMO_USERS.push(newUser);

    return {
      success: true,
      token: `mock-token-${newUser.id}`,
      user: { ...newUser, password: undefined },
    };
  },
};

// ========================
// Mock Data Sets
// ========================
export const mockUsers = [
  {
    id: 101,
    name: "Alice Johnson",
    email: "alice@college.edu",
    role: ROLES.STUDENT,
    status: "active",
    joinedDate: "2024-01-15",
    clubs: ["Tech Club", "Photography Club"],
  },
  {
    id: 102,
    name: "Bob Smith",
    email: "bob@college.edu",
    role: ROLES.CLUB_HEAD,
    status: "active",
    joinedDate: "2023-09-01",
    clubs: ["Drama Club"],
  },
  {
    id: 103,
    name: "Carol Davis",
    email: "carol@college.edu",
    role: ROLES.STUDENT,
    status: "active",
    joinedDate: "2024-02-20",
    clubs: ["Music Club"],
  },
];

export const mockStats = {
  totalUsers: 120,
  activeClubs: 8,
  totalApplications: 45,
  approvedApplications: 20,
  pendingApplications: 15,
  rejectedApplications: 10,
};

export const mockClubs = [
  {
    id: 1,
    name: "Tech Club",
    description: "Programming and technology enthusiasts",
    category: "Technical",
    head: "Tech Club Head",
    headId: 2,
    members: 45,
    maxMembers: 50,
    status: CLUB_STATUS.ACTIVE,
    requirements: "Basic programming knowledge preferred",
    meetingSchedule: "Fridays 4:00 PM",
    location: "Computer Lab",
  },
  {
    id: 2,
    name: "Drama Club",
    description: "Theater and performing arts",
    category: "Cultural",
    head: "Drama Club Head",
    headId: 3,
    members: 30,
    maxMembers: 40,
    status: CLUB_STATUS.ACTIVE,
    requirements: "Interest in acting and theater",
    meetingSchedule: "Wednesdays 3:30 PM",
    location: "Auditorium",
  },
  {
    id: 3,
    name: "Photography Club",
    description: "Capture moments and learn photography",
    category: "Creative",
    head: "Sarah Wilson",
    headId: 5,
    members: 25,
    maxMembers: 35,
    status: CLUB_STATUS.RECRUITING,
    requirements: "Own camera or smartphone",
    meetingSchedule: "Saturdays 2:00 PM",
    location: "Art Room",
  },
];

export const mockRecruitmentDrives = [
  {
    id: 1,
    clubId: 1,
    clubName: "Tech Club",
    title: "Winter Recruitment 2024",
    description:
      "Looking for passionate programmers and tech enthusiasts",
    startDate: "2024-01-10",
    endDate: "2024-01-31",
    status: "active",
    applicants: 23,
    maxPositions: 15,
    requirements: [
      "Basic programming skills",
      "Commitment to attend meetings",
      "Team player attitude",
    ],
  },
  {
    id: 2,
    clubId: 2,
    clubName: "Drama Club",
    title: "Spring Theater Auditions",
    description: "Auditions for upcoming spring theater production",
    startDate: "2024-02-01",
    endDate: "2024-02-15",
    status: "active",
    applicants: 18,
    maxPositions: 12,
    requirements: [
      "Previous acting experience preferred",
      "Flexible schedule",
      "Comfortable performing",
    ],
  },
];

export const mockApplications = [
  {
    id: 1,
    studentId: 4,
    studentName: "John Student",
    studentEmail: "john.student@college.edu",
    clubId: 1,
    clubName: "Tech Club",
    recruitmentId: 1,
    applicationDate: "2024-01-12",
    status: APPLICATION_STATUS.PENDING,
    motivation:
      "I'm passionate about programming and want to learn more about web development.",
    experience:
      "I have basic knowledge of JavaScript and Python from coursework.",
    skills: ["JavaScript", "Python", "HTML/CSS"],
  },
  {
    id: 2,
    studentId: 4,
    studentName: "John Student",
    studentEmail: "john.student@college.edu",
    clubId: 2,
    clubName: "Drama Club",
    recruitmentId: 2,
    applicationDate: "2024-02-03",
    status: APPLICATION_STATUS.APPROVED,
    motivation: "I love theater and have been acting since high school.",
    experience:
      "Participated in 3 high school plays, lead role in Romeo and Juliet.",
    skills: ["Acting", "Voice projection", "Stage presence"],
  },
];

export const mockNotifications = [
  {
    id: 1,
    userId: 4,
    title: "Application Approved!",
    message:
      "Your application to Drama Club has been approved. Welcome to the club!",
    type: "success",
    timestamp: "2024-02-05T10:30:00Z",
    read: false,
    actionUrl: "/applications",
  },
  {
    id: 2,
    userId: 4,
    title: "New Recruitment Open",
    message:
      "Photography Club is now accepting new members. Apply now!",
    type: "info",
    timestamp: "2024-02-04T14:15:00Z",
    read: false,
    actionUrl: "/browse-clubs",
  },
  {
    id: 3,
    userId: 4,
    title: "Application Under Review",
    message: "Your application to Tech Club is currently being reviewed.",
    type: "info",
    timestamp: "2024-01-13T09:00:00Z",
    read: true,
    actionUrl: "/applications",
  },
];
