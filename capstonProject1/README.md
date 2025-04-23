# Crypto Analysis AI Assistant (BitNova)

This project serves as the final project for my Bachelor's degree. It's a sophisticated cryptocurrency analysis system that leverages OpenAI's GPT models to provide intelligent insights and analysis of cryptocurrency data in real-time.

## Repository

-   **GitHub**: [BitNova Crypto Analyzer](https://github.com/albinot001/Crypto-Analyzer-BitNova-)
-   **Author**: [Albinot001](https://github.com/albinot001)
-   **License**: MIT

## Project Overview

This application combines real-time cryptocurrency data from CoinGecko with artificial intelligence to deliver comprehensive analysis and insights. The frontend is built with React for a dynamic and responsive user interface, where users can interact with an AI chatbot that provides detailed analysis and answers questions about specific cryptocurrencies. The system is built using Laravel backend and React frontend to ensure a smooth, real-time user experience.

## Features in Detail

### Real-time Cryptocurrency Analysis

-   Live price tracking for multiple cryptocurrencies
-   Detailed market metrics including:
    -   Price changes (24h, 7d, 30d)
    -   Market capitalization
    -   Trading volume
    -   Historical price data
-   Technical indicators and trend analysis
-   AI-powered market sentiment analysis

### Interactive AI Chat System

-   Real-time conversations about crypto markets
-   Context-aware responses based on current market data
-   Ability to ask specific questions about:
    -   Price trends
    -   Market indicators
    -   Trading volumes
    -   Technical analysis
    -   Market sentiment
-   Natural language processing for user-friendly interactions

### User Interface Features

-   Modern, responsive design
-   Real-time data updates
-   Interactive charts and graphs
-   User-friendly navigation
-   Mobile-responsive layout
-   Dark mode design for comfortable viewing

## CoinGecko Integration

### API Usage

-   The project uses CoinGecko's free API tier
-   No API key required for basic functionality
-   Rate limits: 10-30 calls per minute
-   Endpoints used:
    -   `/coins/markets` - For market data
    -   `/coins/{id}` - For detailed coin information
    -   `/simple/price` - For quick price checks

### Data Updates

-   Market data refreshes every 60 seconds
-   Price data updates every 30 seconds
-   Historical data cached to minimize API calls

## Chat System Architecture

### How the Chat Works

1. User sends a message about a cryptocurrency
2. Backend processes the message and current market data
3. OpenAI analyzes the context and generates a response
4. Response is streamed back with a typing effect
5. Chat history is maintained for context

### Chat Features

-   Typing indicators
-   Message timestamps
-   Context-aware responses
-   Error handling
-   Message history
-   Real-time updates

## Project Structure

```
capstonProject1/
├── app/
│   ├── Http/Controllers/
│   │   └── Api/
│   │       ├── ChatController.php
│   │       └── OpenAiController.php
│   └── Services/
│       ├── ChatService.php
│       └── OpenAiServices.php
├── react-frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── public/
└── routes/
    └── api.php
```

## Deployment Guide

### Backend Deployment

1. Choose a hosting provider (e.g., DigitalOcean, AWS, Heroku)
2. Set up a PHP 8.2+ environment
3. Configure environment variables
4. Set up SSL certificate
5. Configure web server (nginx/Apache)

### Frontend Deployment

1. Build the React application
2. Choose a static hosting service
3. Configure environment variables
4. Set up domain and SSL
5. Configure CORS settings

### Environment Variables Required

```env
APP_NAME=CryptoAnalysis
APP_ENV=production
APP_DEBUG=false
APP_URL=your_domain

DB_CONNECTION=mysql
DB_HOST=your_db_host
DB_DATABASE=your_db_name
DB_USERNAME=your_username
DB_PASSWORD=your_password

OPENAI_API_KEY=your_openai_key

CORS_ALLOWED_ORIGINS=your_frontend_domain
```

## Performance Optimization

### Backend Optimizations

-   API response caching
-   Database query optimization
-   Rate limiting implementation
-   Memory usage optimization

### Frontend Optimizations

-   Code splitting
-   Lazy loading of components
-   Image optimization
-   Caching strategies
-   Performance monitoring

## Troubleshooting

Common issues and solutions:

1. API Rate Limits

    - Implement proper error handling
    - Use caching strategies
    - Monitor API usage

2. OpenAI Connection Issues

    - Check API key validity
    - Verify network connectivity
    - Monitor response times

3. Data Synchronization

    - Verify WebSocket connections
    - Check data refresh intervals
    - Monitor state management

4. Performance Issues
    - Optimize database queries
    - Implement proper caching
    - Monitor memory usage

## Key Features

-   **Real-time Cryptocurrency Data**: Integration with CoinGecko API to fetch live market data, prices, and trends
-   **AI-Powered Analysis**: Utilizes OpenAI's GPT models to analyze cryptocurrency data and provide insights
-   **Interactive Chat Interface**: Real-time conversation with AI about specific cryptocurrencies
-   **Detailed Market Analysis**: Get comprehensive analysis of market trends, price movements, and potential opportunities
-   **Multi-Coin Support**: Analyze multiple cryptocurrencies simultaneously
-   **User-Friendly Interface**: Modern, responsive design for seamless user experience

## How It Works

1. **Data Collection**

    - Real-time cryptocurrency data is fetched from CoinGecko API
    - Supports multiple cryptocurrencies including BTC, ETH, and other major coins
    - Gathers price, volume, market cap, and other relevant metrics

2. **AI Analysis**

    - The collected data is processed by OpenAI's GPT models
    - AI analyzes trends, patterns, and market indicators
    - Generates human-readable insights and explanations

3. **Interactive Chat**
    - Users can ask specific questions about cryptocurrencies
    - AI provides detailed, context-aware responses
    - Real-time updates as market conditions change

## Screenshots

[Screenshots will be added here]

## Technical Stack

### Backend Framework

-   Laravel 11.x
-   PHP 8.2+

### Frontend Stack

-   React 18.x (Frontend Framework)
-   React Router (Client-side routing)
-   React Query (Data fetching and caching)
-   TailwindCSS 3.x (Utility-first CSS framework)
-   Vite 6.0 (Build tool and dev server)
-   Axios (HTTP client)
-   PostCSS (CSS processing)

### Key Dependencies

-   `openai-php/client`: OpenAI API integration
-   CoinGecko API integration
-   `laravel/tinker`: REPL for Laravel

### Development Tools

-   Laravel Sail
-   Laravel Pint (Code Style)
-   PHPUnit (Testing)
-   Vite (Frontend Build Tool)
-   Concurrently (Run multiple commands)
-   Autoprefixer (CSS vendor prefixing)

## Prerequisites

-   PHP 8.2 or higher
-   Composer
-   Node.js & NPM
-   OpenAI API Key (Personal key required)
-   Laravel CLI

## Installation

1. Clone the repository

```bash
git clone https://github.com/albinot001/Crypto-Analyzer-BitNova-
cd Crypto-Analyzer-BitNova-
```

2. Install PHP dependencies

```bash
composer install
```

3. Install Node.js dependencies

```bash
# Install frontend dependencies
cd react-frontend
npm install
cd ..
```

4. Set up environment file

```bash
cp .env.example .env
```

5. Configure your `.env` file:

```env
OPENAI_API_KEY=your_api_key_here
```

6. Generate application key

```bash
php artisan key:generate
```

7. Run migrations

```bash
php artisan migrate
```

8. Build frontend assets

```bash
# Build React frontend
cd react-frontend
npm run build
```

## Development

To start the development servers:

```bash
# Terminal 1: Start Laravel backend server
php artisan serve

# Terminal 2: Start React development server
cd react-frontend
npm run dev
```

## Usage

### API Endpoints

#### Analyze Cryptocurrency

```http
POST /api/analyze-crypto

{
    "cryptos": ["BTC", "ETH"],
    "user_prompt": "Analyze the current market trends"
}
```

Example Response:

```json
{
    "analysis": {
        "market_overview": "Bitcoin is currently showing strong momentum...",
        "price_analysis": "The current price action indicates...",
        "trading_volume": "24h trading volume has increased by...",
        "recommendations": "Based on the current market conditions..."
    }
}
```

## Important Notes

-   This project requires a personal OpenAI API key
-   The OpenAI integration is configured to use the latest GPT models
-   Ensure your OpenAI API key has sufficient credits for the analysis operations
-   Frontend is built with React and TailwindCSS for a modern, responsive UI
-   Hot module replacement enabled for React development
-   Vite is used for fast development and optimized production builds

## Academic Context

This project was developed as a final project for a Bachelor's degree in [Your Field]. It demonstrates the practical application of:

-   React-based SPA development
-   Real-time data integration
-   AI-powered analysis
-   Modern web development practices
-   Responsive UI/UX design
-   Frontend build optimization
-   API integrations (CoinGecko & OpenAI)
-   State management in React
-   Component-based architecture

## Author

[Your Name]
Bachelor's Degree Candidate
[Your University]

## OpenAI Setup

### Getting Started with OpenAI

1. Visit [platform.openai.com](https://platform.openai.com) and create an account
2. Navigate to the API section and create a new API key
3. Add funds to your account (minimum $10 recommended for testing)
4. Copy your API key for configuration

### Configuration

1. In your `.env` file, add your OpenAI API key:

```env
OPENAI_API_KEY=your_api_key_here
```

2. The API key is configured in `config/app.php` and used throughout the application:

```php
'api_key' => env('API_KEY'),
```

### Model Selection

-   The project currently uses two GPT models:

    -   GPT-3.5-turbo for crypto analysis (recommended for cost efficiency)
    -   GPT-4 for chat interactions (can be switched to 3.5 for lower costs)

-   To change the model, modify the following files:
    1. For crypto analysis: `app/Services/OpenAiServices.php`
    ```php
    'model' => 'gpt-3.5-turbo'  // Default and recommended
    ```
    2. For chat: `app/Services/ChatService.php`
    ```php
    'model' => 'gpt-3.5-turbo'  // Change from gpt-4 for cost efficiency
    ```

### Cost Considerations

-   GPT-3.5-turbo is significantly more cost-effective than GPT-4
-   Recommended starting with GPT-3.5-turbo for all features
-   Average cost per analysis:
    -   GPT-3.5-turbo: ~$0.002 per request
    -   GPT-4: ~$0.03 per request

## Contributing

1. Fork the repository
2. Create your feature branch:

```bash
git checkout -b feature/AmazingFeature
```

3. Commit your changes:

```bash
git commit -m 'Add some AmazingFeature'
```

4. Push to the branch:

```bash
git push origin feature/AmazingFeature
```

5. Open a Pull Request
