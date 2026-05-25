# ScamAlert AI

ScamAlert AI is a multilingual AI SaaS app for detecting scams, phishing, fake payments, fake SINPE receipts, WhatsApp fraud, impersonation, emotional manipulation, suspicious links, screenshots and voice notes.

## Stack

- Next.js 14 App Router
- React and Tailwind CSS
- Firebase Authentication
- Firebase Firestore
- OpenAI API for analysis, OCR-style image reading and audio transcription
- PayPal subscriptions
- Vercel deployment

## Features

- Spanish, English and Portuguese analysis
- Automatic language, region and regional scam pattern adaptation
- Text, link, screenshot, receipt and audio analysis
- OCR support through OpenAI vision
- Audio transcription through OpenAI audio transcription
- Google and email/password login
- Free plan with 1 analysis per month
- Premium plan with PayPal subscription
- User dashboard with history and security score
- Admin dashboard with threat trends
- Privacy policy, terms and AI disclaimer
- SEO metadata, sitemap and robots

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Fill in `.env.local`.

4. Start development:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Firebase setup

1. Create a Firebase project.
2. Enable Authentication providers:
   - Google
   - Email/password
3. Create a Firestore database.
4. Add a web app in Firebase settings.
5. Copy the client config into:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
6. Create a Firebase service account and copy:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`
7. Deploy rules from `firebase.rules` and indexes from `firestore.indexes.json`.

## OpenAI setup

1. Create an OpenAI API key.
2. Set `OPENAI_API_KEY`.
3. Keep defaults or change:
   - `OPENAI_ANALYSIS_MODEL`
   - `OPENAI_TRANSCRIPTION_MODEL`

The app uses OpenAI vision capabilities to read screenshots and receipts, and audio transcription for voice notes.

## PayPal setup

1. Create a PayPal developer app.
2. Create a subscription product and plan for ``$1/month`.
3. Set:
   - `PAYPAL_CLIENT_ID`
   - `PAYPAL_CLIENT_SECRET`
   - `PAYPAL_ENV=sandbox` or `live`
   - `PAYPAL_PLAN_ID`
4. Configure the webhook URL:

```text
https://your-domain.com/api/paypal/webhook
```

The webhook route verifies PayPal signatures with `PAYPAL_WEBHOOK_ID` before updating a subscription.

## Vercel deployment

1. Push the repository to GitHub.
2. Import the GitHub repo in Vercel.
3. Add all variables from `.env.example` in Vercel Project Settings.
4. Set `NEXT_PUBLIC_APP_URL` to the final Vercel domain.
5. Deploy.

## GitHub setup

```bash
git init
git add .
git commit -m "Initial ScamAlert AI app"
git branch -M main
git remote add origin https://github.com/YOUR_USER/scamalert-ai.git
git push -u origin main
```

## Production notes

- Keep Firebase service account values private.
- Use PayPal live credentials only after testing sandbox flows.
- Monitor OpenAI usage and Vercel function duration.
- Adjust `NEXT_PUBLIC_FREE_ANALYSES_PER_MONTH` if you want a different free plan.
