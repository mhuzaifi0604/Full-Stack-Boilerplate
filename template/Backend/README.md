# Backend Documentation

## Overview

This is the backend of your fullstack application built with **Node.js**, **Express**, and **Sequelize ORM**. It provides a scalable, maintainable structure for building RESTful APIs with multiple database support.

## 🏗️ Project Structure

```
backend/
├── DB/                      # Database configurations
│   ├── DBInit.js           # Database connection initialization with retry logic
│   └── dbConfigs.js        # Array of all database configurations
├── Models/                  # Sequelize models organized by database
│   ├── index.js            # Exports all database connections
│   └── [DB_NAME]/          # Folder for each database
│       └── [model].js      # Individual model files
├── routes/                  # API route definitions
│   ├── index.js            # Main router that combines all routes
│   ├── authRoutes.js       # Authentication endpoints
│   ├── dashboardRoutes.js  # Dashboard endpoints
│   └── settingsRoutes.js   # Settings endpoints
├── services/                # Business logic layer
│   ├── authService.js      # Authentication business logic
│   ├── cryptoService.js    # Encryption/decryption utilities
│   ├── dashboardService.js # Dashboard business logic
│   └── settingsService.js  # Settings business logic
├── middleware/              # Express middleware
│   └── authMiddleware.js   # JWT authentication middleware
├── .env                     # Environment variables
├── package.json            # Dependencies and scripts
└── server.js               # Main application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20
- npm or yarn
- MySQL, MariaDB, or PostgreSQL database server

### Installation

Dependencies are automatically installed during project creation. To reinstall:

```bash
npm install
```

### Environment Variables

Configure your environment variables in the `.env` file:

```env
# Server Configuration
PORT=5000
CLIENT_URL=http://localhost:5173

# Security
JWT_SECRET=your_jwt_secret_key
PASSWORD_ENCRYPTION_KEY=your_encryption_key

# Database Configuration (if you added databases)
YOUR_DB_USER=username
YOUR_DB_PASSWORD=password
YOUR_DB_NAME=database_name
YOUR_DB_HOST=localhost
YOUR_DB_PORT=3306
```

### Running the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will start on `http://localhost:5000` (or the PORT specified in .env).

## 🗄️ Working with Databases

### Multiple Database Support

This backend supports connecting to multiple databases simultaneously. Each database has its own:
- Configuration file in `DB/`
- Models folder in `Models/[DB_NAME]/`
- Environment variables

### Database Configuration

All databases are registered in `DB/dbConfigs.js`:

```javascript
const dbConfigs = [
  {
    key: "MAIN_DB",              // Identifier used in code
    folder: "MAIN_DB",            // Folder name in Models/
    configPath: "/../DB/MAIN_DB.config.js"  // Path to config file
  },
  // Add more databases here...
];
```

### Adding a New Database

Use the CLI command:

```bash
npx create-fullstack-app add-db
```

This will:
1. Prompt for database credentials
2. Test the connection
3. Create configuration files
4. Generate a sample model
5. Update environment variables

### Importing and Using Databases

#### Import All Databases

```javascript
const databases = require('./Models');
```

The `databases` object contains all your database connections:

```javascript
{
  MAIN_DB: {
    sequelize: [Sequelize Instance],
    Sequelize: [Sequelize Class],
    User: [User Model],
    Product: [Product Model],
    // ... other models
  },
  REPORTING_DB: {
    sequelize: [Sequelize Instance],
    Sequelize: [Sequelize Class],
    Report: [Report Model],
    // ... other models
  }
}
```

#### Import a Specific Database

```javascript
const { MAIN_DB } = require('./Models');

// Access models
const { User, Product } = MAIN_DB;
```

#### Import a Specific Model

```javascript
const { MAIN_DB } = require('./Models');
const User = MAIN_DB.User;

// Or destructure directly
const { User, Product } = require('./Models').MAIN_DB;
```

### Using Sequelize Commands

#### Create a New Record

```javascript
const { MAIN_DB } = require('./Models');
const { User } = MAIN_DB;

// Create
const newUser = await User.create({
  username: 'john_doe',
  email: 'john@example.com',
  password: 'hashed_password'
});
```

#### Find Records

```javascript
// Find all
const allUsers = await User.findAll();

// Find with conditions
const activeUsers = await User.findAll({
  where: { status: 'active' }
});

// Find one by primary key
const user = await User.findByPk(1);

// Find one with condition
const user = await User.findOne({
  where: { email: 'john@example.com' }
});
```

#### Update Records

```javascript
// Update instance
const user = await User.findByPk(1);
await user.update({ username: 'new_username' });

// Bulk update
await User.update(
  { status: 'inactive' },
  { where: { lastLogin: { [Op.lt]: new Date('2023-01-01') } } }
);
```

#### Delete Records

```javascript
// Delete instance
const user = await User.findByPk(1);
await user.destroy();

// Bulk delete
await User.destroy({
  where: { status: 'deleted' }
});
```

