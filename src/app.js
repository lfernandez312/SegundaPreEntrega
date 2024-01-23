const express = require('express');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const router = require('./router');
const FilesDao = require('./dao/files.dao');
const mongoConnect = require('./db')

// Importo las rutas que has creado
const cartsRouter = require('./router/cartRoutes');
const chatRoutes = require('./router/chatRoutes');
const productRoutes = require('./router/productRoutes');


const app = express();

mongoConnect();

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(process.cwd() + '/src/public'));
app.engine('handlebars', handlebars.engine({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
}));
app.set('views', process.cwd() + '/src/views');

router(app);

app.use('/', cartsRouter);
app.use('/', chatRoutes);
app.use('/', productRoutes);


app.get('/', (req, res) => {
  // Redirige a la ruta '/inicio'
  res.redirect('/inicio');
});

const connectedUsers = new Set();
const chatFile = new FilesDao('chats.json');

// Cargar mensajes desde el archivo al inicio
let chats = [];

async function loadChatsFromFile() {
  const data = await chatFile.getItems();
  chats = data.map((chat) => ({ ...chat, createdAt: new Date(chat.createdAt) }));
}

loadChatsFromFile();

const httpServer = app.listen(8080, () => {
  console.log('Server running at port 8080');
});

const io = new Server(httpServer);

io.on('connection', (socket) => {
  socket.on('newUser', (data) => {
    socket.username = data.username;
    connectedUsers.add(data.username);
    socket.emit('messageLogs', chats);
    io.emit('userConnected', { username: data.username, connectedUsers: Array.from(connectedUsers) });
  });

  socket.on('message', (data) => {
    const message = { ...data, createdAt: new Date() };
    chats.push(message);
    io.emit('messageLogs', chats);
    // Escribir los mensajes en el archivo chat.json
    chatFile.writeItems(chats);
  });

  socket.on('disconnect', () => {
    connectedUsers.delete(socket.username);
    io.emit('userDisconnected', { username: socket.username, connectedUsers: Array.from(connectedUsers) });

    // Crear un nuevo array de chats con la información de desconexión
    const disconnectionMessage = {
      username: socket.username,
      message: 'se ha desconectado',
      createdAt: new Date(),
    };

    chats.push(disconnectionMessage);
    io.emit('messageLogs', chats);
    // Escribir los mensajes en el archivo chat.json
    chatFile.writeItems(chats);
  });
});
