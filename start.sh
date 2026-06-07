#!/bin/bash

echo "Starting Backend..."

cd backend

npm install

npm run dev &

sleep 5

echo "Starting Frontend..."

cd ../frontend

npm install

npm run dev