<p align="center"> <a href="https://nestjs.com/" target="_blank"> <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" /> </a> </p> <h1 align="center">Digital Product Selling Backend API</h1> <p align="center"> A scalable, secure, and production-ready REST API for a digital product-selling platform built with <a href="https://nestjs.com" target="_blank">NestJS</a>. </p> <p align="center"> 🔗 <b>Live API:</b> https://agency-website-nest-js-backend.onrender.com/api/v1 </p> <p align="center"> 📘 <b>Swagger API Docs:</b> https://agency-website-nest-js-backend.onrender.com/api/v1/swagger </p>
</p>

---

## 🚀 Overview

This project is a **production-grade backend API** for a **digital product-selling platform**, enabling product/service management, user interactions, transactions, and secure access control.

## Key Features

- Designed and developed a scalable RESTful API for a digital product-selling platform
- Implemented secure authentication & authorization using JWT, OTP verification, email verification, and password recovery
- Built role-based access control (RBAC) for Super Admin, Admin, Manager, and User roles
- Developed advanced backend features including search, filtering, pagination, and validation
- Integrated secure transaction and payment workflows for digital product/service access
- Designed and optimized PostgreSQL database schemas using TypeORM
- Optimized backend performance for scalable, multi-user environments and high-volume data processing
- Documented APIs using Swagger (OpenAPI) for seamless integration and developer experience

Designed for **scalability**, **maintainability**, and **real-world usage**.

---

## 🧱 Tech Stack

- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL / MySQL (via TypeORM)
- **ORM:** TypeORM
- **Validation:** class-validator
- **Documentation:** Swagger (OpenAPI)
- **Auth:** JWT (Access & Refresh Tokens)
- **API Style:** REST + HATEOAS
- **Pagination:** Custom DataQueryService
- **Environment:** Node.js

---

## Core Capabilities

- Product / Service Management API
- Order & Transaction Handling
- Secure Authentication System
- Role-Based Access Control (RBAC)
- Advanced Search & Filtering
- Pagination System
- Scalable Database Design

## Architecture Highlights

- Modular NestJS architecture
- DTO-based validation layer
- Centralized response handling
- Reusable pagination & query system
- Soft delete strategy
- Secure token-based authentication
- Clean separation of concerns

## Authentication Flow

- JWT Access Token
- Refresh Token Rotation
- OTP Verification
- Email Verification
- Password Recovery System
- Secure HTTP-only cookie handling

## Database Design

- PostgreSQL relational schema
- Optimized indexing & query performance
- TypeORM entity-based modeling
- Scalable multi-table relationships

## Performance Optimization

- Optimized backend for multi-user scalable environments
- Efficient query handling for high-volume data processing
- Reduced API response time with structured pagination
- Improved system reliability under load

## 📂 Project Structure

```
src/
├── auth/                 # Authentication & authorization
├── categories/           # Category module (CRUD)
├── common/
│   ├── interceptors/     # Global response interceptor
│   ├── decorators/       # Custom decorators
│   ├── data-query/       # Pagination, filtering, search
│   └── response-dto/     # Standard API response contracts
├── config/               # Environment & app configuration
├── database/             # TypeORM config & migrations
├── main.ts               # App bootstrap
└── app.module.ts
```

---

## ⚙️ Environment Setup

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=3000

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=app_db

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

---

## 📦 Installation

```bash
bun install
```

---

## ▶️ Running the App

```bash
# Development
bun run start:dev

# Production
bun run build
bun run start:prod
```

---

## 🧪 Testing

```bash
# Unit tests
bun run test

# E2E tests
bun run test:e2e

# Coverage
bun run test:cov
```

---

## 📘 API Documentation (Swagger)

Once the server is running, access Swagger UI at:

```
http://localhost:5000/api/v1/swagger
```

---

## 📡 API Response Standard

All APIs follow a **consistent response format**:

### ✅ Success (Single Resource)

```json
{
  "apiVersion": "0.1.1",
  "success": true,
  "message": "Item retrieved successfully",
  "status": 200,
  "data": {},
  "links": {
    "get": "/categories/:id",
    "update": "/categories/:id",
    "delete": "/categories/:id"
  }
}
```

### ✅ Success (Paginated)

```json
{
  "apiVersion": "0.1.1",
  "success": true,
  "message": "Operation Successful",
  "status": 200,
  "meta": {
    "total": 24,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  },
  "links": {
    "first": "?page=1&limit=10",
    "last": "?page=3&limit=10",
    "current": "?page=1&limit=10",
    "next": "?page=2&limit=10",
    "previous": ""
  },
  "data": []
}
```

### ❌ No Content (DELETE – Industry Standard)

```http
HTTP/1.1 204 No Content
```

---

## 🔐 Authentication

- JWT-based authentication
- Access token stored in **HTTP-only cookies**
- Refresh token rotation supported
- Logout clears cookies securely

---

## 🧹 Best Practices Followed

- DTO-based validation
- Soft delete instead of hard delete
- Proper HTTP status codes
- Centralized interceptor for responses
- Clean separation of concerns
- Reusable pagination & filtering logic

---

## 🚢 Deployment

NestJS is platform-agnostic and can be deployed to:

- AWS
- DigitalOcean
- Railway
- Render
- Docker
- Kubernetes

Build for production:

```bash
bun run build
```

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 👤 Author

Zamirul Kabir
**Your Name**
Software Engineer
NestJS | TypeScript | REST APIs

---

## 🤝 Contribution

Contributions, issues, and feature requests are welcome.
Please follow clean code and commit conventions.

---

## ⭐ Support

If you find this project helpful, consider giving it a ⭐ on GitHub.
