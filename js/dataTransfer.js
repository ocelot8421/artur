function takeDataFromOpenSite(dataJson) {
  window.sessionStorage.setItem('transferedDatas', dataJson);
  window.open(`envelope.html`);
}

function getTimeColumnData(k, row, input) {
  if (k == "time") {
    window.sessionStorage.setItem(row.id, input.value);
  }
}



