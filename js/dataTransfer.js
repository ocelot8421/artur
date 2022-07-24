//Stroage tansferedDatas inJson format and open the new enevelope.html
function takeDataFromOpenSite(dataJson) {
  sessionStorage.setItem('transferedDatas', dataJson);
  window.open(`envelope.html`);
}


// function getTimeColumnData(k, row, input) {
//   if (k == "time") {
//     window.sessionStorage.setItem(row.id, input.value);
//   }
// }



