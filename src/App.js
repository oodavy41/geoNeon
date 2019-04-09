import React, { Component } from "react";
import * as THREE from "three";
import mapVec from "./worldmap.json";
import "./App.css";
import drawThreeGeo from "./threeGeoJson";
import "./settings";
import millerXY from "./millerTransformer.js";

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
    global.Sets.cities.forEach(e => {
      let mat = new THREE.PointsMaterial({ color: "orange" });
      let geo = new THREE.Geometry();
      let cood = millerXY(e[0], e[1]);
      geo.vertices.push(new THREE.Vector3(cood.x / 23000, 0, cood.y / 23000));
      let p = new THREE.Points(geo, mat);
      this.scene.add(p);
    });
    this.renderer.render(this.scene, this.camera);
    this.update();
  }

  init() {
    this.cvWidth = this.container.clientWidth;
    this.cvHeight = this.container.clientHeight;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.cvWidth / this.cvHeight, 1, 100000000000000000);
    this.camera.position.set(global.Sets.center[0] * 180, 60 * 1800, global.Sets.center[1] * 180);
    this.camera.lookAt(global.Sets.center[0] * 180, 0, global.Sets.center[1] * 180);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(global.Sets.background);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.cvWidth, this.cvHeight);
    this.container.appendChild(this.renderer.domElement);
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    this.scene.add(directionalLight);
  }

  update() {
    this.renderer.clear();
    this.objs.forEach(e => {
      let cube = e;
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
    });
    this.renderer.render(this.scene, this.camera);
    this.animationID = requestAnimationFrame(() => this.update());
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
