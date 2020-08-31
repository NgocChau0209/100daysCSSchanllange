const API_KEY = "at_zJYfv05dhMiYES5Arp5PjMyZLCRfo";
let input = document.querySelector('#input-info');
let ispElement = document.querySelector('#isp');
let timezoneElement = document.querySelector('#timezone');
let countryElement = document.querySelector('#country');
let ipElement = document.querySelector('#ip');
let loading = document.querySelector('.loading');
let searchButton = document.querySelector('.ip-address__button-search');

window.addEventListener("load", function (event) {
  //init
  const GPS = currentIPAddress();
  GPS.then(values => {
    getInfoIPAddress(values);
  });
  //event
  input.addEventListener("keydown", (event) => {
    event.code == "Enter" && getInfoIPAddress();
  })
  searchButton.addEventListener("click", (event) => {
    getInfoIPAddress();
  })
});

function getInfoIPAddress(ip) {
  fetch(`https://geo.ipify.org/api/v1?apiKey=${API_KEY}&domain=${ip}`)
    .then(res => res.json())
    .then(res => {
      loading.style.visibility = "hidden";
      const {
        lat,
        lng,
        city,
        country,
        region,
        timezone
      } = res.location;
      const {
        isp,
        ip
      } = res;

      ipElement.textContent = ip;
      countryElement.textContent = `${city} , ${region} , ${country}`;
      timezoneElement.textContent = timezone;
      ispElement.textContent = isp;
      console.log(res)
      lat && lng && positionMap(lat, lng);
    })

    .catch(err => console.log(err));
}

async function currentIPAddress() {
  return new Promise(function (resolve, reject) {
    const res = fetch('https://api.ipify.org/?format=json')
      .then(data => data)
      .then(data => data.json())
      .then(data => data.ip)
      .catch(err => console.log(err))
    if (res) resolve(res);
    reject("can get data");
  });

}

function positionMap(lat, lng) {
  var mymap = L.map('mymap').setView([lat, lng], 13);
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoid2FycmlvcjgyNzAiLCJhIjoiY2tlZ3V5NGQxMHlnYTJxdXFyZmQ4cTkzcyJ9.jjfcbZ6cDSbCO6qc_Yp2aA',
  }).addTo(mymap);
  var icon = L.icon({
    iconUrl: './IP Address Tracker /images/icon-location.svg',
  });
  L.marker([lat, lng], {
    icon
  }).addTo(mymap);

}

function onMapClick(e) {
  alert("You clicked the map at " + e.latlng);
}