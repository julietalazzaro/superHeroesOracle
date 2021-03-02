let btnSuerte = document.getElementById("btnSuerte");
let header = document.querySelector(".header");
let main = document.querySelector(".main");
let loader = document.querySelector(".loader");
let cards = document.querySelector(".cards");
let compatibilidad = document.querySelector(".compatibilidad");
let btnCompatibilidad = document.querySelector("#btnCompatibilidad");
let btnVolverTirar = document.querySelector("#btnVolverTirar");
let btnCerrarModal = document.querySelector("#btnModalCerrar");

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

function Juego(jugador1, jugador2, cartas) {
  this.jugador1 = jugador1;
  this.jugador2 = jugador2;
  this.cartas = cartas;
  this.compatibilidad;
}
function Carta(nombre, img, desc, valores) {
  this.nombre = nombre;
  this.img = img;
  this.desc = desc;
  this.valores = valores;
}

let juegos = [];
juego = new Juego();

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

  juego.jugador1 = document.getElementById("jugador1").value;
  juego.jugador2 = document.getElementById("jugador2").value;
  juego.cartas = [];
  carouselItemsTitle[0].innerHTML += juego.jugador1;
  carouselItemsTitle[1].innerHTML += juego.jugador1;
  carouselItemsTitle[2].innerHTML += juego.jugador1;
  carouselItemsTitle[3].innerHTML += juego.jugador2;
  carouselItemsTitle[4].innerHTML += juego.jugador2;
  carouselItemsTitle[5].innerHTML += juego.jugador2;

  repartirCartas();
});

btnCompatibilidad.addEventListener("click", function () {
  btnCerrarModal.click();
  compatibilidad.style.display = "flex";
  cards.style.display = "none";
  cargarCargarCompatibles();
});

btnVolverTirar.addEventListener("click", function () {
  btnCerrarModal.click();
  showLoader();
  repartirCartas();
});

// FUNCIONES
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
    res.powerstats
  );

  for (valor in carta.valores) {
    if (carta.valores[valor] == "null") carta.valores[valor] = "-";
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

function cargarCargarCompatibles() {
  for (let i = 0; i < 6; i++) {
    compatibilidadImg[i].setAttribute("src", juego.cartas[i].img);
  }
  let players = document.querySelectorAll(".compatibilidad__title");
  players[0].innerHTML = "Cartas de " + juego.jugador1;
  players[1].innerHTML = "Cartas de " + juego.jugador2;
}
