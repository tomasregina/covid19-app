<template>
  <div class="home">
    <button @click="refreshData">Refresh</button>
    <TheLegend />
    <!-- <div class="legend">
      <h3>Legend</h3>
      <div class="legend-item" v-for="(color, idx) in colorSchema" :key="color">
        <div class="color-preview" :style="{backgroundColor: color}">
        </div>
        <p>{{statuses[idx]}}</p>
      </div>
    </div> -->
    <div id="map" class="map">
    </div>
  </div>
</template>

<script>
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import * as olProj from 'ol/proj';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import Text from 'ol/style/Text';
import LayerGroup from 'ol/layer/Group';
import Select from 'ol/interaction/Select';
import {click, pointerMove, altKeyOnly} from 'ol/events/condition';
import Chart from 'ol-ext/style/Chart';
import Legend from 'ol-ext/control/Legend';
import TheLegend from '../components/Legend.vue'



let map;
let source;
// let colorSchema = ['rgb(255, 73, 51)', 'rgb(116, 79, 33)', 'rgb(33, 218, 47)'];
let style = new Style({
        text: new Text(),
        fill: new Fill({
          color: 'rgba(20, 100, 240, 0.3)'
        }),
        stroke: new Stroke({
          width: 3,
          color: 'rgba(0, 100, 240, 0.8)'
        }),
       /*  image: new CircleStyle({
                    fill: new Fill({
                        color: 'rgba(55, 200, 150, 0.5)'
                    }),
                    stroke: new Stroke({
                        width: 10,
                        color: 'rgba(55, 200, 150, 0.8)'
                    }),
                    radius: 2
                }), */     
            })
export default {
  components: {
    TheLegend,
  },
  data() {
    return {
      active: 0,
      recovered: 0,
      death: 0,
      statuses: ['Active', 'Deaths', 'Recovered'],
      colorSchema: ['rgb(255, 73, 51)', 'rgb(116, 79, 33)', 'rgb(33, 218, 47)']
    }
  },
  methods: {
    
    addDataToMap() {
      if (source) {
        source.clear();
      }              
      source = new VectorSource({
        features: []
      });
      this.getAllData.forEach((country) => {
        
        let feature = new Feature({
          geometry: new Point(olProj.transform([country.Lon, country.Lat], 'EPSG:4326', 'EPSG:3857')),
          labelPoint: new Point(olProj.transform([country.Lon, country.Lat], 'EPSG:4326', 'EPSG:3857')),
          name: 'Country',
          label: `${country.Province || country.Country}, Deaths: ${country.Deaths}`
        });
        this.active = country.Confirmed - country.Recovered - country.Deaths;
        this.recovered = country.Recovered;
        this.death = country.Deaths;
        country.Active = country.Confirmed - country.Recovered - country.Deaths;
        feature.setProperties(country);
        const active = feature.getProperties().Active;
        const deaths = feature.getProperties().Deaths;
        const recovered = feature.getProperties().Recovered;
        source.addFeature(feature);
      });
      let layer = new VectorLayer({
        source: source,
        style: (feature) => {
          // style.getText().setText(feature.get('label'));
          style.setImage(
            new Chart({
              type: 'pie', 
              radius: 20, 
              offsetY: 10,
              data: [feature.getProperties().Active, feature.getProperties().Deaths, feature.getProperties().Recovered], 
              colors: this.colorSchema,
              rotateWithView: true,
              stroke: new Stroke({
                color: 'rgba(20, 100, 240, 0.4)',
                width: 1
              }),
            })
          )
          return [style];
        }   
      });
      
      map.addLayer(layer);
    },
    
    refreshData() {
      this.$store.dispatch('clearData');
      const countries = ['slovakia', 'czech-republic', 'hungary', 'poland'];
      const yesterday = new Date(Date.now() - 864e5);
      let month;
      let day;
      if ((yesterday.getMonth() + 1 ) < 10 ) {
        month = '0' + (yesterday.getMonth() + 1);
      } else {
        month = yesterday.getMonth();
      }
      if (yesterday.getDate() < 10 ) {
        day = '0' + (yesterday.getDate());
      } else {
        day = yesterday.getDate();
      }
      countries.forEach((country) => {
        this.axios.get(`https://api.covid19api.com/country/${country}?from=${yesterday.getFullYear()}-${month}-${day}T00:00:00Z&to=${yesterday.getFullYear()}-${month}-${day}T23:59:59Z`)
        .then(res => {
          if (res.data.length > 1) {
            (res.data).forEach((province) => {
              this.$store.dispatch('setData', province)              
            })
          } else {
            this.$store.dispatch('setData', res.data[0]);
          }     
          this.addDataToMap();
        });
      });
       

    }
  },
  computed: {
    getAllData() {
      return this.$store.getters.getAllData;
    }
  },
  mounted()  {
    this.refreshData();

    map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new XYZ({
          url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          })
        })
      ],
      view: new View({
      center: [0, 0],
      zoom: 2
      })
    });
    
    const selectSingleClick = new Select();
    
    map.addInteraction(selectSingleClick);

    selectSingleClick.on('select', (e) => {
      let selectedFeature = e.selected[0];
      if (!selectedFeature) {
        return;
      }
      let data = [selectedFeature.getProperties().Active, selectedFeature.getProperties().Deaths, selectedFeature.getProperties().Recovered]; 
      let chartTextStyle = [ new Style(
				{	image: new Chart(
					{	type: "pie", 
						radius: 30, 
            data: data,
            colors: this.colorSchema,
						rotateWithView: true,
						stroke: new Stroke(
						{	color: "#fff",
							width: 1
						}),
					})
        })];
        
      
      let newStyle;
      let sum = selectedFeature.getProperties().Confirmed;
      let s = 0;
      for (let i=0; i<data.length; i++) {
        let d = data[i];
        let a = (2*s+d)/sum * Math.PI - Math.PI/2; 
        let v = Math.round(d/sum*1000);
        if (v>0) {
          chartTextStyle.push( new Style({
            text: new Text({
              text: (v/10)+"%", /* d.toString() */
              offsetX: Math.cos(a)*(25+3),
              offsetY: Math.sin(a)*(25+3),
              textAlign: (a < Math.PI/2 ? "left":"right"),
              textBaseline: "middle",
              stroke: new Stroke({
                color:"#fff", 
                width:2.5 
              }),
              fill: new Fill({color:"#333"})
            })
          }) )
        }
        s += d;
    }
    selectedFeature.setStyle(chartTextStyle);
    
})
  }
}
</script>

<style scoped>
.map {
      height: 400px;
      width: 100%;
    }
/* .color-preview {
  height: 2.5rem;
  width: 2.5rem;
  margin-right: 1rem
}
.legend-item {
  display: flex;
  align-items: center;
}
h3 {
  text-align: left;
} */
</style>
