//Keys of data table
const keys = {
    id: '', dayEng: '',
    // dayOfWeek: '', year: '', month: '', dayOfMonth: '', timeOfDay: '',
    timeOfDayDTOs: []
};

const keysTimeOfDay = {
    // id: '', 
    timeOfDayEng: '', hour: '',
    medicineDTOs: []
}

const keysMedicine = {
    // id: '',
    medicineName: '', dose: '', unit: '', pieces: '', piecesUnit: ''
};

const keysEmptyRow = { idMed: '', medicine: '', pieces: '', dose: '' }


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
    // getServerData("http://localhost:8080/intakes/allIntakes")
    getServerData("http://localhost:8080/medicines")
        // .then(data => { return fillDataTable(data, "pillsDiary")})
        // .then(data => { allIntakes = data; fillDataTable(data, "pillsDiary") })
        .then(data => fillDataTable(data, "pillsDiary"))
        .catch(err => console.error(err));
}

// document.querySelector("#getDataButton").addEventListener("click", startGetMedication);


//Fill table with server data.
function fillDataTable(data, tableID) {
    // console.log(data); //--------------------------------------

    let table = document.querySelector(`#${tableID}`);
    if (!table) {
        console.error(`Table "${tableID}" is not found.`);
        return
    }
    let refreshedBody = table.querySelector("#oneDay");
    let tBody = createAnyElement('tbody');
    for (let dayData of data) {
        let divDay = createAnyElement("div", {
            class: "day",
        });
        let plusButton = createPlusButton("btn btn-primary", '<i class="fa fa-solid fa-plus" aria-hidden="true"></i>');
        createDay(dayData, divDay, plusButton, tBody);
    }
    refreshedBody.parentNode.replaceChild(tBody, refreshedBody);
}

function createDay(dayData, divDay, plusButton, tBody) {
    let refreshButton = createButton("btn btn-info", "setRow(this)", '<i class="fa fa-refresh" aria-hidden="true"></i>');
    let pdfButton = createButton("btn btn-primary", "pdfEnvilope(this)", '<i class="fa fa-file-pdf-o" aria-hidden="true"></i>');
    let bGroupDay = [pdfButton, refreshButton, plusButton];
    let tr = createAnyElement("tr", {
        class: `time ${dayData.dayOfWeek}`
    });
    let btnGroup = createButtonGroup(bGroupDay, dayData);
    tr.appendChild(btnGroup);
    divDay.appendChild(tr);
    createAndFillRow(dayData, tr, keys, divDay);
    let bFunction = "createEmptyIntakeRow(this.parentElement.parentElement.parentElement.parentElement, this)";
    plusButton.setAttribute("onclick", bFunction);
    tBody.appendChild(divDay);
}

function createAndFillRow(dayData, tr, keys, div) {
    for (let k in keys) {
        // if (k !== "medicines" && k !== "id" && k !== "dailyCycles") {
        if (k !== "timeOfDayDTOs" && k !== "id") {
            let td = createAnyElement("td");
            let input = createAnyElement("input", {
                class: `form-control form-control-lg text-primary time ${k} ${dayData.dayOfWeek}`,
                value: dayData[k],
                name: k
            });
            switch (k) {
                case "idTime":
                    input.setAttribute("idTime", dayData.id);
                    input.setAttribute("value", dayData.id);
                    input.setAttribute("readonly", true);
                    break;
                case "dayOfWeek":
                    input.setAttribute("readonly", true);
                    break;
                case "dayOfMonth":
                    input.setAttribute("dayOfWeek", `weekDay${dayData.id}`);
                    break;
                case "timeOfDay":
                    input.setAttribute("readonly", true)
            };
            td.appendChild(input);
            tr.appendChild(td);
            div.appendChild(tr)
        }
        if (k == "timeOfDayDTOs") {
            fillTimeOfDayRow(dayData, keysTimeOfDay, div, k);

        }
    }
}

function fillTimeOfDayRow(dayData, keys, div, subData) {
    for (let i = 0; i < dayData[subData].length; i++) {
        let trMedicine = createAnyElement("tr", {
            class: `${subData} ${dayData.dayOfWeek}`
        });
        for (m in keys) {
            if (m !== "medicineDTOs") {
                let td = createAnyElement("td");
                let input = createAnyElement("input", {
                    class: `form-control text-info ${m} ${dayData.dayOfWeek}`,
                    value: dayData[subData][i][m],
                    name: `${m}Med`
                });
                td.appendChild(input);
                trMedicine.appendChild(td);
                div.appendChild(trMedicine);
            }
            if (m == "medicineDTOs") {
                for (objectMedicine of dayData[subData][i][m]) {
                    fillRow(objectMedicine, keysMedicine, div)
                }
            }
        }
    }
}

function fillRow(objectOfData, keys, div) {
    let trAny = createAnyElement("tr", {
        class: "medicine"
    });
    for (k in keys) {
        let inputAny = createAnyElement("input", {
            class: `form-control medicine ${k}`,
            name: k,
            value: objectOfData[k]
        });
        let tdAny = createAnyElement("td", {
            class: "medicine"
        });
        tdAny.appendChild(inputAny);
        trAny.appendChild(tdAny);
    }

    div.appendChild(trAny);
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
    divButton.appendChild(button);
    let tdButton = createAnyElement("td");
    tdButton.appendChild(divButton);
    let trEmpty = createAnyElement("tr");
    trEmpty.appendChild(tdButton);
    return trEmpty;
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
function getDayData(divDay) {
    let data = {};
    // let inputs = document.querySelectorAll(`input.${tr.attributes.class.value}`);
    let timeRowData = divDay.querySelectorAll(`input.time`);
    for (let i = 0; i < timeRowData.length; i++) {
        data[timeRowData[i].name] = timeRowData[i].value;
    }
    data["medicines"] = [];
    let numMedRow = divDay.querySelectorAll("tr.medicine");
    for (let i = 0; i < numMedRow.length; i++) {
        let inputsOfMedRow = divDay.querySelectorAll(`input.medicine${i}`)
        let medicine = {};

        inputsOfMedRow.forEach(input => {
            medicine[input.name] = input.value;
        });

        data.medicines.push(medicine);
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
    let data = getDayData(tr);
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
    let divDay = button.parentElement.parentElement.parentElement.parentElement;
    let data = getDayData(divDay);
    let dataJson = JSON.stringify(data);
    takeDataFromOpenSite(dataJson);
}

//Set data int the whole row
// function setRow(button) {
function setRow(button) {
    let tr = button.parentElement.parentElement.parentElement;
    let data = getDayData(tr);
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
    startGetMedication();
}

