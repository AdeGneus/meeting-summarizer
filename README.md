
# 📜  Meeting Summarizer
AI-Powered Zoom Meeting Bot for Real-Time Transcription & Summarization

## 🚀 Overview
Meeting Summarizer is an AI-powered Zoom bot that joins Zoom meetings independently, 
captures real-time transcriptions, and generates structured summaries using Mastra AI. 
The full transcript is automatically sent to a Telex channel for easy retrieval.

## ✨ Features
✅ Independent Zoom Bot – Joins meetings without a user account.\
✅ Automated Meeting Transcription – Uses OpenAI Whisper AI.\
✅ Live Zoom Meeting Participation – Puppeteer-based automation.\
✅ Summarization & AI Insights – Powered by Mastra AI.\
✅ Telex Integration – Automatically sends summaries after meetings.

## 📌 Tech Stack
- Backend: Node.js, Express, TypeScript  
- Database: PostgreSQL (TypeORM)  
- AI & Transcription: OpenAI Whisper, Mastra AI  
- Zoom Integration: Zoom SDK & OAuth API  
- Automation: Puppeteer  


## 🛠 Installation
1️⃣ Clone the Repository
    git clone https://github.com/AdeGneus/meeting-summarizer.git
    cd meeting-summarizer

2️⃣ Install Dependencies
    yarn install

3️⃣ Set Up Environment Variables
Create a .env file and add the required credentials.

4️⃣ Start the Server
    yarn dev

## 🖥️ Usage
- Join a Meeting: POST /join-meeting

## 📂 Folder Structure
```.
├── src
│   ├── api                 
│   ├── db                 
│   ├── mastra             
│   ├── telex               
│   ├── transcription      
│   ├── zoom               
│   ├── index.ts           
│   ├── README.md          
└── .env.example           
```
## 👨‍💻 Contributing
1. Fork the repo.
2. Create a new branch (git checkout -b feature-branch).
3. Commit your changes (git commit -m "Added new feature").
4. Push to the branch (git push origin feature-branch).
5. Open a pull request 🚀.

## 📜 License
This project is licensed under the MIT License.

## 📞 Contact
Authors:
        \
         [@AdeGneus](https://github.com/AdeGneus)\
         [@chosenDevop](https://github.com/AdeGneus)\
         [@edwinedjokpa](https://github.com/edwinedjokpa)
      

