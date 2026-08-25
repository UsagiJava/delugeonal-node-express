# Initial Setup
1. **CONFIGURE** the Project
    - **INSTALL** npm packages in bash,
      - **express**:  web application framework for Node.js to simplify the process of building web servers and backend APIs.
      - **mysql12**: high-performance Node.js client and driver used to connect and communicate with the MySQL database.
      - **cors**: attaches the required Cross-Origin Resource Sharing (CORS) headers to server responses.
      - **dotenv**: loads environment variables from a `.env` file into Node.js's `process.env` object.

      ```
      npm init -y
      npm install express mysql2 cors dotenv
      ```

2. **SETUP** the Git Repository
      - **CREATE** a `.gitignore` plain text file in the root directory containing,
        ```
        node_modules
        .env
        ```
      - **INITIALIZE** git repo in bash.
        ```
        git init
        ```
