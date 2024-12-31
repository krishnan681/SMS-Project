import React, { useState, useEffect } from "react";
import "../Css/Card.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import { FaUserPlus } from "react-icons/fa"; // Add Recipient Icon

const Card = ({ onClose }) => {
  const [fromName, setFromName] = useState("");
  const [fromNumber, setFromNumber] = useState("");
  const [toName, setToName] = useState("");
  const [recipientNumber, setRecipientNumber] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const [touched, setTouched] = useState({
    fromName: false,
    fromNumber: false,
    toName: false,
    recipientNumber: false,
  });
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const supported = "contacts" in navigator && "select" in navigator.contacts;
    setIsSupported(supported);
  }, []);

  const handleSelectContact = async () => {
    if (!isSupported) {
      alert("Web Contacts API is not supported in this browser.");
      return;
    }

    try {
      const props = ["name", "tel"];
      const options = { multiple: false };
      const contacts = await navigator.contacts.select(props, options);

      if (contacts.length > 0 && contacts[0].tel.length > 0) {
        setRecipientNumber(contacts[0].tel[0]);
      } else {
        alert("No valid phone number found in the selected contact.");
      }
    } catch (error) {
      console.error("Error accessing contacts:", error);
      alert("An error occurred while accessing contacts.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setTouched({
      fromName: true,
      fromNumber: true,
      toName: true,
      recipientNumber: true,
    });

    // Validation checks
    if (
      !fromName ||
      !fromNumber ||
      !toName ||
      !recipientNumber ||
      fromName.length > 20 ||
      toName.length > 20 ||
      fromNumber.length !== 10 ||
      recipientNumber.length !== 10
    ) {
      setModalMessage("Please fill in valid details before submitting.");
      setShowModal(true);
      return;
    }

    const data = {
      fromName,
      fromNumber,
      toName,
      toNumber: recipientNumber,
    };

    try {
      const response = await fetch("https://signpostphonebook.in/try_contact.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setModalMessage("Data submitted successfully!");
        setShowModal(true);

        setFromName("");
        setFromNumber("");
        setToName("");
        setRecipientNumber("");
        setTouched({
          fromName: false,
          fromNumber: false,
          toName: false,
          recipientNumber: false,
        });

        const smsLink = `sms:${recipientNumber}?body=Hi ${toName}, this is ${fromName}. this is a test sample`;
        setTimeout(() => {
          window.location.href = smsLink;
        }, 2000);
      } else {
        setModalMessage("Failed to save data: " + result.message);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      setModalMessage(`An error occurred while submitting the data: ${error.message}`);
      setShowModal(true);
    }
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const getFieldClass = (value, field, isNumber = false) => {
    if (isNumber) {
      if (value.length === 13) {
        return "is-valid";
      } else if (value.length > 13) {
        return "is-invalid";
      }
    } else {
      if (value.length > 0 && value.length <= 20) {
        return "is-valid";
      } else if (value.length > 20) {
        return "is-invalid";
      }
    }
    return "";
  };

  return (
    <div className="card-overlay">
      <div className="card">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formFromName">
            <Form.Label>From</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Name "
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
              onBlur={() => handleBlur("fromName")}
              className={getFieldClass(fromName, "fromName")}
            />
            {touched.fromName && fromName.length > 20 && (
              <small className="text-danger">Name cannot exceed 20 characters.</small>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="formMobileNo">
            <Form.Label>Mobile No</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter 10-digit Number"
              value={fromNumber}
              onChange={(e) => setFromNumber(e.target.value)}
              onBlur={() => handleBlur("fromNumber")}
              className={getFieldClass(fromNumber, "fromNumber", true)}
            />
            {touched.fromNumber && fromNumber.length !== 10 && (
              <small className="text-danger">Number must be exactly 10 digits.</small>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="formToName">
            <Form.Label>To</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Name "
              value={toName}
              onChange={(e) => setToName(e.target.value)}
              onBlur={() => handleBlur("toName")}
              className={getFieldClass(toName, "toName")}
            />
            {touched.toName && toName.length > 20 && (
              <small className="text-danger">Name cannot exceed 20 characters.</small>
            )}

            <Form.Label>Recipient Mobile No</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                value={recipientNumber}
                onChange={(e) => setRecipientNumber(e.target.value)}
                onBlur={() => handleBlur("recipientNumber")}
                placeholder="Enter 10-digit Number"
                type="number"
                className={getFieldClass(recipientNumber, "recipientNumber", true)}
              />
              <Button
                variant="outline-secondary"
                id="add-recipient-icon"
                onClick={handleSelectContact}
              >
                <FaUserPlus />
              </Button>
            </InputGroup>
            {touched.recipientNumber && recipientNumber.length !== 15 && (
              <small className="text-danger">Number must be exactly 10 digits.</small>
            )}
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Notification</Modal.Title>
          </Modal.Header>
          <Modal.Body>{modalMessage}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Card;
