# ClubConnect

ClubConnect is a **MERN stack** application designed to simplify and digitize the **club recruitment process** in colleges and universities.  
It provides role-based dashboards for students, club heads, and admins, with support for dynamic application workflows and approvals.

---

## 🚀 Features

- 🔐 **Authentication & Login Page**
- 🎓 **Student Dashboard & Profile**
- 📝 **Club Head Dashboard**
  - Post recruitments
  - Add custom application questions
  - Accept or reject applications
- 🛡️ **Admin Dashboard**
  - Approves clubs
  - Manages system-wide operations
- 📊 **Recruitment Management**
  - Track applicants
  - Manage recruitment status

---

## 🛠️ Tech Stack

- **Frontend:** React + Vite + TypeScript + Recharts  
- **Backend:** Node.js + Express  
- **Database:** MongoDB  
- **Auth:** JWT-based authentication  

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Yagami-light45/ClubConnect.git
cd ClubConnect
```

### 2. Start the Frontend

```bash
cd dashboard
```

Create a `.env` file in `dashboard/` with:

```env
VITE_API_URL=http://localhost:5000
VITE_USE_MOCK=true
REACT_APP_API_URL=http://localhost:5000
REACT_APP_USE_MOCK=true
```

Then install and run:

```bash
npm install
npm run dev
```

Frontend runs on **http://localhost:5173** (default Vite port).

### 3. Start the Backend

```bash
cd backend
```

Create a `.env` file in `backend/` with:

```env
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
PORT=5000
NODE_ENV=development
```

Then install and run:

```bash
npm install
npm run dev
```

Backend runs on **http://localhost:5000**.

---



## 🎯 Usage

1. **Students** can browse clubs, apply for recruitment, and track application status
2. **Club Heads** can create recruitment posts, manage applications, and customize questions
3. **Admins** can approve new clubs and oversee system operations

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request



## 📞 Contact

- **Author:** Harshith Pasupuleti
- **Project Link:** [https://github.com/Yagami-light45/ClubConnect](https://github.com/Yagami-light45/ClubConnect)