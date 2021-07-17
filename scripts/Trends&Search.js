//---------------TRENDING GIFS---------------

let TrendingContainer = document.getElementById("trending");
addTrending();
let cont1 = 0;
let btnLeft = document.createElement("img");
let btnRight = document.createElement("img");
let ctn = document.createElement("div");
//funcion para agregar los gifs a la página
async function addTrending() {
  try {
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/trending?api_key=DE8K3o8mb5Wmcwav3ckyL8hr84GY0Hiv&limit=12`
    );
    const trend = await response.json();

    btnLeft.className = "trendBtnLt";
    btnRight.className = "trendBtnRt";

    ctn.className = "trendCtn";
    ctn.id = "trendCtn";
    for (let i = 0; i < 12; i++) {
      let gif = document.createElement("img");
      gif.setAttribute("src", trend.data[i].images.downsized_medium.url);
      gif.id = "trendGif" + i;
      ctn.appendChild(gif);
      TrendingContainer.appendChild(btnLeft);
      TrendingContainer.appendChild(ctn);
      TrendingContainer.appendChild(btnRight);

      function desktopCard() {
        mode = "";
        gifCard(trend, ctn, i, mode, desktopCard, mobileCard);
      }
      //función para mobiles
      function mobileCard() {
        mode = "mobile";
        gifCard(trend, ctn, i, mode, desktopCard, mobileCard);
      }
      gif.addEventListener("mouseover", desktopCard);
      gif.addEventListener("click", mobileCard);
    }
    //EVENTOS
    //eventos para scrollear
    btnRight.addEventListener("click", () => {
      if (cont1 <= 2) {
        //mas de tres clicks ya no tiene nada mas para mostrar
        scrollRight(cont1, ctn);
        cont1++;
      }
    });

    btnLeft.addEventListener("click", () => {
      if (cont1 >= 1) {
        //mas de tres clicks ya no tiene nada mas para mostrar
        scrollLeft(cont1, ctn);
        cont1--;
      }
    });
  } catch (err) {
    console.log(err);
  }
}

//funciones para scrollear a la derecha haciendo click en boton
function scrollRight(cont1, ctn) {
  let scrollWidth = ctn.offsetWidth;
  if (cont1 == 1) {
    scrollWidth = scrollWidth * 2;
  }
  if (cont1 == 2) {
    scrollWidth = scrollWidth * 3;
  }

  ctn.scroll({
    left: scrollWidth,
    behavior: "smooth",
  });
}
//funciones para scrollear a la izquierda haciendo click en boton
function scrollLeft(cont1, ctn) {
  let scrollWidth = ctn.offsetWidth;
  if (cont1 == 1) {
    scrollWidth = 0;
  } else if (cont1 == 3) {
    scrollWidth = scrollWidth * 2;
  }
  ctn.scroll({
    left: scrollWidth,
    behavior: "smooth",
  });
}

//----------------------------BUSCADOR-----------------------------------

//Funciones para agregar sugerencias a la barra de búsqueda
let SearchBar = document.getElementById("search_bar");
let inputCtn = document.getElementById("input_ctn");
let inputSearch = document.getElementById("searchInput");
let lupaImg = document.getElementById("lupa");
let searchLupa = document.getElementById("search");
let closeImg = document.getElementById("close");
let linea = document.getElementById("linea");
let suggestCtn = document.getElementById("suggest_container");
let searchSection = document.getElementById("search_section");

inputSearch.addEventListener("focus", ShowSuggest);

function ShowSuggest() {
  SearchBar.className = "search_bar_clicked";
  searchLupa.setAttribute("src", "assets/icon-search-active.svg");

  inputSearch.addEventListener("keyup", () => {
    suggest();
    contador = 0;
  });
}
var contador = 0;

async function suggest() {
  try {
    linea.className = "lineaShow"; //muestra el span
    //busca y muestra las sugerencias
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/search/tags?q=${inputSearch.value}&api_key=DE8K3o8mb5Wmcwav3ckyL8hr84GY0Hiv&limit=5`
    );
    const json = await response.json();

    suggestCtn.innerHTML = ""; //limpia las búsquedas anteriores

    json.data.forEach((element) => {
      //creamos los elementos para mostrar cada una de las sugerencias
      let suggestionDiv = document.createElement("div");
      let suggestionA = document.createElement("p");
      let lupita = document.createElement("img");

      suggestionA.textContent = element.name;
      suggestionDiv.className = "suggestDiv";
      suggestionDiv.id = "suggestDiv";

      lupita.setAttribute("src", "assets/icon-search-active.svg");

      suggestionDiv.appendChild(lupita);
      suggestionDiv.appendChild(suggestionA);
      suggestCtn.appendChild(suggestionDiv);

      //evento buscar la sugerencia
      suggestionDiv.addEventListener("click", () => {
        searchSuggestion(element.name);
        hidSuggest();
        inputSearch.value = "";
        //hacer que al clickear la sugerencia, la pagina se traslade a los resultados
        const offsetTop = document.querySelector("#trends").offsetTop;
        scroll({
          top: offsetTop,
          behavior: "smooth",
        });
      });

      contador++;
    });
  } catch (err) {
    console.log(err);
  }
}

