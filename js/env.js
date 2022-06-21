const keys = { id: '', time: '', day: '', medicine01: '', dose01: '', medicine02: '', dose02: '' };

function getDataFromServer(url) {
    let fetchOptions = {
        method: "GET",
        mode: "cors",
        cache: "no-cache"
    };
    return fetch(url, fetchOptions)
        .then(response => response.json())
        .catch(error => console.error(error));
}

getDataFromServer(`http://localhost:8080/intakes/get/1`)
    .then(data => vmifuggveny(data))
    .catch(err => console.log(err));

function vmifuggveny(data) {
    let index = "box";
    // let input = document.querySelector(`div.${index}`);
    let inputs = document.querySelectorAll(`div.${index}`);
    for (let key of inputs) {
        for (let sg in data) {
            if (key.id == sg) {
                key.innerHTML = data[sg]
            }
        }
    }
}

// const queryString = window.location.search;
// const queryString = window.location.href; //ez mükszik :)
const queryString = window.location.pathname;
console.log(queryString);





