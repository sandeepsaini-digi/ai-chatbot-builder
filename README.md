# 🤖 AI Chatbot Builder — MERN + LangChain + OpenAI + RAG

A no-code platform to build, train, and deploy custom AI chatbots on any website. Train chatbots on your own documents (PDFs, URLs, text), customize the UI, and embed anywhere with a single script tag.

![Chatbot Builder Preview](https://via.placeholder.com/1200x600/0f172a/10b981?text=AI+Chatbot+Builder)

## ✨ Features

- **No-Code Bot Builder** — Create chatbots with a drag-and-drop interface, no coding needed
- **Custom Knowledge Base** — Train on PDFs, websites, Notion docs, or plain text
- **RAG Architecture** — Retrieval Augmented Generation for accurate, context-aware responses
- **Embeddable Widget** — Copy one `<script>` tag to add chatbot to any website
- **Multi-channel** — Deploy to website, WhatsApp, Telegram, or Slack
- **Analytics Dashboard** — Track conversations, user satisfaction, and unanswered questions
- **Human Handoff** — Escalate to live agent when confidence is low
- **White-labeling** — Custom branding, colors, and avatar per bot
- **Conversation History** — Full searchable conversation logs with export

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Tailwind CSS, Zustand |
| Backend | Node.js, Express.js, TypeScript |
| AI / RAG | LangChain.js, OpenAI GPT-4o, text-embedding-3-small |
| Vector DB | Pinecone (production) / ChromaDB (local dev) |
| Database | MongoDB + Mongoose |
| File Processing | Multer, pdf-parse, cheerio (web scraping) |
| Real-time | Socket.io |
| Queue | Bull + Redis (document processing jobs) |
| Auth | JWT + Refresh Tokens |
| Deployment | Railway / Render + Vercel |

## 📁 Project Structure

```
├── client/                      # React frontend
│   └── src/
│       ├── components/
│       │   ├── BotBuilder/      # Visual bot configuration UI
│       │   ├── ChatWidget/      # Embeddable chat widget
│       │   ├── Analytics/       # Conversation analytics
│       │   └── KnowledgeBase/   # Document management
│       ├── pages/
│       │   ├── Dashboard.tsx
│       │   ├── BotCreate.tsx
│       │   ├── BotEdit.tsx
│       │   └── Analytics.tsx
│       └── hooks/
│           ├── useChat.ts
│           └── useBotConfig.ts
│
├── server/                      # Node.js backend
│   └── src/
│       ├── routes/
│       │   ├── bots.ts
│       │   ├── documents.ts
│       │   ├── conversations.ts
│       │   └── embed.ts
│       ├── services/
│       │   ├── langchain/
│       │   │   ├── ingestion.ts  # Document → chunks → embeddings
│       │   │   ├── retrieval.ts  # Vector similarity search
│       │   │   └── chain.ts      # QA chain with memory
│       │   ├── document-processor.ts
│       │   └── widget-generator.ts
│       ├── models/
│       │   ├── Bot.ts
│       │   ├── Document.ts
│       │   └── Conversation.ts
│       └── middleware/
│           ├── auth.ts
│           └── rate-limit.ts
│
└── widget/                      # Standalone embeddable widget
    └── chatbot-widget.js        # <5KB minified bundle
```

## 🚀 Getting Started

```bash
# Clone
git clone https://github.com/sandeep-dev/ai-chatbot-builder.git

# Install all dependencies
npm run install:all

# Configure environment
cp server/.env.example server/.env
cp client/.env.example client/.env

# Start development (both frontend + backend)
npm run dev
```

## 🧠 How RAG Works

```
User Question
     │
     ▼
Generate Embedding (OpenAI text-embedding-3-small)
     │
     ▼
Vector Similarity Search (Pinecone/ChromaDB)
     │
     ▼
Retrieve Top-K Relevant Chunks
     │
     ▼
Build Context-Aware Prompt
     │
     ▼
GPT-4o generates answer grounded in your data
     │
     ▼
Stream response to user
```

## 🌐 Embed on Any Website

After creating your bot, copy the embed code:

```html
<script
  src="https://chatbot-builder.app/widget.js"
  data-bot-id="YOUR_BOT_ID"
  data-primary-color="#6366f1"
  data-position="bottom-right"
></script>
```

That's it. The chatbot appears as a floating bubble on your site.

## 📊 Analytics

Track per bot:
- Total conversations & messages
- Average confidence score
- Questions with no answer (knowledge gaps)
- User satisfaction rating
- Peak usage hours
- Geographic distribution

## 🔐 Security

- API keys are hashed server-side and never exposed to the client
- Bot API requests validated by origin domain whitelist
- Rate limiting per bot (configurable)
- PII detection before storing conversation logs

## 📄 License

MIT License
