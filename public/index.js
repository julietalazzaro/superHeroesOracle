let btnSuerte = document.getElementById("btnSuerte");
let header = document.querySelector(".header");
let main = document.querySelector(".main");
let loader = document.querySelector(".loader");
let cards = document.querySelector(".cards");
let compatibilidad = document.querySelector(".compatibilidad");
let btnCompatibilidad = document.querySelector("#btnCompatibilidad");
let btnVolverTirar = document.querySelector("#btnVolverTirar");
let btnCerrarModal = document.querySelector("#btnModalCerrar");
let btnCerrarCompatibilidad = document.querySelector("#btnSalir");
let btnGuardarCompatibilidad = document.querySelector("#btnGuardar");
let listaResultados = document.querySelector(".main__resultados-list");
let btnCerrarCompatibilidad2 = document.querySelector("#compatibilidadClose");

let carouselItems = document.querySelectorAll(".carousel-item");
let carouselItemsTitle = document.querySelectorAll(".carousel-item__title");
let carouselItemsImg = document.querySelectorAll(".carousel-item__img");
let carouselItemsSubtitle = document.querySelectorAll(
  ".carousel-item__subtitle"
);
let carouselItemsDesc = document.querySelectorAll(".carousel-item__desc");
let statscombat = document.querySelectorAll(".carousel-item__stat-span.combat");
let statsdurability = document.querySelectorAll(
  ".carousel-item__stat-span.durability"
);
let statsintelligence = document.querySelectorAll(
  ".carousel-item__stat-span.intelligence"
);
let statspower = document.querySelectorAll(".carousel-item__stat-span.power");
let statsspeed = document.querySelectorAll(".carousel-item__stat-span.speed");
let statsstrength = document.querySelectorAll(
  ".carousel-item__stat-span.strength"
);
let compatibilidadImg = document.querySelectorAll(".compatibilidad__img");

function Juego(jugador1, jugador2, cartas, compatibilidad) {
  this.jugador1 = jugador1;
  this.jugador2 = jugador2;
  this.cartas = cartas;
  this.compatibilidad = compatibilidad;
}
function Carta(nombre, img, desc, valores, valorgeneral) {
  this.nombre = nombre;
  this.img = img;
  this.desc = desc;
  this.valores = valores;
  this.valorgeneral = valorgeneral;
}

let valoresCartas = new Array();
let juegos = [];
let partidaGuardada = false;
juego = new Juego();

// LISTENERS

document
  .getElementById("jugador2")
  .addEventListener("keydown", function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      btnSuerte.click();
    }
  });

btnSuerte.addEventListener("click", function () {
  if (jugador1.value == "" || jugador2.value == "") {
    document.querySelector(".valid-feedback").style.display = "block";
    return;
  }
  showLoader();
  focusFirstCard();

  partidaGuardada = false;
  juego.jugador1 = document.getElementById("jugador1").value;
  juego.jugador2 = document.getElementById("jugador2").value;
  juego.cartas = [];
  carouselItemsTitle[0].innerHTML = "Carta 1/3 de " + juego.jugador1;
  carouselItemsTitle[1].innerHTML = "Carta 2/3 de " + juego.jugador1;
  carouselItemsTitle[2].innerHTML = "Carta 3/3 de " + juego.jugador1;
  carouselItemsTitle[3].innerHTML = "Carta 1/3 de " + juego.jugador2;
  carouselItemsTitle[4].innerHTML = "Carta 2/3 de " + juego.jugador2;
  carouselItemsTitle[5].innerHTML = "Carta 3/3 de " + juego.jugador2;

  repartirCartas();
});

btnCompatibilidad.addEventListener("click", function () {
  btnCerrarModal.click();
  compatibilidad.style.display = "flex";
  cards.style.display = "none";
  if (!partidaGuardada) {
    verMatch();
  }

  cargarCompatibles();
});

btnVolverTirar.addEventListener("click", function () {
  btnCerrarModal.click();
  juego.cartas = [];
  repartirCartas();
  showLoader();
  focusFirstCard();
});

btnCerrarCompatibilidad.addEventListener("click", function () {
  menu();
});
btnCerrarCompatibilidad2.addEventListener("click", function () {
  compatibilidad.style.display = "none";
  cards.style.display = "flex";
});

