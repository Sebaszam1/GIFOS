let favBtn;
let gifID;

function gifCard(json, divContainer, i, mode, desktopCard, mobileCard) {
  let gifS;
  let idContainer = divContainer.id;
  //indico a qué gifs hace referencia para calcular la posición de la tarjeta
  if (idContainer === "trendCtn") {
    gifS = document.getElementById("trendGif" + i);
  } else {
    gifS = document.getElementById("gif" + i);
  }
  //obtengo la posición del gif con mouseover
  let top = gifS.offsetTop; //obtiene altura en px
  let left = gifS.offsetLeft; //obtiene left en px
  let width = divContainer.offsetWidth; //obtiene width en px
  //identifico desde dónde se llamó a la función y recalculo las distancias si fue desde el slide del trending
  if (idContainer === "trendCtn") {
    if (i === 3 || i === 4 || i === 5) {
      left = left - width;
    } else if (i === 6 || i === 7 || i === 8) {
      left = left - width * 2;
    } else if (i === 9 || i === 10 || i === 11) {
      left = left - width * 3;
    } else {
    }
  }

  //creo la tarjeta y sus componentes
  let backDiv = document.createElement("div");
  let divIcons = document.createElement("div");
  let divText = document.createElement("div");
  favBtn = document.createElement("img");
  let dwlBtn = document.createElement("img");
  let fullBtn = document.createElement("img");
  let userTitle = document.createElement("p");
  let gifName = document.createElement("p");
  gifID = json.data[i].id;

  //defino los estilos, entre los que están la posición del gif con mouseover
  backDiv.className = "cardDiv";
  backDiv.id = "backDiv";
  backDiv.style.top = top + "px";
  backDiv.style.left = left + "px";
  divContainer.insertBefore(backDiv, divContainer.children[i]);

  //resto de los componentes
  divIcons.className = "divIcons";
  divText.className = "divText";
  dwlBtn.setAttribute("src", "assets/icon-download.svg");
  fullBtn.setAttribute("src", "assets/icon-max.svg");
  userTitle.innerHTML =
    json.data[i].username.charAt(0).toUpperCase() +
    json.data[i].username.slice(1); //mayúscula primera letra
  gifName.innerHTML =
    json.data[i].title.charAt(0).toUpperCase() + json.data[i].title.slice(1); //mayuscula primera letra
  //defino el botón de descarga
  dwlBtn.addEventListener("click", () => downloadGif(gifS, gifName.innerHTML));
  //cambio de la imágen de botón de favoritos
  changeFavBtn(favBtn);
  divIcons.appendChild(favBtn);
  divIcons.appendChild(dwlBtn);
  divIcons.appendChild(fullBtn);
  divText.appendChild(userTitle);
  divText.appendChild(gifName);

  //mobile
  if (mode == "mobile") {
    gifMax(divContainer, i, json, divIcons, desktopCard, mobileCard);
    backDiv.remove();
  } else {
    backDiv.appendChild(divIcons);
    backDiv.appendChild(divText);
  }
  //eventos
  backDiv.addEventListener("mouseout", gifCardOut); //elimina la tarjeta al hacer mouseout

  favBtn.addEventListener("click", () => {
    //agregado/quitado de un gif a favortios
    addFav(gifID);
  });
  fullBtn.addEventListener("click", () => {
    gifMax(divContainer, i, json, divIcons, desktopCard, mobileCard);
    backDiv.removeEventListener("mouseout", gifCardOut);
    backDiv.remove();
  });
}

