# Zapier Clone

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

## 📌 About the Project

A Zapier-inspired automation system that enables webhook functionality for automating tasks based on GitHub comments. The system listens for specific GitHub repository comments and triggers a series of automated actions, including sending Solana transactions and email notifications.

---

## 📸 Project Screenshots

<details>
  <summary><strong>System Architecture</strong></summary>
  <img src="/apps/client/public/images/arch.png" alt="arch" />
</details>

<details>
  <summary><strong>Webhook trigger Setup</strong></summary>
  <img src="/apps/client/public/images/trigger.png" alt="trigger" />
</details>

<details>
  <summary><strong>Webhook actions Setup</strong></summary>
  <img src="/apps/client/public/images/actions.png" alt="actions" />
</details>

<details>
  <summary><strong>Webhooks</strong></summary>
  <img src="/apps/client/public/images/pub.png" alt="pub" />
</details>

---

## 📑 Index

- [Features](#features)
- [Built With](#built-with)
- [Installation](#installation)
- [How It Works](#how-it-works)
- [Roadmap](#roadmap)
- [Support](#support)
- [License](#license)

---

## 🚀 Features

✅ **Webhook System**

- Generate unique webhook URLs per Zap
- Process incoming GitHub webhook events

✅ **Task Automation**

- Execute actions based on GitHub comments:
  - **Send Solana transactions**
  - **Send email notifications**

✅ **Scalability & Performance**

- Kafka-based event-driven architecture
- Transactional outbox pattern for reliable event processing

---

## 🛠 Built With

- **Frontend**: Next.js
- **Backend**: Express.js, Prisma
- **Database**: PostgreSQL
- **Queue Processing**: Kafka (for Outbox Processor & Worker)
- **Webhooks Processing**: Custom Webhook Handler
- **Email Messaging**: AWS SMTP  
- **Authentication**: JWT

---

## 📦 Installation

### Running Locally

#### 1️⃣ Clone the repository

```sh
git clone https://github.com/Shyaminda/Zapier.git
cd zapier
```

#### 2️⃣ Install dependencies

```sh
npm install
```

#### 3️⃣ Set up environment variables

Copy `.env.example` to `.env` and configure the following:

```env
SOL_PRIVATE_KEY="your-private-key"
SMTP_USERNAME="your-smtp-username"
SMTP_PASSWORD="your-smtp-password"
SMTP_ENDPOINTS="your-smtp-endpoints"
DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/postgres"
```

#### 4️⃣ Start PostgreSQL with Docker

```sh
docker run -p 5432:5432 -e POSTGRES_PASSWORD=mysecretpassword -d postgres
```

#### 5️⃣ Generate and seed the Prisma database

```sh
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

#### 6️⃣ Start the services

```sh
# Start the frontend
cd apps/client && npm run dev
```
Your frontend will run at [http://localhost:3000](http://localhost:3000) 🚀

```sh
# Start the backend
cd apps/api && npm run dev
```
Your backend will run at [http://localhost:3001](http://localhost:3001) 🚀

```sh
# Start the hooks server
cd apps/hooks && npm run dev
```
Your hooks server will run at [http://localhost:3002](http://localhost:3002) 🚀

#### 7️⃣ Set up Kafka with Docker

```sh
docker run -p 9092:9092 apache/kafka:3.7.1
docker exec -it <container_id> bash
cd /opt/kafka/bin/
./kafka-topics.sh --create --topic zap-events --bootstrap-server localhost:9092
exit
```

#### 8️⃣ Start additional services

```sh
# Start the outbox processor
cd apps/processor && npm run dev
```

```sh
# Start the worker server
cd apps/worker && npm run dev
```

---

## 🔍 How It Works

1️⃣ **Creating a Zap**

- Users create a **Zap**, generating a unique webhook URL.

2️⃣ **GitHub Comment Event**

- A GitHub repository owner comments on an issue or PR with:

```json
{
    "comment": {
        "amount": 1.9,
        "address": "dcvbvvbgfngfnukyky-solana-wallet-address",
        "email": "user@example.com"
    }
}
```

<details>
  <summary><strong>Postman data transfer</summary>
  <img src="/apps/client/public/images/postman.png" alt="postman" />
</details>

3️⃣ **Processing Flow**

<details>
  <summary><strong>System design</strong></summary>
  <img src="/apps/client/public/images/arch.png" alt="arch" />
</details>

- GitHub sends the comment to the webhook URL.
- The backend stores it in the **transactional outbox**.
- The **outbox processor** moves the event to **Kafka**.
- The **worker** picks it up and executes the following:
  - Sends **1.9 SOL** to `solana-wallet-address`.
  - Sends an email notification to `user@example.com`.
- A response is sent back to GitHub.

<details>
  <summary><strong>Successful console</strong></summary>
  <img src="/apps/client/public/images/console-success.png" alt="console-success" />
</details>

---

## 📌 Roadmap

- 📂 Improve webhook logging and monitoring.
- 🚀 Enhance UI for better visualization.
- 🛠  Optimize Kafka event processing.
- 🔧 Improve security and access control.
- ⚙️ Deploy and manage services with **Kubernetes** for scalability.

Planned improvements.

---

## 💡 Support

If you find this project useful, please consider giving it a ⭐ on GitHub.

---


## 📝 License

MIT License – Free to use and modify.
