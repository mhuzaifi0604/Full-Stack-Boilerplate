# create-fullstack-boilerplate

[![npm version](https://badge.fury.io/js/create-fullstack-boilerplate.svg)](https://badge.fury.io/js/create-fullstack-boilerplate)
[![Downloads](https://img.shields.io/npm/dm/create-fullstack-boilerplate.svg)](https://npmjs.org/package/create-fullstack-boilerplate)

A powerful CLI tool to quickly scaffold a complete fullstack application with React, Node.js, Express, and Sequelize with multi-database support. Get started building real features instead of spending time on project setup!

![Dashboard UI](https://raw.githubusercontent.com/mhuzaifi0604/Full-Stack-Boilerplate/main/dashUI.png)

## ✨ Features

- 🚀 **Quick Setup** - Create a production-ready fullstack project in minutes
- 🗄️ **Multi-Database Support** - Connect to multiple databases (MySQL, MariaDB, PostgreSQL)
- 🔧 **Interactive CLI** - User-friendly prompts guide you through setup
- 📦 **Modern Stack** - React 19, Node.js 20+, Express, Sequelize, Tailwind CSS, DaisyUI
- 🔌 **Dynamic Database Addition** - Add new databases to existing projects
- 🛣️ **Route Generator** - Quickly scaffold new API endpoints with services
- 🔐 **Authentication Ready** - JWT-based authentication out of the box
- 📝 **Comprehensive Documentation** - Detailed READMEs for both frontend and backend
- 🎯 **Best Practices** - Following industry-standard project structure

## 📋 Prerequisites

- **Node.js** >= 20.0.0
- **npm** or **yarn**
- **Database Server** (MySQL, MariaDB, or PostgreSQL)

## 🚀 Quick Start

### Create a New Project

```bash
npx create-fullstack-boilerplate
```

Or install globally:

```bash
npm install -g create-fullstack-boilerplate
create-fullstack-boilerplate
```

Follow the interactive prompts:

1. Enter your project name
2. Choose your main database dialect (MySQL, MariaDB, or PostgreSQL)
3. Optionally add an extra database
4. Optionally initialize a Git repository

The tool will:
- ✅ Copy project template files
- ✅ Configure databases
- ✅ Install all dependencies
- ✅ Test database connections
- ✅ Set up environment variables

### Start Development

```bash
cd your-project-name

# Start backend server
cd backend
npm run dev

# In another terminal, start frontend
cd frontend
npm run dev
```

- Backend runs on: `http://localhost:5000`
- Frontend runs on: `http://localhost:5173`

## 🗄️ Database Management

### Add a Database to Existing Project

Navigate to your project root and run:

```bash
npx create-fullstack-boilerplate add-db
```

The CLI will prompt you for:
- Database identifier (e.g., `REPORTING_DB`, `ANALYTICS_DB`)
- Database credentials (host, port, username, password)
- Database name
- Table/model name
- Whether to define table attributes now

#### Defining Table Attributes

When adding a database, you can choose to define your table schema interactively:

1. **Primary Key**: Define your primary key column (name, type, auto-increment)
2. **Other Attributes**: Add as many columns as needed with:
   - Column name
   - Data type (dialect-specific options)
   - Length/precision (for VARCHAR, DECIMAL, etc.)
   - Constraints (NOT NULL, UNIQUE, DEFAULT values)

The tool automatically:
- Creates a folder in `Models/[DB_NAME]/`
- Generates the model file with your schema
- Creates database configuration file
- Updates `DB/dbConfigs.js`
- Adds credentials to `.env`
- Tests the database connection

### Data Types by Dialect

The CLI provides appropriate data types based on your selected database dialect:

**MySQL/MariaDB:**
- INTEGER, BIGINT, FLOAT, DOUBLE, DECIMAL
- STRING (VARCHAR), TEXT
- BOOLEAN, DATE, DATETIME, TIME
- JSON, BLOB, ENUM

**PostgreSQL:**
- INTEGER, BIGINT, FLOAT, DOUBLE, DECIMAL
- STRING (VARCHAR), TEXT
- BOOLEAN, DATE, TIMESTAMP, TIME
- JSON, JSONB, BYTEA, UUID, ARRAY, ENUM

## 🛣️ Route Management

### Add a New Route

Navigate to your project root and run:

```bash
npx create-fullstack-boilerplate add-route
```

The CLI will prompt you for:
- Route name (e.g., `users`, `products`)
- Route path (e.g., `/users`)
- Whether authentication is required

This automatically:
- ✅ Creates `routes/[routeName]Routes.js` with CRUD endpoints
- ✅ Creates `services/[routeName]Service.js` with business logic stubs
- ✅ Updates `routes/index.js` to register the new route
- ✅ Applies authentication middleware if requested

### Generated Route Structure

```javascript
// routes/usersRoutes.js
GET    /users      - Get all users
GET    /users/:id  - Get user by ID
POST   /users      - Create new user
PUT    /users/:id  - Update user
DELETE /users/:id  - Delete user
```

Each route delegates to a corresponding service function where you implement your business logic.

## 📁 Project Structure

```
your-project/
├── backend/
│   ├── DB/                    # Database configurations
│   │   ├── DBInit.js         # Connection initialization
│   │   ├── dbConfigs.js      # Database registry
│   │   └── [DB].config.js    # Individual DB configs
│   ├── Models/               # Sequelize models
│   │   ├── index.js         # Model loader
│   │   └── [DB_NAME]/       # Models per database
│   ├── routes/              # API endpoints
│   │   ├── index.js        # Main router
│   │   └── *Routes.js      # Feature routes
│   ├── services/           # Business logic
│   │   └── *Service.js    # Service functions
│   ├── middleware/        # Express middleware
│   ├── .env              # Environment variables
│   ├── package.json
│   ├── server.js        # Application entry
│   └── README.md       # Backend documentation
└── frontend/
    ├── src/
    │   ├── components/  # React components
    │   ├── pages/      # Page components
    │   ├── services/   # API clients
    │   ├── App.jsx
    │   └── main.jsx
    ├── public/
    ├── .env
    ├── package.json
    ├── vite.config.js
    └── README.md      # Frontend documentation
```

## 🔧 Configuration

### Backend Environment Variables

```env
# Server
PORT=5000
CLIENT_URL=http://localhost:5173

# Security
JWT_SECRET=your_jwt_secret
PASSWORD_ENCRYPTION_KEY=your_encryption_key

# Database Example (created when you add a database)
MAIN_DB_USER=root
MAIN_DB_PASSWORD=password
MAIN_DB_NAME=mydb
MAIN_DB_HOST=localhost
MAIN_DB_PORT=3306
```

### Frontend Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
```

**Important:** Vite requires environment variables to be prefixed with `VITE_`.

## 💻 Usage Examples

### Accessing Databases in Your Code

```javascript
// Import all databases
const databases = require('./Models');

// Access specific database
const { MAIN_DB, REPORTING_DB } = databases;

// Use models
const { User, Product } = MAIN_DB;

// Sequelize operations
const users = await User.findAll();
const user = await User.findByPk(1);
await User.create({ name: 'John', email: 'john@example.com' });
```

### Creating API Endpoints

After generating a route with `add-route`, implement your service logic:

```javascript
// services/usersService.js
const { MAIN_DB } = require('../Models');
const { User } = MAIN_DB;

exports.getAll = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};
```

### Making API Calls from Frontend

```javascript
// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// src/services/userService.js
import api from './api';

export const getUsers = () => api.get('/users');
export const createUser = (data) => api.post('/users', data);
```

## 📚 Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **Sequelize** - ORM for SQL databases
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **colors** - Terminal output styling
- **dotenv** - Environment variable management

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS 4** - Utility-first CSS
- **DaisyUI** - Component library
- **React Router** - Routing
- **Axios** - HTTP client
- **Recharts** - Data visualization

## 🎯 Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **Database Models**: Organize models by database
3. **Service Layer**: Keep business logic in services, not routes
4. **Error Handling**: Always handle errors and provide meaningful messages
5. **Authentication**: Use JWT tokens stored in localStorage
6. **Validation**: Validate input on both client and server
7. **Documentation**: Update READMEs when adding features

## 🔒 Security Considerations

- Change default JWT secrets in production
- Use environment variables for sensitive data
- Implement rate limiting for APIs
- Sanitize user inputs
- Use HTTPS in production
- Keep dependencies updated

## 🐛 Troubleshooting

### Command Not Found

```bash
# Reinstall the package globally
npm install -g create-fullstack-app
```

### Database Connection Failed

- Verify database server is running
- Check credentials in `.env`
- Ensure database exists
- Check network connectivity
- Verify port is not blocked

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

### Module Not Found

```bash
# Reinstall dependencies
cd backend && npm install
cd ../frontend && npm install
```

## 📖 Additional Documentation

After creating your project, refer to:

- `backend/README.md` - Complete backend documentation including Sequelize usage
- `frontend/README.md` - Complete frontend documentation including React patterns

## 🤝 Contributing

Found a bug or have a feature request? Please open an issue on GitHub.

## 📝 License

ISC

## 👨‍💻 Author

Muhammad Huzaifa

## 🙏 Acknowledgments

Built with modern tools and best practices to help developers start building features faster!

---

**Happy Coding! 🚀**

Get started in minutes, not hours. Focus on building features, not boilerplate.
