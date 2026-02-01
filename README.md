# StoreFleet

StoreFleet is a full-stack **online store & delivery platform** project designed to handle products, users, and orders — the backend engine that drives a retail ecosystem. This repo contains the server APIs powering StoreFleet’s data, auth, and order workflows.

> ⚠️ Currently under development — doc sections will get links once frontend & routes finalize.

---

## 🚀 Features

StoreFleet backend currently (or soon) supports:

- 🔐 **User Authentication**
  - Register & login
  - JWT-based secure sessions
  - Profile update
- 🧾 **Product Management**
  - Add, update, delete products
  - Fetch product listings
- 🛍️ **Order Processing**
  - Create new orders
  - Update order status
  - Order history endpoints
- 🛠️ Clean folder structure with future-ready modular routes

---

## 🧰 Tech Stack

This project is built using:

| Technology | Purpose |
|-----------|---------|
| **Node.js** | Server runtime |
| **Express.js** | API endpoints & routing |
| **MongoDB** | NoSQL database |
| **Mongoose** | DB models & schema |
| **bcrypt** | Password hashing |
| **jsonwebtoken** | Auth tokens |
| **nodemailer** | (Optional) Email services |
| **Validator** | Input sanitization |

---

## 🏗️ Setup & Installation

### 1. Clone the repo

```bash
git clone https://github.com/sushanthacharya2003/StoreFleet.git
cd StoreFleet