btnGuardarCompatibilidad.addEventListener("click", function () {
  juegos.push(juego);
  juegos.length;
  listaResultados.innerHTML += `<li class="list-group-item" data-juego="${
    juegos.length - 1
  }">${juego.jugador1} & ${juego.jugador2}</li>`;
  menu();
});

listaResultados.addEventListener("click", function (e) {
  juego = juegos[e.target.getAttribute("data-juego")];
  showLoader();
  focusFirstCard();

  btnVolverTirar.style.display = "none";
  btnGuardarCompatibilidad.style.display = "none";
  partidaGuardada = true;

  for (let i = 0; i < 6; i++) {
    cargarCards(juego.cartas[i], i);
  }
});

//
//
// FUNCIONES
//
//

function showLoader() {
  header.style.display = "none";
  main.style.display = "none";
  compatibilidad.style.display = "none";
  cards.style.display = "none";
  loader.style.display = "flex";

  setTimeout(() => {
    loader.style.display = "none";
    cards.style.display = "flex";
  }, 3000);
}

function repartirCartas() {
  for (let i = 0; i < 6; i++) {
    let rand = Math.floor(Math.random() * 731);
    let url = `https://www.superheroapi.com/api.php/10225017839096516/${rand}`;
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        let carta = guardarCard(res);
        cargarCards(carta, i);
        juego.cartas.push(carta);
      })
      .catch((err) => {
        console.error(err);
      });
  }
}

function guardarCard(res) {
  let carta = new Carta(
    res.name,
    res.image.url,
    res.work.occupation,
    res.powerstats,
    [],
    1
  );
  valoresCartas = [];
  for (valor in carta.valores) {
    if (carta.valores[valor] == "null") carta.valores[valor] = "-";
    if (carta.valores[valor] != "-")
      carta.valorgeneral += parseInt(carta.valores[valor]);
  }
  if (carta.valorgeneral > 0) {
    valoresCartas.push(parseInt(carta.valorgeneral));
  } else {
    valoresCartas.push(0);
  }
  return carta;
}

function cargarCards(carta, i) {
  carouselItemsImg[i].setAttribute("src", carta.img);
  carouselItemsSubtitle[i].innerHTML = carta.nombre;
  carouselItemsDesc[i].innerHTML = carta.desc;

  statscombat[i].innerHTML = carta.valores.combat;
  statsdurability[i].innerHTML = carta.valores.durability;
  statsintelligence[i].innerHTML = carta.valores.intelligence;
  statspower[i].innerHTML = carta.valores.power;
  statsspeed[i].innerHTML = carta.valores.speed;
  statsstrength[i].innerHTML = carta.valores.strength;
}

function verMatch() {
  let match = 1;
  for (let i = 0; i < 3; i++) {
    if (valoresCartas[i] % 2 == 0 && valoresCartas[i + 3] % 2 == 0) {
      match = match * true;
    } else {
      match = match * false;
    }
  }
  if (match) {
    juego.compatibilidad = "SI";
  } else {
    juego.compatibilidad = "NO";
  }
}

function cargarCompatibles() {
  for (let i = 0; i < 6; i++) {
    compatibilidadImg[i].setAttribute("src", juego.cartas[i].img);
  }
  let players = document.querySelectorAll(".compatibilidad__title");
  players[0].innerHTML = "Cartas de " + juego.jugador1;
  players[1].innerHTML = "Cartas de " + juego.jugador2;

  document.querySelector(".compatibilidad__text").innerHTML =
    juego.compatibilidad;
}

function menu() {
  header.style.display = "flex";
  main.style.display = "block";
  compatibilidad.style.display = "none";
  document.querySelector(".valid-feedback").style.display = "none";

  btnVolverTirar.style.display = "block";
  btnGuardarCompatibilidad.style.display = "block";

  document.getElementById("jugador1").value = "";
  document.getElementById("jugador2").value = "";
  juego = new Juego();

  if (juegos.length != 0) {
    document.querySelector(".main__resultados").style.display = "block";
  }
}
function focusFirstCard() {
  document
    .querySelector("#carouselCards button[data-bs-target].active")
    .setAttribute("class", "");
  document
    .querySelector("#carouselCards button[data-bs-target]")
    .setAttribute("class", "active");
  document
    .querySelector("div.carousel-item.active")
    .setAttribute("class", "carousel-item");
  document
    .querySelector("div.carousel-item")
    .setAttribute("class", "carousel-item active");
}
