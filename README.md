# 🌬️ AirMojo

A full-stack property rental and booking platform that allows users to list, search, filter, and book properties seamlessly. Built with a secure authentication system and interactive map integration, **AirMojo** aims to provide a smooth and intuitive user experience similar to modern travel rental services.

---

## 🚀 Live Demo

👉 [Live Website](https://airmojo.onrender.com/)

---

## 📌 Features

- 🔐 Secure **User Authentication** with Passport.js
- 🏘️ Property **Listing Management (CRUD)**
- 🏠 Newly designed **Home Page** showcasing featured stays and quick actions
- 🔍 Expanded **Search & Filter** tools for faster discovery by location and price
- 🗺️ **Interactive Map Integration** using Leaflet.js
- 📦 File Upload support (Cloudinary)
- 🛏️ **Booking Workflow**
- 💼 Session management with express-session
- 📮 Refreshed **Footer** with helpful links and contact info
- 🌐 Backend deployed on **Render**, DB on **MongoDB Atlas**
- ✅ API tested using **Hoppscotch**

---

## 🛠️ Tech Stack

| Category       | Tools / Frameworks                   |
| -------------- | ------------------------------------ |
| Frontend       | HTML, EJS (templating), Bootstrap    |
| Backend        | Node.js, Express.js                  |
| Database       | MongoDB, Mongoose                    |
| Authentication | Passport.js, bcrypt                  |
| Cloud Storage  | Cloudinary                           |
| Maps           | Leaflet.js                           |
| API Testing    | Hoppscotch                           |
| Deployment     | Render (Backend), MongoDB Atlas (DB) |

---

## 📂 Folder Structure

```
AirMojo/
├── controllers/ # Route handlers
├── init/ # DB initialization
├── models/ # Mongoose schemas
├── public/ # Static assets (CSS, JS)
├── routes/ # Express routes
├── uploads/ # Uploaded images (Cloudinary-backed)
├── utils/ # Utility functions
├── views/ # EJS templates
│ ├── includes/
│ ├── layouts/
│ ├── listings/
│ └── users/
├── .env # Environment variables
├── app.js # Main Express app
├── middleware.js # Custom middlewares
├── schema.js # Joi validation schemas
├── package.json

```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/utkarshp579/airmojo.git
cd airmojo
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create .env File

```bash
Create a .env file in the root directory and add the following:
CLOUD_API_SECRET=your_secret
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
ATLASDB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
SECRET=your_session_secret
```

### 4. Set Local DB (if not using Atlas)

In app.js, replace the dbURL with your local MongoDB URI if needed.

### 5. Run the App

```bash
node app.js
```

### 6. Visit http://localhost:3000 in your browser.

---

### 🧪 API Testing

You can test API routes using Hoppscotch.

---

## 🆕 Recent Updates

- ✅ Launched the dedicated Home page with a hero search, featured listings, and quick-entry cards.
- ✅ Introduced the upgraded filter bar to combine destination, date, and price filters in one place.
- ✅ Polished the footer with consistent styling, navigation shortcuts, and support links.

---

### 🧭 Future Improvements

🗺️ Add map-based listing & location pins
💅 UI enhancements for mobile responsiveness
💸 Add property buying feature

---

### 👤 Author

Utkarsh – [LinkedIn](https://linkedin.com/in/utkarshp579/) || [GitHub](https://github.com/utkarshp579/)
