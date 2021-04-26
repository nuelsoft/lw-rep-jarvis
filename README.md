
# Fictional Social media API
## DOCUMENTATION
The documentation for the REST API lives [here](https://documenter.getpostman.com/view/5971478/TzJycvgH) on POSTMAN
## SETUP
### Install MongoDB database locally
Visit [MongoDB](https://www.mongodb.com/try/download/community) to install a community version of the database.

### Clone this repository
clone this repository from Github to your computer

### Setup your environment
```sh
cp .env.example .env
```
then fill out the values  in the `.env` file or use this sample
```sh
MONGO_URI=mongodb://localhost/talentql
PORT=9002
EMAIL_HOST=<SMTP_HOST>
EMAIL_PORT=587
EMAIL_USE_TLS=0
EMAIL_USER=<SMTP_USER>
EMAIL_PASS=<SMTP_PASSWORD>
REDIS_URL=<REDIS_URL>
JWT_SECRET=8b7e25050fbcebcac1153b7e851fac661fb2ebc650c
```

### Install dependencies
```sh
npm i
```
### Run the app in watch mode
```sh
npm run watch
```
### Run tests
For the sake of duplication errors that mongo combats aggressively, I did not include tests for the auth module.
manually create a new user in the database by running the following request on the running server:
```
POST /api/v1/users

{
    "email": "benjamincath@gmail.com",
    "password": "mmmmmmmm"
}
```
Examples of this request are also available in the POSTMAN docs linked above.

Kill the server you started above and run tests.
```sh
npm test
```