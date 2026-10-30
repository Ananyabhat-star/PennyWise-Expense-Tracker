# PennyWise – Personal Expense Tracker

PennyWise is a full-stack personal expense tracking application that helps users manage daily expenses, monitor spending habits, and understand their financial activities through interactive reports and analytics.

## Features

- **Dashboard:** View total expenses, transaction count, and top spending category.
- **Expense Management:** Add, view, edit, and delete expenses.
- **Search Expenses:** Search transactions by expense name.
- **Category Filtering:** Filter expenses by categories.
- **Spending Analytics:** Visualize category-wise expenses using pie charts.
- **Monthly Reports:** Track monthly spending through bar charts.
- **Monthly Summary:** View total monthly spending and categories used.
- **Database Integration:** Store and retrieve expense records using MySQL.

## Technologies Used

**Frontend**
- React.js
- JavaScript
- HTML5
- CSS3
- Recharts
- Vite

**Backend**
- Java 21
- Spring Boot
- Spring Data JPA
- Hibernate
- REST APIs
- Maven

**Database**
- MySQL 8

**Tools**
- Visual Studio Code
- Git and GitHub
- Postman

## Project Structure

```text
Expense-Tracker/
│
├── expense-tracker/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   └── package.json
│
├── .gitignore
└── README.md
```

## Application Setup

### 1. Clone the repository

```bash
git clone https://github.com/Ananyabhat-star/PennyWise-Expense-Tracker.git
```

### 2. Configure MySQL

Create a database:

```sql
CREATE DATABASE expense_tracker;
```

Configure your database connection in the backend's `application.properties` file. Set the `DB_PASSWORD` environment variable to your local MySQL password.

### 3. Run the Spring Boot backend

Open a terminal:

```bash
cd expense-tracker
```

Run:

```bash
.\mvnw.cmd spring-boot:run
```

Backend URL: `http://localhost:8080`

### 4. Run the React frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

## Future Enhancements

- Monthly budget management
- Export expense reports to CSV
- Advanced financial analytics
- Improved reporting and visualization

## Author

**Ananya Bhat**

GitHub: [Ananyabhat-star](https://github.com/Ananyabhat-star)

---

Developed as a full-stack application using React, Spring Boot, and MySQL.