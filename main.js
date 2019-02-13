var net = require('net');
var Net = net;
var NetPorts = ["1001", "1002", "1003", "1004"];
//var NetPorts = ["1002"]
myNet = []

var serialport = require("serialport");
var SerialPort = serialport;
var ComPorts = ["COM26", "COM27", "COM28", "COM29"];
//var ComPorts = ["COM26"]
myPort = []

var crypto = require("crypto");
let originalString = crypto.randomBytes(10000).toString('hex');
originalString += "\r\n"
receivedString = []


for (let i = 0; i < NetPorts.length; i++) {
  receivedString[i] = ""
  myNet[i] = new net.createServer(function (socket) {
    //  console.log('Server started: Waiting for client connection ...');
    //  console.log('Client connected:port,address: ' + socket.remotePort, socket.remoteAddress);
    //  console.log(NetPorts[i])
    socket.on('data', on_sock_data_arrival)
  });

  function on_sock_data_arrival(data) {
    receivedString[i] += data.toString();
    console.log("Packet received on port " + NetPorts[i]);
    if (receivedString[i].endsWith('\r\n')) {
      console.log("Delimiter Detected on port " + NetPorts[i]);
      receivedString[i] == originalString ? console.log("Success") : console.log("Fail")
    }
  };

  myNet[i].listen(NetPorts[i], '192.168.1.39', sendData);

  function sendData() {

    myPort[i] = new SerialPort(ComPorts[i], {
      baudRate: 230400,
      dataBits: 8,
      stopBits: 1,
      parity: 'none',  
      rtscts: true,      
    })

    myPort[i].on('open', onOpen);

    function onOpen() {
      myPort[i].write(originalString);
      console.log("Data sent from " + myPort[i].path);
    }
  }
}