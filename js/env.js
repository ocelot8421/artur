const keys = { id: '', time: '', day: '', medicine01: '', dose01: '', medicine02: '', dose02: '' };

let divTime = document.querySelector("#time");

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

function start() {
    let sg = getServerData(`http://localhost:8080/intakes/${id}`);
    console.log(sg);
}

window.onload = () => {
    start()
}