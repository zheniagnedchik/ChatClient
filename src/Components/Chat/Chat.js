import React, { useEffect, useRef, useState } from "react";
import Popup from "../Popup/Popup";
import "./Chat.css";
let messageList = [];
function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [popup, setPopup] = useState(false);
  const soket = useRef(null);

  useEffect(() => {
    soket.current = new WebSocket("ws://localhost:3001/");
    soket.current.onopen = () => {
      const message = {
        event: "connection",
        id: Date.now(),
      };
      soket.current.send(JSON.stringify(message));
    };
    soket.current.onmessage = (message) => {
      message = JSON.parse(message.data);
      switch (message.event) {
        case "connection":
          return console.log(message);
        case "message":
          return pushMessages(message);
      }
    };
    return () => soket.current.close();
  }, [soket]);

  const pushMessages = async (message) => {
    messageList.push(message);
    setMessages((prevState) => [...prevState, message]);
    setTimeout(() => addClass(message), 3000);
  };

  const addClass = async (message) => {
    const newArray = [...messageList];
    const index = newArray.findIndex((el) => el.id === message.id);
    newArray[index].new = false;
    setMessages(newArray);
  };
  const sendMessage = () => {
    const sendMessage = {
      message: message,
      event: "message",
    };
    soket.current.send(JSON.stringify(sendMessage));
    setMessage("");
  };

  return (
    <div className="app">
      {popup && <Popup message={popup} setPopup={setPopup} />}

      <div
        className={`chatClientBody ${
          messages.length <= 0 && "containerNoMessages"
        }`}
      >
        {messages.length > 0 ? (
          <div className="chatClientConversation">
            {messages.map((item) => {
              return (
                <div
                  className="chatClientConversationMessage"
                  key={item.id}
                  onClick={() => setPopup(item)}
                >
                  <div
                    className={`chatClientConversationMessageBody ${
                      item.new && "messageContainerActive"
                    }`}
                  >
                    {item.message}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="textNoMessages">Здесь пока нет сообщений</div>
        )}
      </div>
      <div className="inputContainer">
        <input
          onChange={(e) => setMessage(e.target.value)}
          className="input"
          placeholder="Введите сообщение"
          value={message}
        />
        <div className="sendButton" onClick={sendMessage}>
          Отправить
        </div>
      </div>
    </div>
  );
}

export default Chat;
