"use strict";

let sheetId = "1YOCFlcLZPVuEuTtG6ZHGkcxPEIEt1U2mHWRdEUXbC1I";
let sheetNumber = 1;
let sheetUrl = "https://spreadsheets.google.com/feeds/list/" + sheetId + "/" + sheetNumber + "/public/full?alt=json";
console.log(sheetUrl);

fetch(sheetUrl)
  .then(function(response) {
    return response.json();
  })
  .then(function(json) {
    console.log(json);
    appendBassiner(json.feed.entry);
  });

/*
Appends json data to the DOM
*/

function appendBassiner(bassiner) {
  console.log(bassiner);
  let htmlTemplate = "";
  for (let bassin of bassiner) {
    htmlTemplate += `
        <article class="column-element">
          <h4>${bassin['gsx$omraade']['$t']}</h4>
          <p>${bassin['gsx$omraadenavn']['$t']}</p>
          <button class="button" id="${bassin['gsx$omraade']['$t']}" onclick="openModal(); makeI(this.id)">Åben oversigt</button>
        </article>
        `;
  }
  document.querySelector("#bassiner").innerHTML += htmlTemplate;
}

let modal = document.getElementById("myModal");

let i = [];

function makeI(id) {
  i.push(id);
}

// When the user clicks the button, and change text accordingly
function openModal() {
  modal.style.display = "block";
  fetch(sheetUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      fullDataSet(json.feed.entry)
    });
};

// get the full data from json

function fullDataSet(bassiner) {
  let modalBody = "";
  for (let bassin of bassiner) {
    let j = [`${bassin['gsx$omraade']['$t']}`];
    if (j[0] === i[0]) {
      console.log("hey world");
      modalBody += `
      <p><b>Område nummer:</b><br>${bassin['gsx$omraade']['$t']}</p>
      <p><b>Navn og adresse:</b><br>${bassin['gsx$omraadenavn']['$t']}</p>
      <div class="row-container">
      <p><b>Areal tegning:</b><br><a href="${bassin['gsx$pdf-arealtegning']['$t']}" target="_blank" class="button">Vis PDF</a></p>
      <p><b>Område liste:</b><br><a href="${bassin['gsx$pdf-omraadeliste']['$t']}" target="_blank" class="button">Vis PDF</a></p>
      </div>
        <textarea rows="4" cols="50" id="commentSection"></textarea>
        <button class="button" onclick="pushText()">Tilføj</button>
        <p id="demo"></p>
      `;
    }
  }
  document.querySelector("#modal-body").innerHTML += modalBody;
  i = [];
};

function pushText() {
  let x = document.getElementById("commentSection").value;
  document.getElementById("demo").innerHTML = x;
  document.getElementById("commentSection").value = "";
}
// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
  document.getElementById("modal-body").innerHTML = "";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    document.getElementById("modal-body").innerHTML = "";
  }
}
