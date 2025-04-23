import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./CryptoDetails.css";

const formatTime = (date) => {
  return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
};

const CryptoDetail = () => {
  const location = useLocation();
  const { analysis, coin } = location.state || {};

  const [needleAngles, setNeedleAngles] = useState({
    "1_day": -90,
    "7_day": -90,
    "30_day": -90,
  });

  const [isVisible, setIsVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "ai",
      text: `I'm here and ready to assist you with any questions about ${coin?.name} (${coin?.symbol}) based on the provided analysis data. How can I help you today?`,
      timestamp: formatTime(new Date()),
    },
  ]);
  const [userMessage, setUserMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingIntervalRef = useRef(null);

  useEffect(() => {
    if (analysis) {
      setIsVisible(true);
      setTimeout(() => {
        setNeedleAngles({
          "1_day": calculateNeedleAngle(
            analysis.percentages["1_day"].buy,
            analysis.percentages["1_day"].sell
          ),
          "7_day": calculateNeedleAngle(
            analysis.percentages["7_day"].buy,
            analysis.percentages["7_day"].sell
          ),
          "30_day": calculateNeedleAngle(
            analysis.percentages["30_day"].buy,
            analysis.percentages["30_day"].sell
          ),
        });
      }, 1000);
    }
  }, [analysis]);

  useEffect(() => {
    const chatBox = document.querySelector(".chat-messages");
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
  }, [chatMessages]);

  const calculateNeedleAngle = (buy, sell) => {
    const total = buy + sell;
    if (total === 0) return -90;
    const buyPercentage = buy / total;
    return (buyPercentage - 0.5) * 180;
  };

  const simulateTypingEffect = (text, callback) => {
    let index = 0;
    const messageLength = text.length;

    typingIntervalRef.current = setInterval(() => {
      if (index < messageLength) {
        setChatMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          const newMessage = {
            ...lastMessage,
            text: text.slice(0, index + 1),
          };
          return [...prev.slice(0, -1), newMessage];
        });
        index++;
      } else {
        clearInterval(typingIntervalRef.current);
        setIsTyping(false);
        callback();
      }
    }, 50);
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    const timestamp = formatTime(new Date());
    setChatMessages((prev) => [
      ...prev,
      { sender: "user", text: userMessage, timestamp },
    ]);

    setUserMessage("");
    setIsTyping(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.trim(),
          coin: { name: coin?.name, symbol: coin?.symbol },
          analysis_data: analysis,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiMessage = { sender: "ai", text: "", timestamp };

      setChatMessages((prev) => [...prev, aiMessage]);
      simulateTypingEffect(data.reply, () => {});
    } catch (error) {
      console.error("Chat API error:", error);
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Sorry, an error occurred while processing your request.",
          timestamp: formatTime(new Date()),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!analysis) {
    return <div>Analysis data is missing. Please try again.</div>;
  }

  return (
    <div className="crypto-detail">
      <h1 className={isVisible ? "fade-in" : ""}>{coin?.name} Analysis</h1>
      <div className={`gauges ${isVisible ? "fade-in" : ""}`}>
        {["1_day", "7_day", "30_day"].map((period) => {
          const periodData = analysis.percentages[period] || {};
          const buy = periodData.buy || 0;
          const sell = periodData.sell || 0;

          return (
            <div
              className={`gauge ${
                period === "7_day" ? "large-gauge" : "small-gauge side-gauge"
              }`}
              key={period}
            >
              <h3>{period.replace("_", " ").toUpperCase()} Trend</h3>
              <div className="half-circle">
                <div
                  className="needle"
                  style={{
                    transform: `rotate(${needleAngles[period]}deg)`,
                  }}
                ></div>
              </div>
              <div className="gauge-labels">
                <span className={`label ${buy < 50 ? "active" : ""}`}>
                  Sell
                </span>
                <span className={`label ${buy === 50 ? "active" : ""}`}>
                  Neutral
                </span>
                <span className={`label ${buy > 50 ? "active" : ""}`}>Buy</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="tables-container">
        <div className="table oscillators fade-in">
          <h2>Oscillators</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Value</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {analysis.oscillators.map((oscillator, index) => (
                <tr key={index}>
                  <td>{oscillator.name}</td>
                  <td>
                    {typeof oscillator.value === "number"
                      ? oscillator.value.toFixed(5)
                      : "N/A"}
                  </td>
                  <td
                    className={`action ${
                      oscillator.action.toLowerCase() === "buy"
                        ? "buy"
                        : oscillator.action.toLowerCase() === "sell"
                        ? "sell"
                        : "neutral"
                    }`}
                  >
                    {oscillator.action}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table moving-averages fade-in">
          <h2>Moving Averages</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Value</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {analysis.moving_averages.map((ma, index) => (
                <tr key={index}>
                  <td>{ma.name}</td>
                  <td>{ma.value.toFixed(2)}</td>
                  <td
                    className={`action ${
                      ma.action.toLowerCase() === "buy"
                        ? "buy"
                        : ma.action.toLowerCase() === "sell"
                        ? "sell"
                        : "neutral"
                    }`}
                  >
                    {ma.action}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="description fade-in">
        <h2>Analysis Summary</h2>
        <p>{analysis?.description || "No analysis description available."}</p>
      </div>

      <div className="chat-container fade-in">
        <h2>Ask AI for help 🚀</h2>
        <div className="chat-messages">
          {chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${
                msg.sender === "user" ? "user" : "ai"
              }`}
            >
              <div>{msg.text}</div>
              <div className="chat-timestamp">{msg.timestamp}</div>
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Ask AI about this crypto..."
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default CryptoDetail;
