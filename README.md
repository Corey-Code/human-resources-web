# 🚀 **HR Web Application**

A **modern, full-stack HR management application** built with:  
✅ **Angular** for the front-end  
✅ **Fastify (Node.js)** for the back-end  
✅ **SQLite (Event Sourcing)** for persistent storage

This application allows HR teams to **manage employees, track salaries, and deductions**, and perform calculations in real-time.

---

## **🛠️ Features**

✔ **Employee Management** – Add, update, and edit employee details (Name, Salary, Deductions).  
✔ **Event Sourcing Architecture** – Tracks all changes over time for auditability.  
✔ **Fast and Lightweight** – Built with **Fastify** for high-performance API responses.  
✔ **Responsive UI** – Modern, dark-themed, mobile-first UI.  
✔ **Real-time Data Updates** – No page reloads; instant changes.  
✔ **SQLite Persistence** – Data remains saved even after server restarts.

---

## **⚡ Quick Start Guide**

Follow the instructions below to get the HR Web Application running locally.

### **1️⃣ Prerequisites**

Ensure you have the following installed:  
🔹 [Node.js 22.2.0](https://nodejs.org/) & **npm** (for backend & frontend dependencies)  
🔹 [Angular CLI](https://angular.io/cli) (for running the front-end)  
🔹 [Git](https://git-scm.com/) (to clone the repository)

---

### **2️⃣ Backend Setup (Fastify Server)**

Navigate to the **back-end folder** and install dependencies:

```bash
cd ./hr_backend
npm install
```

Start the **Fastify** server:

```bash
npm start
```

The server should now be running on:  
📌 **http://localhost:3000**

---

### **3️⃣ Frontend Setup (Angular App)**

Navigate to the **Angular front-end** folder and install dependencies:

```bash
cd ./hr-app
npm install
```

Start the **Angular** development server:

```bash
ng serve
```

The application should now be accessible at:  
📌 **http://localhost:4200**

---

### **4️⃣ Configure Environment Variables**

To connect the front-end to the back-end, update the API URL in the environment files:

📌 **Development Mode**: Edit `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
};
```

📌 **Production Mode**: Edit `src/environments/environment.prod.ts`

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com',
};
```

---

## **🔧 API Endpoints (Backend)**

| Method   | Endpoint                        | Description                     |
| -------- | ------------------------------- | ------------------------------- |
| **GET**  | `/api/employees`                | Fetch all employees             |
| **POST** | `/api/employees`                | Add a new employee              |
| **PUT**  | `/api/employees/:id/name`       | Update an employee's name       |
| **PUT**  | `/api/employees/:id/salary`     | Update an employee's salary     |
| **PUT**  | `/api/employees/:id/deductions` | Update an employee's deductions |

📌 **Example Payload (Adding an Employee)**

```json
{
  "name": "John Doe",
  "salary": 50000,
  "deductions": 5000
}
```

📌 **Example Response**

```json
{
  "message": "Employee added successfully",
  "employeeId": 1
}
```

---

## **📸 Screenshots**

### 🔹 **Employee List & Adding**

![Employee List](https://github.com/corey-code/human-resources-web/captures/capture1.png)

### 🔹 **Edit Employee**

![Edit Employee](https://github.com/corey-code/human-resources-web/captures/capture2.png)

---

## **🛠️ Running Tests**

### **Backend Tests (Fastify API)**

Run backend tests:

```bash
cd ./hr_backend
npm test
```

### **Frontend Tests (Angular App)**

Run frontend unit tests:

```bash
cd ./hr-app
ng test
```

---

## **🚀 Deployment**

### **📌 Deploy Backend (Fastify)**

To deploy your Fastify API, let's use **AWS**.  
Example for **Docker**:

```bash
docker build -t hr-backend .
docker run -p 3000:3000 hr-backend
```

### **📌 Deploy Frontend (Angular)**

Build Angular for production:

```bash
ng build --configuration=production
```

Deploy using **Netlify, Vercel, or Firebase Hosting**.

---

## **👥 Contributing**

Want to contribute? Follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature-branch`
3. Make your changes and commit: `git commit -m "Added new feature"`
4. Push to your branch: `git push origin feature-branch`
5. Open a Pull Request 🎉

---

## **📜 License**

This project is licensed under the **MIT License**.

---

### **✨ Built With ❤️ By Me**

Let me know if you need **any additional sections or improvements!** 🚀😊
