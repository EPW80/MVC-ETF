# ETF-MVC Project

This project is a web application for fetching and displaying historical stock data for ETFs such as SOXL and SOXS. It follows the Model-View-Controller (MVC) architectural pattern.

## Features

- Fetch historical stock data from Yahoo Finance.
- Display stock data on a line chart using Chart.js.
- Simple, clean, and responsive UI design.
- Server-side handling with Node.js and Express.
- Client-side interactivity with JavaScript and Chart.js.

## Project Structure

```
/etf-mvc
/dist
/controllers
/models
/views
/public
/js
main.js
/css
style.css
index.html
/src
/controllers
DataController.ts
TradeController.ts
/models
DataModel.ts
TradeModel.ts
/views
/data
package.json
package-lock.json
tsconfig.json
README.md
```

## Installation

1. **Clone the repository:**

   ```
   git clone 
   cd <project>
   ```

Install dependencies:

```
npm install
```

Compile TypeScript to JavaScript:

```
npx tsc
```

Fetch historical data:

```
npm run fetch-data
```

Start the server:

```
npm start
```

### Usage

Access the application:

Open your browser and navigate to <http://localhost:3000>.

### Fetch stock data

Enter the stock symbol (e.g., SOXL or SOXS).
Enter the start date.
Enter the end date.
Click the "Get Data" button to fetch and display the data on the chart.

### Project Files

- HTML
public/index.html

The main HTML file that contains the form for input and a canvas for displaying the chart.

- CSS
public/css/style.css

CSS file for styling the form, canvas, and overall page layout.

- JavaScript
public/js/main.js

JavaScript file for handling form submission, fetching data from the server, and rendering the chart using Chart.js.

- Server Configuration
src/server.ts

Node.js server configuration using Express to handle routes and serve static files.

- Controllers
src/controllers/DataController.ts

Handles requests for fetching historical stock data.

- Models
src/models/DataModel.ts

Handles data retrieval logic for stock data.

- TypeScript Configuration
tsconfig.json

TypeScript configuration file.

### Dependencies

- Express - Fast, unopinionated, minimalist web framework for Node.js.
- Body-Parser - Node.js body parsing middleware.
- Chart.js - Simple yet flexible JavaScript charting for designers & developers.
- Chartjs-Adapter-Date-Fns - Adapter for date-fns to be used with Chart.js.
- Yahoo-Finance2 - Yahoo Finance API for Node.js.
- TypeScript - Typed JavaScript at Any Scale.

### License

This project is licensed under the MIT License.
