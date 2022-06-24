//Keys of data table
const keys = {
    id: '',
    month: '', time: '', day: '',
    medicine01: '', pieces01: '', dose01: '',
    medicine02: '', pieces02: '', dose02: ''
};

// Get data from server.
function getServerData(url) {
    let fetchOptions = {
        method: "GET",
        mode: "cors",
        cache: "no-cache"
    };
    return fetch(url, fetchOptions)
        .then(response => response.json())
        .catch(err => console.error(err));
}

function startGetUsers() {
    getServerData("http://localhost:8080/intakes/allIntakes")
        .then(data => fillDataTable(data, "pillsDiary"))
        .catch(err => console.error(err));
}

document.querySelector("#getDataButton").addEventListener("click", startGetUsers);


//Fill table with server data.
function fillDataTable(data, tableID) {
    let table = document.querySelector(`#${tableID}`);
    if (!table) {
        console.error(`Table "${tableID}" is not found.`);
        return
    }
    let refreshedBody = table.querySelector("tbody");
    let tBody = document.createElement('tbody');
    let newRow = addNewRow(keys);
    tBody.appendChild(newRow);
    for (let row of data) {
        let tr = createAnyElement("tr");
        for (let k in keys) {
            let td = createAnyElement("td");
            let input = createAnyElement("input", {
                class: "form-control",
                value: row[k],
                name: k
            });
            if (k == "id") {
                input.setAttribute("readonly", true);
            }
            td.appendChild(input);
            tr.appendChild(td);

            // if (k == "time") {
            //     // console.log(row.id);
            //     // console.log(input.value);
            //     window.sessionStorage.setItem(row.id, input.value);
            // }
            getTimeColumnData(k, row, input);
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

    let infoButton = createAnyElement("button", { class: "btn btn-info", onclick: "setRow(this)" });
    infoButton.innerHTML = '<i class="fa fa-refresh" aria-hidden="true"></i>';
    let deleteButton = createAnyElement("button", { class: "btn btn-danger", onclick: "delRow(this)" });
    deleteButton.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';
    let pdfButton = createAnyElement("button", { class: "btn btn-primary", onclick: "pdfEnvilope(this)" });
    pdfButton.innerHTML = '<i class="fa fa-file-pdf-o" aria-hidden="true"></i>';

    group.appendChild(infoButton);
    group.appendChild(deleteButton);
    group.appendChild(pdfButton);

    let td = createAnyElement("td");
    td.appendChild(group);
    return td;
}


//By Peti:

// async function main() {
//   try{

//     const response = await fetch(`http://localhost:8080/intakes/${id}`, fetchOptions)
//     const json = await response.json()
//   } catch (e) {

//   }
// }


//Create new line
function addNewRow(row) {
    let tr = createAnyElement("tr");
    for (let k in row) {
        let td = createAnyElement("td");
        let input = createAnyElement("input", {
            class: "form-control",
            name: k
        });
        td.appendChild(input);
        tr.appendChild(td);
    }
    let tdBtn = createAnyElement("td");
    let group = createAnyElement("div", { class: "btn btn-group" });
    let newBtn = createAnyElement("button", {
        class: "btn btn-success",
        onclick: "addNewIntake(this)"
    });
    newBtn.innerHTML = '<i class="fa fa-solid fa-plus" aria-hidden="true"></i>';
    group.appendChild(newBtn);
    tdBtn.appendChild(group);
    tr.appendChild(tdBtn);
    return tr;
}

function addNewIntake(button) {
    let tr = button.parentElement.parentElement.parentElement;
    let data = getRowData(tr);
    let fetchOptions = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    fetch(`http://localhost:8080/intakes/add`, fetchOptions)
        .then(response => response.json())
        .catch((error) => console.error(error))
        .then(() => startGetUsers())
        .catch((error) => console.error(error));
}

function getRowData(tr) {
    let inputs = tr.querySelectorAll("input.form-control");
    let data = {};
    for (let i = 0; i < inputs.length; i++) {
        data[inputs[i].name] = inputs[i].value;
    }
    return data;
}

// function getNumbersFromDay(tr) {
//     let inputs = tr.querySelectorAll("input.form-control");
//     let data = {};
//     for (let i = 0; i < inputs.length; i++) {
//         data[inputs[i].name] = inputs[i].value;
//     }
//     return data;
// }

// Delete the whole row
function delRow(button) {
    let tr = button.parentElement.parentElement.parentElement;
    let data = getRowData(tr);
    let fetchOptions = {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
    fetch(`http://localhost:8080/intakes/del/${data.id}`, fetchOptions)
        .then(response => response.json())
        .catch(error => console.error(error))
        .then(() => startGetUsers())
        .catch((error) => console.error(error));
}


function pdfEnvilope(button) {
    let tr = button.parentElement.parentElement.parentElement;
    let data = getRowData(tr);

    let dataJson = JSON.stringify(data);
    // console.log(data);
    // console.log(dataJson);

    // window.open(`http://localhost:8080/intakes/get/${data.id}`);
    // window.open(`envelope.html/?${data.id}`);
    // window.open(`envelope.html/1`);
    // window.open(`envelope.html/?1`);
    // window.open(`envelope.html`);
    // window.location(`envelope.html/1`)
    takeDataFromOpenSite(dataJson);
}

//Set data int the whole row
function setRow(button) {
    let tr = button.parentElement.parentElement.parentElement;
    let data = getRowData(tr);
    let fetchOptions = {
        method: "PUT",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
    fetch(`http://localhost:8080/intakes/put/${data.id}`, fetchOptions)
        .then(response => response.json())
        .catch(error => console.error(error))
        .then(() => startGetUsers())
        .catch((error) => console.error(error));
}

//Automatic refresh
window.onload = () => {
    startGetUsers()
}

