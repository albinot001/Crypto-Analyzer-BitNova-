import React from "react";
import { Route, Routes } from "react-router-dom";
import CryptoAnalyzer from "./Components/CryptoAnalyzer";
import CryptoDetails from "./Components/CryptoDetails";
import IntroPage from "./Components/IntroPage.tsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<IntroPage />} />
      <Route path="/crypto-analyzer" element={<CryptoAnalyzer />} />
      <Route path="/crypto-details" element={<CryptoDetails />} />
    </Routes>
  );
};

export default App;
