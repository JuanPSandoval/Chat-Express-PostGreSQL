```
  ________                                 _________ .__            __   
 /  _____/______  ____  __ ________ ___.__.\_   ___ \|  |__ _____ _/  |_ 
/   \  __\_  __ \/  _ \|  |  \____ <   |  |/    \  \/|  |  \\__  \\   __\
\    \_\  \  | \(  <_> )  |  /  |_> >___  |\     \___|   Y  \/ __ \|  |  
 \______  /__|   \____/|____/|   __// ____| \______  /___|  (____  /__|  
        \/                   |__|   \/             \/     \/     \/        
                     🔥 Group chat with Node.js + Socket.IO
```

# 💬 GroupyChat 🔥

**GroupyChat** is a real-time group chat system built with Node.js, Express, and WebSockets. It's simple, fast, and perfect for creating private chat rooms — "only those with the password can enter 🔑".

---

## 🚀 Features

- 🔐 JWT authentication using cookies (no trespassing)
- 💬 Private group chats (each with its own password)
- ⚡ Real-time communication via `socket.io`
- ☕ Ready to use or customize for your own projects

---

## 🛠️ Technologies

- **Node.js**
- **Express.js**
- **Socket.IO**

---

## 📦 Installation

```bash
git clone https://github.com/JuanPSandoval/Chat-Express-PostGreSQL.git
npm install
```

---

## 🏁 Run the App

```bash
npm run dev
```

## 🧪 How It Works

1. The user signs up or logs in.
2. They can join a group using the `ID` and group `password`.
3. All communication is handled via `socket.io`, and the backend verifies the token before allowing access.
4. Once inside, they can send and receive messages in the group.

---

## 🔐 Security

- Tokens are verified on every socket connection.
- Group passwords are hashed before being saved.
- If a user connects with an invalid token — they’re out.

---

## 📢 Socket Events

| Event             | Description                                |
|-------------------|--------------------------------------------|
| `join group`      | Join a group using ID and password         |
| `group joined`    | Emitted when the user successfully joins   |
| `group error`     | Emitted on authentication or join failure  |
| `send message`    | Send a message to all group members        |
| `receive message` | Receive message broadcasted to the group   |

---

## ✍️ Author

Built with rage and love by https://github.com/JuanPSandoval

---

## ⚠️ Disclaimer

This project includes a very simple frontend, making it easy to test or integrate with your own custom application.

---

## 🌟 License

MIT – IDK 🧪
