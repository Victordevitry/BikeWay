# Bikeway

Bikeway: Your biking companion for seamless route planning and sharing.

**Current Access Link**: [bikeway-bucket.s3-website.eu-west-3.amazonaws.com](http://bikeway-bucket.s3-website.eu-west-3.amazonaws.com)

**Warning**: Some features, like accessing your device's location and sharing routes, require HTTPS. I'm currently working on obtaining an SSL certificate and a custom domain name. These should be set up in a few days.

## Table of Contents
- [Pages](#pages)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [License](#license)

## Pages
- **Home Page**:
  - Introduction to Bikeway.
  - Access route planning and location features with the integrated map present on the home page.

- **Popular Routes Page**:
  - Explore popular cycling routes in your city, complete with pictures and descriptions to help you choose the right route.
  - Each route includes a link for easy access to detailed information on the integrated map.

- **About Page**:
  - Information about Bikeway's values and the founding team.

- **User Sign-Up/Log In Page**:
  - Allows unregistered users to create accounts and access the full functionalities of Bikeway.

- **Account Page**:
  - Features for saving a home and/or work address to streamline future bike route planning; these can be modified at any time.
  - View your saved routes, rate them, share them, or delete them as needed.
 
## Features
- **Interactive Map**: Access an interactive map integrated within the web application.
- **Bike Route Information**: Search for bike routes using a start and end address to obtain information about the route.
- **Route Saving, Rating, and Sharing**: If logged in, you can save any routes displayed on the integrated map. On your account page, you can rate these routes and share them with friends.
- **User Account Management**: Sign up, log in, and manage your account information.
- **Popular Biking Routes**: Discover popular biking routes in your city (currently available for Barcelona and Paris) on the integrated map.
- **Dark/Light theme**: Change the theme of the web application with a button in the header
- **Location Sharing**: Access your device's location to facilitate easier route planning.
- **Address Autocomplete**: Enjoy address autocompletion for a better user experience.


## Technologies Used
- Angular for front-end development
- Node.js and Express for back-end development
- MongoDB for database management
- AWS S3 for static file hosting
- AWS Lightsail for server hosting
- AWS Certificate Manager for SSL certification

## License
This project is licensed under the MIT License.
