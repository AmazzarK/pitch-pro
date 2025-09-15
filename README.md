# PitchPerfect 🚀

AI-powered tool to transform your startup ideas into professional pitches and development prompts. Instantly generate company names, elevator pitches, sleek pitch decks, and detailed MERN stack instructions.

---

## ✨ Features

- **Pitch Generation:** AI-crafted company names, elevator pitches, and 4-slide HTML pitch decks with modern design
- **Code Prompts:** Detailed and quick MERN stack instructions for developers
- **Export:** Download pitch decks as PDF or PNG
- **Responsive & Accessible:** Works perfectly on desktop/mobile, keyboard navigation & ARIA support
- **Optional Database:** Store pitch history with MongoDB (or run without)

---

## 🛠 Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (optional)
- **AI:** DeepSeek API
- **Export:** jsPDF + html2canvas
- **Testing:** Vitest (frontend), Jest (backend)

---

## 🚀 Quick Start

1. **Clone & Install**
    ```bash
    git clone https://github.com/AmazzarK/pitch-pro.git
    cd pitch-pro
    npm run install-all
    ```

2. **Setup .env (`server/.env`)**
    ```env
    DEEPSEEK_API_KEY=sk-your-deepseek-api-key-here
    CLIENT_URL=http://localhost:5173
    # Optional for pitch history:
    MONGODB_URI=mongodb://localhost:27017/pitchperfect
    ```

3. **Run in Development**
    ```bash
    npm run dev      # Starts client & server
    # Or separately:
    npm run server   # Backend: http://localhost:5000
    npm run client   # Frontend: http://localhost:5173
    ```

4. **Build for Production**
    ```bash
    npm run build
    npm start
    ```

---

## 📁 Project Structure

```
pitch-pro/
├── client/   # React frontend
├── server/   # Express backend
└── package.json
```

---

## 🔧 Config

| Variable          | Description                           |
|-------------------|---------------------------------------|
| DEEPSEEK_API_KEY  | Your DeepSeek API key (required)      |
| MONGODB_URI       | MongoDB URI for pitch history (opt.)  |
| CLIENT_URL        | Frontend URL for CORS (default shown) |

---

## 🤝 Contribute

- Fork and make a branch
- Commit and push your changes
- Open a Pull Request

---

**Built with ❤️ for entrepreneurs and startup enthusiasts**
