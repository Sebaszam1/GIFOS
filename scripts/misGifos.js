var constraints = { audio: false, video: true };
let video = document.createElement("video");
let startBtn = document.getElementById("grabarBtn");
let texto1 = document.getElementById("text1");
let texto2 = document.getElementById("text2");
let texto3 = document.getElementById("text3");
let texto4 = document.getElementById("text4");
let p1 = document.getElementById("p1");
let p2 = document.getElementById("p2");
let p3 = document.getElementById("p3");
let videoCtn = document.getElementById("video");
let gifCreado = document.createElement("img");
let timeCtn = document.getElementById("time");
let numeroPaso = 0; //contador de clicks del botón
let recorder = null;
let myBlob;
let time = document.createElement("p");
let hour = 0;
let minute = 0;
let second = 0;
let timeInterval;
var h, m, s;
let form; //sirve para agregar el gif a GIPHY

//comienzo, al hacer click
startBtn.addEventListener("click", () => {
  switch (numeroPaso) {
    case 0: //primer click pide permiso y activa la cámara
      texto1.className = "textCrearHid";
      texto2.className = "textCrearSw";
      p1.className = "numActive";
      startBtn.style.display = "none";
      getStreamAndRecord();
      return;
    case 1: //botón para empezar la grabación
      recorder.startRecording();
      timer(); //inicia el timer
      startBtn.innerHTML = "FINALIZAR";
      numeroPaso++;
      return;
    case 2: //finalizó la grabación, muestra el gif
      recorder.stopRecording();
      stopTimer(); //finaliza el timer
      video.remove();
      myBlob = recorder.getBlob();
      gifCreado.src = URL.createObjectURL(myBlob);
      gifCreado.className = "gifCreado";
      videoCtn.insertBefore(gifCreado, texto3);
      recorder.camera.stop();
      time.innerHTML = "REPETIR CAPTURA";
      time.className = "timeRepeat";
      timeCtn.addEventListener("click", restart);
      startBtn.innerHTML = "SUBIR GIFO";
      numeroPaso++;
      return;
    case 3: //clickea en 'subir gifo'
      let form = new FormData();
      form.append("file", myBlob, "myGif.gif");
      time.innerHTML = "";
      texto3.className = "textUploadGif";
      p2.className = "numInactive";
      p3.className = "numActive";
      startBtn.style.display = "none";
      upload(form);
  }
});

//reinicia al punto de grabar el gif
function restart() {
  numeroPaso = 0;
  restartTimer(); //reinicia el timer
  gifCreado.remove();
  video.remove();
  texto1.className = "textCrearSw";
  p2.className = "numInactive";
  startBtn.click();
}

function restoreRecord() {
  //vuelve todo al principio al salir a otra sección (llamada en transiciones.js)
  if (numeroPaso >= 2) {
    restartTimer();
    if (numeroPaso == 3) {
      p3.className = "numInactive";
      texto3.className = "textUploadHid";
      texto4.className = "textUploadHid";
    }
  }
  numeroPaso = 0;
  gifCreado.remove();
  video.remove();
  texto1.className = "textCrearSw";
  startBtn.style.display = "block";
  startBtn.innerHTML = "COMENZAR";
  p2.className = "numInactive";
  if (recorder != null) {
    recorder.camera.stop();
    recorder = null;
  }
}

