import React, { Component } from "react";
import * as THREE from "three";
import mapVec from "./geoJsons/countries.json";
import rivers from "./geoJsons/rivers.json";
import lakes from "./geoJsons/lakes.json";
import "./sources/App.css";
import drawThreeGeo from "./tools/threeGeoJson";
import "./settings";
import millerXY from "./tools/millerTransformer";
import seaLine from "./object/seaLine.js";
import earthLand from "./object/earthLand.js";
import lineLauncher from "./particle/lineLauncher.js";
import lineTrail from "./particle/lineTrail";
import Stats from "stats-js";
import FragFactory from "./textRenderer/fragFactory.js";
import ParticleLauncher from "./particle/ParticleLauncher.js";
import anime from "animejs";

import earthNightMap from "./sources/earthNightMap11.png";
import earthNormalMap from "./sources/earthNormalMap.png";
import steamIcon from "./sources/steam.png";

const SET = global.Sets;
export default class WorldMap extends Component {
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
    lighttarget.position.set(1, 1, 1);
    //this.scene.add(lighttarget);
    light.target = lighttarget;

    var envlight = new THREE.AmbientLight(SET.sunLightColor); // soft white light
    this.scene.add(envlight);

    let world = drawThreeGeo(mapVec, 1, "plane", ["ATA", "GRL"]);
    // drawThreeGeo(rivers, 1, "plane", { color: SET.waterColor }, this.scene);
    // drawThreeGeo(lakes, 1, "plane", { color: SET.waterColor }, this.scene);
    let worldTex = new THREE.TextureLoader().load(earthNightMap);
    worldTex.minFilter = THREE.LinearMipMapLinearFilter;
    let worldNormal = new THREE.TextureLoader().load(earthNormalMap);
    worldNormal.magFilter = THREE.NearestMipMapLinearFilter;
    let worldOBJ = new earthLand(world, SET.geoLineColor, worldTex, worldNormal);
    this.scene.add(worldOBJ.getObj());

    let pos = this.props.sealine;
    let spriteTex = new THREE.TextureLoader().load(steamIcon);

    for (let i = 0; i < pos.length; i++) {
      let coords = pos[i].points.map(e => {
        let xy = millerXY(e[1], e[0]);
        return new THREE.Vector2(xy[0], xy[1]);
      });
      let color = SET.boatColors[parseInt(Math.random() * SET.boatColors.length)];
      let boat = new THREE.Sprite(new THREE.SpriteMaterial({ map: spriteTex, color: color, transparent: true }));

      let { areaC, compC, day } = pos[i];
      boat["sealineInfo"] = { areaC, compC, day };

      boat.scale.set(SET.boatSize, SET.boatSize, SET.boatSize);

      // let spriteLauncher = new lineLauncher(color, this.scene);
      // boat.add(spriteLauncher);
      let trail = new lineTrail(color, this.scene, boat);

      let particleLauncher = new ParticleLauncher(spriteTex, color, boat, this.scene);
      boat.add(particleLauncher);

      let textFrag = this.textFactory.frag(boat, pos[i].lineC, 44, "#f4f4f4");
      boat.add(textFrag.obj);

      let sl = new seaLine(coords, SET.geoLineColor, boat, [particleLauncher, trail]);
      sl.show(this.scene);
      pos[i]["sealine"] = sl;
    }
    this.renderer.render(this.scene, this.camera);
    this.update(0);
  }

  componentDidUpdate() {
    let flag = this.props.pickState;
    let handeler = e => {
      if (e.children || e.children.length > 0) {
        e.children.forEach(handeler);
      }
      let eflag = e.sealineInfo;

      if (!eflag) return;

      e.layers.set(1);
      if (
        (eflag.areaC === flag.pickArea || flag.pickArea === "All") &&
        (eflag.day === flag.pickDay || flag.pickDay === 7) &&
        (flag.pickComps.find(v => v === eflag.compC) || flag.pickComps.length === 0)
      ) {
        e.layers.set(0);
      }
    };
    this.scene.children.forEach(handeler);
    if (flag.pickLine) {
      this.focuse(flag.pickLine);
      flag.pickLine = "";
    }
  }

  init() {
    this.stats = new Stats();
    this.container.appendChild(this.stats.dom);

    this.cvWidth = this.container.clientWidth;
    this.cvHeight = this.container.clientHeight;
    this.scene = new THREE.Scene();

    let centerX = SET.center[0] * SET.widthScale,
      centerY = SET.center[1] * SET.heightScale;
    this.camera = new THREE.PerspectiveCamera(40, this.cvWidth / this.cvHeight, 1, 10000);
    this.camera.position.set(centerX, centerY, 400.0);
    this.camera.lookAt(centerX, centerY, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(SET.backgroundColor);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.cvWidth, this.cvHeight);

    this.container.appendChild(this.renderer.domElement);
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    this.scene.add(directionalLight);

    this.textFactory = new FragFactory();
    // this.canvas2.appendChild(this.textFactory.canvas);
  }

  focuse(lineCode) {
    console.log(lineCode);
    let pos = this.props.sealine.find(v => lineCode === v.lineC);

    let sealine = pos.sealine;
    if (this.ani) {
      this.ani.pause();
    }
    if (sealine) {
      let boat = sealine.boat;
      let target = { h: 400 };
      this.ani = anime({
        targets: target,
        duration: 3000,
        endDelay: 3000,
        easing: "easeInQuad",
        h: 100,
        autoplay: true,
        round: 1,
        update: a => {
          this.camera.position.z = target.h;
          this.camera.lookAt(boat.position);
        },
        complete: a => {
          this.ani = anime({
            targets: target,
            duration: 3000,
            easing: "easeInQuad",
            h: 400,
            autoplay: true,
            update: a => {
              this.camera.position.z = target.h;
              this.camera.lookAt(boat.position);
            },
            complete: a => {
              let centerX = SET.center[0] * SET.widthScale,
                centerY = SET.center[1] * SET.heightScale;
              this.camera.lookAt(centerX, centerY, 0);
              this.ani = null;
            }
          });
        }
      });
    }
  }

  update(t) {
    this.stats.begin();

    //=========      =========
    // this.renderer.clear();
    this.objs.forEach(e => {
      e.update(t, e);
    });
    this.renderer.render(this.scene, this.camera);

    //=========      =========
    this.stats.end();
    this.animationID = requestAnimationFrame(t => this.update(t));
  }

  render() {
    return (
      <div className="App">
        <div ref={ref => (this.container = ref)} style={{ width: "1920px", height: "1080px" }} />
        <div ref={ref => (this.canvas2 = ref)} />
      </div>
    );
  }
}
