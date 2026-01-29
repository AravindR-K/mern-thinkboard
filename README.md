# 📝 ThinkBoard – Secure Notes Web Application

ThinkBoard is a **secure multi-user notes web application** built using the **MERN stack**.  
The project demonstrates **authentication, authorization, encryption, hashing, digital signatures, and encoding** in a **distributed system**, designed for **academic lab evaluation**.

---

## 🚀 Features

### 🔐 Security Features
- **User Authentication**
  - Email + password login
  - OTP-based multi-factor authentication (MFA)
- **Authorization & Access Control**
  - Identity-Based Access Control (IBAC)
  - Users can access only their own notes
- **Encryption (Confidentiality)**
  - AES-256-GCM encryption for note content
  - Encrypted data stored in MongoDB
- **Key Management**
  - Per-user encryption key derived using PBKDF2
  - Encryption keys are never stored
- **Hashing**
  - Passwords hashed using bcrypt
- **Digital Signatures**
  - RSA + SHA-256 based digital signatures
  - Detects tampering and ensures integrity
- **Encoding**
  - Base64URL encoding in JWT
  - Hex encoding for encrypted data
- **Rate Limiting**
  - Prevents abuse using Upstash Redis

---

## 🏗️ Tech Stack

### Frontend
- React (Vite)
- React Router
- Axios
- Tailwind CSS / DaisyUI
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (JSON Web Tokens)
- Nodemailer (OTP)
- Upstash Redis (Rate Limiting)

### Cryptography
- AES-256-GCM (Encryption)
- PBKDF2 (Key Derivation)
- bcrypt (Password Hashing)
- RSA + SHA-256 (Digital Signatures)

---

## 📂 Project Structure

mern-thinkboard/
│
├── backend/
│ ├── src/
│ │ ├── controllers/
│ │ ├── models/
│ │ ├── routes/
│ │ ├── middleware/
│ │ ├── utils/
│ │ └── server.js
│ └── .env
│
├── frontend/
│ ├── src/
│ │ ├── pages/
│ │ ├── components/
│ │ ├── lib/
│ │ └── main.jsx
│ └── index.html
│
└── README.md



---

## 🔄 Application Flow

1. User registers with email and password
2. Password is hashed and stored
3. User logs in and verifies OTP
4. JWT token is issued
5. User creates a note:
   - Content is encrypted (AES-256-GCM)
   - Digital signature is generated
6. Encrypted note and signature are stored in MongoDB
7. On access:
   - Content is decrypted
   - Signature is verified
8. Notes failing integrity verification are blocked

---

## 🔐 Cryptography Workflow

### Encryption
Plaintext
↓
PBKDF2 (password hash + userId)
↓
AES-256-GCM
↓
Ciphertext + IV + AuthTag


---

## ⚙️ Environment Variables

Create a `.env` file inside `backend/`:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_mailtrap_user
EMAIL_PASS=your_mailtrap_password

UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token

NODE_ENV=development

▶️ Running the Project
Backend
cd backend
npm install
npm run dev

Frontend
cd frontend
npm install
npm run dev

ThinkBoard ensures:

Secure storage of sensitive data
Protection against unauthorized access
Detection of tampering through digital signatures
The application integrates encryption, hashing, digital signatures, and encoding to form a complete secure distributed system.

👤 Author

Aravind R K
B.E / B.Tech – Computer Science
