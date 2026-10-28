# Live Code Collaboration IDE: A Decentralized Platform for Real-Time Collaborative Coding and Secure Code Execution

[![Node.js: 18+](https://img.shields.io/badge/Node.js-18%2B-339933.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-Frontend-61dafb.svg)](https://react.dev/)
[![Yjs](https://img.shields.io/badge/Yjs-CRDT-orange.svg)](https://yjs.dev/)
[![WebRTC](https://img.shields.io/badge/WebRTC-P2P-333333.svg)](https://webrtc.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248.svg)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Sandbox-2496ED.svg)](https://www.docker.com/)
[![Storj](https://img.shields.io/badge/Storj-Decentralized%20Storage-2683FF.svg)](https://www.storj.io/)

## Abstract

LiveIDE (Live Code Collaboration IDE) is a full-stack web platform that allows multiple developers to write, edit and execute code together in real time. The system combines conflict-free replicated data types (CRDTs), peer-to-peer networking, container-based sandboxing and decentralized object storage into a single collaborative development environment.

The project pairs a React frontend for interactive editing with a Node.js and Express backend that handles authentication, room management and peer signaling. Real-time text synchronization is performed directly between browsers using Yjs over WebRTC, so the high-frequency keystroke stream does not pass through a central server. Untrusted user code is executed inside short-lived Docker containers, user and room metadata are stored in MongoDB, and project files are persisted to the Storj decentralized storage network.

By unifying these capabilities, LiveIDE provides a practical environment for pair programming, teaching, technical interviews and research on decentralized collaboration architectures.

---

## 1. Introduction

Real-time collaboration has become a core requirement of modern software development, education and remote work. Two technical challenges sit at the heart of any collaborative code editor:

1. Keeping the document consistent across many users who edit it at the same time
2. Running code submitted by multiple users without endangering the host system

LiveIDE addresses both challenges in a single platform. For synchronization, it uses CRDTs so that concurrent edits merge deterministically without a central ordering authority. For execution, it uses container isolation so that user-submitted code never touches the host operating system.

The system demonstrates how peer-to-peer networking, distributed data structures, secure execution and decentralized storage can be combined into a coherent workflow. It is relevant to research, academic study and prototype deployment of collaborative developer tools.

---

## 2. Motivation and Problem Statement

Most collaborative editors, such as Google Docs, rely on Operational Transformation (OT). OT requires a central server to impose a strict total order on every edit and to transform concurrent operations against each other. This creates three problems:

- a single point of failure
- growing server cost and latency as usage increases
- difficulty supporting offline editing and peer-to-peer topologies

At the same time, any tool that executes user-submitted code introduces serious security risk if that code is run directly on the server.

Many existing solutions address only part of this problem. LiveIDE closes the gap by providing a unified platform that supports:

- conflict-free real-time editing using CRDTs
- direct browser-to-browser synchronization over WebRTC
- sandboxed code execution with isolation from the host
- authenticated access and room-based collaboration
- decentralized, encrypted persistence of project files

This makes the system valuable for education, research demonstration and applied web engineering.

---

## 3. Research and Development Goals

The project is designed to achieve the following goals:

- Build a practical real-time collaborative editor based on CRDTs rather than OT
- Minimize server involvement in the high-frequency synchronization path
- Provide a secure pipeline for executing untrusted code
- Support room-based collaboration with authenticated users
- Persist project files on decentralized, encrypted storage
- Keep the architecture modular so individual layers can be replaced or extended
- Provide a reproducible local development setup

---

## 4. Scope of the Project

LiveIDE is a research and learning-oriented system that integrates:

- real-time collaborative editing
- peer-to-peer synchronization
- peer discovery through signaling
- containerized code execution
- user authentication and session management
- decentralized file persistence
- web-based interactive interface

The project is not limited to a single editor or language. It presents an end-to-end framework for exploring decentralized collaboration and safe execution in a structured and user-accessible manner.

---

## 5. System Overview

LiveIDE is implemented as a multi-layer application consisting of:

- a frontend for editing, room management and output display
- a backend for authentication, signaling and execution control
- a synchronization layer built on Yjs and WebRTC
- an execution layer based on Docker
- a storage layer combining MongoDB and Storj

The guiding architectural principle is to **keep high-frequency traffic (keystrokes) off the server, and use the server only for trust-critical and compute-critical tasks.**

```text
+--------------------------------------------------------------+
|                 Frontend (ReactJS, browser)                  |
|     Editor | Room UI | Output panel | Yjs doc | y-webrtc      |
+-------+--------------------+-------------------+-------------+
        | REST (cookies)     | Socket.IO         | WebRTC data channel
        |                    | signaling         | (peer-to-peer)
        v                    v                   v
+------------------------------------------+   +-------------+
| Backend (Node.js + Express)              |   | Other peers |
| Auth, rooms, signaling, run-code API     |   | in the room |
+------+-------------------+---------------+   +-------------+
       |                   |
       v                   v
  +---------+     +------------------+     +-------+
  | MongoDB |     | Docker sandbox   |     | Storj |
  | users,  |     | (one container   |     | files |
  | rooms   |     |  per execution)  |     |       |
  +---------+     +------------------+     +-------+
```

---

## 6. Functional Capabilities

### 6.1 Real-Time Collaborative Editing

The synchronization module allows multiple users to edit the same document simultaneously.

#### CRDT-Based Conflict Resolution
This track uses Yjs to manage the shared document:
- every insert and delete is tracked with a unique identifier
- concurrent edits merge deterministically on every peer
- no central server decides the order of operations
- edits made while offline merge automatically after reconnection

#### Peer-to-Peer Transport
This track uses WebRTC through `y-webrtc`:
- direct browser-to-browser data channels
- low-latency transmission of small binary updates
- presence and cursor information shared between peers
- reduced load on the backend server

The combination of CRDTs and WebRTC removes the central ordering bottleneck found in OT-based systems.

### 6.2 Room Management and Peer Discovery

The platform provides:
- creation of coding rooms with unique Room IDs
- joining of rooms by sharing the Room ID
- Socket.IO-based signaling that lets browsers exchange WebRTC handshake data
- automatic connection of new participants to existing peers

### 6.3 Secure Code Execution

The execution module runs user-submitted code safely:
- a fresh Docker container is created for each run
- code is injected into the container and executed
- standard output and errors are captured and returned to the interface
- the container is destroyed after execution
- the host operating system is never used to run user code

Resource limits, restricted networking and timeouts are the recommended hardening measures for this pipeline.

### 6.4 Persistence

The storage module supports:
- storing user accounts and room metadata in MongoDB through Mongoose schemas
- uploading the final project files to Storj on manual save or session end
- storing the Storj reference in MongoDB so that projects can be reloaded

Storj provides client-side encryption and distributes erasure-coded pieces of each file across a global network of nodes.

### 6.5 Authentication and Access Control

The project includes support for:
- user registration and login
- salted password hashing before storage
- secure HTTP-only cookies for session handling
- session validation on protected routes
- room-level access to the collaborative workspace

---

## 7. Technical Architecture

### 7.1 Frontend Layer

The frontend is implemented using ReactJS. It provides the code editor, room creation and joining interface, output panel and connection handling. It owns the Yjs document and the WebRTC provider, and it communicates with the backend through REST and Socket.IO.

### 7.2 Backend Layer

The backend is implemented using Node.js and Express. It provides:
- REST API endpoints
- authentication and session management
- room creation and lookup
- Socket.IO signaling
- a local `y-webrtc` signaling server
- the code-execution endpoint
- integration with MongoDB, Docker and Storj

### 7.3 Synchronization Layer

The synchronization layer includes:
- the Yjs shared document
- the `y-webrtc` provider
- awareness state for cursors and presence
- state-vector based reconnection and catch-up

### 7.4 Execution Layer

The execution layer is a Docker-based pipeline that creates an isolated container for each execution request and removes it after the result is returned.

### 7.5 Storage Layer

The storage layer combines:
- MongoDB for users, rooms and references
- Storj for the actual project files

### 7.6 Session Lifecycle

1. **Authentication:** the user logs in; the backend verifies the hashed password against MongoDB and issues a secure HTTP-only cookie.
2. **Room generation:** the backend creates a unique Room ID, stores it in MongoDB and the frontend opens the editor.
3. **Peer discovery:** browsers connect to the signaling layer; when a second user joins the same Room ID, the peers exchange WebRTC handshake data (SDP offers/answers and ICE candidates).
4. **Real-time synchronization:** a direct WebRTC connection opens; Yjs transmits each insert and delete to peers, and CRDT rules guarantee convergence.
5. **Code execution:** on **Run**, the code is sent to the backend, executed in a Docker container, and the output is returned.
6. **Persistence:** on save or session end, the project is uploaded to Storj and the reference is stored in MongoDB.

---

## 8. Technology Stack

### Frontend
- ReactJS
- JavaScript
- Yjs
- y-webrtc
- Socket.IO client

### Backend
- Node.js
- Express
- Socket.IO
- Mongoose
- Cookie-based authentication with session and JWT secrets
- Environment-based configuration

### Infrastructure and Storage
- MongoDB
- Docker
- Storj
- WebRTC

---

## 9. Repository Structure

```text
Live-Code-Collaboration-IDE/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Room.js
│   ├── utils/
│   │   ├── hashPassword.js
│   │   └── storjClient.js
│   ├── ...                  (routes, server entry point)
│   ├── package.json
│   └── .env                 (not committed)
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── .gitignore
├── package.json             (root scripts: install-all, start)
├── package-lock.json
└── README.md
```

> The exact layout of `backend/` and `frontend/` should be adjusted to match the repository.

---

