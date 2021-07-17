let favArray = [];
let favSection = document.getElementById("fav_section");
let favResults = document.getElementById("favContainer");
let favNoResults = document.getElementById("noFavsContainer");

async function addFavorito() {
  try {
    let key = "favGifs";
    let favString = localStorage.getItem(key);
    //json con cada uno de los ID faveados
    if (favString === null) {
      favResults.className = "resultsHidden";
      favNoResults.className = "noResultsShown";
    } else {
      favResults.className = "resultsShown";
      favNoResults.className = "noResultsHidden";
      const response = await fetch(
        `https://api.giphy.com/v1/gifs?api_key=DE8K3o8mb5Wmcwav3ckyL8hr84GY0Hiv&ids=${favString}`
      );
      const favs = await response.json();
      favResults.innerHTML = ""; //elimina lo que haya en pantalla
      //mostramos los gifs por pantalla
      let divCtn = document.createElement("div");
      divCtn.id = "favDivCtn";
      divCtn.className = "favDivCtn";
      cont2 = 1; //usado en botón ver más
      for (let i = 0; i < 12; i++) {
        //crea los nodos para c/u de los gifs
        if (favs.data[i] != undefined) {
          //si hay menos de 12 gifs fav, corta el loop
          let gif = document.createElement("img");
          gif.setAttribute("src", favs.data[i].images.downsized_medium.url);
          gif.id = "gif" + i;
          gif.className = "favGif";

          divCtn.appendChild(gif);
          favResults.appendChild(divCtn);
          //los gifs de favoritos tmb tienen que tener tarjeta
          gif.addEventListener("mouseover", () => {
            mode = "";
            gifCard(favs, divCtn, i, mode);
          });
          gif.addEventListener("click", () => {
            mode = "mobile";
            gifCard(favs, divCtn, i, mode);
          });
        }
      }
      if (favs.data.length > 12) {
        let btn = document.createElement("button");
        btn.addEventListener("click", () => {
          verMas(favs, divCtn);
        });
        btn.textContent = "Ver más";
        btn.id = "btnVerMas";
        favResults.appendChild(btn);
      }
    }
  } catch (err) {
    console.log(err);
  }
}
