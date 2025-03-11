# Web-Based Documentation Builder

This project is a web-based documentation builder built on top of Yoopta-Editor, using Next and Neon.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation and setup](#installation-and-setup)
  - [Running the Application](#running-the-application)

## Introduction

This project aims to provide an easy way to build documentation style websites using Notion-like UX.

## Features

- Easy to use interface
- Collaboration features
- Media upload *(coming soon...)*
- AI/fulltext search *(coming soon...)*
- Text to speech *(coming soon...)*
- AI autocomplete *(coming soon...)*

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Node
- npm
- Neon account

### Installation/Setup

1. Clone the repository:

    ```sh
    git clone https://github.com/calvinvanoss/capstone.git
    ```

2. Install the dependencies:

    ```sh
    npm install
    ```

3. Set up local environment:
    
    ```sh
    cp .env.local.example .env.local
    ```

    Open `.env.local` and follow the embedded directions to set the env variables.

4. Push database schema:

    ```sh
    npx drizzle-kit push
    ```
    

### Running the Application

1. Start the development server:

    ```sh
    npm run dev
    ```
    Open your browser and navigate to [`http://localhost:3000`](http://localhost:3000).

3.  *Optional* - bring up drizzle studio to view database:

    ```sh
    npm run studio
    ```
    Open your browser and navigate to [`https://local.drizzle.studio`](https://local.drizzle.studio).
