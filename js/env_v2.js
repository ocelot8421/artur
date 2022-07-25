

//Get datas from weeklyMedIntakes.html
let data = sessionStorage.getItem('transferedDatas');
let dataJSON = JSON.parse(data);

vmifuggveny(dataJSON);

//Collect elements (mainly "td"s) marked "box" class and insert the datas from weeklyMedIntake.html by the correct keys
function vmifuggveny(data) {
    let index = "box";
    let inputs = document.querySelectorAll(`.${index}`);
    for (let key of inputs) {
        for (let sg in data) {
            if (key.id == sg) {
                key.innerHTML = data[sg];
            }
        }
    }
}

let timeOfDay = document.querySelector("#timeOfDay01").innerHTML;

//Fill rows with hearth emoji
fillRowWithHeartEmoji(`th#rowEvening`);
fillRowWithHeartEmoji(`th#rowMorning`);
function fillRowWithHeartEmoji(thSelected) {
    console.log("thSelected: " + thSelected);
    let thEvening = document.querySelector(thSelected);
    let thSiblings = thEvening.parentNode.children;
    for (let index = 1; index < thSiblings.length; index++) {
        thSiblings[index].innerHTML = '<i class="fa fa-heart-o" aria-hidden="true"></i>';
    }
    //Put the astronaut into the correct td
    if (timeOfDay == "Esti" && thSelected == "th#rowEvening") {
        let indexX = dataJSON.id;
        thSiblings[indexX].innerHTML = '<i class="fa fa-grav" aria-hidden="true"></i>';
    }
    if (timeOfDay == "Reggeli" && thSelected == "th#rowMorning") {
        let indexX = dataJSON.id;
        thSiblings[indexX].innerHTML = '<i class="fa fa-grav" aria-hidden="true"></i>';
    }
}








