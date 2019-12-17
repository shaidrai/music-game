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

function newRoom(socket, username){
    let roomName = uniqid()
        socket.join(roomName)
        console.log("newroom")
        rooms.push({name: roomName, length: 1, allusers: [username], wrong: []})
        users[username] = {room: roomName, points: 0}
}

io.on('connection', (socket)=>{
console.log("connection")

    socket.on("join", (username)=>{
        

        
        let counter = 0;
            if (rooms.length > 0){
                
            for (var room in rooms){
                if (rooms[room].length === 1){
                    socket.join(rooms[room].name)

                    users[username] = {room: rooms[room].name, points: 0}

                    rooms[room].length += 1
                    rooms[room].allusers.push(username)
                    console.log("usedroom")
                    
                    setTimeout(()=>{
                        let note = Math.floor(Math.random() * 11)
                        io.in(rooms[room].name).emit('users', rooms[room].allusers);
                        io.in(rooms[room].name).emit('start', note);

                        
                        
                    }, 300)
                    
                }
                else if(counter === rooms.length -1){
                    newRoom(socket, username)
                }
                else{
                    counter += 1
                }
            }
            
            }
            else{
                newRoom(socket, username)
            }

            
            

            socket.on("answer", (type)=>{
                console.log("emit")
                
                
                // let user1 = users[room_name.allusers[0]].points
                // let user2 = users[room_name.allusers[1]].points

                if (type==="correct"){
                    // emit winner and new round and add points
                    users[username].points += 10
                    findRoomByName(users[username].room, rooms).then((room)=>{room.wrong = []
                        let user1 = users[room.allusers[0]].points
                        let user2 = users[room.allusers[1]].points

                    io.in(users[username].room).emit('roundwinner', {winner: username, user1, user2 });
                    io.in(users[username].room).emit('roundstart', Math.floor(Math.random() * 11));
                        
                    })
                    

                    
                    
                }
                else if (type==="wrong"){
                    // -10 points to username
                    if (users[username].points > 0) users[username].points -= 10
                    
                    findRoomByName(users[username].room, rooms).then((room)=>{
                        //setTimeout(()=>{console.log(room, "full")}, 2000) 
                        if (room.wrong.length === 1){
                            // emit no winner and new round
                            room.wrong = []
                            let user1 = users[room.allusers[0]].points
                            let user2 = users[room.allusers[1]].points
                            io.in(users[username].room).emit('nowinner', user1, user2);
                            io.in(users[username].room).emit('roundstart', Math.floor(Math.random() * 11));
                            
                            //setTimeout(()=>{console.log(room, "emty")}, 2000) 
                        }
                        else{room.wrong.push(username)}
                    })
                }
            })






            // socket.on("correct", ()=>{

            //     console.log("correct")
            //     findRoomByName(users[username].room, rooms).then((room)=>{
            //         room.winner.push({username, status: 'correct'})
            //         checkwin(room.winner).then((status)=>{
            //             //room.winner = []
            //             if (status === 'nowinner'){
            //                 room.winner = []
            //                 io.in(users[username].room).emit('nowinner')
            //                 io.in(users[username].room).emit('roundstart', Math.floor(Math.random() * 11));
            //             }
            //             else if (status != "notend"){
            //                 room.winner = []
            //                 io.in(users[username].room).emit('roundwinner', status);
            //                 io.in(users[username].room).emit('roundstart', Math.floor(Math.random() * 11));
            //                 setTimeout(()=>{
            //                     console.log(rooms)
            //                 }, 3000)
            //             }
            //             else{
            //                 console.log("continue")
            //             }
            //         })
            //     }) 
            //     //checkwin(rooms[users.username.room].winner)
            // })

            // socket.on("wrong", ()=>{
            //     console.log("wrong")
            //     findRoomByName(users[username].room, rooms).then((room)=>{
            //         room.winner.push({username, status: 'wrong'})
            //         checkwin(room.winner).then((status)=>{
            //             //room.winner = []
            //             if (status === 'nowinner'){
            //                 room.winner = []
            //                 io.in(users[username].room).emit('nowinner')
            //                 io.in(users[username].room).emit('roundstart', Math.floor(Math.random() * 11));
            //             }
            //             else if (status != "notend"){
            //                 room.winner = []
            //                 io.in(users[username].room).emit('roundwinner', status);
            //                 io.in(users[username].room).emit('roundstart', Math.floor(Math.random() * 11));
            //                 setTimeout(()=>{
            //                     console.log(rooms)
            //                 }, 3000)
            //             }
            //             else{
            //                 console.log("continue")
            //             }
            //         })
            //     })    
            //     //checkwin(rooms[users.username.room].winner)

            // })

        //     function checkwin(winner){
        //         console.log(winner)
        //         return new Promise(function(resolve, reject) {
        //     if (winner.length === 2){
                
        //         if(winner[0].status === "correct"){
        //             var roundwinner = winner[0].username

        //             //users[roundwinner].stats += 10
        //     //io.in(users[username].room).emit('roundwinner', roundwinner);
        //             resolve(roundwinner)

        //     //io.in(users[username].room).emit('roundstart', Math.floor(Math.random() * 11));
            
        //         }
        //         else if(winner[0].status != "correct" && winner[1].status === "correct"){
        //             var roundwinner = winner[1].username
        //             resolve(roundwinner)

        //             //users[roundwinner].stats += 10
        //     //io.in(users[username].room).emit('roundwinner', roundwinner);

        //     //io.in(users[username].room).emit('roundstart', Math.floor(Math.random() * 11));
            
        //         }
        //         else  resolve("nowinner") //io.in(users[username].room).emit('nowinner')
                
        //         //io.in(users[username].room).emit('roundstart', Math.floor(Math.random() * 11));
        //     }
        //     else resolve("notend")
        // })
        // }

        function findRoomByName(roomname, rooms){
            return new Promise(function(resolve, reject) {
                rooms.forEach(room => {
                    if (room.name === roomname){
                        resolve(room)
                    }
                });
            })
        }

            

            
})

})

app.get('', (req, res) => {
    res.sendFile('index')
})

server.listen(port, ()=>{
    console.log("Server is up")
})
