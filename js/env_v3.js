let data = sessionStorage.getItem('transferedDatas');
let dataJSON = JSON.parse(data);

console.log("data: ");
console.log(data);
console.log("dataJSON:");
console.log(dataJSON);

//Create medicine table below date
let tbodyMedIntakes = document.querySelector("#tbodyMedIntakes");
let numTrMedMax = 20;
for (let i = 0; i < numTrMedMax; i++) {
    let trMed = createAnyElement("tr");
    tbodyMedIntakes.appendChild(trMed);
    const boxNameMed = {};
    boxNameMed[`piecesMed${i}`] = '';
    boxNameMed[`doseMed${i}`] = '';
    boxNameMed[`unitMed${i}`] = '';
    boxNameMed[`nameMed${i}`] = '';
    boxNameMed[`hourMed${i}`] = '';

    for (aBoxName in boxNameMed) {
        let tdMed = createAnyElement("td", {
            name: aBoxName,
            class: "box tdMed text-end",
        });
        // tdMed.innerHTML = dataJSON[aBoxName];
        trMed.appendChild(tdMed);
        tdMed.innerHTML = aBoxName == `piecesMed${i}` ? (dataJSON[aBoxName] + " x") : dataJSON[aBoxName];
        if (dataJSON[aBoxName] == null) {
            tdMed.innerHTML = null;
        }
    }
    tbodyMedIntakes.appendChild(trMed);
}

fillMedRow(dataJSON);

//Collect elements (mainly "td"s) marked "box" class and insert data from weeklyMedIntake.html by the correct keys
function fillMedRow(data) {
    let index = "box";
    let boxes = document.querySelectorAll(`.${index}`);
    for (let box of boxes) {
        for (let aData in data) {
            if (box.id == aData) {
                box.innerHTML = data[aData];
            }
        }
    }
}

let timeOfDay = document.querySelector("#timeOfDay").innerHTML;

//Fill rows with hearth emoji
fillRowWithHeartEmoji(`th#rowMorning`);
fillRowWithHeartEmoji(`th#rowEvening`);

function fillRowWithHeartEmoji(thSelected) {
    let thTimeOfDay = document.querySelector(thSelected);
    let thSiblings = thTimeOfDay.parentNode.children;
    for (let index = 1; index < thSiblings.length; index++) {
        thSiblings[index].innerHTML = '<i class="fa fa-heart-o" aria-hidden="true"></i>';
    }
    //Put the astronaut into the correct td //TODO!!!
    if (timeOfDay == "Reggeli" && thSelected == "th#rowMorning") {
        let indexX = dataJSON.idTime % 7; // TODO: make it dynamic by html element attributums
        thSiblings[indexX].innerHTML = '<i class="fa fa-grav" aria-hidden="true"></i>';
    }
    if (timeOfDay == "Esti" && thSelected == "th#rowEvening") {
        let indexX = dataJSON.idTime;
        thSiblings[indexX].innerHTML = '<i class="fa fa-grav" aria-hidden="true"></i>';
    }
}








