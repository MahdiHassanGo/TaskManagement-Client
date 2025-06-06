# Task Management Web App

A modern, collaborative task management application that allows users to create, manage, and track tasks in groups. Built with React and Node.js, this application provides a seamless experience for team collaboration and task organization.
Live Link: https://taskmanagement-cf552.web.app

![image](https://github.com/user-attachments/assets/89739741-1a8d-4240-9efa-49bcdf7036be)


## 🌟 Features

### User Management
- User authentication and authorization
- Profile management with display name and photo
- Secure login and registration system
- Role-based access control (Admin/Member)
![image](https://github.com/user-attachments/assets/36ea7085-6ace-470b-9914-c181c3b77c45)



### Group Management
- Create and manage multiple task groups
- Invite team members via email
- Assign group administrators
- Manage member roles and permissions
- Kick members from groups
- Leave groups as a member
![image](https://github.com/user-attachments/assets/c41a1aee-d12d-4028-a8c3-475fdc701865)
### Task Management
- Create, edit, and delete tasks
- Drag-and-drop task organization
- Categorize tasks (To-Do, In Progress, Done)
- Real-time task updates
- Task assignment and tracking
- Mobile-responsive task board
![image](https://github.com/user-attachments/assets/940ccd90-b945-4ce4-8040-102e1e038ff8)

### Collaboration Features
- Real-time updates across team members
- Group chat and notifications
- Task comments and discussions
- Member activity tracking
- Shared task boards
![image](https://github.com/user-attachments/assets/1a5b67f7-7c2b-4ad9-a708-59fa97de85db)

### UI/UX Features
- Responsive design for all devices
- Intuitive drag-and-drop interface
- Beautiful animations and transitions
- Dark/Light mode support
- Loading states and error handling
- User-friendly notifications

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **Vite** - Build tool and development server
- **React Router** - Client-side routing
- **React DnD** - Drag and drop functionality
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library
- **Axios** - HTTP client
- **SweetAlert2** - Beautiful alerts and notifications
- **React Icons** - Icon library
- **AOS** - Animate on scroll library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication
- **Cors** - Cross-origin resource sharing
- **Dotenv** - Environment variables
- **Vercel** - Deployment platform

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/task-management.git
```

2. Install dependencies
```bash
# Install client dependencies
cd TaskManagement-Client
npm install

# Install server dependencies
cd ../TaskServer
npm install
```

3. Set up environment variables
```bash
# In TaskServer/.env
PORT=5001
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

4. Start the development servers
```bash
# Start the backend server
cd TaskServer
npm run dev

# Start the frontend server
cd TaskManagement-Client
npm run dev
```

## 📱 Mobile Responsiveness

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

Features optimized for mobile:
- Touch-friendly drag and drop
- Responsive layouts
- Adaptive UI components
- Mobile-optimized forms
- Touch gestures support

## 🔒 Security Features

- JWT-based authentication
- Secure password hashing
- Protected API routes
- Input validation
- XSS protection
- CORS configuration
- Environment variable protection

## 🎨 UI Components

- Modern and clean design
- Responsive navigation
- Interactive task cards
- Animated transitions
- Loading spinners
- Error messages
- Success notifications
- Modal dialogs
- Form validations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


## 👥 Authors

-Mahdi Hassan Noor Asif - Initial work

## 🙏 Acknowledgments

- React.js community
- Tailwind CSS team
- All contributors and supporters

---

