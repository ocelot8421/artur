let index = "box";
let input = document.querySelector(`div.${index}`);
// console.log(input.innerHTML);

let fetchOptions = {
    method: "GET",
    mode: "cors",
    cache: "no-cache"
};

fetch(`http://localhost:8080/intakes/get/1`, fetchOptions)
    .then(response => response.json())
    .catch(error => console.error(error))
    .then(data => vmifuggveny(data));

function vmifuggveny(data) {
    input.innerHTML = data.time;
}