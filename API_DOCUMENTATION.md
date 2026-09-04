# API Documentation — College Management System

This document provides a comprehensive list of all API endpoints, including required parameters, request bodies, and authentication details.

---

## 🔐 Base URL
`http://localhost:5000`

---

## 🛡️ Authentication
All admin-protected routes require a **Bearer Token** in the `Authorization` header.
- **Header:** `Authorization: Bearer <your_jwt_token>`
- Obtain the token via **Admin Login** or **Admin Registration**.

---

## 📂 Summary of Content Types
- **JSON:** Most routes use `application/json`.
- **Multipart/Form-Data:** College management (Add/Update) uses `multipart/form-data` to handle image file uploads.

---

## ──────────── 🏛️ 1. Admin Management ────────────

### 📝 Register Admin
*   **Path:** `POST /api/admin/register`
*   **Auth:** None
*   **Body (JSON):**
    ```json
    {
      "name": "Admin Name",
      "email": "admin@example.com",
      "password": "securepassword123"
    }
    ```

### 🔑 Admin Login
*   **Path:** `POST /api/admin/login`
*   **Auth:** None
*   **Body (JSON):**
    ```json
    {
      "email": "admin@example.com",
      "password": "securepassword123"
    }
    ```

---

## ──────────── 🎓 2. Colleges (Public) ────────────

### 📜 Get All Colleges (Paginated)
*   **Path:** `GET /api/colleges`
*   **Auth:** None
*   **Query Parameters:**
    | Parameter | Default | Description |
    | :--- | :--- | :--- |
    | `page` | `1` | Page number |
    | `limit` | `10` | Items per page (max 100) |
    | `search` | - | Searches Name, City, or State |
    | `sortBy` | `nirfRanking.overallRank` | Field to sort by |
    | `order` | `asc` | `asc` (1 to 100) or `desc` (100 to 1) |

---

## ──────────── 🏫 3. College Management (Admin) ────────────

### ➕ Add New College
*   **Path:** `POST /api/admin/colleges`
*   **Auth:** Admin Token
*   **Content-Type:** `multipart/form-data`
*   **Form Fields:**
    | Field | Type | Description |
    | :--- | :--- | :--- |
    | `collegeId` | Text | Unique ID (e.g., "IITB-001") |
    | `collegeName` | Text | Full Name of the college |
    | `collegeType` | Text | Type of college (e.g., "Private", "Gov.") |
    | `feesRange` | Text | Fees range (e.g., "3lakh to 6lakh") |
    | `modes` | JSON String | Array of study modes (e.g., `["Online", "Regular"]`) |
    | `establishedYear`| Text | Year (e.g., "1958") |
    | `description` | Text | About the college |
    | `videoLink` | Text | YouTube/Video URL |
    | `images` | File(s) | Multiple image files (Field name must be `images`) |
    | `location` | JSON String | `{ "country": "", "state": "", "city": "", "address": "", "pincode": "", "coordinates": { "latitude": 0, "longitude": 0 } }` |
    | `nirfRanking` | JSON String | `{ "overallRank": 1, "year": 2025 }` |
    | `collegeRatings`| JSON String | `{ "averageRating": 4.5, "totalReviews": 100 }` |
    | `placement` | JSON String | `{ "placementPercentage": 90, "year": 2025, "highestPackage": {...}, "companiesVisited": [...] }` |
    | `courses` | JSON String | Array of course objects |
    | `reviews` | JSON String | Array of review objects |

### 📋 Get All Colleges (Admin List)
*   **Path:** `GET /api/admin/colleges`
*   **Auth:** Admin Token

### 🔍 Get Single College
*   **Path:** `GET /api/admin/colleges/:id`
*   **Auth:** Admin Token
*   **Params:** `id` (MongoDB ObjectId)

### 🔄 Update College
*   **Path:** `PUT /api/admin/colleges/:id`
*   **Auth:** Admin Token
*   **Params:** `id` (MongoDB ObjectId)
*   **Content-Type:** `multipart/form-data`
*   **Body:** Same as **Add New College** (all fields optional)

### 🗑️ Delete College
*   **Path:** `DELETE /api/admin/colleges/:id`
*   **Auth:** Admin Token
*   **Params:** `id` (MongoDB ObjectId)

---

## ──────────── 📩 4. Student Enquiries ────────────

### 📤 Submit Enquiry (Public)
*   **Path:** `POST /api/enquiries`
*   **Auth:** None
*   **Body (JSON):**
    ```json
    {
      "name": "Student Name",
      "phone": "9876543210",
      "email": "student@example.com"
    }
    ```

### 🔓 Admin: List All Enquiries
*   **Path:** `GET /api/admin/enquiries`
*   **Auth:** Admin Token

### 🔓 Admin: Get Enquiry By ID
*   **Path:** `GET /api/admin/enquiries/:id`
*   **Auth:** Admin Token
*   **Params:** `id` (MongoDB ObjectId)

### 🔓 Admin: Delete Enquiry
*   **Path:** `DELETE /api/admin/enquiries/:id`
*   **Auth:** Admin Token
*   **Params:** `id` (MongoDB ObjectId)

---

## ──────────── 🎥 5. Webinars ────────────

### 📜 Get All Webinars (Public)
*   **Path:** `GET /api/webinars`
*   **Auth:** None
*   **Query Parameters:**
    | Parameter | Description |
    | :--- | :--- |
    | `status` | Filter by `UPCOMING`, `LIVE`, `RECORDED` |
    | `category` | Filter by category (e.g. `Engineering`, `Medical`) |
    | `search` | Keyword search in title, speaker name, host |

### ➕ Create Webinar
*   **Path:** `POST /api/webinars`
*   **Auth:** None
*   **Body (JSON):**
    ```json
    {
      "title": "IIT JEE 2025 Strategy",
      "name": "Dr. Ramesh Kumar",
      "url": "https://collegy.in/webinars/iit-jee-strategy",
      "status": "LIVE",
      "time": "Live now",
      "viewers": "1.2K watching",
      "icon": "🎯",
      "category": "Engineering"
    }
    ```

### 🔍 Get Webinar by ID
*   **Path:** `GET /api/webinars/:id`
*   **Auth:** None
*   **Params:** `id` (MongoDB ObjectId)

### ✏️ Update Webinar
*   **Path:** `PUT /api/webinars/:id`
*   **Auth:** None
*   **Params:** `id` (MongoDB ObjectId)

### 🗑️ Delete Webinar
*   **Path:** `DELETE /api/webinars/:id`
*   **Auth:** None
*   **Params:** `id` (MongoDB ObjectId)

---

## 🖼️ Static Media Access
Uploaded images are accessible via:
`http://localhost:5000/uploads/colleges/<filename>`
