# Project of Web Media Library

You need to have Docker and Docker Compose installed on your server to set up dev environment or set up it by your self.

This project has been implemented with PHP and Javascript and persisted with MySQL.

### Versions
- PHP 7.4-FPM
- JavaScript ES6
- MySQL 5.7

# Frameworks 
- Laravel 8
- ReactJS 17

## Running the application

Start cloning the repository:
```bash
git clone https://github.com/helmarjunior/everyangle
```

###Docker

- To get started, set up your application in the root directory.
- Set the environment variables creating a `.env` file with the content:
```bash
DB_HOST=db
DB_DATABASE=laravelapp
DB_USERNAME=laravelapp_user
DB_PASSWORD=password
```

- Build the app image with the following command:

```bash
docker-compose build app
```

- When the build is finished, you can run the environment in background mode with:

```bash
docker-compose up -d
```

- To show information about the state of your active services, run:

```bash
docker-compose ps
```

###Backend

To set up the application backend with Laravel, go to the **everyangle-app** and install the project dependencies with composer. 
```bash
cd everyangle-app
composer install
```
After installing the dependencies is necessary to generate the database structure.
The migrations will make it:
```bash
php artisan migrate:fresh 
```

###FrontEnd

To set up the application frontend with ReactJS, go to the **everyangle-app/resources** and install the project dependencies with npm. 
```bash
cd everyangle-app/resources/react-app
npm install
```