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

const keysEmptyRow = { id: '', medicineName: '', dose: '', unit: '', pieces: '', piecesUnit: '' }

// const connectionIntake = { id: '', day_of_week_id: '', date_id: '', medicine_id: '', time_of_day_id: '' }
// const connectionIntake = { id: 0, dayOfWeek: 0, date: 0, medicine: 0, timeOfDay: 0 }
const connectionIntake = {
    id: 0, dayOfWeek: 0, date: 0, timeOfDay: 0,
    medicine: { name: '', dose: '', unit: '', pieces: '', piecesUnit: '' }
}


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

//Create the table for the day of week
function createDay(dayData, divDay, tBody) {
    let refreshButton = createButton("btn btn-info", "setRow(this)", '<i class="fa fa-refresh" aria-hidden="true"></i>');
    let bGroupDay = [refreshButton];
    let tr = createAnyElement("tr", {
        class: `time`
    });
    let btnGroup = createButtonGroup(bGroupDay, dayData);
    divDay.appendChild(tr);
    fillDayRow(dayData, tr, keysDayOfWeek, divDay);
    tr.appendChild(btnGroup);
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
                createEmptyIntakeRow(divMedicine); //----------------------------------
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
    let deleteButton = createButton("btn", "delRow(this)", '<i class="fa fa-trash" aria-hidden="true"></i>');
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

//The empty row below the medicines. By this the new data can be pushed into medicine intakes database.
function createEmptyIntakeRow(div) {
    let saveButton = createButton("btn", "setRow(this)", '<i class="fa fa-save" aria-hidden="true"></i>');
    let divBtn = createAnyElement("div", {
        class: `btn btn-group btn-time`
    });
    divBtn.appendChild(saveButton);
    let tdBtn = createAnyElement("td", { class: "dayOfWeek" });
    tdBtn.appendChild(divBtn);
    let trEmpty = createEmptyMedicineRow();
    for (const k in keysEmptyRow) {
        let tdEmpty = createAnyElement("td");
        let input = createAnyElement("input", {
            class: `form-control newRowBox`,
            name: k
            // value: "new " + k
        });
        switch (k) {
            case "id":
                input.classList.add("d-none");
                input.setAttribute("value", 99)
                break;
        };
        tdEmpty.appendChild(input);
        trEmpty.appendChild(tdEmpty);
    }
    trEmpty.appendChild(tdBtn);
    div.appendChild(trEmpty);
}

function createEmptyMedicineRow() {
    let trEmpty = createAnyElement("tr", { class: "medicine" });
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

//Collect all data from intake row
// function collectIntakeData(trMedicine) { //20220907 1235 ----------------------------------
//     console.log("collectIntakeData:");
//     inputsElementsFromMedicineRow = trMedicine.querySelectorAll('input');
//     let medicineObject = {};
//     for (let i = 0; i < inputsElementsFromMedicineRow.length; i++) {
//         medicineObject[inputsElementsFromMedicineRow[i].name] = inputsElementsFromMedicineRow[i].value;
//     }
//     console.log(medicineObject);
// }


//Collect all data for pdfEnvilope
function getDayDataForEnevelope(trTimeOfDay) {
    let dataForEnvelope = {};
    //data from day of week row (1st row)
    let inputElementsFromDayOfWeekRow = trTimeOfDay.parentElement.parentElement.querySelectorAll(`.forDayDataSearching`);
    for (let i = 0; i < inputElementsFromDayOfWeekRow.length; i++) {
        if (inputElementsFromDayOfWeekRow[i].value !== "undefined") {
            dataForEnvelope[inputElementsFromDayOfWeekRow[i].name] = inputElementsFromDayOfWeekRow[i].value;
        }
    }
    // data from time of day row (above medicines)
    let inputElementsFromTimeOfDayRow = trTimeOfDay.querySelectorAll('input');
    for (let i = 0; i < inputElementsFromTimeOfDayRow.length; i++) {
        if (inputElementsFromTimeOfDayRow[i].value !== "undefined") {
            dataForEnvelope[inputElementsFromTimeOfDayRow[i].name] = inputElementsFromTimeOfDayRow[i].value;
        }
    }
    // data of medicines (medicineNAme, dose, unit, pieces, pieceUnit)
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
    //data from day-of-month column to create the day-of-month row on week table in envilope
    let inputElementsFromDayOfMonthColumn = document.querySelectorAll(".dayOfMonth");
    for (let i = 0; i < inputElementsFromDayOfMonthColumn.length; i++) {
        dataForEnvelope[`weekDay${i}`] = inputElementsFromDayOfMonthColumn[i].value;
    }
    return dataForEnvelope;
}

//Search connection between day of week, time of day and medication intake, then generate an object for push request
function collectConnections(tr) {
    let intakeID = 0;
    let conDayOfWeek = tr.parentElement.parentElement.previousElementSibling.firstChild.firstChild.value;
    intakeID += (parseFloat(conDayOfWeek) * 1000);
    let conTimeOfDay = tr.parentElement.previousElementSibling.firstChild.firstChild.value;
    intakeID += (parseFloat(conTimeOfDay) * 100);
    let conMedIntake = tr.firstChild.firstChild.value;
    intakeID += parseFloat(conMedIntake);

    console.log("collectConnections - medicine:");
    console.log(tr);

    connectionIntake.id = intakeID;
    connectionIntake.dayOfWeek = conDayOfWeek;
    connectionIntake.date = conDayOfWeek; // temporary. it will need modification at annual diary!!!!!
    connectionIntake.timeOfDay = conTimeOfDay;
    // connectionIntake.medicineID = conMedIntake;
    let medicineName = tr.querySelector('input[name="medicineName"]').value;
    let dose = tr.querySelector('input[name="dose"]').value;
    let unit = tr.querySelector('input[name="unit"]').value;
    let pieces = tr.querySelector('input[name="pieces"]').value;
    let piecesUnit = tr.querySelector('input[name="piecesUnit"]').value;
    connectionIntake.medicine.name = medicineName;
    connectionIntake.medicine.dose = dose;
    connectionIntake.medicine.unit = unit;
    connectionIntake.medicine.pieces = pieces;
    connectionIntake.medicine.piecesUnit = piecesUnit;


    console.log("connectionIntake:"); // put -----------------------------------
    console.log(connectionIntake);

    return connectionIntake;
}

// Delete the whole row
function delRow(button) {
    let tr = button.parentElement.parentElement.parentElement;
    let data = collectConnections(tr);
    let fetchOptions = {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data.id)
    };
    fetch(`http://localhost:8080/medicines/del/${data.id}`, fetchOptions)
        .then(response => response.json())
        .catch((error) => console.error(error))
        .finally(() => startGetMedication());
    // startGetMedication();
}

function pdfEnvilope(button) {
    let trTimeOfDay = button.parentElement.parentElement.parentElement;
    let data = getDayDataForEnevelope(trTimeOfDay);
    let dataJson = JSON.stringify(data);
    takeDataFromOpenSite(dataJson);
}

//Set data int the whole row
function setRow(button) {
    let tr = button.parentElement.parentElement.parentElement;
    let data = collectConnections(tr);
    console.log("data:");
    console.log(data); // put -------------------------
    let fetchOptions = {
        method: "PUT",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
    fetch(`http://localhost:8080/medicines/put/${data.id}`, fetchOptions)
        .then(response => response.json())
        .catch((error) => console.error(error))
        .finally(() => startGetMedication());
    // startGetMedication();
}

//Automatic refresh
window.onload = () => {
    startGetMedication();
}

