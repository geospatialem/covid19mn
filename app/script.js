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
  return popRate > 181.7 ?    '#000' :
         popRate >  95.3 ? '#006d2c' :
         popRate >  55.0 ? '#31a354' :
         popRate >  30.1 ? '#74c476' :
         popRate >  12.9 ? '#bae4b3' :
                           '#edf8e9';
}

function addThousandSeparator(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

//COVID-19 geometries and attributes
const mnCovidData = new L.GeoJSON.AJAX("data/mnCOVID19Data.json", {
  attribution: "Data: <a href='https://www.health.state.mn.us/'>Minnesota Department of Health</a> | Map & Analysis: <a href='http://geospatialem.github.io'>Kitty Hurley</a>",
  style: function (feature) {
    return {
      color: "#D3D3D3", //Gray outline
      weight: 1, // Weight of the outline
      fillColor: setColor(feature.properties.CASES_100K), //Set the fill to a field in your dataset
      fillOpacity: 0.75, //Fill opacity
      opacity: 1, //Line opacity
      clickable: true 
    }
  },
  onEachFeature: function(feature, layer) {
    layer.bindPopup("<h2>" + feature.properties.NAME + " County</h2>" + 

                    "<b>Cases per 100,000 people: " + addThousandSeparator(feature.properties.CASES_100K.toFixed(1)) + "</b><br />" +
                    "<b>Deaths per 100,000 people: " + addThousandSeparator(feature.properties.DEATHS_100K.toFixed(1)) + "</b><br />" +

                    "<br />Cases: " + feature.properties.CASES.toFixed(0) + "<br />" +
                    "Deaths: " + feature.properties.DEATHS.toFixed(0) + "<br />" +
                    "Population: " + addThousandSeparator(feature.properties.POPULATION) + "<br /><br />" +

                    "<i>Last updated: Fri., 4/10</i>")
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
  this._div.innerHTML = '<h4>COVID-19 in Minnesota' +
    '<span style="display:block;font-size:0.75em">Cases per 100,000 people</span></h4>' +
    '<img src="images/legend.png" width="95" height="90" alt="">' +

    '<p><i>Updated Fri., 4/10</i></p>';
};

mapLegend.addTo(map);

