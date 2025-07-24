# 🌿 Jungle Quest - Gamified Python Learning Platform

A MERN stack-based gamified Python learning platform where students can solve coding challenges, earn badges, and track their progress in a jungle-themed environment.

## 🚀 Features

### 👨‍🎓 Student Features
- **Authentication**: Secure JWT-based login/registration
- **Dashboard**: Progress tracking, badges, and statistics
- **Code Editor**: Monaco Editor with Python syntax highlighting
- **Real-time Feedback**: Instant code execution and result validation
- **Gamification**: Points, badges, and progress tracking
- **Responsive Design**: Works on desktop, tablet, and mobile

### 👩‍💼 Admin Features
- **Level Management**: Create, edit, and delete coding challenges
- **User Progress**: View student submissions and progress
- **Challenge Creation**: Rich editor with starter code and hints
- **Statistics**: Overview of platform usage and performance

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** authentication
- **bcryptjs** for password hashing
- **CORS** enabled for frontend communication

### Frontend
- **React 18** with functional components and hooks
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Monaco Editor** for code editing
- **Jungle-themed** UI with custom components

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   Create a `.env` file in the backend directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/jungle-quest
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String,
  passwordHash: String,
  role: { type: String, enum: ['student', 'admin'] },
  progress: [{ levelId: ObjectId, completed: Boolean }],
  badges: [{ name: String, description: String }],
  totalScore: Number
}
```

### Level Model
```javascript
{
  title: String,
  description: String,
  difficulty: String,
  starterCode: String,
  expectedOutput: String,
  testCases: [String],
  hints: [String],
  points: Number,
  order: Number,
  isActive: Boolean
}
```

### Submission Model
```javascript
{
  userId: ObjectId,
  levelId: ObjectId,
  code: String,
  output: String,
  isCorrect: Boolean,
  executionTime: Number,
  errorMessage: String,
  testResults: [Object],
  submittedAt: Date
}
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Levels (Students)
- `GET /api/levels` - Get all active levels
- `GET /api/levels/:id` - Get specific level

### Levels (Admin)
- `POST /api/levels` - Create new level
- `PUT /api/levels/:id` - Update level
- `DELETE /api/levels/:id` - Delete level
- `GET /api/levels/admin/all` - Get all levels (including inactive)

### Submissions
- `POST /api/submissions/:levelId` - Submit code for level
- `GET /api/submissions/:levelId` - Get user submissions for level
- `GET /api/submissions/admin/all` - Get all submissions (admin)

## 🎨 UI Components

### Jungle Theme
- **Colors**: Green and orange palette
- **Fonts**: Comic Neue and Nunito
- **Components**: Rounded cards, progress vines, jungle backgrounds
- **Responsive**: Mobile-first design

### Custom Components
- `jungle-card` - Styled cards with backdrop blur
- `jungle-button` - Gradient buttons with hover effects
- `jungle-input` - Styled form inputs
- `progress-vine` - Animated progress bars

## 🚀 Deployment

### Backend Deployment (Heroku)
1. Create Heroku app
2. Set environment variables
3. Deploy with Git:
   ```bash
   git push heroku main
   ```

### Frontend Deployment (Vercel/Netlify)
1. Build the project:
   ```bash
   npm run build
   ```
2. Deploy the `build` folder

### Environment Variables
Set these in your deployment platform:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secure JWT secret key
- `FRONTEND_URL` - Your frontend URL

## 🔧 Development

### Running Both Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

### Code Execution
Currently uses basic validation. For production, consider:
- **Pyodide** (client-side Python execution)
- **Docker sandbox** (server-side execution)
- **Python subprocess** (with security measures)

## 🎯 Future Enhancements

- [ ] Real Python code execution with Pyodide
- [ ] Advanced test case validation
- [ ] Leaderboards and competitions
- [ ] Social features and comments
- [ ] Mobile app with React Native
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Dark/light theme toggle

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Monaco Editor for the code editing experience
- Tailwind CSS for the utility-first styling
- React community for the amazing ecosystem
- Jungle theme inspiration from nature and adventure games

---

**🌿 Happy coding in the jungle! 🐍** 