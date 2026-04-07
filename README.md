# Customer-Feedback-Collector
Customer Feedback Collector is a small web project I built to collect feedback from users through an online form. The responses are stored in a database so they can be organized and reviewed later. It demonstrates how a simple web application can gather user opinions and manage the data in a structured way.

This project allows users to submit feedback through forms, rate services, and store responses in a structured database. The stored data can then be accessed through APIs for analysis and reporting.

The project demonstrates basic full-stack development concepts including REST API design, backend development, and relational database management.

Objectives
Build APIs to collect and manage customer feedback
Store feedback responses in a structured database
Provide simple analytics to understand user feedback
Demonstrate backend development using Node.js and PostgreSQL
Technology Stack

Backend

Node.js
Express.js

Database

PostgreSQL

Libraries

pg (PostgreSQL client for Node.js)
cors
express
Features
Feedback Collection
Submit feedback responses
Rate services
Store feedback data in a database
Analytics
View feedback summaries
Analyze user ratings
Generate basic reports through API endpoints
Database Design

The system uses a relational PostgreSQL database consisting of multiple tables to manage feedback data.

feedback_forms

Stores information about feedback forms.

Fields:

form_id
title
description
is_active
created_at
questions

Stores the questions that belong to a feedback form.

Fields:

question_id
form_id
question_text
question_type
is_required
users

Stores information about users submitting feedback.

Fields:

user_id
name
age
gender
city
email
timestamp
submissions

Stores records of each feedback submission.

Fields:

submission_id
form_id
user_id
submitted_at
responses

Stores answers given by users for each question.

Fields:

response_id
submission_id
question_id
answer
ratings

Stores numeric service ratings.

Fields:

rating_id
submission_id
question_id
rating (1–5)
API Endpoints
Submit Feedback
POST /feedback

Allows users to submit feedback responses and ratings.

Get Feedback
GET /feedback

Retrieves stored feedback responses from the database.

Feedback Analytics
GET /feedback/analytics

Returns summarized analytics such as:

total feedback submissions
average ratings
feedback statistics
Project Structure
customer-feedback-collector
│
├── public
│   └── index.html
│
├── server.js
├── package.json
└── README.md

public/
Contains the frontend files for submitting feedback.

server.js
Main backend server containing API routes and database connections.

package.json
Contains project dependencies and scripts.
