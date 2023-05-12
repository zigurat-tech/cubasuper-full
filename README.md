# Cubasuper monorepo

This project is composed of two services:

- WEB: Nextjs web app build using Typescript, Chakra UI and Zodios. 
- API: Django api using DRF

## How do i run this?

- Step 1: Clone the repo
- Step 2: Create a .env file from the .env.local and be sure to edit it. 
- Step 3: Make sure you have docker installed
- Step 4: Make sure you have makefile support (Linux has makefile support of the box)
- Step 5: Use the following command to build the images and start your container -> make start
- Step 6: Use the following command to migrate database -> make migrate