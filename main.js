var net = require('net');
var serialport = require("serialport");
const commandLineArgs = require('command-line-args')
var crypto = require("crypto");

const optionDefinitions = [
  { name: 'sp', type: String, multiple: true },
  { name: 'ip', type: String },
  { name: 'np', type: Number, multiple: true },
  { name: 'baud', type: Number },
  { name: 'bytes', type: Number }
]

const arguments = commandLineArgs(optionDefinitions)
var ComPorts = arguments.sp;
var IP = arguments.ip;
var NetPorts = arguments.np;
var Baud = arguments.baud;
var Bytes = arguments.bytes;
var BaudRates = ["150", "300", "600", "1200", "2400", "4800", "9600", "19200", "28800", "38400", "57600", "115200", "230400", "460800"]

if (Baud == undefined) Baud = "230400";
if (Bytes == undefined) Bytes = "1048576";

if (BaudRates.includes(Baud.toString()) != true) {
  console.log("Please select a valid baudrate");
  process.exit(1);
}

--if (NetPorts != undefined && NetPorts.length != ComPorts.length) {
  console.log("Number of network ports must equal number of serial ports!");
  process.exit(1);
} else if (NetPorts == undefined) {
  let portNum = 1002;
  NetPorts = ["1001"];
  for (var i = 0; i < ComPorts.length - 1; i++) {
    NetPorts.push(portNum.toString());
    portNum++;
  }
}

let originalString = crypto.randomBytes(parseInt(Bytes)).toString('hex') + "\r\n";
let previousPercentage = 0
let completedTransfers = 0
myNet = [];
myPort = [];
receivedString = [];

for (let i = 0; i < NetPorts.length; i++) {
  receivedString[i] = "";
  myNet[i] = new net.createServer(function (socket) {
    socket.on('data', on_sock_data_arrival);
  });

  function on_sock_data_arrival(data) {
    receivedString[i] += data.toString();
    let percentage = Math.floor(receivedString[0].length / originalString.length * 100);
    if (percentage != previousPercentage)
      console.log("Percentage complete: " + percentage + "%");
    if (receivedString[i].endsWith('\r\n')) {
      console.log("Delimiter Detected on port " + NetPorts[i]);
      if (receivedString[i] == originalString) {
        console.log("Success")
      } else {
        console.log("Fail");
        process.exit(1);
      }
      if (completedTransfers++ == ComPorts.length - 1) {
        console.log("All transfers completed succesfully!")
        process.exit(0);
      }
    }
    previousPercentage = Math.floor(receivedString[0].length / originalString.length * 100);
  };

  myNet[i].listen(NetPorts[i], IP, sendData);

  function sendData() {

    myPort[i] = new serialport("COM" + ComPorts[i], {
      baudRate: parseInt(Baud),
      rtscts: true,
    })
    myPort[i].on('open', onOpen);

    function onOpen() {
      myPort[i].write(originalString);
      console.log("Data sent from " + myPort[i].path);
    }
  }
}