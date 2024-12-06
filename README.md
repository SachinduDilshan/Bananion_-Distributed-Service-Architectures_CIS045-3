# Math Game with Firebase Integration for the Distributed Server Architecure module.

## Project Overview

This Math Game is a React-based web application where players solve math equations within a limited time frame. The game offers three difficulty levels (Beginner, Intermediate, Expert), with each level having different time limits. Players can make up to two mistakes before the game ends. The scores are based on remaining time, and the highest scores are stored in Firebase Realtime Database. The profile page displays the user’s highest scores for each difficulty level.

## Features

- **User Authentication**: User login and registration with Firebase Authentication.
- **Difficulty Levels**: Three difficulty levels — Beginner (60s), Intermediate (45s), Expert (30s).
- **Question Management**: Math questions are fetched from a custom API and displayed for the user to solve.
- **Score Tracking**: Scores are calculated based on the time taken to answer questions correctly, and the highest scores are stored in Firebase.
- **Profile Page**: Displays user information and highest scores for each difficulty level.
- **Real-time Database**: Uses Firebase Realtime Database to store scores and user details.
- - **Challenging Users**: User can challenge another player.


## Technologies Used

- **Frontend**: React, React Router, Bootstrap
- **Backend**: Node.js, express, Firebase Authentication, Firebase Realtime Database
- **Other Libraries**: Firebase SDK

  I haven't shared the service account due to google's security policies.
