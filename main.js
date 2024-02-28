import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import TileWMS from 'ol/source/TileWMS.js';
import View from 'ol/View.js';


const layers = [
  new TileLayer({
    source: new TileWMS({
      url: 'http://geosrv04-preza:8080/geoserver/wms',
      params: {'LAYERS': 'm10000:map_m10000'},
    }),
  }),
  new TileLayer({
    source: new TileWMS({
      url: 'http://geosrv04-preza:8080/geoserver/wms',
      params: {'LAYERS': 'm10000:BUILDING'},
    }),
  }),
  new TileLayer({
    source: new TileWMS({
      url: 'http://geosrv04-preza:8080/geoserver/wms',
      params: {'LAYERS': 'srv210:layer672'},
    }),
  }),
];
const map = new Map({

  layers: layers,
  target: 'map',
  view: new View({
    center: [0,0],
    zoom: 18,
  }),
});