#### Complex Queries

```javascript
const { Op } = require('sequelize');

// Where operators
const users = await User.findAll({
  where: {
    age: { [Op.gte]: 18 },
    status: { [Op.in]: ['active', 'pending'] },
    email: { [Op.like]: '%@gmail.com' }
  }
});

// Ordering
const sortedUsers = await User.findAll({
  order: [['createdAt', 'DESC']]
});

// Limiting and pagination
const page = 1;
const limit = 10;
const offset = (page - 1) * limit;

const paginatedUsers = await User.findAndCountAll({
  limit,
  offset
});
```

#### Associations

```javascript
// Define associations in your model file
User.associate = function(models) {
  User.hasMany(models.Post, { foreignKey: 'userId' });
  User.belongsTo(models.Role, { foreignKey: 'roleId' });
};

// Query with associations
const userWithPosts = await User.findOne({
  where: { id: 1 },
  include: [{
    model: Post,
    as: 'posts'
  }]
});
```

#### Transactions

```javascript
const { sequelize } = MAIN_DB;

const t = await sequelize.transaction();

try {
  const user = await User.create({
    username: 'john'
  }, { transaction: t });

  await Post.create({
    userId: user.id,
    title: 'First Post'
  }, { transaction: t });

  await t.commit();
} catch (error) {
  await t.rollback();
  throw error;
}
```

## 🛣️ Working with Routes

### Adding a New Route

Use the CLI command:

```bash
npx create-fullstack-app add-route
```

This will:
1. Prompt for route information
2. Create a route file in `routes/`
3. Create a service file in `services/`
4. Update `routes/index.js` automatically

### Route Structure

Routes should be thin and delegate logic to services:

```javascript
// routes/usersRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const usersService = require('../services/usersService');

router.get('/', authenticateToken, usersService.getAll);
router.get('/:id', authenticateToken, usersService.getById);
router.post('/', authenticateToken, usersService.create);
router.put('/:id', authenticateToken, usersService.update);
router.delete('/:id', authenticateToken, usersService.delete);

module.exports = router;
```

### Service Structure

Services contain business logic:

```javascript
// services/usersService.js
const { MAIN_DB } = require('../Models');
const { User } = MAIN_DB;

exports.getAll = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};
```

## 🔐 Authentication

The backend includes JWT-based authentication:

### Protecting Routes

```javascript
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/protected', authenticateToken, (req, res) => {
  // req.user contains the decoded JWT payload
  res.json({ message: 'This is protected', user: req.user });
});
```

### Authentication Flow

1. User logs in via `/api/auth/login`
2. Server validates credentials and returns JWT token
3. Client stores token and sends it in subsequent requests
4. `authenticateToken` middleware verifies the token

## 📝 Model Creation

### Creating a New Model

Create a file in `Models/[DB_NAME]/modelName.js`:

```javascript
'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      defaultValue: 'active'
    }
  }, {
    tableName: 'users',
    timestamps: true  // Adds createdAt and updatedAt
  });

  User.associate = function(models) {
    // Define associations here
    User.hasMany(models.Post, { foreignKey: 'userId', as: 'posts' });
  };

  return User;
};
```

### Data Types Reference

Common Sequelize data types:

- `DataTypes.STRING(length)` - VARCHAR
- `DataTypes.TEXT` - TEXT
- `DataTypes.INTEGER` - INTEGER
- `DataTypes.BIGINT` - BIGINT
- `DataTypes.FLOAT` - FLOAT
- `DataTypes.DOUBLE` - DOUBLE
- `DataTypes.DECIMAL(precision, scale)` - DECIMAL
- `DataTypes.BOOLEAN` - BOOLEAN
- `DataTypes.DATE` - DATETIME
- `DataTypes.DATEONLY` - DATE
- `DataTypes.JSON` - JSON
- `DataTypes.JSONB` - JSONB (PostgreSQL)
- `DataTypes.ENUM('value1', 'value2')` - ENUM
- `DataTypes.UUID` - UUID

## 🧪 Testing

Add your test files and update package.json with test scripts:

```bash
npm install --save-dev jest supertest
```

```javascript
// __tests__/users.test.js
const request = require('supertest');
const app = require('../server');

describe('User API', () => {
  test('GET /api/users should return users', async () => {
    const response = await request(app).get('/api/users');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
```

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Sequelize Documentation](https://sequelize.org/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## 🤝 Contributing

When adding new features:

1. Create models in appropriate database folders
2. Create services for business logic
3. Create routes for API endpoints
4. Update this README if needed
5. Test your changes thoroughly

## 🐛 Troubleshooting

### Database Connection Issues

- Verify credentials in `.env`
- Ensure database server is running
- Check network connectivity
- Review logs in the console

### Module Not Found Errors

```bash
npm install
```

### Port Already in Use

Change the PORT in `.env` or kill the process using the port:

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```
