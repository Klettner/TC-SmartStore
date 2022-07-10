# Smart Store
TechChallenge 2022 "Guided Construction" 🏗👷‍

## Description
Smart Store is an intelligen storing solution for construction sites, so that construction managers and workers never lose track of availble parts and their location again.  
It consists of three systems. A web application (frontend) that is displayed in the terminal. A backend that handles and persists the data. And the edge client (Raspberry Pi) that gathers all the sensor data and sends it to the backend.

## Set up
### Backend Sever
1. Open the **Backend** folder in a terminal
2. Install the required dependencies:    
``npm install``
3. Copy the .env.dist file to .env and fill in the required values  
``cp .env.dist .env``
4. Change the database connection string in Backend/src/server.ts  
5. Start in dev mode using  
``npm run dev``
6. For use in production run  
``npm run build && npm run start``
7. If you want to deploy it on heroku use branch: __deployment-be__
  
### Frontend Server
1. Open the **Frontend** folder in a terminal
2. Install the required dependencies:    
``npm install``
3. Start in dev mode using  
``npm run dev``
4. For use in production run  
``npm run build && npm run start``
5. If you want to deploy it on heroku use branch: __deployment-fe__
  
### Edge Client
1. Clone the repo to the Raspberry Pi and open the **Edge** folder
2. Install the required dependencies:  
``pip3 install -r requirements.txt``
3. Copy the .env.dist file to .env and fill in the required values  
``cp .env.dist .env``
4. Calibrate the pallets using:  
``python3 run.py``
5. Start the communication with the backend using:  
``pyhon3 main.py``
