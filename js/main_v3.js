//Keys of data table
const keys = {
    id: '',
    dayOfWeek: '', year: '', month: '', dayOfMonth: '', timeOfDay: '',
    keysMedIntakes: {}
};
let numberOfMedicationIntakes = 3;
for (let index = 1; index <= numberOfMedicationIntakes; index++) {
    keys.keysMedIntakes[`keysMedIntakes${index}`] = {};
    keys.keysMedIntakes[`keysMedIntakes${index}`][`idMed`] = index;
    keys.keysMedIntakes[`keysMedIntakes${index}`][`medicine0${index}`] = '';
    keys.keysMedIntakes[`keysMedIntakes${index}`][`pieces0${index}`] = '';
    keys.keysMedIntakes[`keysMedIntakes${index}`][`dose0${index}`] = '';
}
const keysEmptyRow = { idMed: 0, medicine: '', pieces: '', dose: '' }

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

function startGetMedication() {
    getServerData("http://localhost:8080/intakes/allIntakes")
        .then(data => fillDataTable(data, "pillsDiary"))
        .catch(err => console.error(err));
}

document.querySelector("#getDataButton").addEventListener("click", startGetMedication);


//Fill table with server data.
function fillDataTable(data, tableID) {
    let table = document.querySelector(`#${tableID}`);
    if (!table) {
        console.error(`Table "${tableID}" is not found.`);
        return
    }
    let refreshedBody = table.querySelector("#oneDay");
    let tBody = document.createElement('tbody');
    for (let row of data) {
        let div = createAnyElement("div", {
            class: "table",
        });
        let plusButton = createPlusButton("btn btn-primary", '<i class="fa fa-solid fa-plus" aria-hidden="true"></i>');
        createTimeRow(row, div, plusButton);
        for (let index = 1; index <= numberOfMedicationIntakes; index++) {
            createIntakeRow(row, keys.keysMedIntakes[`keysMedIntakes${index}`], div);
        }
        tBody.appendChild(div);
    }
    refreshedBody.parentNode.replaceChild(tBody, refreshedBody);
}

function createTimeRow(row, div, plusButton) {
    let refreshButton = createButton("btn btn-info", "setRow(this)", '<i class="fa fa-refresh" aria-hidden="true"></i>');
    let pdfButton = createButton("btn btn-primary", "pdfEnvilope(this)", '<i class="fa fa-file-pdf-o" aria-hidden="true"></i>');
    let bGroupDay = [pdfButton, refreshButton, plusButton];
    let tr = createAnyElement("tr", {
        class: `${row.dayOfWeek}`
    });
    let sg = createButtonGroup(bGroupDay, row);
    tr.appendChild(sg);
    createAndFillRow(row, tr, keys);

    let bFunction = "createEmptyIntakeRow(this.parentElement.parentElement.parentElement.parentElement, this)";
    plusButton.setAttribute("onclick", bFunction);
    div.appendChild(tr);
}

function createIntakeRow(row, keys, div) {
    let deleteButton = createButton("btn btn-danger", "delRow(this)", '<i class="fa fa-trash" aria-hidden="true"></i>');
    let divButton = createAnyElement("div");
    divButton.appendChild(deleteButton);
    let tdButton = createAnyElement("td");
    tdButton.appendChild(divButton)
    let tr = createAnyElement("tr");
    tr.appendChild(tdButton);
    createAndFillRow(row, tr, keys, div);
    div.appendChild(tr);
}

function createAndFillRow(row, tr, keys, div) {
    for (let k in keys) {
        if (k !== "keysMedIntakes") {
            let td = createAnyElement("td");
            let input = createAnyElement("input", {
                class: `form-control ${k} ${row.dayOfWeek}`,
                value: row[k],
                name: k
            });
            switch (k) {
                case "idMed":
                    let valueMed = div.lastChild.querySelector(".form-control").value;
                    input.setAttribute("idMed", parseInt(valueMed) + 1);
                    input.setAttribute("value", parseInt(valueMed) + 1);
                    break;
                case "id":
                    input.setAttribute("value", row.id * 100)
                    input.setAttribute("readonly", true);
                    break;
                case "dayOfWeek":
                    input.setAttribute("readonly", true);
                    break;
                case "dayOfMonth":
                    input.setAttribute("dayOfWeek", `weekDay${row.id}`);
                    break;
            };
            td.appendChild(input);
            tr.appendChild(td);
        }
    }
}

function createPlusButton(bClass, bIcon) {
    let button = createAnyElement("button", {
        class: bClass,
        onclick: ""
    });
    button.innerHTML = bIcon;
    return button;
}

function createEmptyIntakeRow(div) {
    let numIdMed = div.lastChild.querySelector(".form-control").value;
    let numRow = parseInt(numIdMed) + 1;
    let deleteButton = createButton("btn btn-danger", "delRow(this)", '<i class="fa fa-trash" aria-hidden="true"></i>');
    let trEmpty = createEmptyRow(deleteButton);
    for (const key in keysEmptyRow) {
        let tdEmpty = createAnyElement("td");
        let inputEmpty = createAnyElement("input", {
            class: "form-control inputName",
            name: key + numRow,
            value: key + numRow
        });
        if (key == "idMed") {
            inputEmpty.setAttribute("value", numRow);
        }
        tdEmpty.appendChild(inputEmpty);
        trEmpty.appendChild(tdEmpty);
    }
    div.appendChild(trEmpty);
}

function createEmptyRow(button) {
    let divButton = createAnyElement("div");
    let tdButton = createAnyElement("td");
    let trEmpty = createAnyElement("tr");
    divButton.appendChild(button);
    tdButton.appendChild(divButton);
    trEmpty.appendChild(tdButton);
    return trEmpty;
}

function createAnyElement(name, attributes) {
    let element = document.createElement(name);
    for (let k in attributes) {
        element.setAttribute(k, attributes[k]);
    }
    return element;
}

//Create td within buttons
function createButtonGroup(buttonArray, row) {
    let group = createAnyElement("div", {
        class: `btn btn-group`
    });
    buttonArray.forEach(element => {
        group.appendChild(element);
    });
    let td = createAnyElement("td", {
        class: `dayOfWeek ${row.dayOfWeek}`
    });
    td.appendChild(group);
    return td;
}

//Create button with icon and funciouns
function createButton(bClass, bFunction, bIcon) {
    let button = createAnyElement("button", { class: bClass, onclick: bFunction });
    button.innerHTML = bIcon;
    return button;
}

//Collect all data from the row and make an js object of them
function getRowData(tr) {
    let data = {};
    let inputs = document.querySelectorAll(`input.${tr.attributes.class.value}`);
    for (let i = 0; i < inputs.length; i++) {
        data[inputs[i].name] = inputs[i].value;
    }
    let daysOfMonth = document.querySelectorAll(`input.dayOfMonth`);
    for (let i of daysOfMonth) {
        let index = i.attributes.dayOfWeek.value;
        data[index] = i.value;
    }
    return data;
}

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
        .then(() => startGetMedication())
        .catch((error) => console.error(error));
}

function pdfEnvilope(button) {
    let tr = button.parentElement.parentElement.parentElement;
    let data = getRowData(tr);
    let dataJson = JSON.stringify(data);
    takeDataFromOpenSite(dataJson);
}

//Set data int the whole row
// function setRow(button) {
function setRow(button) {
    let tr = button.parentElement.parentElement.parentElement;
    let data = getRowData(tr);
    // let data = getRowData(row);
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
        .then(() => startGetMedication())
        .catch((error) => console.error(error));
}

//Automatic refresh
window.onload = () => {
    startGetMedication()
}

