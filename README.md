# Analytics MultiApp

## Project Overview

The **Analytics MultiApp** is an interactive, feature-rich web application that consolidates multiple data sources into a single platform. It features widgets for real-time updates on weather, stock market data, news, movies, and more. The app offers a user-friendly experience with customizable layouts, smooth animations, and responsive design.

## Features

- **Weather Updates**: Real-time weather forecasts with multi-day predictions.
- **News Widget**: Fetch and display categorized news articles (e.g., General, Technology, Business) using NewsAPI.
- **Stock Market Analysis**: Monitor real-time stock prices and trends from financial APIs.
- **Movie Information**: View trending movies, ratings, and trailers using the TMDB API.
- **GitHub Insights**: Showcase repository stats, commits, and contributors.
- **Custom Widgets**: Drag-and-drop widgets for a personalized dashboard.
- **Advanced Animations**: Interactive UI elements built with **Framer Motion**.
- **Theme Modes**: Light and Dark modes for optimal user experience.
- **Real-Time Data**: Automatically update news, weather, and stock data with WebSockets.
- **Responsive Design**: Optimized for all devices—desktop, tablet, and mobile.

---

## Technologies Used

- **Frontend Framework**: Next.js  
- **Language**: TypeScript  
- **Styling**: Tailwind CSS  
- **State Management**: Redux Toolkit  
- **Data Visualization**: Recharts & D3.js  
- **Animations**: Framer Motion, CSS Transitions  
- **Backend APIs**: OpenWeatherMap, NewsAPI, Alpha Vantage, TMDB, GitHub API  
- **Real-Time Updates**: WebSockets for stock prices and news.  

---

## Project Structure

```bash
├── app/                  # Main application structure (pages, layouts)
├── components/           # Modular mini components (widgets, cards, buttons)
├── styles/               # Custom Tailwind CSS configurations
├── utils/                # Helper functions and utilities
├── public/               # Public assets (icons, images)
```

---

## Installation Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/Ayushpal11/Analytics_MultiApp.git
   ```

2. Navigate to the project directory:
   ```bash
   cd Analytics_MultiApp
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

---

## Running the Project

- **Development Mode**:
  ```bash
  npm run dev
  ```
  Access the application at `http://localhost:3000`.

- **Production Mode**:
  ```bash
  npm run build
  npm start
  ```

---

## Environment Variables

Create a `.env.local` file in the root directory and add the following keys:

```env
# Weather API Key
NEXT_PUBLIC_WEATHER_API_KEY=your_openweathermap_api_key

# News API Key
NEXT_PUBLIC_NEWSAPI_API_KEY=your_newsapi_key

# Stock Market API Key
NEXT_PUBLIC_FINANCE_API_KEY=your_alpha_vantage_api_key

# TMDB API Key
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
```

Ensure these APIs are active and their respective keys are valid.

---

## Deployment

The project is deployed on **Vercel** for seamless production hosting.  
Visit the live demo here: [Live Demo Link](https://analytics-multi-app.vercel.app/).

---

## Additional Features

- **Widget Customization**: Drag-and-drop widgets for custom layouts.
- **Localization**: Multi-language support using **react-i18next**.
- **Real-Time Data**: Automatic data refresh using WebSocket connections.
- **Smooth Animations**: Enhance user engagement with interactive animations.
- **Error Handling**: Graceful handling of API failures with informative messages.

---

## Contributing

We welcome contributions to improve the Analytics MultiApp!  
Please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes and push them:
   ```bash
   git commit -m "Add your feature description"
   git push origin feature/your-feature
   ```
4. Submit a Pull Request for review.

---

## License

This project is licensed under the [MIT License](LICENSE).
