// npm install serialport
var SerialPort = require('serialport');
// npm install obs-websocket-js
var OBSWebSocket = require('obs-websocket-js');
// npm install node-telegram-bot-api
const TelegramBot = require('node-telegram-bot-api');

//Token de ChepecarlosBot
const token = '536642015:AAG1T0MYGMZ62wK97aRwO1vkDcgejGQAgx8';

const bot = new TelegramBot(token, {
  polling: true
});

var ChatOficial = -205470611;
var ChatYo = 30085334;

var portName = "null";
if (process.argv[2]) {
  var portName = process.argv[2];
}
var MensajeSerial = "";
console.log("PueroUSB " + portName);

var OpcioneOBS = {
  address: 'sakura.local:4444'
};

const obs = new OBSWebSocket();

obs.connect(OpcioneOBS)
  .then(() => {
    return obs.GetStreamingStatus();
  })
  .then(data => {
    console.log(data);
    if (data.recording == true) {
      port.write('RT');
      console.log('Esta grabacion');
    }
    if (data.streaming == true) {
      port.write('ET');
      console.log("Esta Striming");
    }
  })
  .catch(err => {
    console.log(err);
  });

var OpcionSerial = {
  baudRate: 9600,
  autoOpen: true
};

var port = new SerialPort(portName, OpcionSerial);

port.on('data', function(data) {
  console.log("Estasdo " + obs.GetCurrentTransition());

  for (var i = 0; i < data.length; i++) {
    MensajeSerial = MensajeSerial + String.fromCharCode(data[i]);
  }
  console.log('Data:', MensajeSerial);
  if (MensajeSerial === "RT") {
    console.log("Orden Iniciar Grabacion");
    MensajeSerial = "";
    obs.StartRecording();
  } else if (MensajeSerial === "RF") {
    console.log("Orden Terminando Grabacion");
    MensajeSerial = "";
    obs.StopRecording();
  } else if (MensajeSerial == "ET") {
    console.log("Orden Iniciar Termision");
    MensajeSerial = "";
    obs.StartStreaming();
  } else if (MensajeSerial == "EF") {
    console.log("Orden Cancelar Termision");
    MensajeSerial = "";
    obs.StopStreaming();
  }
});

obs.on('RecordingStarted', err => {
  port.write('RT');
  bot.sendMessage(ChatOficial, 'Empezando a Grabar en OBS');
  bot.sendMessage(ChatYo, "Empezando a Grabar en OBS");
  console.log('Iniciando grabacion:');
});

obs.on('RecordingStopping', err => {
  port.write('RF');
  bot.sendMessage(ChatOficial, 'Terminando la Grabar en OBS');
  bot.sendMessage(ChatYo, "Terminando la Grabar en OBS");
  console.log('Terminando grabacion:');
});

obs.on('StreamStarting', dato => {
  port.write('ET');
  bot.sendMessage(ChatOficial, 'Empezando a Trarmitir en OBS');
  bot.sendMessage(ChatYo, "Empezando a Trasmitir en OBS");
  console.log("Iniciando Striming");
});

obs.on('StreamStopped', dato => {
  port.write('EF');
  bot.sendMessage(ChatOficial, 'Terminando a Trarmitir en OBS');
  bot.sendMessage(ChatYo, "Terminando a Trasmitir en OBS");
  console.log("Apagando Striming");
});

//Comandos de Telegram

bot.onText(/\/conectar (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];
  port = new SerialPort(match[1], OpcionSerial);
  console.log("Intentando Conectar " + resp);
  bot.sendMessage(chatId, resp);
});

function FalloConectar(err) {
  if (err) {
    return console.log('Error: ', err.message);
  }
}

bot.onText(/\/puerto/, (msg, match) => {
  const chatId = msg.chat.id;
  require('serialport').list(function(err, results) {
    if (err) {
      throw err;
    }
    for (var i = 0; i < results.length; i++) {
      if (results[i].manufacturer != null) {
        bot.sendMessage(chatId, results[i].manufacturer + " " + results[i].comName);
      }
    }
  });

  bot.sendMessage(chatId, "Puertos Disponibles");
});

bot.onText(/\/help/, (msg, match) => {
  const chatId = msg.chat.id;
  console.log("Manando menu");
  var Mensaje = "Mensaje de ayuda\n";
  Mensaje = Mensaje + "/puerto pregunta puerto disponibles\n";
  Mensaje = Mensaje + "/conectar con un puerto\n";
  Mensaje = Mensaje + "/help ayuda\n";
  bot.sendMessage(chatId, Mensaje);
});
