Cryptocurrency Investment Portfolio Management App

This application allows users to create an account, log in, and manage a portfolio of cryptocurrency investments. It is designed to simulate real-time investments using live cryptocurrency prices. Users can track their portfolio performance, cash out their investments, and manage their account balances. The app is built using a full-stack approach with React for the frontend and Node.js/Express with PostgreSQL for the backend.

Key Features

	•	User Authentication: Secure login and registration system using JWT (JSON Web Token).
	•	Cryptocurrency Portfolio: Users can view a list of available cryptocurrencies, select one, and invest a specific amount of USD.
	•	Real-Time Price Updates: Live cryptocurrency prices are fetched from an API and stored in a local JSON file. Users can see the updated prices and track their portfolio’s performance.
	•	Investment Management: Each investment is displayed with details like the amount invested, the current value in USD, and the profit/loss percentage. The app ensures users cannot invest more than their available balance.
	•	Cashout System: Users can cash out their cryptocurrency investments, converting their holdings into USD based on real-time market values.
	•	Portfolio Overview: A complete breakdown of the user’s current portfolio is shown, with statistics like total USD invested, total current value, and percentage gain/loss.

Project Structure

	•	Frontend (React):
	•	Built using React and TypeScript with a focus on managing user interactions, presenting real-time data, and ensuring a responsive, user-friendly interface.
	•	Components for registration, login, cryptocurrency investment, cashout, and portfolio visualization.
	•	Backend (Node.js/Express):
	•	Manages user authentication (using JWT), CRUD operations for portfolios, and interaction with PostgreSQL for database management.
	•	API endpoints handle operations such as fetching available cryptocurrencies, managing investments, and processing cashouts.

Database

The database is structured using PostgreSQL, with tables to handle user data, portfolios, transactions, and cryptocurrencies. Key features include:

	•	Portafolios Table: Tracks each user’s investments, including the cryptocurrency type, amount invested, price at purchase, and current value.
	•	Users Table: Manages user information, including login credentials, balance, and historical transactions.

Key Sprints

	•	Sprint 1: Environment setup, user authentication (JWT), and initial database configuration.
	•	Sprint 2: Completed the frontend registration and login views, ensuring proper navigation and authentication flows.
	•	Sprint 3: Developed core portfolio functionality, allowing users to invest in cryptocurrencies, track performance, manage balances, cashout functionality and enhanced the user interface for better visualization of portfolio data.

Feel free to adjust or expand upon any section to fit your project needs!
