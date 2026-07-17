# Smart Grocery 🛒

Smart Grocery is a product-inventory management application. It features a modern Angular frontend built with standalone components and Signals, backed by a lightweight, self-contained Express API.

## ✨ Features

* **Full CRUD Inventory Management:** Add, view, edit, and delete grocery products.
* **Inventory Intelligence:** Automatic tracking and visual indicators for stock health:
    * Low stock alerts (Threshold: < 50 units).
    * Expiry warnings (Expiring within 7 days).
    * Expired product flags.
* **Advanced Data Table:** Client-side data manipulation powered by Angular Signals:
    * Text search (queries across name, description, brand, and category).
    * Multi-faceted filtering (by category and stock status).
    * Clickable column sorting (Ascending/Descending).
    * Pagination (10 items per page).
* **Seamless Routing:** Fully implemented Angular routing with deep-linking support for viewing and editing specific products.

## 🛠️ Tech Stack

* **Frontend:** Angular (Standalone Components, Signals, Reactive Forms, HttpClient, SSR configured).
* **Backend:** Node.js, Express.js.
* **Database:** Local JSON file (`server/api/products.json`) for zero-setup, persistent local storage.

## 🚀 Getting Started

### Prerequisites
Ensure you have [Node.js](https://nodejs.org/) and `npm` installed on your machine.

### Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### Running Locally (Development Mode)
The application requires two separate processes to run simultaneously. You will need to open two terminal windows.

Terminal 1: Start the Backend API
Starts the Express server on http://localhost:4000. This serves the data from products.json.
```bash
npm run api
```

Terminal 2: Start the Angular Frontend
Starts the Angular development server on http://localhost:4200. It is configured (via proxy.conf.json) to automatically proxy /api/* requests to your local Express server, avoiding any CORS issues.
```bash
npm start
```

Once both servers are running, open your browser and navigate to: http://localhost:4200/products

### 📦 Production Build & SSR
The frontend is configured for Server-Side Rendering (SSR). To run a production-style build, follow these steps:

Build the application:
```npm run build```

Start the SSR Frontend:
```node dist/my-first-angular/server/server.mjs```

Start the API (in a separate terminal):
```npm run api```