//FUNCIONES
//cambio de imagen del botón fav
function changeFavBtn(favBtn) {
  let IDVieja = localStorage.getItem("favGifs");
  if (IDVieja != null) {
    //si hay gifs guardados
    if (IDVieja.includes(gifID)) {
      //el gif está en favoritos
      favBtn.setAttribute("src", "assets/icon-fav-active.svg");
    } else {
      //el gif no está en favoritos
      favBtn.setAttribute("src", "assets/icon-fav-hover.svg");
    }
  } else {
    //no hay gifs guardados
    favBtn.setAttribute("src", "assets/icon-fav-hover.svg");
  }
}
//elimina la tarjeta si sacamos el mouse de encima
function gifCardOut() {
  let divViejo = document.querySelectorAll("#backDiv");
  if (divViejo != null) {
    divViejo.forEach((element) => {
      element.remove();
    });
  }
}
//agrega el gif a favoritos o lo elimina si ya estaba
function addFav(ID) {
  let key = "favGifs";
  let allMyFavs = localStorage.getItem(key);
  if (allMyFavs === null) {
    //si no había gifs guardados
    localStorage.setItem(key, ID);
    favBtn.setAttribute("src", "assets/icon-fav-active.svg");
  } else {
    let favArray = allMyFavs.split(",");
    if (favArray.includes(ID)) {
      //si ya está, lo saca del array
      let index = favArray.indexOf(ID);
      favArray.splice(index, 1);
      favBtn.setAttribute("src", "assets/icon-fav-hover.svg");
    } else {
      //si no está, lo agrega
      favArray.push(ID);
      favBtn.setAttribute("src", "assets/icon-fav-active.svg");
    }
    allMyFavs = favArray.join(",");
    localStorage.setItem(key, allMyFavs);
  }
}
//muestra el gif grande
function gifMax(containerDiv, i, json, botones, desktopCard, mobileCard) {
  containerDiv.className = "maxed";
  //clases para mostrar el gif grande
  let gifMaxed;
  let idContainer = containerDiv.id;
  //indico a qué gifs hace referencia para calcular la posición de la tarjeta
  if (idContainer === "trendCtn") {
    gifMaxed = document.getElementById("trendGif" + i);
  } else {
    gifMaxed = document.getElementById("gif" + i);
  }
  if (gifMaxed == null) {
    return;
  }
  gifMaxed.className = "gifMaxed";
  //crea todos los elementos de la card
  let btnRight = document.createElement("img");
  let btnLeft = document.createElement("img");
  let closeBtn = document.createElement("img");
  let text = document.createElement("div");
  let username = document.createElement("p");
  let gifName = document.createElement("p");
  let btn = botones.cloneNode(true);
  let next = i + 4;
  console.log(containerDiv);
  text.className = "divText";
  username.innerHTML =
    json.data[i].username.charAt(0).toUpperCase() +
    json.data[i].username.slice(1); //mayúscula primera letra
  gifName.innerHTML =
    json.data[i].title.charAt(0).toUpperCase() + json.data[i].title.slice(1); //mayuscula primera letra
  //elimino funciones viejas
  gifMaxed.removeEventListener("click", mobileCard);

  btn.lastChild.remove(); //el boton de pantalla completa ya no está
  btn.addEventListener("click", () => {
    changeFavBtn(btn.firstChild);
  });
  changeFavBtn(btn.firstChild); //imagen del botón favoritos
  btn.firstChild.addEventListener("click", () => {
    //agregado/quitado de un gif a favortios
    addFav(json.data[i].id);
  });
  btn.lastChild.addEventListener("click", () =>
    downloadGif(gifMaxed, gifName.innerHTML)
  );
  //assets
  if (changeMode == "dark") {
    //assets para modo dark
    closeBtn.setAttribute("src", "assets/button-close-modo-noct.svg");
    btnRight.setAttribute("src", "assets/button-right-modo-noc.svg");
    btnLeft.setAttribute("src", "assets/button-left-modo-dark.svg");
    btnRight.addEventListener("mouseover", () => {
      btnRight.setAttribute("src", "assets/Button-Slider-right-hover-dark.svg");
    });
    btnRight.addEventListener("mouseout", () => {
      btnRight.setAttribute("src", "assets/button-right-modo-noc.svg");
    });
    btnLeft.addEventListener("mouseover", () => {
      btnLeft.setAttribute("src", "assets/button-slider-left-hvr-dark.svg");
    });
    btnLeft.addEventListener("mouseout", () => {
      btnLeft.setAttribute("src", "assets/button-left-modo-dark.svg");
    });
  } else {
    closeBtn.setAttribute("src", "assets/close.svg");
    btnRight.setAttribute("src", "assets/button-right.svg");
    btnLeft.setAttribute("src", "assets/button-left.svg");
    btnRight.addEventListener("mouseover", () => {
      btnRight.setAttribute("src", "assets/Button-Slider-right-hover.svg");
    });
    btnRight.addEventListener("mouseout", () => {
      btnRight.setAttribute("src", "assets/button-right.svg");
    });
    btnLeft.addEventListener("mouseover", () => {
      btnLeft.setAttribute("src", "assets/button-slider-left-hover.svg");
    });
    btnLeft.addEventListener("mouseout", () => {
      btnLeft.setAttribute("src", "assets/button-left.svg");
    });
  }
  closeBtn.className = "close";
  closeBtn.id = "closeMax";
  closeBtn.addEventListener("click", () => {
    //evento para cerrar la vista ampliada
    closeMaxed(containerDiv, btnRight, btnLeft, text, btn, gifMaxed, closeBtn);
    gifCardOut();
    // //vuelve a poner los eventos de la card
    gifMaxed.addEventListener("click", mobileCard);
  });
  btnRight.id = "rgtBtn";
  //evento al clickear la flecha de la derecha
  //tengo que agregarle la función del botón "ver más" para poder ver más de los 12 primeros gifs mostrados
  if (i === 11 || i === 23 || i === 35 || i === 47) {
    btnRight.addEventListener("click", () => {
      gifCardOut();
      verMas(json, containerDiv);
      i++;
      closeMaxed(
        containerDiv,
        btnRight,
        btnLeft,
        text,
        btn,
        gifMaxed,
        closeBtn
      );
      gifMax(containerDiv, i, json, botones, desktopCard, mobileCard);
    });
  } else {
    btnRight.addEventListener("click", () => {
      i++;
      gifCardOut();
      closeMaxed(
        containerDiv,
        btnRight,
        btnLeft,
        text,
        btn,
        gifMaxed,
        closeBtn
      );
      gifMax(containerDiv, i, json, botones, desktopCard, mobileCard);
    });
  }
  btnLeft.id = "lftBtn";
  btnLeft.addEventListener("click", () => {
    i--;
    closeMaxed(containerDiv, btnRight, btnLeft, text, btn, gifMaxed, closeBtn);
    gifMax(containerDiv, i, json, botones, desktopCard, mobileCard);
  });
  btnRight.className = "maxButtons";
  btnLeft.className = "maxButtons";

  //agregado al DOM
  text.appendChild(username);
  text.appendChild(gifName);
  //límite izquierdo
  if (i === 0) {
    btnLeft.remove();
  } else {
    containerDiv.insertBefore(btnLeft, containerDiv.children[i]);
  }
  containerDiv.insertBefore(closeBtn, containerDiv.children[i]);
  //límite derecho
  if (gifMaxed.id === "gif47") {
    btnRight.remove();
  } else {
    containerDiv.insertBefore(btnRight, containerDiv.children[next]);
  }
  containerDiv.appendChild(text);
  containerDiv.appendChild(btn);
}

function closeMaxed(
  container,
  btnRight,
  btnLeft,
  text,
  btn,
  gifMaxed,
  closeBtn
) {
  switch (container.id) {
    case "searchGifs":
      container.className = "searchGifs";
      break;
    case "trendCtn":
      container.className = "trendCtn";
      break;
    case "gifosContainer":
      container.className = "misGifosCtn";
      break;
    case "favDivCtn":
      container.className = "favDivCtn";
      break;
  }
  gifMaxed.classList.remove("gifMaxed");
  btnRight.remove();
  btnLeft.remove();
  closeBtn.remove();
  text.remove();
  btn.remove();
}
//función para descargar el gif


async function downloadGif(gifS, gifName, mode) {
  try {
    let a = document.createElement("a");
    let url;
    if (mode != "myGifs" || mode === undefined) {
      //si viene desde una card
      let src = gifS.getAttribute("src");
      //busco el nombre del gif
      let response = await fetch(src);
      url = await response.blob();
    } else {
      //si viene desde la creacion de gifs
      url = gifS;
    }
    a.href = window.URL.createObjectURL(url);
    a.download = gifName;
    a.click();
  } catch (err) {
    console.log(err);
  }
}
