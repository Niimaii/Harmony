CREATE TABLE users (
    id SERIAL PRIMARY KEY,              
    discord_id VARCHAR(20) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,  
    password VARCHAR(255) NOT NULL       
);
