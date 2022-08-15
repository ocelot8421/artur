//Keys of data table
const keys = {
    id: '', dayEng: '', empty1: '', empty2: '', empty3: '',
    // dayOfWeek: '', year: '', month: '', dayOfMonth: '', timeOfDay: '',
    timeOfDayDTOs: []
};

const keysTimeOfDay = {
    // id: '', 
    timeOfDayEng: '', hour: '', empty1: '', empty2: '',
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

        //NOTE for only training, not part of the code
        // .then(data => { return fillDataTable(data, "pillsDiary")})
        // .then(data => { allIntakes = data; fillDataTable(data, "pillsDiary") })


        .then(data => fillDataTable(data, "pillsDiary"))
        .catch(err => console.error(err));
}

// document.querySelector("#getDataButton").addEventListener("click", startGetMedication);


//Fill table with server data.
function fillDataTable(data, tableID) {
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
        createDay(dayData, divDay, tBody);
    }
    refreshedBody.parentNode.replaceChild(tBody, refreshedBody);
}

function createDay(dayData, divDay, tBody) {
    let plusButton = createPlusButton("btn btn-primary", '<i class="fa fa-solid fa-plus" aria-hidden="true"></i>');
    let refreshButton = createButton("btn btn-info", "setRow(this)", '<i class="fa fa-refresh" aria-hidden="true"></i>');
    let bGroupDay = [plusButton, refreshButton];
    let tr = createAnyElement("tr", {
        class: `time`
    });
    let btnGroup = createButtonGroup(bGroupDay, dayData);
    divDay.appendChild(tr);
    fillDayRow(dayData, tr, keys, divDay);
    tr.appendChild(btnGroup);
    let bFunction = "createEmptyIntakeRow(this.parentElement.parentElement.parentElement.parentElement, this)";
    plusButton.setAttribute("onclick", bFunction);
    tBody.appendChild(divDay);
}

function fillDayRow(dayData, tr, keys, divDay) {
    for (let k in keys) {
        if (k !== "timeOfDayDTOs" && k !== "id") {
            let td = createAnyElement("td");
            let input = createAnyElement("input", {
                class: `form-control form-control-lg ${k} forDayDataSearching`,
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
                    input.setAttribute("readonly", true);
                    break;
            };
            if (k.slice(0, 5) == "empty") {
                td.setAttribute("class", "empty");
            }
            td.appendChild(input);
            tr.appendChild(td);
            divDay.appendChild(tr)
        }
        if (k == "timeOfDayDTOs") {
            fillTimeOfDayRow(dayData, keysTimeOfDay, divDay, k);
        }
    }
}

function fillTimeOfDayRow(dayData, keys, divDay, subData) {
    let divTimeOfDay = createAnyElement("div", {
        class: "timeOfDayArea"
    });
    for (let i = 0; i < dayData[subData].length; i++) {
        let plusButton = createPlusButton("btn btn-primary", '<i class="fa fa-solid fa-plus" aria-hidden="true"></i>');
        let pdfButton = createButton("btn btn-pdf btn-danger ", "pdfEnvilope(this)", '<i class="fa fa-file-pdf-o" aria-hidden="true"></i>');
        let btnGroupTime = [plusButton, pdfButton];
        let btnGroup = createButtonGroup(btnGroupTime, dayData);
        let trMedicine = createAnyElement("tr", {
            class: `${subData}`
        });
        for (m in keys) {
            if (m !== "medicineDTOs") {
                let td = createAnyElement("td");
                let input = createAnyElement("input", {
                    class: `form-control ${m}`,
                    value: dayData[subData][i][m],
                    name: `${m}Med`
                });
                td.appendChild(input);
                trMedicine.appendChild(td);
                trMedicine.appendChild(btnGroup);
                divTimeOfDay.appendChild(trMedicine);
                if (m.slice(0, 5) == "empty") {
                    td.setAttribute("class", "empty");
                }
            }
            if (m == "medicineDTOs") {
                let divMedicine = createAnyElement("div", {
                    class: "medicineArea"
                });
                for (objectMedicine of dayData[subData][i][m]) {
                    fillRow(objectMedicine, keysMedicine, divMedicine)
                }
                divTimeOfDay.appendChild(divMedicine);
            }
        }
    }
    divDay.appendChild(divTimeOfDay);
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
        class: `btn btn-group btn-time`
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
    let button = createAnyElement("button", {
        class: bClass,
        onclick: bFunction
    });
    button.innerHTML = bIcon;
    return button;
}

//Collect all data for pdfEnvilope
function getDayData(trTimeOfDay) {
    let dataForEnvelope = {};

    let inputElementsFromDayOfWeekRow = trTimeOfDay.parentElement.parentElement.querySelectorAll(`.forDayDataSearching`);
    for (let i = 0; i < inputElementsFromDayOfWeekRow.length; i++) {
        if (inputElementsFromDayOfWeekRow[i].value !== "undefined") {
            dataForEnvelope[inputElementsFromDayOfWeekRow[i].name] = inputElementsFromDayOfWeekRow[i].value;
        }
    }
    dataForEnvelope["timeOfDay"] = {};

    let inputElementsFromTimeOfDayRow = trTimeOfDay.querySelectorAll('input');
    for (let i = 0; i < inputElementsFromTimeOfDayRow.length; i++) {
        if (inputElementsFromTimeOfDayRow[i].value !== "undefined") {
            dataForEnvelope.timeOfDay[inputElementsFromTimeOfDayRow[i].name] = inputElementsFromTimeOfDayRow[i].value;
        }
    }
    dataForEnvelope.timeOfDay["medicines"] = [];

    let arrayOfMedicineRows = trTimeOfDay.nextSibling.children;
    for (trMedicine of arrayOfMedicineRows) {
        inputsElementsFromMedicineRow = trMedicine.querySelectorAll('input');
        let medicineObject = {};
        for (let i = 0; i < inputsElementsFromMedicineRow.length; i++) {
            medicineObject[inputsElementsFromMedicineRow[i].name] = inputsElementsFromMedicineRow[i].value;
        }
        dataForEnvelope.timeOfDay.medicines.push(medicineObject);
    }
    return dataForEnvelope;
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
    let trTimeOfDay = button.parentElement.parentElement.parentElement;
    let data = getDayData(trTimeOfDay);
    let dataJson = JSON.stringify(data);
    takeDataFromOpenSite(dataJson); //++++++++++++++++++3
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

