# Web-Based Documentation Builder

This project is a web-based documentation builder built on top of Yoopta-Editor, using Next.Js and Neon.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)

## Introduction

This project aims to provide an easy way to build documentation style websites using Notion-like UX.

## Features

- Easy to use interface
- Collaboration features
- Media upload *(coming soon...)*
- AI/fulltext search *(coming soon...)*
- Text to speech integration *(coming soon...)*

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js
- npm
- Neon account

### Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/calvinvanoss/capstone.git
    ```

2. Install the dependencies:

    ```sh
    npm install
    ```

3. Setup `.env.local`
    
    ```sh
    cp .env.local.example .env.local
    ```

    Open `.env.local` and follow the embedded directions to set the env variables.
    

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
    go to [`https://local.drizzle.studio`](https://local.drizzle.studio)