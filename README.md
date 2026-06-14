# 💪 Smart Fitness & Gym Management System

<div align="center">

### 🚀 Full Stack Gym & Fitness Management Platform

Built with **React.js + Spring Boot + MySQL**

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-green)
![React](https://img.shields.io/badge/React-18-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.0-lightblue)
![License](https://img.shields.io/badge/License-MIT-yellow)

</div>

---

## 📖 Overview

Smart Fitness & Gym Management System is a modern Full Stack Web Application designed to simplify gym operations and enhance member fitness experiences.

The platform provides complete management of workouts, diet plans, memberships, trainers, attendance, progress tracking, and analytics through a centralized dashboard.

Whether you're a gym owner, trainer, or fitness enthusiast, this system offers everything needed to manage fitness activities efficiently.

---

## ✨ Features

### 👑 Admin Module

* Manage Users
* Manage Trainers
* Membership Management
* Revenue Analytics Dashboard
* Attendance Monitoring
* System Reports
* Notification Management

### 🏋️ Trainer Module

* Create Workout Plans
* Create Diet Plans
* Monitor Member Progress
* Assign Fitness Programs
* Manage Assigned Members

### 🏃 User Module

* User Registration & Login
* Workout Tracking
* Diet Tracking
* Fitness Challenges
* Membership Purchase
* Trainer Booking
* Progress Monitoring
* BMI Calculator

---

## 💪 Workout Management

### Exercise Categories

✔ Chest

✔ Back

✔ Arms

✔ Legs

✔ Shoulders

✔ Abs

✔ Cardio

### Features

* Exercise Library
* Workout Plan Creation
* Exercise Tracking
* Progress Monitoring
* Personalized Workouts

---

## 🥗 Diet Management

### Diet Features

* Meal Scheduling
* Calorie Tracking
* Protein Tracking
* Carbohydrate Tracking
* Fat Tracking
* Meal Completion Tracking

### Supported Meals

🍳 Breakfast

🥗 Lunch

🍎 Snacks

🍛 Dinner

---

## 🎫 Membership Plans

| Plan    | Duration  | Price |
| ------- | --------- | ----- |
| Basic   | Monthly   | ₹999  |
| Premium | Quarterly | ₹2499 |
| Elite   | Yearly    | ₹7999 |

### Membership Features

* Auto Expiry Tracking
* Membership Status
* Renewal Alerts
* Membership History

---

## 📅 QR Attendance System

### Features

✅ Unique QR Code

✅ Check-In

✅ Check-Out

✅ Attendance History

✅ Time Tracking

---

## 📊 Progress Tracking

Track important fitness metrics:

* Weight
* BMI
* Calories Burned
* Water Intake
* Body Measurements
* Weekly Reports
* Monthly Reports
* Progress Charts

---

## 🏆 Fitness Challenges

### Available Challenges

🔥 Weight Loss Challenge

💪 Muscle Building Challenge

🏃 10K Steps Challenge

🧘 Yoga Challenge

🏋️ Push-Up Challenge

⭐ Six Pack Challenge

---

## 🛠️ Technology Stack

### Frontend

```text
React.js
Axios
React Context API
CSS3
JavaScript ES6+
```

### Backend

```text
Spring Boot
Spring Security
Spring Data JPA
Hibernate
REST APIs
Maven
```

### Database

```text
MySQL
```

---

## 🏗️ Architecture

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
MySQL Database
```

### Architecture Pattern

✔ MVC Architecture

✔ Layered Architecture

✔ RESTful APIs

✔ Role-Based Access Control

---

## 🗄️ Database Design

### Tables

```text
users
user_profiles
trainers
trainer_assignments
workout_plans
exercises
diet_plans
meals
memberships
attendance
notifications
progress_tracking
```

Total Tables: **12**

---

## 🔒 Security Features

* Spring Security
* Role-Based Authorization
* Protected APIs
* Secure Authentication
* Password Encryption

---

## 🚀 API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### Users

```http
GET /api/users
GET /api/users/{id}
DELETE /api/users/{id}
```

### Workouts

```http
GET /api/workouts
POST /api/workouts
```

### Diet Plans

```http
GET /api/diet-plans
POST /api/diet-plans
```

### Memberships

```http
GET /api/memberships
POST /api/memberships
```

### Attendance

```http
GET /api/attendance
POST /api/attendance/checkin
POST /api/attendance/checkout
```

---

## 🧠 Challenges Solved

### Circular Reference Issue

Problem:

```text
DietPlan ↔ Meal infinite JSON recursion
```

Solution:

```java
@JsonIgnoreProperties
```

### Lazy Loading Exception

Problem:

```text
Entity data not loading during serialization
```

Solution:

```java
FetchType.EAGER
```

### Foreign Key Constraint Issue

Problem:

```text
User deletion failed due to related records
```

Solution:

```java
@Transactional
```

### CORS Error

Problem:

```text
Frontend and Backend communication blocked
```

Solution:

```java
CorsConfig.java
```

---

## 📈 Project Statistics

```text
10 Backend Modules
13 Frontend Pages
12 Database Tables
25+ REST APIs
3 User Roles
6 Fitness Challenges
100% Responsive Design
```

---

## 🔮 Future Enhancements

🤖 AI Workout Recommendations

🥗 AI Diet Recommendations

💳 Payment Gateway Integration

💬 Real-Time Chat System

📱 React Native Mobile App

📧 Email Notifications

📊 Advanced Analytics Dashboard

---

## 📸 Screenshots

Add screenshots here:

### Dashboard

<img src="screenshots/dashboard.png" width="800">

### Workout Module

<img src="screenshots/workout.png" width="800">

### Diet Module

<img src="screenshots/diet.png" width="800">

### Admin Dashboard

<img src="screenshots/admin.png" width="800">

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/smart-fitness-gym-management-system.git
```

### Backend Setup

```bash
cd backend

mvn clean install

mvn spring-boot:run
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

### Database Setup

```sql
CREATE DATABASE fitness_db;
```

Update database credentials in:

```properties
application.properties
```

---

## 👨‍💻 Developed By

### Vishal Deshmukh

Full Stack Java Developer

💼 Java | Spring Boot | Hibernate | React.js | MySQL

📧 Your Email

🔗 LinkedIn Profile

🔗 GitHub Profile

---

⭐ If you like this project, don't forget to Star the Repository!
