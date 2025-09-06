// src/data/mockData.js
export const ROLES = {
  ADMIN: 'ADMIN',
  CLUB_HEAD: 'CLUB_HEAD',
  STUDENT: 'STUDENT'
};

export const APPLICATION_STATUS = {
  PENDING: 'PENDING',
  UNDER_REVIEW: 'UNDER_REVIEW',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED'
};

export const CLUB_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

// Mock Clubs Data
export const mockClubs = [
  {
    id: 1,
    name: 'Tech Innovation Club',
    description: 'A club focused on emerging technologies and innovation',
    category: 'Technical',
    status: CLUB_STATUS.APPROVED,
    headId: 2,
    headName: 'Tech Club Head',
    maxMembers: 50,
    currentMembers: 23,
    requirements: 'Basic programming knowledge preferred',
    image: 'https://via.placeholder.com/300x200?text=Tech+Club',
    createdAt: '2024-01-15',
    isRecruiting: true
  },
  {
    id: 2,
    name: 'Drama Society',
    description: 'Explore the world of theater and performing arts',
    category: 'Arts',
    status: CLUB_STATUS.APPROVED,
    headId: 3,
    headName: 'Drama Club Head',
    maxMembers: 30,
    currentMembers: 18,
    requirements: 'Passion for acting and theater',
    image: 'https://via.placeholder.com/300x200?text=Drama+Club',
    createdAt: '2024-01-10',
    isRecruiting: true
  },
  {
    id: 3,
    name: 'Photography Club',
    description: 'Capture moments and learn advanced photography techniques',
    category: 'Creative',
    status: CLUB_STATUS.PENDING,
    headId: null,
    headName: null,
    maxMembers: 25,
    currentMembers: 0,
    requirements: 'Own camera equipment preferred',
    image: 'https://via.placeholder.com/300x200?text=Photo+Club',
    createdAt: '2024-02-01',
    isRecruiting: false
  }
];

// Mock Applications Data
export const mockApplications = [
  {
    id: 1,
    studentId: 4,
    studentName: 'John Doe',
    studentEmail: 'john.student@college.edu',
    clubId: 1,
    clubName: 'Tech Innovation Club',
    status: APPLICATION_STATUS.PENDING,
    appliedAt: '2024-02-10T10:00:00Z',
    responses: {
      'Why do you want to join?': 'I am passionate about technology and want to contribute to innovative projects.',
      'Previous experience': 'Built several web applications using React and Node.js',
      'Time commitment': 'Can dedicate 10-15 hours per week'
    },
    resumeUrl: null
  },
  {
    id: 2,
    studentId: 5,
    studentName: 'Jane Smith',
    studentEmail: 'jane.student@college.edu',
    clubId: 1,
    clubName: 'Tech Innovation Club',
    status: APPLICATION_STATUS.UNDER_REVIEW,
    appliedAt: '2024-02-08T14:30:00Z',
    responses: {
      'Why do you want to join?': 'I want to learn new technologies and work on real-world projects.',
      'Previous experience': 'Completed several online courses in Python and machine learning',
      'Time commitment': 'Can dedicate 8-12 hours per week'
    },
    resumeUrl: null
  },
  {
    id: 3,
    studentId: 4,
    studentName: 'John Doe',
    studentEmail: 'john.student@college.edu',
    clubId: 2,
    clubName: 'Drama Society',
    status: APPLICATION_STATUS.ACCEPTED,
    appliedAt: '2024-01-25T16:00:00Z',
    responses: {
      'Acting experience': 'Participated in high school theater productions for 3 years',
      'Favorite genre': 'Contemporary drama and classical theater',
      'Time availability': 'Available for evening rehearsals and weekend performances'
    },
    resumeUrl: null
  }
];

// Mock Recruitment Drives
export const mockRecruitmentDrives = [
  {
    id: 1,
    clubId: 1,
    title: 'Spring 2024 Recruitment',
    description: 'Looking for passionate tech enthusiasts to join our innovation projects',
    startDate: '2024-02-01',
    endDate: '2024-02-28',
    maxApplications: 20,
    currentApplications: 12,
    isActive: true,
    questions: [
      {
        id: 1,
        question: 'Why do you want to join?',
        type: 'textarea',
        required: true
      },
      {
        id: 2,
        question: 'Previous experience',
        type: 'textarea',
        required: false
      },
      {
        id: 3,
        question: 'Time commitment',
        type: 'text',
        required: true
      }
    ]
  },
  {
    id: 2,
    clubId: 2,
    title: 'Winter Drama Auditions',
    description: 'Auditions for our upcoming winter production',
    startDate: '2024-01-20',
    endDate: '2024-02-15',
    maxApplications: 15,
    currentApplications: 8,
    isActive: true,
    questions: [
      {
        id: 1,
        question: 'Acting experience',
        type: 'textarea',
        required: true
      },
      {
        id: 2,
        question: 'Favorite genre',
        type: 'text',
        required: false
      },
      {
        id: 3,
        question: 'Time availability',
        type: 'textarea',
        required: true
      }
    ]
  }
];

// Mock Notifications
export const mockNotifications = [
  {
    id: 1,
    userId: 4,
    title: 'Application Status Update',
    message: 'Your application to Drama Society has been accepted!',
    type: 'success',
    read: false,
    createdAt: '2024-02-12T09:00:00Z'
  },
  {
    id: 2,
    userId: 4,
    title: 'New Club Available',
    message: 'Photography Club is now accepting applications',
    type: 'info',
    read: true,
    createdAt: '2024-02-10T14:00:00Z'
  },
  {
    id: 3,
    userId: 2,
    title: 'New Application Received',
    message: 'John Doe has applied to Tech Innovation Club',
    type: 'info',
    read: false,
    createdAt: '2024-02-10T10:30:00Z'
  }
];

// Stats for dashboard
export const mockStats = [
  {
    title: 'Total Clubs',
    value: '12',
    change: '+2',
    trend: 'up',
    icon: {
      path: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      bgColor: 'bg-blue-500'
    }
  },
  {
    title: 'Active Applications',
    value: '156',
    change: '+12',
    trend: 'up',
    icon: {
      path: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      bgColor: 'bg-green-500'
    }
  },
  {
    title: 'Club Members',
    value: '2,341',
    change: '+198',
    trend: 'up',
    icon: {
      path: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
      bgColor: 'bg-purple-500'
    }
  },
  {
    title: 'Pending Approvals',
    value: '23',
    change: '-5',
    trend: 'down',
    icon: {
      path: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      bgColor: 'bg-yellow-500'
    }
  }
];