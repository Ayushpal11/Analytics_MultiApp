# InsightHub Dashboard

## Project Overview

The **Analytics MultiApp** is a feature-packed web application that provides insights and data from multiple sources in one centralized platform. With real-time updates, customizable widgets, and an intuitive UI, users can access information like weather, news, stock market data, and more in a single dashboard.

## Features

- **Weather Widget**: Real-time weather updates and forecasts.
- **News Widget**: Latest news categorized by topics.
- **Finance Widget**: Real-time stock market data and trends.
- **Movie Widget**: Trending movies with ratings and trailers from TMDB API.
- **GitHub Widget**: Repository statistics, commit history, and contributor details.
- **Customizable Dashboard**: Drag-and-drop widgets for a personalized experience.
- **Dark Mode**: Toggle between light and dark themes.
- **Responsive Design**: Fully responsive for mobile, tablet, and desktop.
- **Real-Time Data**: Widgets auto-update with fresh data.

## Directory Structure

```plaintext
└── Ayushpal11-Analytics_MultiApp/
    ├── README.md
    ├── components.json
    ├── eslint.config.mjs
    ├── mock-weatherdata.json
    ├── next.config.ts
    ├── package.json
    ├── postcss.config.mjs
    ├── tailwind.config.ts
    ├── tsconfig.json
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── providers.tsx
    │   └── (home)/
    │       └── page.tsx
    ├── components/
    │   ├── AnimatedBackground.tsx
    │   ├── ArticleModal.tsx
    │   ├── AutoComplete.tsx
    │   ├── Dashboard.tsx
    │   ├── FinanceWidget.tsx
    │   ├── GithubWidget.tsx
    │   ├── MovieWidget.tsx
    │   ├── NewsWidget.tsx
    │   ├── PersonalInfo.tsx
    │   ├── StockSearch.tsx
    │   ├── WeatherWidget.tsx
    │   ├── WidgetSelector.tsx
    │   └── minicomp/
    │       ├── animated-number.tsx
    │       ├── avatar.tsx
    │       ├── badge.tsx
    │       ├── button.tsx
    │       ├── card.tsx
    │       ├── dialog.tsx
    │       ├── dropdown-menu.tsx
    │       ├── input.tsx
    │       ├── neon-border.tsx
    │       ├── progress.tsx
    │       ├── scroll-area.tsx
    │       ├── select.tsx
    │       ├── separator.tsx
    │       ├── switch.tsx
    │       ├── tabs.tsx
    │       └── tooltip.tsx
    ├── data/
    │   └── popularStocks.ts
    ├── lib/
    │   ├── utils.ts
    │   └── redux/
    │       ├── financeSlice.ts
    │       ├── newsSlice.ts
    │       ├── store.ts
    │       └── weatherSlice.ts
    ├── public/
    ├── styles/
    │   └── globals.css
    └── utils/
        └── formatDate.ts
```

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

## Running the Project

- **Development Server**:
  ```bash
  npm run dev
  ```
  Access the application at `http://localhost:3000`.

- **Production Build**:
  ```bash
  npm run build
  npm start
  ```

## Environment Variables

Create a `.env.local` file in the root directory and add the following environment variables:
```env
NEXT_PUBLIC_WEATHER_API_KEY=your_openweathermap_api_key
NEXT_PUBLIC_NEWS_API_KEY=your_newsapi_key
NEXT_PUBLIC_FINANCE_API_KEY=your_alpha_vantage_api_key
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
```

## Technologies Used

- **Framework**: Next.js
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Data Visualization**: Recharts
- **Animations**: Framer Motion, CSS Transitions
- **APIs**: OpenWeatherMap, NewsAPI, Alpha Vantage, TMDB, GitHub API
- **WebSocket**: Real-time data updates

## Additional Features

- **Localization**: Multi-language support using **react-i18next**.
- **Theme Customization**: Users can toggle between light and dark modes.
- **Real-Time Updates**: WebSocket integration for data-intensive widgets.

## Deployment

The application is deployed on [Vercel](https://vercel.com). You can access the live demo here: [Live Demo Link](https://analytics-multi-app.vercel.app/).

## Future Enhancements

- **Additional Widgets**: Add support for new widgets like sports scores, cryptocurrency trends, and more.
- **User Authentication**: Enable user-specific customizations with authentication.
- **Performance Improvements**: Optimize API calls and component rendering.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