//función para buscar los gifs al clickear las sugerencias
let searchButton = document.getElementById("lupa");
let searchCtn = document.getElementById("searchContainer");
let noResultsSearch = document.getElementById("noResultsSearch");

async function searchSuggestion(info) {
  try {
    searchSection.className = "searchShown";
    //búsqueda del valor tipeado
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=DE8K3o8mb5Wmcwav3ckyL8hr84GY0Hiv&q="${info}&offset=0&rating=r&lang=es`
    );
    const busqueda = await response.json();

    searchCtn.className = "resultsShown";
    noResultsSearch.className = "noResultsHidden";
    addSearchToDOM(busqueda, info);
  } catch (err) {
    console.log(err);
  }
}
//eliminar las sugerencias
closeImg.addEventListener("click", function () {
  hidSuggest();
  inputSearch.value = ""; //borra lo que está escrito en el input si clickea la cruz
});

function hidSuggest() {
  //función que esconde la barra de sugerencias
  linea.className = "lineaHid"; //esconde el span
  SearchBar.className = "search_bar";
  lupaImg.className = "lupaImgShow";

  for (let i = 0; i < contador; i++) {
    let suggestDivs = document.getElementById("suggestDiv"); //elije c/u de las sugerencias
    if (suggestDivs != null) {
      //si no hay ningún elemento para borrar pq no hubo busqueda, ignora
      suggestDivs.remove();
    }
  }
  contador = 0;
}

//busqueda de palabra tipeada
lupaImg.addEventListener("click", function () {
  search(); //busca
  hidSuggest(); //borra sugerencias
  inputSearch.value = ""; //borra lo que está escrito en el input
  //nos leva smoooooth a la parte donde muestra los resultados
  const offsetTop = document.querySelector("#trends").offsetTop;
  scroll({
    top: offsetTop,
    behavior: "smooth",
  });
});

inputSearch.addEventListener("keyup", function (event) {
  //evento al apretar enter
  if (event.key === "Enter") {
    search(); //busca
    hidSuggest(); //borra sugerencias
    inputSearch.value = ""; //borra lo que está escrito en el input
    //nos leva smoooooth a la parte donde muestra los resultados
    const offsetTop = document.querySelector("#trends").offsetTop;
    scroll({
      top: offsetTop,
      behavior: "smooth",
    });
  }
});

