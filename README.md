# ONLINE-SHOP-EXERCISE
Online-shop-exercise is a e-commerce website that allows users to purchase online.
## Features
1. customer is able to store products in cart.
2. customer is able to create orders.
3. customer is able to pay via third-party payment service.
4. admin is able to view users and their orders
5. admin is able to create, edit, view products.
## Test website
* User: https://online-shop-sql.herokuapp.com/
* Admin: https://online-shop-sql.herokuapp.com/admin

**user**
```
email: user1@example.com
password: 12345678

email: user2@example.com
password: 12345678
```
**credit card No.** 
```
4000 2211 1111 1111
```
**admin**
```
email: root@example.com
password: 12345678
```

## Prerequisites
### global packages
1. Node.js: v10.15.0
2. nodemon: v2.0.7
3. npm: v6.4.1

### local packages
Please check ```dependencies``` in ```package.json```.
### database related
1. sequelize: v6.6.5
2. sequelize-cli: v6.2.0
3. mysql2: v2.3.0
4. MySQL workbench 8.0.26
## Installation and Execution
Please check ```scripts``` in ```package.json``` for commands.
1. clone the project:
```git clone https://github.com/```
2. go into root directory and install packages:
```npm install```
3. add .env file and set the enviroment variables.
4. install MySQL workbench:
* Windows: https://dev.mysql.com/downloads/windows/installer/
* MacOS: https://dev.mysql.com/downloads/mysql
5. connect Workbench with MySQL server (setup followed by development in config/config.json)
6. build a database:
```create database e_commerce```
7. build tables and insert seed data:
```
npx sequelize db:migrate
npx sequelize db:seed:all 
```
8. launch server:
```npm run dev```
9. get public URL for third-party payment service
```./ngrok http 3000```
10. sign in using user seed data:
```
user:
email: user1@example.com
password: 12345678

email: user2@example.com
password: 12345678

admin:
email: root@example.com
password: 12345678
```
