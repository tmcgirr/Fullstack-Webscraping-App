-- SQL Commands
CREATE DATABASE gaspricescraper;

CREATE TABLE gasprices (
  id SERIAL PRIMARY KEY,
  date VARCHAR(50),
  name_address VARCHAR(250),
  gas_price MONEY,
  gas_type VARCHAR(50),
);