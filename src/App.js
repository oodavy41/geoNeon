import React, { Component } from "react";
import * as THREE from "three";
import mapVec from "./geoJsons/countries.json";
import rivers from "./geoJsons/rivers.json";
import lakes from "./geoJsons/lakes.json";
import "./App.css";
import drawThreeGeo from "./threeGeoJson";
import "./settings";
import millerXY from "./millerTransformer.js";
import seaLine from "./object/seaLine.js";
import earthLand from "./object/earthLand.js";
import lineLauncher from "./particle/lineLauncher.js";
import Stats from "stats-js";
import FragFactory from "./textRenderer/fragFactory.js";

const SET = global.Sets;
class App extends Component {
  constructor(props) {
    super(props);
    this.container = null;
    this.canvas2 = null;
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

    var boxsize = 999999;

    let light = new THREE.DirectionalLight(SET.sunLightColor);
    this.scene.add(light);
    this.objs.push({
      obj: light,
      update: (time, context) => {
        context.obj.position.set(3 * Math.cos(time / 900), 3 * Math.sin(time / 900), 1);
      }
    });

    var lighttarget = new THREE.Mesh(
      new THREE.BoxGeometry(boxsize, boxsize, boxsize),
      new THREE.MeshBasicMaterial({ color: "#ff0000" })
    );
    lighttarget.position.set(0, 0, 0);
    this.scene.add(lighttarget);
    light.target = lighttarget;

    var envlight = new THREE.AmbientLight(SET.sunLightColor); // soft white light
    this.scene.add(envlight);

    let world = drawThreeGeo(mapVec, 1, "plane", ["ATA", "GRL"]);
    // drawThreeGeo(rivers, 1, "plane", { color: SET.waterColor }, this.scene);
    // drawThreeGeo(lakes, 1, "plane", { color: SET.waterColor }, this.scene);
    let worldTex = new THREE.TextureLoader().load("earthNightMap.png");
    worldTex.magFilter = THREE.NearestMipMapNearestFilter;
    let worldNormal = new THREE.TextureLoader().load("earthNormalMap.png");
    worldNormal.magFilter = THREE.NearestMipMapLinearFilter;
    let worldOBJ = new earthLand(world, SET.geoLineColor, worldTex, worldNormal);
    this.scene.add(worldOBJ.getObj());

    let pos = SET.sealines;

    let spriteTex = new THREE.TextureLoader().load("steam.png");
    for (let i = 0; i < pos.length; i++) {
      let coords = pos[i].map(e => {
        let xy = millerXY(e[1], e[0]);
        return new THREE.Vector2(xy[0], xy[1]);
      });
      let color = SET.boatColors[parseInt(Math.random() * SET.boatColors.length)];
      let boat = new THREE.Sprite(new THREE.SpriteMaterial({ map: spriteTex, color: color, transparent: true }));
      boat.scale.set(SET.boatSize, SET.boatSize, SET.boatSize);

      let spriteLauncher = new lineLauncher(color, this.scene);
      boat.add(spriteLauncher);

      let textFrag = this.textFactory.frag("line" + i, 14, "#f4f4f4");

      boat.add(textFrag.obj);

      let sl = new seaLine(coords, "#FFaabb", boat, spriteLauncher);
      this.scene.add(boat);
      // this.scene.add(sl.getCurve());
    }
    this.renderer.render(this.scene, this.camera);
    this.update(0);
  }

  init() {
    this.stats = new Stats();
    this.container.appendChild(this.stats.dom);

    this.cvWidth = this.container.clientWidth;
    this.cvHeight = this.container.clientHeight;
    this.scene = new THREE.Scene();

    let centerX = SET.center[0] * SET.widthScale,
      centerY = SET.center[1] * SET.heightScale;
    this.camera = new THREE.PerspectiveCamera(40, this.cvWidth / this.cvHeight, 1, 100000000000000000);
    this.camera.position.set(centerX, centerY, 40000000);
    this.camera.lookAt(centerX, centerY, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(SET.backgroundColor);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.cvWidth, this.cvHeight);

    this.container.appendChild(this.renderer.domElement);
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    this.scene.add(directionalLight);

    this.textFactory = new FragFactory();
    this.canvas2.appendChild(this.textFactory.canvas);
  }

  update(t) {
    this.stats.begin();

    //=================
    this.renderer.clear();
    this.objs.forEach(e => {
      e.update(t, e);
    });
    this.renderer.render(this.scene, this.camera);
    //==================

    this.stats.end();
    this.animationID = requestAnimationFrame(t => this.update(t));
  }

  render() {
    return (
      <div className="App">
        <div ref={ref => (this.container = ref)} style={{ width: "1440px", height: "900px" }} />
        <div ref={ref => (this.canvas2 = ref)} />
      </div>
    );
  }
}

export default App;
