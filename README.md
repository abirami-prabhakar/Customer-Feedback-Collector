# Customer-Feedback-Collector
Customer Feedback Collector is a small web project I built to collect feedback from users through an online form. The responses are stored in a database so they can be organized and reviewed later. It demonstrates how a simple web application can gather user opinions and manage the data in a structured way.

This project allows users to submit feedback through forms, rate services, and store responses in a structured PostgreSQL database. The stored data can be retrieved using API endpoints and analyzed to generate feedback insights.

The project demonstrates core backend development concepts such as REST APIs, relational database design, and feedback analytics.

This project allows users to submit feedback through forms, rate services, and store responses in a structured PostgreSQL database. The stored data can be retrieved through API endpoints and analyzed to generate useful insights.

The project demonstrates backend development concepts such as REST API design, relational database management, and structured data collection.

Build APIs to collect and manage customer feedback
Store feedback responses in a structured database
Provide analytics to understand user feedback
Demonstrate backend development using Node.js and PostgreSQL


**Technology Stack**

Backend	 - Node.js
Framework - Express.js
Database  -	PostgreSQL
Libraries	 - pg, cors, express

**Features**

**Feedback Collection**
Submit feedback responses
Rate services
Store responses in the database

**Feedback Analytics**
View feedback summaries
Analyze service ratings
Generate reports using API endpoints
Database Design

The system uses a relational PostgreSQL database to organize feedback data.

**Main Tables**
feedback_forms  -	Stores information about feedback forms
questions	      - Stores questions associated with forms
users	          - Stores information about users
submissions	    - Stores records of feedback submissions
responses       - Stores answers to form questions
ratings         -	Stores numeric service ratings


**API Endpoints**

POST	/feedback	- Submitfeedback and ratings
GET	/feedback	- Retrieve all feedback responses
GET	/feedback/analytics	- Retrieve summarized feedback analytics


**Project Structure**
customer-feedback-collector
│
├── public
│   └── index.html
│
├── server.js
├── package.json
└── README.md


