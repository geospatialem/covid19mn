//Get the zoom extent based on the browser and device size
function getZoomNumber() {
  if (document.documentElement.clientHeight >= 900) {
    return 7;
  } else {
      return 6;
  }
}

// Initialize the map on the "map" div with a given center and zoom
const map = L.map("covidmap").setView([46.37, -93.88], getZoomNumber());
// Basemap Layers
const EsriDarkGrayCanvas = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}").addTo(map);
const EsriDarkGrayCanvasRef = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}").addTo(map);

//Rate symbology
function setColor(popRate) {
  return popRate > 50.2 ?    '#000' :
         popRate > 21.4 ? '#006d2c' :
         popRate > 10.0 ? '#31a354' :
         popRate >  5.3 ? '#74c476' :
         popRate >  1.5 ? '#bae4b3' :
                          '#edf8e9';
}

//COVID-19 geometries and attributes
const mnCovidData = new L.GeoJSON.AJAX("data/mnCOVID19Data.json", {
  attribution: "Data: <a href='https://www.health.state.mn.us/'>Minnesota Department of Health</a> | Analysis: Matt Lindholm | Map: <a href='http://geospatialem.github.io'>Kitty Hurley</a>",
  style: function (feature) {
    return {
      color: "#D3D3D3", //Gray outline
      weight: 1, // Weight of the outline
      fillColor: setColor(feature.properties.PER_100K_3_26), //Set the fill to a field in your dataset
      fillOpacity: 0.75, //Fill opacity
      opacity: 1, //Line opacity
      clickable: true 
    }
  },
  onEachFeature: function(feature, layer) {
    layer.bindPopup("<h2>" + feature.properties.NAME + " County</h2>" + 
                    "<b>Rate per 100,000 people: " + feature.properties.PER_100K_3_26.toFixed(1) + "</b><br />" +
                    "Beds per 100,000 people: " + feature.properties.PER_1K_BEDS_3_26.toFixed(0) + "<br />" +
                    "Cases: " + feature.properties.CASES_3_26.toFixed(0) + "<br /><br />" +
                    "<i>Last updated: Thurs., 3/26</i>")
  }
}).addTo(map);

//Map legend
const mapLegend = L.control();

mapLegend.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'mapLegend'); // create a div with a class "info"
  this.update();
  return this._div;
};

mapLegend.update = function () {
  this._div.innerHTML = '<h4>COVID-19 in Minnesota</h4>' +
    '<img src="images/legend.png" width="95" height="90" alt="">' +
    '<p><i>Updated Thurs., 3/26</i></p>';
};

mapLegend.addTo(map);

