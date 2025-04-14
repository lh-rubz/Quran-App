# 🌟 Quran App 🌙

Welcome to the **Quran App**! This application is designed to provide users with an interactive and user-friendly way to read, listen to, and understand the Quran. Whether you're looking to recite, explore translations, or dive into tafsir, this app has you covered.

---
## 📖 About the App

The Quran App is built to serve as a comprehensive tool for Quranic study and recitation. Key features include:

- 🎧 **Verse Playback**: Listen to Quranic verses with high-quality audio.
- 🌍 **Translations**: View translations of verses in your preferred language.
- 📜 **Tafsir **: Access detailed explanations and interpretations of Quranic verses.
- 🌗 **Dark and Light Themes**: Switch between themes for a comfortable reading experience.
- ✨ **Interactive UI**: Highlight the current verse being played or selected for better focus.
![image](https://github.com/user-attachments/assets/3dc5dbb8-0d06-468e-b136-5f431df9c3d8)
![image](https://github.com/user-attachments/assets/f99ceca4-3595-48f0-8645-60312f25ce9d)

---

## 🚀 Getting Started

To get started with the project, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/lh-rubz/Quran-App
   cd quran-app
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

---

## 🛠️ Installation

Make sure you have the following installed on your system:

- **Node.js** (v18 or higher) 🌐
- **npm** (v8 or higher) 📦

Install the project dependencies by running:

```bash
npm install
```

---

## 📜 Scripts

The following scripts are available in the project:

- **`npm run dev`**: Starts the development server with Turbopack.
- **`npm run build`**: Builds the project for production.
- **`npm run start`**: Starts the production server.
- **`npm run lint`**: Runs ESLint to check for code quality issues.

---

## 🌐 APIs Used

The project uses the **Al-Quran Cloud API** to fetch Quranic data, translations, audio, and tafsir. Below are the endpoints used:

### 📚 Quran Data Endpoints
- **Fetch Surah**:  
  `https://api.alquran.cloud/v1/surah/${selectedSurah}/${selectedEdition}`  
  Retrieves the verses of a specific surah in the selected edition.

- **Fetch Translation**:  
  `https://api.alquran.cloud/v1/surah/${selectedSurah}/${selectedTranslation}`  
  Retrieves the translation of a specific surah.

- **Fetch Page**:  
  `https://api.alquran.cloud/v1/page/${selectedPage}/${selectedEdition}`  
  Retrieves the Quranic content of a specific page in the selected edition.

- **Fetch Page Translation**:  
  `https://api.alquran.cloud/v1/page/${selectedPage}/${selectedTranslation}`  
  Retrieves the translation of a specific page.

### 🎧 Audio Endpoints
- **Fetch Reciters**:  
  `https://api.alquran.cloud/v1/edition?format=audio`  
  Retrieves a list of available reciters.

- **Fetch Ayah Audio**:  
  `https://api.alquran.cloud/v1/ayah/${ayahNumber}/${tafsirId}`  
  Retrieves the audio for a specific ayah.

### 📜 Tafsir Endpoints
- **Fetch Tafsir Editions**:  
  `https://api.alquran.cloud/v1/edition/type/tafsir`  
  Retrieves a list of available tafsir editions.

---

## 🛠️ Technologies

The project is built using the following technologies:

- ⚛️ **Next.js**: A React framework for building server-rendered and static web applications.
- 🎨 **TailwindCSS**: A utility-first CSS framework for styling.
- 🛡️ **TypeScript**: A strongly typed programming language that builds on JavaScript.
- 🖼️ **Lucide Icons**: A library for modern, customizable icons.

---

## 👥 Team Members

- **Heba Abu El-rub**  
  Student ID: 1212401

- **Doaa Assi**  
  Student ID: 1220504


---

## 🎓 Course Information

This project is our **first assignment** for the course **Web Services** with **Dr. Ahmad Hammo**. It demonstrates our understanding of API integration.

---

## 🎉 Thank You!

Thank you for using the Quran App! We hope it helps you in your journey of understanding and connecting with the Quran. If you have any feedback or suggestions, feel free to reach out! 🌟
