import Map from 'ol/Map.js';
import TileLayer from 'ol/layer/Tile.js';
import TileWMS from 'ol/source/TileWMS.js';
import View from 'ol/View.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import MultiPoint from 'ol/geom/MultiPoint.js'
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';

//http://address/?bbox?polygon1?polygon99?$srv:srv$srv:srv

const extent = document.querySelector('.coords')
const currentUrl = window.location.href.toString().split('?').splice(1)
console.log(currentUrl)
const layersUrl = window.location.href.toString().split('$').splice(1)
console.log(layersUrl)
const geoObject = Object.assign({} , currentUrl)
delete geoObject[0]
delete geoObject[Object.keys(geoObject).length]


function polygonSlicer(arr){
  const e = arr.split(',').map(Number);
  const res = [];
  for (let i = 0; i < e.length; i += 2) {
      const chunk = e.slice(i, i + 2);
      res.push(chunk);
  }
  return res;
}

console.log(geoObject)

const styles = [
  new Style({
    stroke: new Stroke({
      color: '#9b191970',
      width: 2,
    }),
    fill: new Fill({
      color: 'rgba(255, 155, 155 , 0.5)',
    }),
  }),
  new Style({
    image: new CircleStyle({
      radius: 0,
      fill: new Fill({
        color: 'red',
      }),
    }),
    geometry: function (feature) {
      const coordinates = feature.getGeometry().getCoordinates()[0];
      return new MultiPoint(coordinates);
    },
  }),
];


//polygonObject
const geojsonObject = {
  'type': 'FeatureCollection',
  'crs': {
    'type': 'name',
  },
  'features': []
}

for(let i in geoObject){
  console.log(polygonSlicer(geoObject[i]))
  geojsonObject.features.push(
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Polygon',
        'coordinates': [
          polygonSlicer(geoObject[i])
        ],
     }
    }
  )

}

  const source = new VectorSource({
    features: new GeoJSON().readFeatures(geojsonObject),
  });
  
  const polygon = new VectorLayer({
    source: source,
    style: styles,
  });


const layers = [
  new TileLayer({
    source: new TileWMS({
      url: 'http://geosrv04-preza:8080/geoserver/wms',
      params: {'LAYERS': 'm10000:map_m10000','TILED': true},      
      serverType: 'geoserver',
      
    }),
    
  }),
];

for(let i in layersUrl){
  layers.push(
    new TileLayer({
      source: new TileWMS({
        url: 'http://geosrv04-preza:8080/geoserver/wms',
        params: {'LAYERS': `${layersUrl[i]}`, 'TILED': true},

      }),
    }),
  )
}




//pushing polygon

layers.push(polygon)

// map initializer 

const map = new Map({
  layers: layers,
  target: 'map',
  view: new View({
    center: [0,0],
    zoom: 20,
    zoomFactor: 1.5,
  }),
});


//extent and move-on function
map.on('moveend' , (evt) =>{
  extent.innerHTML = evt.frameState.extent
})
const myExtent = currentUrl[0].split(',').map(Number)
map.getView().fit(myExtent , map.getSize())