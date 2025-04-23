import axios from "axios";
import {
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import "./CryptoAnalyzer.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

const CryptoAnalyzer = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCryptoData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              order: "market_cap_desc",
              per_page: 5,
              page: 1,
              sparkline: true,
            },
          }
        );
        setCryptoData(response.data);
      } catch (err) {
        setError("Failed to fetch cryptocurrency data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoData();
  }, []);

  const handleRowClick = async (coin) => {
    try {
      console.log("Sending data to backend:", coin);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/analyze-crypto",
        {
          name: coin.name,
          symbol: coin.symbol,
          current_price: coin.current_price,
          market_cap: coin.market_cap,
          price_change_percentage_24h: coin.price_change_percentage_24h,
          price_change_percentage_7d: coin.sparkline_in_7d?.price[6] || 0,
          price_change_percentage_30d: coin.sparkline_in_7d?.price[29] || 0,
          total_volume: coin.total_volume,
        }
      );
      console.log("Backend response (percentages):", response.data);
      navigate("/crypto-details", { state: { analysis: response.data, coin } });
    } catch (err) {
      console.error("Error sending data to backend:", err);
    }
  };

  return (
    <div className="crypto-analyzer">
      <h1>Cryptocurrency Market Shared from Bitnova</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Price</th>
              <th>Market Cap</th>
              <th>24h Change</th>
              <th>7-Day Trend</th>
            </tr>
          </thead>
          <tbody>
            {cryptoData.map((coin, index) => (
              <tr key={coin.id} onClick={() => handleRowClick(coin)}>
                <td>{index + 1}</td>
                <td>
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="crypto-icon"
                  />
                  {coin.name}
                </td>
                <td>${coin.current_price.toLocaleString()}</td>
                <td>${coin.market_cap.toLocaleString()}</td>
                <td
                  style={{
                    color:
                      coin.price_change_percentage_24h > 0 ? "green" : "red",
                  }}
                >
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </td>
                <td>
                  <Line
                    data={{
                      labels: coin.sparkline_in_7d.price.map((_, i) => i),
                      datasets: [
                        {
                          data: coin.sparkline_in_7d.price,
                          borderColor: "#66fcf1",
                          borderWidth: 2,
                          pointRadius: 0,
                        },
                      ],
                    }}
                    options={{
                      plugins: { tooltip: { enabled: false } },
                      scales: { x: { display: false }, y: { display: false } },
                      maintainAspectRatio: false,
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CryptoAnalyzer;
