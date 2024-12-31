import React, { useState, useEffect } from "react";
import Card from "./Components/Card"; // Import the Card component
import './App.css';

// import { FaBeer } from 'react-icons/fa'; // Font Awesome
// import Gradient from "./Components/Gradient";


function App() {
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    // Show the card when the page loads
    setShowCard(true);
  }, []);

  const handleClose = () => {
    setShowCard(false);
  };

  return (
    <div className="App">
      {/* <Gradient /> */}
    
      {showCard && <Card onClose={handleClose} />}
    </div>
  );
}

export default App;
