//Stroage tansferedDatas inJson format and open the new enevelope.html
function takeDataFromOpenSite(dataJson) {
  sessionStorage.setItem('transferedDatas', dataJson);
  window.open(`envelope_v3.html`);
}

