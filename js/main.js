// Get data from server.
function getServerData(url) {
  let fetchOptions = {
    method: "GET",
    mode: "cors",
    cache: "no-cache"
  };

  return fetch(url, fetchOptions).then(
    response => response.json(),
    err => console.error(err)
  );
}

function startGetUsers() {
  getServerData("http://localhost:8080/intakes/allIntakes").then(
    data => fillDataTable(data, "pillsDiary")
  );
}


document.querySelector("#getDataButton").addEventListener("click", startGetUsers);

//Fill table with server data.
function fillDataTable(data, tableID) {
  let table = document.querySelector(`#${tableID}`);
  if (!table) {
    console.error(`Table "${tableID}" is not found.`);
    return
  }

  // let tBody = table.querySelector("tbody");
  let refreshedBody = table.querySelector("tbody");
  let tBody = document.createElement('tbody');

  for (let row of data) {
    let tr = createAnyElement("tr");
    const keys = ["id", "time", "medicine01", "dose01", "medicine02", "dose02", "medicine03", "dose03"];

    // for (let k in row) {
    for (let k of keys) {
      let td = createAnyElement("td");
      // td.innerHTML = row[k];
      td.innerHTML = row[k];
      tr.appendChild(td);
    }
    let buttonGroup = createButtonGroup();
    tr.appendChild(buttonGroup);
    tBody.appendChild(tr);
  }

  refreshedBody.parentNode.replaceChild(tBody, refreshedBody);
}

function createAnyElement(name, attributes) {
  let element = document.createElement(name);
  for (let k in attributes) {
    element.setAttribute(k, attributes[k]);
  }
  return element;
}

function createButtonGroup() {
  let group = createAnyElement("div", { class: "btn btn-group" });

  let infoButton = createAnyElement("button", { class: "btn btn-info", onclick: "getInfo(this)" });
  infoButton.innerHTML = '<i class="fa fa-refresh" aria-hidden="true"></i>'
  let deleteButton = createAnyElement("button", { class: "btn btn-danger", onclick: "delRow(this)" });
  deleteButton.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>'

  group.appendChild(infoButton);
  group.appendChild(deleteButton);

  let td = createAnyElement("td");
  td.appendChild(group);
  return td;
}

function delRow(button) {
  let tr = button.parentElement.parentElement.parentElement;
  let id = tr.querySelector("td:first-child").innerHTML;
  let fetchOptions = {
    method: "DELETE",
    mode: "cors",
    cache: "no-cache"
  };

  fetch(`http://localhost:8080/intakes/${id}`, fetchOptions)
    .then(response => response.json())
    .catch((error) => console.error(error))
    .then(() => startGetUsers())
    .catch((error) => console.error(error))

}
window.onload = () => {
  startGetUsers()
}

//By Peti:

// async function main() {
//   try{

//     const response = await fetch(`http://localhost:8080/intakes/${id}`, fetchOptions)
//     const json = await response.json()
//   } catch (e) {

//   }
// }