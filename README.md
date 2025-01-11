# book-ecommerce-app-backend

It's a simple backend of an e-commerce app for books.

## Backend e-commerce app tasks for V 1.0.0

- [X] **Setup Project**

  - [X] Initialize Node.js project.
  - [X] Set up Express framework.
  - [X] Configure MongoDB database connection.
  - [X] Setup .prettier and eslint for formating and code quality.
  - [X] Setup .env.
  - [X] Initial error hundler middleware.
  - [X] Initial logs middleware.
  - [X] Setup loggers.

- [X] **Authentication System**

  - [X] Design user schema including role-based access control (e.g., admin vs user).
  - [X] Implement user registration endpoint.
  - [X] Implement user login endpoint.
  - [X] Use JWT for token-based authentication.
  - [X] Implement user logout endpoint.
  - [X] Document all endpoints in postman.
  - [X] Make an integrational tests for user registration endpoint. 
  - [X] Make an integrational tests for user login endpoint. 
  - [X] Make an integrational tests for user logout endpoint. 

- [ ] **Box Management**

  - Create CRUD (Create, Read, Update, Delete) endpoints for boxes.
  - Validate incoming data (e.g., box name, price, and stock).

- [ ] **Shopping Cart**

  - Add endpoints for managing the shopping cart:
    - Add box to cart.
    - Remove box from cart.
    - Get cart details.

- [ ] **Order Management**

  - Create an endpoint for placing orders:
    - Save order details (e.g., items, total price, user info).
    - Update stock quantities after purchase.
  - Create an endpoint for retrieving user orders.

- [ ] **Localization Support**

  - Enable multilingual support for messages (e.g., validation errors, success responses).

- [ ] **Admin Dashboard API**

  - Add endpoints for admin actions:
    - View inventory status.
    - Manage boxes (add/edit/delete).
    - View sales and order stats.

- [ ] **Testing and Documentation**
  - Write unit tests for critical routes and services.
  - Document API endpoints using tools like Postman or Swagger.

---
