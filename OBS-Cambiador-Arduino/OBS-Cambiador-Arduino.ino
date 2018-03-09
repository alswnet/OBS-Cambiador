//Mensajes
// Tipo de Mensaje
// E - Estriming - Trasmitir
// R - Recorde - Grabar
// S - Seen - Esena
// Estado del Mensajes
// F - falso
// V - Verdadero
// Ejemplo EV - Estrimini es Verdadero

#define Grabando 0
#define Trasmitir 1
#define Esena 2

int CantidadBotones = 2;
int Led[2] = {13, 12};
int Boton[2] = {8, 9};
int Decifrando = -1;
boolean Estado[2] = {false, false};


void setup() {
  Serial.begin(9600);
  for (int i = 0; i < 2; i++) {
    pinMode(Led[i] , OUTPUT);
    pinMode(Boton[i], INPUT);
  }
}

void loop() {
  if (Serial.available()) {
    char Letra = Serial.read();
    //Serial.write(Letra);
    switch (Decifrando) {
      case Grabando:
      case Trasmitir:
        BuscarEstado(Letra, Decifrando);
        ActivarLed(Decifrando);
        Decifrando = -1;
        break;
      default:
        BuscarFuncion(Letra);
        break;
    }
  }
  for (int i = 0; i < CantidadBotones; i++) {
    int EstadoActual = digitalRead(Boton[i]);
    if (EstadoActual == 1) {
      switch (i) {
        case Grabando:
          Serial.print("R");
          break;
        case Trasmitir:
          Serial.print("E");
          break;
      }
      if (Estado[i] == true) {
        Serial.print("F");
      }
      else if (Estado[i] == false) {
        Serial.print("T");
      }
      delay(400);
    }
  }
}

void ActivarLed(int Decifrando) {
  if (Estado[Decifrando] == false) {
    digitalWrite(Led[Decifrando], 0);
  }
  else if (Estado[Decifrando] == true) {
    digitalWrite(Led[Decifrando], 1);
  }
}

void BuscarEstado(char Letra, int Decifrando) {
  if (Letra == 'f' || Letra == 'F') {
    Estado[Decifrando] = false;
    //Serial.println( " Falso");
  }
  else if (Letra == 't' || Letra == 'T') {
    Estado[Decifrando] = true;
    //Serial.println(" Verdadero");
  }
}

void BuscarFuncion(char Letra) {
  switch (Letra) {
    case 'E':
    case 'e':
      Decifrando = Trasmitir;
      //Serial.print("Trasmitir ");
      break;
    case 'R':
    case 'r':
      Decifrando = Grabando;
      //Serial.print("Grabando ");
      break;
    case 'S':
    case 's':
      Decifrando = Esena;
      break;
    default:
      Decifrando = -1;
      break;
  }
}
