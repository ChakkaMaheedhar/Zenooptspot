import { useState } from "react";
import { Input, Button } from "antd";
import "./ContactOptOut.css";

export default function ContactOptOut() {
  const [phoneNumber, setPhoneNumber] = useState("(402) 555-1212");
  const [knownAccounts, setKnownAccounts] = useState([
    "Sparkle Car SPA - Retention",
    "Sparkle Car SPA - Marketing",
    "Sparkle Car SPA - Churn",
  ]);

  const handlePhoneChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleOptOut = () => {
    alert(`Contact ${phoneNumber} has been opted out from all accounts.`);
  };

  return (
    <div className="contact-optout-container">
      <div className="optout-content">
        <h1>Contact Opt Out</h1>

        <div className="optout-form-section">
          <div className="optout-description">
            <h3>Opt Out</h3>
            <p>
              Use the form to remove a mobile number from all the accounts. Once
              submitted, the number will be opted out within a few minutes.
            </p>
          </div>

          <div className="optout-form">
            <div className="form-group">
              <label htmlFor="phone">Phone number</label>
              <Input
                id="phone"
                type="tel"
                placeholder="(402) 555-1212"
                value={phoneNumber}
                onChange={handlePhoneChange}
                size="large"
              />
            </div>

            <div className="form-group">
              <label>Known Accounts</label>
              <div className="known-accounts">
                {knownAccounts.length > 0 ? (
                  knownAccounts.map((account, index) => (
                    <div key={index} className="account-item">
                      {account}
                    </div>
                  ))
                ) : (
                  <div className="account-item empty">
                    No accounts found for this number
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="optout-button-container">
          <Button
            type="primary"
            size="large"
            onClick={handleOptOut}
            className="optout-button"
          >
            Opt Out
          </Button>
        </div>
      </div>
    </div>
  );
}
