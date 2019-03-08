# **SOI Automated Test** 

This script is designed to stress test the SOI application. Randomly generated is sent from the PC via serial. The data is then received back via ethernet. Sent data is compared with received data to check for any loss.



## SOI Application Settings

Load the SOI application onto the device you would like to test.

Open DS Manager

Under the Ch1 tab, configure the following settings:

- **Transport Protocol** - 1- TCP.
- **Routing Mode** - 1 - Server OR client.
- **Destination IP Address** - Enter the IP address of your computer here.
- **Destination Port** - Enter the port number you wish to send data to.
- **Flow Control** - 1 - Local RTS-CTS.
- **Baudrate** - Enter the baudrate at which you want to test.



## Script Arguments

###### The following arguments are required for the script to run:

**--sp**  The number of the serial port/ports you would like to test on.

**--ip**  The IP address of the computer you are using. 



###### The following arguments are optional:

**--np**  The ethernet ports you would like to send to. These values must be the same as the ones set in DS Manager. This number of ethernet ports should equal the number of serial ports you have selected. Default values starts at **1001** and increments for each additional serial port.

**--baud**  The baudrate to test at. This value must be the same as the one set in DS Manager. Default value is **230400**.

 **--bytes**  The number of bytes to send from each port. Default value is **1048576**.



## Running the Script

Install Node.JS

Start the Command Prompt and navigate to the root folder *...\soi-automated-test*

Enter the command "node main.js" followed by the appropriate arguments.



## Example

```
node main.js --bytes 524288 --baud 57600 --sp 4 --np 307 --ip 192.168.1.110   
```



In this example, **524288** bytes of data are sent to the device through serial port **COM4** at a baudrate of **57600**. The IP address of the computer is **192.168.1.110**. The data is then sent back to the computer from the device on ethernet port **307**. 



```
node main.js --bytes 2097152 --baud 115200 --sp 4 5 --np 1001 1002 --ip 192.168.1.110   
```



In this example, **2097152** bytes of data are sent to the device through serial ports **COM4** and **COM5** at a baudrate of **115200**. The IP address of the computer is **192.168.1.110**. The data is then sent back to the computer from the device on ethernet ports **1001** and **1002**. 

