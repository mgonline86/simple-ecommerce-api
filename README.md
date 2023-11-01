# Simple-Ecommerce-API Documentation

## 👋 Introduction

This API uses the following:

- Node.js.
- OOP concept.
- REST API Using Express.js.
- MYSQL Database.
- JWT authentication.
- Prisma ORM.

## 🚀 Getting Started

1. Clone this Repo to your local device.

    ```bash
    git clone https://github.com/mgonline86/simple-ecommerce-api.git
    ```

2. In the project folder, install the npm packages.

    ```bash
    cd <cloned_project_path>
    
    npm install
    ```

3. Add The following environmental variables as Mandatory containing your MYSQL Database URL and Token Secret.

    `DATABASE_URL="mysql://<username>:<password>@<host>:<port>/<database_name>"`

    `SERVER_HOSTNAME="localhost"`

4. The following environmental variables are Optional as they have default values.

    `SERVER_HOSTNAME="localhost"`
    `SERVER_PORT=3000`
    `SERVER_TOKEN_EXPIRETIME=300`
    `SERVER_TOKEN_ISSUER="devIssuer"`

5. Navigate to the `/src` folder, then run the prisma migrate command to connect to Database and Seed the Database with Dummy Data.

    ```bash
    cd src
    
    npx prisma migrate dev
    ```

6. To Run The Application in Dev Mode run the following command.

    ```bash
    npm run dev
    ```

7. To Build The Application run the following command.

    ```bash
    npm start
    ```

## 👉 [API Documentaion](https://documenter.getpostman.com/view/15175699/2s9YXcc4jX)

## 👉 [Postman Collection](https://www.postman.com/everprint/workspace/kortobaa/overview)
