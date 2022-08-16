import React from "react";
import "./Popup.css";

const Popup = ({ message, setPopup }) => {
  const getTime = () => {
    const diff = Math.abs(new Date() - new Date(message.time));
    if (diff >= 60000) {
      return Math.floor(diff / 60000) + " минут назад";
    } else {
      return Math.floor(diff / 1000) + " секунд назад";
    }
  };

  return (
    <div className="popupContainer">
      <div className="popupMessageContainer">
        <div> {message.message}</div>
        <div className="closeBtn" onClick={() => setPopup(false)}>
          X
        </div>
        <div className="time"> {getTime()}</div>
      </div>
    </div>
  );
};

export default Popup;
