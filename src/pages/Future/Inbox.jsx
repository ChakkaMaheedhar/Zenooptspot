import { useState } from "react";
import { Input, Button } from "antd";
import {
  SearchOutlined,
  SendOutlined,
  CloseOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "./Inbox.css";

export default function Inbox() {
  const [selectedContact, setSelectedContact] = useState("1");
  const [messageText, setMessageText] = useState("");
  const [showCoupons, setShowCoupons] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const contacts = [
    {
      id: "1",
      phone: "(214) 232-7667",
      date: "12/19/1990",
      lastMessage: "about 4 hours ago",
      preview: "text preview",
      unread: true,
    },
    {
      id: "2",
      phone: "(209) 685-6429",
      lastMessage: "1 day ago",
      preview: "Make it rain! Send FREE WASH COUP...",
      unread: false,
    },
    {
      id: "3",
      phone: "(214) 202-0513",
      lastMessage: "3 days ago",
      preview: "You have already joined the Spark...",
      unread: false,
    },
    {
      id: "4",
      phone: "(202) 961-0389",
      lastMessage: "4 days ago",
      preview: "Reply YES to confirm you're an Un...",
      unread: false,
    },
    {
      id: "5",
      phone: "(202) 961-0389",
      lastMessage: "4 days ago",
      preview: "Reply YES to confirm you're an Un...",
      unread: false,
    },
    {
      id: "6",
      phone: "(214) 223-0808",
      lastMessage: "4 days ago",
      preview: "Hard to believe it's been over 3 ...",
      unread: false,
    },
    {
      id: "7",
      phone: "(214) 208-0009",
      lastMessage: "4 days ago",
      preview: "Sparkle Car Spa Membership Alert ...",
      unread: false,
    },
    {
      id: "8",
      phone: "(209) 486-9525",
      lastMessage: "4 days ago",
      preview: "Hey there, it looks like you still...",
      unread: false,
    },
    {
      id: "9",
      phone: "(210) 989-0754",
      lastMessage: "4 days ago",
      preview: "Hey there, it looks like you still...",
      unread: false,
    },
  ];

  const conversations = {
    1: [
      {
        id: "1",
        sender: "marketing",
        time: "02:12 AM",
        date: "Tuesday Dec 23, 2025",
        text: "We love our customers – especially on their birthdays! Reply using this format (mm/dd/yyyy) and Sparkle Car Spa will send you a FREE surprise.",
        type: "received",
      },
      {
        id: "2",
        sender: "marketing",
        time: "10:56 AM",
        date: "Wednesday Dec 24, 2025",
        text: "12/19/1990",
        type: "received",
      },
      {
        id: "3",
        sender: "marketing",
        time: "11:13 AM",
        date: "Wednesday Dec 24, 2025",
        text: "12/19/1990",
        type: "received",
      },
    ],
  };

  const coupons = [
    {
      id: "1",
      title: "1 FREE $21 Diamond Car Wash @ Sparkle Car SPA",
      code: "SPARKLECS1",
      created: "May 29, 2025",
    },
    {
      id: "2",
      title: "Refer It Forward Qualifier - 1 FREE Carwash @ Sparkle Car SPA",
      code: "RFQ",
      created: "April 07, 2025",
    },
    {
      id: "3",
      title: "1 FREE Carwash @ Sparkle Car SPA",
      code: "SparklCarSPA",
      created: "April 07, 2025",
    },
    {
      id: "4",
      title: "1 FREE $21 Diamond Car Wash @ Sparkle Car SPA",
      code: "WEBSITE2",
      created: "May 29, 2025",
    },
    {
      id: "5",
      title: "1 FREE Carwash @ Sparkle Car SPA",
      code: "EmailCapture",
      created: "April 07, 2025",
    },
    {
      id: "6",
      title: "FREE Diamond Car Wash @ Sparkle Car SPA",
      code: "Google3",
      created: "August 19, 2025",
    },
    {
      id: "7",
      title: "1 Diamond Car Wash @ Sparkle Car SPA",
      code: "BOGO",
      created: "November 20, 2025",
    },
  ];

  const currentConversation = conversations[selectedContact] || [];

  return (
    <div className="inbox-container">
      {/* Contacts List */}
      <div className="inbox-contacts">
        <div className="contacts-header">
          <h3>Contacts ({contacts.length})</h3>
        </div>
        <div className="contacts-search">
          <Input
            placeholder="Search by mobile"
            prefix={<SearchOutlined />}
            style={{ borderRadius: "6px" }}
          />
          <Button type="primary" style={{ marginTop: "12px", width: "100%" }}>
            Search
          </Button>
        </div>
        <div className="contacts-list">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`contact-item ${
                selectedContact === contact.id ? "active" : ""
              }`}
              onClick={() => setSelectedContact(contact.id)}
            >
              <div className="contact-icon">
                <UserOutlined />
              </div>
              <div className="contact-info">
                <div className="contact-phone">{contact.phone}</div>
                <div className="contact-date">
                  {contact.date || contact.lastMessage}
                </div>
                <div className="contact-preview">{contact.preview}</div>
              </div>
              {contact.unread && <div className="unread-badge" />}
            </div>
          ))}
        </div>
      </div>

      {/* Message Thread */}
      <div className="inbox-messages">
        {selectedContact && (
          <>
            <div className="messages-header">
              <div>
                <div className="contact-phone-large">
                  {contacts.find((c) => c.id === selectedContact)?.phone}
                </div>
                <div className="message-date">
                  Last message:{" "}
                  {contacts.find((c) => c.id === selectedContact)?.lastMessage}
                </div>
              </div>
            </div>

            <div className="messages-thread">
              {currentConversation.length > 0 ? (
                currentConversation.map((msg) => (
                  <div key={msg.id} className="message-group">
                    <div className="message-date-separator">{msg.date}</div>
                    <div className={`message ${msg.type}`}>
                      <div className="message-sender">{msg.sender}</div>
                      <div className="message-time">{msg.time}</div>
                      <div className="message-text">{msg.text}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-messages">
                  <p>Select a message to reply</p>
                </div>
              )}
            </div>

            <div className="messages-footer">
              <div className="message-input-group">
                <textarea
                  className="message-input"
                  placeholder="Send a text message"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
                <div className="message-actions">
                  <div
                    className="coupon-link"
                    onClick={() => setShowCoupons(!showCoupons)}
                  >
                    <span>📎 Use a coupon</span>
                  </div>
                  <div className="character-count">
                    {160 - messageText.length} characters remaining
                  </div>
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    size="large"
                    style={{ backgroundColor: "#1890ff" }}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Coupons Modal/Sidebar */}
      {showCoupons && (
        <div className="inbox-coupons-panel">
          <div className="coupons-header">
            <h3>Available Coupons</h3>
            <button
              className="coupons-close"
              onClick={() => setShowCoupons(false)}
            >
              <CloseOutlined />
            </button>
          </div>
          <p className="coupons-subtitle">Select an available coupon.</p>
          <div className="coupons-list">
            {coupons.map((coupon) => (
              <div
                key={coupon.id}
                className={`coupon-item ${
                  selectedCoupon === coupon.id ? "active" : ""
                }`}
                onClick={() => setSelectedCoupon(coupon.id)}
              >
                <div className="coupon-title">{coupon.title}</div>
                <div className="coupon-code">{coupon.code} ~redeem~</div>
                <div className="coupon-created">Created: {coupon.created}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
