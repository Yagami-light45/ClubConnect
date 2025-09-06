-- Users table (already exists in your system)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'clubhead', 'admin') NOT NULL,
    phone VARCHAR(20),
    year INT,
    branch VARCHAR(100),
    skills TEXT,
    interests TEXT,
    bio TEXT,
    department VARCHAR(100),
    position VARCHAR(100),
    experience TEXT,
    specializations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Clubs table
CREATE TABLE clubs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    club_head_id INT,
    max_members INT DEFAULT 50,
    current_members INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    recruitment_status ENUM('open', 'closed') DEFAULT 'open',
    requirements TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (club_head_id) REFERENCES users(id)
);

-- Recruitment drives table
CREATE TABLE recruitment_drives (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    club_id INT NOT NULL,
    club_head_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    max_applications INT DEFAULT 50,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (club_id) REFERENCES clubs(id),
    FOREIGN KEY (club_head_id) REFERENCES users(id)
);

-- Recruitment questions table
CREATE TABLE recruitment_questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    recruitment_drive_id INT NOT NULL,
    question_text TEXT NOT NULL,
    question_type ENUM('text', 'textarea', 'select') DEFAULT 'text',
    is_required BOOLEAN DEFAULT true,
    options JSON,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recruitment_drive_id) REFERENCES recruitment_drives(id) ON DELETE CASCADE
);

-- Applications table
CREATE TABLE applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    recruitment_drive_id INT NOT NULL,
    student_id INT NOT NULL,
    club_id INT NOT NULL,
    status ENUM('pending', 'under_review', 'accepted', 'rejected') DEFAULT 'pending',
    notes TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    reviewed_by INT NULL,
    FOREIGN KEY (recruitment_drive_id) REFERENCES recruitment_drives(id),
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (club_id) REFERENCES clubs(id),
    FOREIGN KEY (reviewed_by) REFERENCES users(id),
    UNIQUE KEY unique_application (recruitment_drive_id, student_id)
);

-- Application responses table
CREATE TABLE application_responses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    application_id INT NOT NULL,
    question_id INT NOT NULL,
    response_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES recruitment_questions(id)
);