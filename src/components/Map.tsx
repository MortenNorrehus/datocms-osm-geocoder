import { useEffect } from "react";
import "ol/ol.css";
import Map from "ol/map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile.js";
import OSM from "ol/source/OSM.js";
import Point from "ol/geom/Point.js";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Feature from "ol/Feature.js";
import { fromLonLat } from "ol/proj";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";

function MapView({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  useEffect(() => {
    const map = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM(),
          preload: Infinity,
        }),
      ],
      view: new View({
        center: fromLonLat([longitude, latitude]),
        constrainResolution: true,
        zoom: 14,
      }),
    });

    const marker = new Feature({
      geometry: new Point(fromLonLat([longitude, latitude])),
    });

    const vectorSource = new VectorSource({
      features: [marker],
    });

    const markerStyle = new Style({
      image: new Icon({
        color: "#FF0000",
        crossOrigin: "anonymous",
        src: "https://openlayers.org/en/latest/examples/data/dot.png",
      }),
    });

    marker.setStyle(markerStyle);

    const markerVectorLayer = new VectorLayer({
      source: vectorSource,
    });

    map.addLayer(markerVectorLayer);

    return () => {
      map.setTarget(undefined);
    };
  }, [latitude, longitude]);
  return <div id="map" style={{ width: "100%", height: "400px" }} />;
}

export default MapView;
