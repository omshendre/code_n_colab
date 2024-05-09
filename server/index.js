const  express = require('express')
const app = express();
const env = require('dotenv');
const {Server}= require("socket.io")
const http = require('http');
const{ACTIONS}= require('../server/Actions')
const path = require('path');

env.config();
const server = http.createServer(app);
const io= new Server(server);




const port = process.env.PORT || 5050;   

// app.use(express.static(path.join(__dirname, 'client')));

//middleware
// Middleware to serve Vite-built files
  
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

// Middleware to handle all other routes
app.get('*', (req, res) => {
    
    res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
  });


 const userSocketMap={};

 function getAllConnectedClients(roomId){
    // Convert the set of socket IDs in the specified 'roomId' to an array using Array.from(),
// retrieving the socket IDs from the Socket.IO sockets adapter and the rooms associated with 'roomId'.
// This allows for easy manipulation or iteration over the list of socket IDs.
   return  Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId)=>{
    return {
        socketId,
        username:userSocketMap[socketId],
    }
   });

 } 


// Listen for 'connection' event on the 'io' instance, which triggers whenever a new client connects.
io.on('connection',(socket)=>{
 console.log('socket conneted',socket.id );

 // Listen for 'JOIN' action from the client.
   socket.on(ACTIONS.JOIN,({roomId, username})=>{
     // Map the socket ID to the username for identification.
    userSocketMap[socket.id]= username;
   
    // Make the socket join the specified room.
    socket.join(roomId);
   
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({socketId})=>{
        // Emit a 'JOINED' action to each client in the room.
       io.to(socketId).emit(ACTIONS.JOINED,{
        clients,
        username:username,
        socketId:socket.id
       })
    })
   })


   // we receive code from one socket and we will broadcast to every client/socket 
   socket.on(ACTIONS.CODE_CHANGE,({roomId,code})=>{
       socket.in(roomId).emit(ACTIONS.CODE_CHANGE,{code})
   })



   socket.on('disconnecting',()=>{
    // we will get rooms in map format so we are converting it into array using spread opreator
    const rooms = [...socket.rooms];
    rooms.forEach((roomId)=>{
        socket.in(roomId).emit(ACTIONS.DISCONNECTED,{
            socketId:socket.id,
            username : userSocketMap[socket.id],
        });

    });
    delete userSocketMap[socket.id];
    socket.leave();
   })
}) 

// app.get('/', (req, res) => res.send('welcome to the backend of codeFuse!'))
server.listen(port, () => console.log(`Example app listening on port ${port}!`))