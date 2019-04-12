import React, { Component } from "react";
import * as THREE from "three";
import mapVec from "./geoJsons/worldMap.json";
import rivers from "./geoJsons/rivers.json";
import lakes from "./geoJsons/lakes.json";
import "./App.css";
import drawThreeGeo from "./threeGeoJson";
import "./settings";
import millerXY from "./millerTransformer.js";
import seaLine from "./object/seaLine.js";
import launcher from "./particle/launcher.js";

class App extends Component {
  constructor(props) {
    super(props);
    this.container = null;
    this.cvWidth = 0;
    this.cvHeight = 0;
    this.scene = null;
    this.renderer = null;
    this.camera = null;
    this.animationID = 0;
    this.objs = [];
  }

  componentDidMount() {
    this.init();

    drawThreeGeo(mapVec, 180, "plane", { color: global.Sets.geoColor }, this.scene);
    drawThreeGeo(rivers, 180, "plane", { color: global.Sets.waterColor }, this.scene);
    drawThreeGeo(lakes, 180, "plane", { color: global.Sets.waterColor }, this.scene);

    let pos = [];
    let mat = new THREE.PointsMaterial({ color: 0xaaffff });
    let geo = new THREE.Geometry();
    global.Sets.cities.forEach((e, i) => {
      let cood = millerXY(e[4], -e[3]);
      geo.vertices.push(new THREE.Vector3(cood.x, e[5], -cood.y));
      let p = new THREE.Points(geo, mat);
      // this.scene.add(p);

      if (i % 1995 === 0) {
        pos.push(new THREE.Vector2(cood.x, -cood.y));
      }
    });
    let bz = new THREE.SplineCurve(pos);
    let points = bz.getPoints(100);
    points = points.map(e => {
      return new THREE.Vector3(e.x, 0, e.y);
    });

    let spriteTex = new THREE.TextureLoader().load("steam.png");
    for (let i = 0; i < 1; i++) {
      let boat = new THREE.Mesh(new THREE.SphereGeometry(200000), new THREE.MeshBasicMaterial({ color: "#ffddee" }));
      let spriteLauncher = new launcher(spriteTex, "#ffffff", this.scene);
      boat.add(spriteLauncher);

      let sl = new seaLine(points, "#FFaabb", boat, spriteLauncher);
      this.scene.add(sl.getObj());
      this.scene.add(sl.getCurve());
    }
    this.renderer.render(this.scene, this.camera);
    this.update();
  }

  init() {
    this.cvWidth = this.container.clientWidth;
    this.cvHeight = this.container.clientHeight;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.cvWidth / this.cvHeight, 1, 100000000000000000);
    this.camera.position.set(global.Sets.center[0], 40000000, global.Sets.center[1]);
    this.camera.lookAt(global.Sets.center[0], 0, global.Sets.center[1]);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(global.Sets.background);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.cvWidth, this.cvHeight);
    this.container.appendChild(this.renderer.domElement);
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    this.scene.add(directionalLight);
  }

  update(t) {
    this.renderer.clear();
    this.objs.forEach(e => {
      let cube = e;
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
    });
    this.renderer.render(this.scene, this.camera);
    this.animationID = requestAnimationFrame(t => this.update(t));
  }

  render() {
    return (
      <div className="App">
        <div ref={ref => (this.container = ref)} style={{ width: "1440px", height: "900px" }} />
      </div>
    );
  }
}

export default App;
