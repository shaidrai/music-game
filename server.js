const path = require('path')   
const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const cors = require('cors')
const bodyParser = require('body-parser');
const uniqid = require('uniqid');

const staticDir = path.join(__dirname, 'public')


const app = express()
app.use(express.static(staticDir))
app.use(cors())
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));



const server =  http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 5000

rooms = []
users = {}

function newRoom(socket, username, userId){
    let roomName = uniqid()
        socket.join(roomName)
        console.log("newroom")
        rooms.push({name: roomName, length: 1, allusers: [userId], wrong: [], lockRoom: false})
        users[userId] = {room: roomName, points: 0, username}
}

io.on('connection', (socket)=>{
console.log("connection")

socket.on("kaki", (username)=>{
    console.log(username, "kaki")
})

    socket.on("join", (username)=>{
        console.log(username)
        const userId = uniqid()
        socket.emit('id', userId)
        
        let counter = 0;
            if (rooms.length > 0){
                
            for (var room in rooms){
                if (rooms[room].length === 1){
                    
                    

                    socket.join(rooms[room].name)
                    users[userId] = {room: rooms[room].name, points: 0, username}

                    rooms[room].length += 1
                    rooms[room].allusers.push(userId)

                    console.log("usedroom")
                    
                    setTimeout(()=>{
                        let note = Math.floor(Math.random() * 11)

                        let RoomUsers = {user1: {id: userId, username}}

                        rooms[room].allusers.forEach((id)=>{
                            if (id!= userId) RoomUsers["user2"] = {id, username: users[id].username}
                        })
                        
                        
                        io.in(rooms[room].name).emit('start', {note, RoomUsers});

                        
                        
                    }, 300)
                    
                }
                else if(counter === rooms.length -1){
                    newRoom(socket, username, userId)
                }
                else{
                    counter += 1
                }
            }
            
            }
            else{
                newRoom(socket, username, userId)
            }

            
            

            socket.on("answer", (type)=>{
                console.log("emit")
                
                
                // let user1 = users[room_name.allusers[0]].points
                // let user2 = users[room_name.allusers[1]].points

                if (type==="correct"){
                    // emit winner and new round and add points
                    
                    findRoomByName(users[userId].room, rooms).then((room)=>{
                        
                        if(!room.lockRoom){
                        lockRoom(room)

                        users[userId].points += 10

                        // User win
                        if (users[userId].points === 100){
                            io.in(users[userId].room).emit('gamwwinner', {winner: userId});
                        }

                        // New round 
                        else{
                        room.wrong = []
                        let user1 = {id: room.allusers[0], points: users[room.allusers[0]].points }
                        let user2 = {id: room.allusers[1], points: users[room.allusers[1]].points }

                        io.in(users[userId].room).emit('roundwinner', {winner:false, user1, user2, note: Math.floor(Math.random() * 11)});
                        }
                    }
                    })
                    

                    
                    
                }
                else if (type==="wrong"){
                    
                    findRoomByName(users[userId].room, rooms).then((room)=>{

                        if (!room.lockRoom){
                        // -10 points to username
                        if (users[userId].points > 0) users[userId].points -= 10
                        //setTimeout(()=>{console.log(room, "full")}, 2000) 
                        if (room.wrong.length === 1){
                            lockRoom(room)
                            // emit no winner and new round
                            room.wrong = []
                            let user1 = {id: room.allusers[0], points: users[room.allusers[0]].points }
                            let user2 = {id: room.allusers[1], points: users[room.allusers[1]].points }
                            io.in(users[userId].room).emit('roundwinner', {winner:false, user1, user2, note: Math.floor(Math.random() * 11)});
                            
                            
                            //setTimeout(()=>{console.log(room, "emty")}, 2000) 
                        }
                        else{room.wrong.push(username)}
                    }
                    })
                }
            })




        function findRoomByName(roomname, rooms){
            return new Promise(function(resolve, reject) {
                rooms.forEach(room => {
                    if (room.name === roomname){
                        resolve(room)
                    }
                });
            })
        }

// after joining a room
        socket.on("disconnect",()=>{
            console.log("disconnet")
    
    findRoomByName(users[userId].room, rooms).then((room)=>{
        io.in(room.name).emit("left")
        rooms.splice( rooms.indexOf(room), 1 );
        })
    
    })

    
    

            

            
})  
})

const lockRoom = (room) =>{
room.lockRoom = true
                        setTimeout(()=>{
                            room.lockRoom = false
                        }, 2000)
}



app.get('', (req, res) => {
    res.sendFile('index')
})

server.listen(port, ()=>{
    console.log("Server is up")
})