//funcion para buscar la palabra tipeada
async function search() {
  try {
    searchSection.className = "searchShown";
    let tipeado = inputSearch.value;
    //búsqueda del valor tipeado
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=DE8K3o8mb5Wmcwav3ckyL8hr84GY0Hiv&q=${tipeado}&offset=0&rating=r&lang=es`
    );

    const busqueda = await response.json();

    //verifica si hay resultados para la búsqueda o no
    if (busqueda.pagination.total_count == 0) {
      //borra búsquedas anteriores
      let resultadoViejo = document.getElementById("searchTitle");
      if (resultadoViejo != null) {
        //si hay una busqueda vieja, elimina sus resultados
        resultadoViejo.remove();
      }
      searchCtn.className = "resultsHidden";
      noResultsSearch.className = "noResultsShown";
      let searchTitle = document.createElement("h2");

      searchTitle.textContent = tipeado;
      searchTitle.id = "searchTitle";
      noResultsSearch.insertBefore(searchTitle, noResultsSearch.childNodes[0]);
    } else {
      //si encuetra, los muestra por pantalla
      searchCtn.className = "resultsShown";

      noResultsSearch.className = "noResultsHidden";
      trends.className = "trendsHidden"; //esconde la sección de las trending words
      addSearchToDOM(busqueda, tipeado);
    }
  } catch (err) {
    console.log(err);
  }
}

let mode; //usado en la función para indicar si esta en mobile o desktop
//agregado al DOM de los gifs buscados
function addSearchToDOM(json, name) {
  cont2 = 1;
  //primero verifica que no haya habido alguna búsqueda antes
  let resultadoViejo = document.getElementById("searchGifs");
  if (resultadoViejo != null) {
    //si hay una busqueda vieja, elimina sus resultados
    searchCtn.innerHTML = "";
  }

  let searchGifCtn = document.createElement("div");
  searchGifCtn.id = "searchGifs";
  searchGifCtn.className = "searchGifs";
  let searchTitle = document.createElement("h2");
  //creamos botón y evento de agregar más gifs
  let btn = document.createElement("button");
  btn.addEventListener("click", function () {
    verMas(json, searchGifCtn);
  });
  //crea los gifs para 12 elementos de la búsqueda
  for (let i = 0; i < 12; i++) {
    let gif = document.createElement("img");

    //Mostrar el texto con mayúscula al principio
    name = name.charAt(0).toUpperCase() + name.slice(1);
    searchTitle.textContent = name;
    gif.setAttribute("src", json.data[i].images.downsized_medium.url);
    gif.id = "gif" + i;
    //creo el listener para el evento de las tarjetas, cuya función y demás está definido en styles/cards.js
    //los eventos están definidos así para poder aplicarles removeEvent más adelante
    //función sólo para desktop
    function desktopCard() {
      mode = "";
      gifCard(json, searchGifCtn, i, mode, desktopCard, mobileCard);
    }
    //función para mobiles
    function mobileCard() {
      mode = "mobile";
      gifCard(json, searchGifCtn, i, mode, desktopCard, mobileCard);
    }
    gif.addEventListener("mouseover", desktopCard);
    gif.addEventListener("click", mobileCard);
    btn.textContent = "Ver más";
    btn.id = "btnVerMas";

    searchGifCtn.appendChild(gif);
    searchCtn.appendChild(searchTitle);
    searchCtn.appendChild(searchGifCtn);
    searchCtn.appendChild(btn);
  }
}

let cont2 = 1;
function verMas(json, div) {
  let endCont = Math.floor(json.data.length / 12);
  let base = 12 * cont2;
  let techo = 12 * (cont2 + 1);
  for (let j = base; j < techo; j++) {
    let gif = document.createElement("img");
    if (json.data[j] != undefined) {
      gif.setAttribute("src", json.data[j].images.downsized_medium.url);
      gif.id = "gif" + j;
      //creo el listener para el evento de las tarjetas, cuya función y demás está definido en styles/cards.js
      gif.addEventListener("mouseover", () => {
        gifCard(json, div, j, mode);
      });
      gif.addEventListener("click", () => {
        mode = "mobile"; //función para mobile
        gifCard(json, div, j, mode);
      });
      div.appendChild(gif);
    }
  }
  cont2++;
  if (cont2 > endCont) {
    //elimina el botón de ver más al mostrar los últimos gifs
    let button = document.getElementById("btnVerMas");
    button.remove();
    cont2 = 1;
    return cont2;
  }
}

//------------------------------TRENDING WORDS-------------------------------

let trends = document.getElementById("trends");
ShowTrends();
async function ShowTrends() {
  try {
    let response = await fetch(
      "https://api.giphy.com/v1/trending/searches?&api_key=DE8K3o8mb5Wmcwav3ckyL8hr84GY0Hiv"
    );
    let showTrend = await response.json();
    let trendDiv = document.createElement("div");
    for (let i = 0; i < 5; i++) {
      //crea cada una de las tendencias
      let trendP = document.createElement("p");
      let coma = document.createElement("p");
      coma.textContent = ", ";
      coma.style.marginRight = "5px";

      let trendString = showTrend.data[i]; //Mostrar el texto con mayúscula al principio
      trendString = trendString.charAt(0).toUpperCase() + trendString.slice(1);
      trendP.innerHTML = trendString;
      trendDiv.className = "trenDiv";

      //agregado de los trends a la página
      trendDiv.appendChild(trendP);
      trendDiv.appendChild(coma);
      trends.appendChild(trendDiv);

      //busqueda del trend al clickearlo
      trendP.addEventListener("click", () => {
        searchSuggestion(showTrend.data[i]);
        //smooth scroll a los resultados
        const offsetTop = document.querySelector("#trends").offsetTop;
        scroll({
          top: offsetTop,
          behavior: "smooth",
        });
      });
    }
    trendDiv.removeChild(trendDiv.lastChild); //borra la última coma
  } catch (err) {
    console.log(err);
  }
}
