# Multi-Level Referral and Earning System with Live Data Updates

## Overview
This project implements a **multi-level referral and earning system** with real-time data updates using **Nest.js**, **GraphQL**, **WebSockets**, and **MongoDB Atlas**. The system allows users to:

- Refer up to 8 people directly.
- Earn profits based on direct and indirect referrals.
- View live updates of their earnings in real time without refreshing the page.

## Features

### Referral System
- Users can refer up to 8 individuals directly.
- Hierarchical tracking of referrals for up to 2 levels.

### Profit Distribution Logic
- **Direct Earnings:**
  - Users earn 5% of the profit from their direct referrals (Level 1).
- **Indirect Earnings:**
  - Users earn 1% of the profit from Level 2 users (via their direct referrals).
- **Threshold:**
  - Earnings are calculated only if the purchase exceeds or equals 1000 Rs.

### Real-Time Updates
- Leveraging **WebSockets**, users receive live updates on earnings when a referred user completes a valid transaction.

### Reports and Analytics
- APIs provides Breakdown of referral-based earnings by level.

## Technology Stack
- **Backend:** Nestjs, GraphQL, WebSockets
- **Database:** MongoDB Atlas

## Setup Instructions

### Prerequisites
- Node.js (v14 or later)
- Npm

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/shivamgoyalCD/referral-task.git
   ```
2. Navigate to the project directory:
   ```bash
   cd referral-task
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application
1. Start the development server:
   ```bash
   npm start:dev
   ```

## API Documentation
### GraphQL APIs
#### 1. Query:
`getUserById(id: String!): User` (Fetch User By ID)
`getEarningReport(id: String!): EarningReport!` Fetch User's Earning report with multiple hirerchy

#### 2. Mutation: 
`createUser(data: CreateUserInput!): User!`
`updateUser(id: String!, data: UpdateUserInput!): User!`
`createPayment(data: CreatePaymentInput!): Payment!`

### WebSocket Events
- **Event:** `earningsUpdated`
  - Real-time updates for a user’s earnings when a payment is created

