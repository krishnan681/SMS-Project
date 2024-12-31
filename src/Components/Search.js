import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
} from "react";

const HomePage = () => {
  const [data, setData] = useState([]); // State to store fetched data
  const [filteredData, setFilteredData] = useState([]); // State for filtered data
  const [inputName, setInputName] = useState(""); // State for input value

  const fetchData = async () => {
    try {
      const response = await fetch("https://signpostphonebook.in/client_fetch.php");
      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
      const jsonResponse = await response.json();
      setData(jsonResponse);
      setFilteredData(jsonResponse);
    } catch (error) {
      console.error("Fetch Error:", error);
      Alert.alert("Error", "Failed to load data: " + error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (inputName.trim() === "") {
      setFilteredData([]);
    } else {
      const filtered = data.filter((item) =>
        item.businessname.toLowerCase().includes(inputName.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [inputName, data]);

  return (
    <div style={styles.container}>
      <div style={styles.inputWrapper}>
        <input
          type="text"
          style={styles.input}
          placeholder="Enter Name"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
        />
      </div>

      {inputName.trim() !== "" && (
        <div style={styles.listContainer}>
          {filteredData.map((item) => (
            <div key={item.id} style={styles.card}>
              <p style={styles.mobileNumber}>{item.mobileno}</p>
            </div>
          ))}
          {filteredData.length === 0 && (
            <p style={styles.noResults}>No results found.</p>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    maxWidth: "600px",
    margin: "auto",
  },
  inputWrapper: {
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  listContainer: {
    marginTop: "20px",
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: "15px",
    borderRadius: "5px",
    marginBottom: "10px",
    boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
  },
  mobileNumber: {
    fontSize: "16px",
    color: "#555",
  },
  noResults: {
    fontSize: "16px",
    color: "#777",
    textAlign: "center",
  },
};

export default HomePage;
