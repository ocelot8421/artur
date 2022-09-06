//Keys to fill rows
const keysDayOfWeek = {
    id: '', dayHu: '', year: '', month: '', dayOfMonth: '',
    timeOfDayDTOs: []
};
const keysTimeOfDay = {
    id: '', timeOfDayHu: '', hour: '', empty1: '', empty2: '', medicineDTOs: []
}
const keysMedicine = {
    id: '', medicineName: '', dose: '', unit: '', pieces: '', piecesUnit: ''
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
    getServerData("http://localhost:8080/medicines")
        .then(data => fillDataTable(data, "pillsDiary"))
        .catch(err => console.error(err));
}

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

//Create a table for data of day of week
function createDay(dayData, divDay, tBody) {
    let plusButton = createPlusButton("btn btn-primary", '<i class="fa fa-solid fa-plus" aria-hidden="true"></i>');
    let refreshButton = createButton("btn btn-info", "setRow(this)", '<i class="fa fa-refresh" aria-hidden="true"></i>');
    let bGroupDay = [plusButton, refreshButton];
    let tr = createAnyElement("tr", {
        class: `time`
    });
    let btnGroup = createButtonGroup(bGroupDay, dayData);
    divDay.appendChild(tr);
    fillDayRow(dayData, tr, keysDayOfWeek, divDay);
    tr.appendChild(btnGroup);
    let bFunction = "createEmptyIntakeRow(this.parentElement.parentElement.parentElement.parentElement, this)";
    plusButton.setAttribute("onclick", bFunction);
    tBody.appendChild(divDay);
}

//Fill the row (1st row) of day of week with data (day of week, year, month, day of month)
function fillDayRow(dayData, tr, keys, divDay) {
    for (let k in keys) {
        if (k !== "timeOfDayDTOs") {
            let td = createAnyElement("td");
            let input = createAnyElement("input", {
                class: `form-control form-control-lg ${k} forDayDataSearching`,
                value: dayData[k],
                name: k
            });
            switch (k) {
                case "id":
                    input.classList.add("d-none");
                    break;
                case "dayHu":
                case "dayEng":
                    input.setAttribute("name", "dayOfWeek");
                    break;
                case "dayOfMonth":
                    input.setAttribute("dayOfWeek", `weekDay${dayData.id}`);
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

//Fill the row (above medicines) of time of day (time of day, hour)
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
                switch (m) {
                    case "id":
                        input.classList.add("d-none");
                        break;
                    case "timeOfDayHu":
                    case "timeOfDayEng":
                        input.setAttribute("name", "timeOfDay");
                        input.setAttribute("class", `form-control timeOfDay`)
                        break;
                };
                if (m.slice(0, 5) == "empty") {
                    td.setAttribute("class", "empty");
                }
                td.appendChild(input);
                trMedicine.appendChild(td);
                trMedicine.appendChild(btnGroup);
                divTimeOfDay.appendChild(trMedicine);
            }
            if (m == "medicineDTOs") {
                let divMedicine = createAnyElement("div", {
                    class: "medicineArea"
                });
                for (objectMedicine of dayData[subData][i][m]) {
                    fillMedicineRows(objectMedicine, keysMedicine, divMedicine)
                }
                //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~1
                // let btnPlusMedicine = createPlusButton("btn btn-primary", '<i class="fa fa-solid fa-plus" aria-hidden="true"></i>');
                // let btnGroupMedicineDivEnd = [btnPlusMedicine];
                // let btnGroupPlusMedicineRow = createButtonGroup(btnGroupMedicineDivEnd, dayData.medicineDTOs);
                // let trForPlusMEdicineBtn = createAnyElement("tr");
                // trForPlusMEdicineBtn.appendChild(btnGroupPlusMedicineRow);
                // divMedicine.appendChild(trForPlusMEdicineBtn);

                //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~1~~~~~~~~~~~~~~~~~~~~~~~~~~~11
                divTimeOfDay.appendChild(divMedicine);
            }
        }
    }
    divDay.appendChild(divTimeOfDay);
}

//Fill the row of medicine intakes with data (medicineName, pieces, pieceUnit, dose, unit), insert del button
function fillMedicineRows(objectOfData, keys, divMedicine) {
    let tr = createAnyElement("tr", { class: "medicine" });
    for (k in keys) {
        let td = createAnyElement("td", { class: "medicine" });
        let input = createAnyElement("input", {
            class: `form-control medicine ${k}`,
            name: k,
            value: objectOfData[k]
        });
        switch (k) {
            case "id":
                input.classList.add("d-none");
                break;
        };
        if (k.slice(0, 5) == "empty") {
            td.setAttribute("class", "empty");
        }
        td.appendChild(input);
        tr.appendChild(td);
    }
    //Create delete button at the end of medicine row
    let deleteButton = createButton("btn btn-danger", "delRow(this)", '<i class="fa fa-trash" aria-hidden="true"></i>');
    let btnGroup = [deleteButton];
    let delBtn = createButtonGroup(btnGroup);
    tr.appendChild(delBtn);
    divMedicine.appendChild(tr);
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
        class: `dayOfWeek `
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
    let inputElementsFromTimeOfDayRow = trTimeOfDay.querySelectorAll('input');
    for (let i = 0; i < inputElementsFromTimeOfDayRow.length; i++) {
        if (inputElementsFromTimeOfDayRow[i].value !== "undefined") {
            dataForEnvelope[inputElementsFromTimeOfDayRow[i].name] = inputElementsFromTimeOfDayRow[i].value;
        }
    }
    dataForEnvelope["medicines"] = [];
    let arrayOfMedicineRows = trTimeOfDay.nextSibling.children;
    for (trMedicine of arrayOfMedicineRows) {
        inputsElementsFromMedicineRow = trMedicine.querySelectorAll('input');
        let medicineObject = {};
        for (let i = 0; i < inputsElementsFromMedicineRow.length; i++) {
            medicineObject[inputsElementsFromMedicineRow[i].name] = inputsElementsFromMedicineRow[i].value;
        }
        dataForEnvelope.medicines.push(medicineObject);
    }
    let inputElementsFromDayOfMonthColumn = document.querySelectorAll(".dayOfMonth");
    for (let i = 0; i < inputElementsFromDayOfMonthColumn.length; i++) {
        dataForEnvelope[`weekDay${i}`] = inputElementsFromDayOfMonthColumn[i].value;
    }
    return dataForEnvelope;
}

function getMedicineIntakeID(tr) {
    let intakeID = 0;
    intakeID += (parseInt(tr.parentElement.parentElement.previousElementSibling.firstChild.firstChild.value) * 1000);
    intakeID += (parseInt(tr.parentElement.previousElementSibling.firstChild.firstChild.value) * 100);
    intakeID += parseInt(tr.firstChild.firstChild.value);
    return intakeID;
}

// Delete the whole row
function delRow(button) {
    let tr = button.parentElement.parentElement.parentElement;
    let data = getMedicineIntakeID(tr); //HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH
    let fetchOptions = {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
    // http://localhost:8080/medicines/del/
    fetch(`http://localhost:8080/medicines/del/${data}`, fetchOptions)
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
function setRow(button) {
    let tr = button.parentElement.parentElement.parentElement;
    let data = getDayData(tr);
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

