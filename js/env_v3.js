let data = sessionStorage.getItem('transferedDatas');
let dataJSON = JSON.parse(data);
keysMedicine = { pieces: '', piecesUnit: '', dose: '', unit: '', medicineName: '' }

fillBoxes(dataJSON);

let tbodyIntakes = document.querySelector("#intakes");
for (medicineObject of dataJSON.medicines) {
    let trIntake = createAnyElement("tr");
    for (k in keysMedicine) {
        let tdIntake = createAnyElement("td", {
            class: "tdMed"
        });

        tdIntake.innerHTML = medicineObject[k];
        trIntake.appendChild(tdIntake);
    }
    tbodyIntakes.appendChild(trIntake);
}

function fillBoxes(data) {
    let index = "box";
    let boxes = document.querySelectorAll(`.${index}`);
    for (let box of boxes) {
        for (let aData in dataJSON) {
            if (box.id == aData) {
                box.innerHTML = data[aData];
            }
        }
    }
}

//Fill rows with hearth emoji
let timeOfDay = document.querySelector("#timeOfDay").innerHTML;
fillRowWithHeartEmoji(`th#rowMorning`);
fillRowWithHeartEmoji(`th#rowNoon`);
fillRowWithHeartEmoji(`th#rowEvening`);

function fillRowWithHeartEmoji(thSelected) {
    let thTimeOfDay = document.querySelector(thSelected);
    let thSiblings = thTimeOfDay.parentNode.children;
    for (let index = 1; index < thSiblings.length; index++) {
        thSiblings[index].innerHTML = '<i class="fa fa-heart-o" aria-hidden="true"></i>';
    }
    //Put the astronaut into the correct td //TODO!!!
    if ((timeOfDay == "Reggeli" || timeOfDay == "Morning") && thSelected == "th#rowMorning") {
        let indexX = dataJSON.id;
        thSiblings[indexX].innerHTML = '<i class="fa fa-grav" aria-hidden="true"></i>';
    }
    if ((timeOfDay == "Déli" || timeOfDay == "Noon") && thSelected == "th#rowNoon") {
        let indexX = dataJSON.id;
        thSiblings[indexX].innerHTML = '<i class="fa fa-grav" aria-hidden="true"></i>';
    }
    if ((timeOfDay == "Esti" || timeOfDay == "Evening") && thSelected == "th#rowEvening") {
        let indexX = dataJSON.id;
        thSiblings[indexX].innerHTML = '<i class="fa fa-grav" aria-hidden="true"></i>';
    }
}