const express = require('express');

const app = express();

const http = require('http').Server(app);

const io = require('socket.io')(http);

const listaTurnos = ["Enzo Francescoli", "Ariel Ortega", "Franco Armani", "Miguel Borja", "Enzo Pérez"];
const listaAtendidos = [];

app.use(express.static('./puclic'));

app.get('/', (req, res) => {
    res.sendFile('index.html', {root: __dirname})
});


http.listen(3000, () => console.log('SERVER ON\n http://localhost:3000'));

function enviarListados(alerta){
    io.sockets.emit('ListaDeTurnos', {pendientes:listaTurnos,atendidos:listaAtendidos,alerta:alerta}); //Envio Arreglo listaTurno a todos los sockets
}

setInterval(() => {
    enviarListados(false);
}, 60000);

io.on('connection', (socket)=>{
    console.log('Usuario conectado')

    socket.on('VentanaTurnoActual', data => {
        console.log('VentanaTurnoActual')
        enviarListados(false)
    });
    socket.on('AtenderTurno', puesto =>{
        console.log('AtenderTurno')
        if (listaTurnos.length>0) {
            listaAtendidos.unshift({nombre:listaTurnos[0],puesto:puesto,hora:Date.now()})//agrega elemento al princio de un arreglo
            listaTurnos.shift() //borra primer elemento de la lista
            enviarListados(true)
        }
    });
    socket.on('CrearTurno', data => {
        console.log('CrearTurno')
        listaTurnos.push(data) //Agrego item al final de la lista
        enviarListados(false)
    });
});