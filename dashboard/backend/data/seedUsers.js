const ROLES = {
    ADMIN: "admin",
    CLUB_HEAD: "clubhead", 
    STUDENT: "student"
};

const users = [
    {
        name: "Admin User",
        email: "admin@test.com",
        password: "admin123",
        role: "admin"
    },
    {
        name: "Club Head",
        email: "clubhead@test.com", 
        password: "club123",
        role: "clubhead"
    },
    {
        name: "Student User",
        email: "student@test.com",
        password: "student123",
        role: "student"
    }
];

const clubs = [
    {
        name: "Coding Club",
        description: "Programming and development club",
        category: "Technical",
        isActive: true
    },
    {
        name: "Photography Club",
        description: "Photography and visual arts",
        category: "Cultural",
        isActive: true
    }
];

module.exports = { ROLES, users, clubs };