//función para pedir permiso de activar la cámara y empezar a mostrar el video
function getStreamAndRecord() {
  navigator.mediaDevices
    .getUserMedia({
      audio: false,
      video: {
        height: { max: 480 },
      },
    })
    .then(function (stream) {
      video.srcObject = stream;
      video.setAttribute("autoplay", true);
      video.setAttribute("loop", true);
      videoCtn.insertBefore(video, texto3);
      video.play();
      recorder = RecordRTC(stream, {
        type: "gif",
        frameRate: 1,
        quality: 10,
        width: 360,
        hidden: 240,
      });
      recorder.camera = stream;
    })
    .then(function () {
      texto2.className = "textCrearHid";
      videoCtn.className = "videoSw";
      video.className = "videoActive";
      p1.className = "numInactive";
      p2.className = "numActive";
      startBtn.innerHTML = "GRABAR";
      startBtn.style.display = "block";
      numeroPaso++;
    })
    .catch((error) => {
      alert("No pudimos acceder a la cámara");
      console.log(error);
    });
}
//funciones para mostrar el tiempo de grabado
function timer() {
  startTimer();
  timeInterval = setInterval(startTimer, 1000);
}
function startTimer() {
  if (second > 59) {
    second = 0;
    minute++;
  }
  if (minute > 59) {
    minute = 0;
    hour++;
  }

  if (second < 10) {
    s = "0" + second;
  } else {
    s = second;
  }
  if (minute < 10) {
    m = "0" + minute;
  } else {
    m = minute;
  }
  if (hour < 10) {
    h = "0" + hour;
  } else {
    h = hour;
  }
  second++;
  time.innerHTML = `${h}:${m}:${s}`;
  timeCtn.appendChild(time);
}
function stopTimer() {
  //finaliza el timer
  clearInterval(timeInterval);
}
function restartTimer() {
  //reinicia el timer
  stopTimer();
  hour = 0;
  minute = 0;
  second = 0;
  timeCtn.removeChild(time);
  return;
}
//agregado a GIPHY
async function upload(gif) {
  try {
    let response = await fetch(
      `https://upload.giphy.com/v1/gifs?api_key=DE8K3o8mb5Wmcwav3ckyL8hr84GY0Hiv&file=${gif}`,
      {
        method: "POST",
        body: gif,
        json: true,
        mode: "cors",
      }
    );
    let json = await response.json();
    //guarda el gif en localStorage
    let myGifID = json.data.id;
    let key = "myGifIDs";
    let allMyGifs = localStorage.getItem(key);
    if (allMyGifs != null) {
      //si ya hay IDs almacenadas
      allMyGifs = allMyGifs + "," + myGifID; //almacena los ids separados por una coma
      localStorage.setItem(key, allMyGifs);
    } else {
      localStorage.setItem(key, myGifID);
    }
    //ultima card
    texto3.className = "textUploadHid";
    texto4.className = "textUploaded";
    getGif(myGifID);
  } catch (err) {
    console.log(err);
  }
}
async function getGif(id) {
  try {
    let response = await fetch(
      `https://api.giphy.com/v1/gifs?api_key=DE8K3o8mb5Wmcwav3ckyL8hr84GY0Hiv&ids=${id}`
    );
    let json = await response.json();
    //descarga del gif
    let myGifName = "MiGIFO";
    myGifDwl.addEventListener("click", () => {
      let mode = "myGifs";
      downloadGif(myBlob, myGifName, mode);
    });
    //copia el link del gif
    let link = document.getElementById("myLink");
    link.addEventListener("click", () => {
      var aux = document.createElement("input");
      var body = document.querySelector("body");
      body.appendChild(aux);
      aux.setAttribute("value", json.data[0].url);
      aux.select();
      document.execCommand("copy");
      body.removeChild(aux);
    });
  } catch (err) {
    console.log(err);
  }
}

//----------------MIS GIFOS---------------------------------------
let misGifosResults = document.getElementById("misGifosCtn");
let noGifosResults = document.getElementById("noGifosCtn");

async function showMisGifs() {
  try {
    let myGifsIDs = localStorage.getItem("myGifIDs");
    if (myGifsIDs != null) {
      //si hay gifs guardados, a mostrarlos
      misGifosResults.className = "resultsShown";
      noGifosResults.className = "noResultsHidden";
      const response = await fetch(
        `https://api.giphy.com/v1/gifs?api_key=DE8K3o8mb5Wmcwav3ckyL8hr84GY0Hiv&ids=${myGifsIDs}`
      );
      const json = await response.json();
      misGifosResults.innerHTML = "";
      let misGifosCtn = document.createElement("div");
      misGifosCtn.className = "misGifosCtn";
      misGifosCtn.id = "gifosContainer";
      cont2 = 1; //usado en botón ver más
      for (let i = 0; i < 12; i++) {
        if (json.data[i] != undefined) {
          //si hay menos de 12 gifs fav, corta el loop
          let myGif = document.createElement("img");
          myGif.id = "gif" + i;
          myGif.setAttribute("src", json.data[i].images.downsized_medium.url);
          misGifosCtn.appendChild(myGif);
          misGifosResults.appendChild(misGifosCtn);
          //event para mostrar la card con hover o touch
          myGif.addEventListener("mouseover", () => {
            mode = "";
            gifCard(json, misGifosCtn, i, mode);
          });
          myGif.addEventListener("click", () => {
            mode = "mobile";
            gifCard(json, misGifosCtn, i, mode);
          });
        }
      }
      if (json.data.length > 12) {
        //si hay más de 12 gifs activa el botón ver más
        let btn = document.createElement("button");
        btn.addEventListener("click", () => {
          verMas(json, misGifosCtn); //función ver más en Trends&Search.js
        });
        btn.textContent = "Ver más";
        btn.id = "btnVerMas";
        misGifosResults.appendChild(btn);
      }
    } else {
      noGifosCtn.className = "noResultsShown";
    }
  } catch (err) {
    console.log(err);
  }
}
