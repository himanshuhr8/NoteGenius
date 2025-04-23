
# Note Genius 🧠✍️  
AI-Powered Notes App built with Next.js, TypeScript, TailwindCSS, Supabase, and React Query.

## 🧩 Features

- ✨ **User Authentication** (Google + Email/Password via Supabase)
- 📝 **Create, Edit & Delete Notes**
- 🤖 **AI-Powered Summarization** using Groq's `llama-3.1-8b-instant` model
- ⚡ **State Management** with React Query
- 🎨 **Modern UI** with Shadcn components
- 🚀 **Deployed on Vercel**

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1. Clone the repository

```bash
git clone https://github.com/himanshuhr8/NoteGenius.git
cd NoteGenius
```

### 2. Install dependencies

```bash
npm install
# or
yarn
```

### 3. Set up environment variables

Create a `.env` file in the root and add:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
GROQ_API_KEY=your-groq-api-key
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=your-google-client
SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=your-google-secret
```

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📁 Project Structure

```
├── app/                       # Next.js App Router routes and API
│   ├── api/
│   │   └── summarize/route.ts  # AI summarization API route
│   ├── note/
│   │   └── [id]/page.tsx       # Note detail (view/edit)
│   ├── signup/page.tsx      # SignUp Page
│   ├── login/page.tsx      # Login Page
│   ├── dashboard/page.tsx      # Dashboard showing all notes
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/                # Reusable UI components
│   └── ui/                    # Shadcn-based design system components
├── hooks/                     # Custom React hooks (useNote, useNotes, etc.)
├── lib/                       # Library utilities (Supabase client, AI utils)
│   ├── supabase/
│   │   └── client.ts
│   └── utils/
│       └── ai.ts
├── types/                     # Shared TypeScript types and interfaces
├── next.config.js             # Next.js configuration
└── README.md                  # Project documentation
```

---

## 🔒 Authentication

Authentication is powered by Supabase:
- Google OAuth
- Email & Password

Make sure you configure authentication providers in your Supabase dashboard.

---
## 🤖 Summarization API

AI Summarization is integrated using **Groq's `llama-3.1-8b-instant` model**. The model helps summarize user-generated notes effectively.

#### Model Used: `llama-3.1-8b-instant` from Groq

The `llama-3.1-8b-instant` model is a powerful language model used for summarizing the content of notes. The summarization feature enables users to get concise versions of their notes with minimal effort.

##### How It Works:
1. The user writes or edits a note.
2. The note is sent to Groq's API using the provided API key.
3. The model processes the content and returns a summary.
4. The summary is displayed to the user in the app.

---


---

## 🛠 Built With

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Supabase](https://supabase.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [React Query](https://tanstack.com/query/latest)
- [Groq](https://groq.com/) (for AI Summarization with `llama-3.1-8b-instant` model)

---



---

## 🙋‍♂️ Author

Made with ❤️ by Himanshu Raj  
[LinkedIn](https://www.linkedin.com/in/himanshu-raj-1053a4260/) ・ [Portfolio](https://hima31.vercel.app/)
