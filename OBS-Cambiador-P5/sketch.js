const obs = new OBSWebSocket();
const obs2 = new OBSWebSocket();

const OpcionesOBS = {
  address: "Umaru-Lenovo-ideapad-FLEX-6-14IKB.local:4444"
};

let CantidadEsena;
let MensajePrincipal;
let MensajeActual;
let EsenaActual;

function setup() {
  noCanvas();
  MensajePrincipal = createP("Esperando OBS");
  MensajeActual = createP("Esena Actual: Esperando");

  console.log("Iniciando :) ");

  ActivarOBS().catch(err => { // Promise convention dicates you have a catch on every chain.
    console.log(err.code);
    MensajePrincipal.html("Error fatall: " + err.code)
  });

}


function draw() {


  // put drawing code here
}


async function ActivarOBS() {
  await obs.connect(OpcionesOBS);
  let Esenas = await obs.send('GetSceneList');
  console.log("Cantidad de Esenas es:" + Esenas.scenes.length);
  CantidadEsena = Esenas.scenes.length;
  MensajePrincipal.html("Cantidad de Esenas <b>" + CantidadEsena + "</b>")
  createP("<h1>Precionar Boton</h1>");
  EsenaActual = Esenas.currentScene;
  MensajeActual.html("Esena Actual: " + EsenaActual);
  Esenas.scenes.forEach(scene => {
    let BotonActual = createButton(scene.name);
    BotonActual.mousePressed(CambiarEsena);
  });
  let Volumen = await obs.send('GetVolume', {
    source: EsenaActual
  });
  console.log(Volumen);
  let Fuentes = await obs.send('GetSourcesList');
  console.log(Fuentes);

}

function CambiarEsena() {
  var NombreBoton = this.elt.innerHTML;
  console.log("Mandando mensaje de cambiar a: " + NombreBoton);
  obs.send('SetCurrentScene', {
    'scene-name': NombreBoton
  });
}

obs.on('SwitchScenes', data => {
  console.log(`Cambiano a Esena: ${data.sceneName}`);
  EsenaActual = data.sceneName;
  MensajeActual.html("Esena Actual: " + EsenaActual);
});

obs.on('error', err => {
  console.error('socket error:', err);
});
