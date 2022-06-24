const keys = { id: '', time: '', day: '', medicine01: '', dose01: '', medicine02: '', dose02: '' };
let data = window.sessionStorage.getItem('transferedDatas');
let dataJSON = JSON.parse(data);
vmifuggveny(dataJSON);

function vmifuggveny(data) {
    let index = "box";
    let inputs = document.querySelectorAll(`.${index}`);
    for (let key of inputs) {
        for (let sg in data) {
            if (key.id == sg) {
                key.innerHTML = data[sg]
            }
        }
    }
}


let thDayNumber = document.querySelector(`td#rowDay`);
let thDaySiblings = thDayNumber.parentNode.children;
for (let i = 1; i <= 7; i++) {
    let timeData = window.sessionStorage.getItem(i);
    thDaySiblings[i].innerHTML = timeData;
}




let thEvening = document.querySelector(`th#rowEvening`);
let thSiblings = thEvening.parentNode.children;
for (let index = 1; index < thSiblings.length; index++) {
    thSiblings[index].innerHTML = '<i class="fa fa-heart-o" aria-hidden="true"></i>';
}
let indexX = dataJSON.id;
thSiblings[indexX].innerHTML = '<i class="fa fa-grav" aria-hidden="true"></i>';








