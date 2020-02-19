import React, { Component } from "react";
import * as THREE from "three";
import mapVec from "./geoJsons/countries.json";
import rivers from "./geoJsons/rivers.json";
import lakes from "./geoJsons/lakes.json";
import cities from "./geoJsons/cities.json";
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
import beatPoint from "./object/beatPoint.js";

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
    this.land = null;
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
    this.land = new earthLand(world, SET.geoLineColor, worldTex, worldNormal);
    this.scene.add(this.land.getObj());

    //sealine generator
    let pos = this.props.sealine;
    let spriteTex = new THREE.TextureLoader().load(steamIcon);

    for (let i = 0; i < pos.length; i++) {
      let coords = pos[i].points.map(e => {
        let xy = millerXY(e[1], e[0]);
        return new THREE.Vector2(xy[0], xy[1]);
      });
      let color = SET.boatColors[parseInt(Math.random() * SET.boatColors.length)];
      let boat = new THREE.Sprite(new THREE.SpriteMaterial({ map: spriteTex, color: color, transparent: true }));

      let { areaC, compC, lineC, day } = pos[i];
      boat["sealineInfo"] = { areaC, compC, lineC, day };

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

    // cities points generator
    for (let i = 0; i < cities.length; i++) {
      if (Math.random() > 0.15) {
        continue;
      }
      let city = cities[i];
      let cood = millerXY(city.lng, city.lat);
      let citypos = new THREE.Vector3(cood[0], cood[1], 1);
      let color = "#" + ((Math.random() * 0xffffff) << 0).toString(16);
      let cityPoint = new beatPoint(0.7, color, citypos);
      let board = this.textFactory.frag(cityPoint, city.name, 44, color);
      cityPoint.add(board.obj);
      board.obj.position.z = 3;
      board.obj.layers = cityPoint.layers;
      this.scene.add(cityPoint);
    }
    this.renderer.render(this.scene, this.camera);
    this.update(0);
  }

  componentDidUpdate() {
    let flag = this.props.pickState;
    this.lineFilter(flag);
    if (flag.pickLine) {
      this.focuse(flag.pickLine);
    }
  }

  lineFilter(flag) {
    let handeler = e => {
      if (e.children || e.children.length > 0) {
        e.children.forEach(handeler);
      }
      let eflag = e.sealineInfo;

      if (!eflag) return;

      e.layers.set(1);
      if (
        flag.pickLine
          ? flag.pickLine.lineC === eflag.lineC
          : (eflag.areaC === flag.pickArea || flag.pickArea === "All") &&
            (eflag.day === flag.pickDay || flag.pickDay === 7) &&
            (flag.pickComps.find(v => v === eflag.compC) || flag.pickComps.length === 0)
      ) {
        e.layers.set(0);
      }
      console.info(flag, eflag);
    };
    this.scene.children.forEach(handeler);
  }

  init() {
    // this.stats = new Stats();
    // this.container.appendChild(this.stats.dom);

    this.cvWidth = this.container.clientWidth;
    this.cvHeight = this.container.clientHeight;
    this.scene = new THREE.Scene();

    let centerX = SET.center[0] * SET.widthScale,
      centerY = SET.center[1] * SET.heightScale;
    this.camera = new THREE.PerspectiveCamera(40, this.cvWidth / this.cvHeight, 1, 10000);
    this.camera.position.set(centerX, centerY, 200.0);
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

  focuse(line) {
    let sealine = line.sealine;
    if (this.ani) {
      this.ani.pause();
    }
    if (sealine) {
      let centerX = SET.center[0] * SET.widthScale,
        centerY = SET.center[1] * SET.heightScale;
      let boat = sealine.boat;
      let { x, y, z } = this.camera.position;
      let target = { x, y, z };
      this.ani = anime({
        targets: target,
        duration: 3000,
        endDelay: 10000,
        easing: "easeInQuad",
        x: boat.position.x,
        y: boat.position.y - 120,
        z: 60,
        autoplay: true,
        round: 1,
        update: a => {
          this.camera.position.set(target.x, target.y, target.z);
          this.camera.lookAt(boat.position);
          this.camera.rotation.z = 0;

          this.land.meshMat.opacity = (100 - 5 * a.progress) / 100;
          this.land.lineMat.opacity = Math.max(30, 5 * a.progress) / 100;
        },
        changeComplete: a => {
          this.camera.layers.enable(3);
        }
      });
      this.ani.finished
        .then(() => {
          this.ani = anime({
            targets: target,
            duration: 3000,
            easing: "easeInQuad",
            x: centerX,
            y: centerY,
            z: 400,
            autoplay: true,
            update: a => {
              this.camera.position.set(target.x, target.y, target.z);
              this.camera.lookAt(boat.position);
              this.camera.rotation.z = 0;

              this.land.meshMat.opacity = a.progress / 100;
              this.land.lineMat.opacity = Math.max(30, 100 - a.progress) / 100;
            },
            complete: a => {
              this.camera.layers.disable(3);
            }
          });
          return this.ani.finished;
        })
        .then(() => {
          let { x, y, z } = boat.position;
          let target = { x, y, z };
          this.ani = anime({
            targets: target,
            duration: 1000,
            easing: "linear",
            x: centerX,
            y: centerY,
            z: 0,
            autoplay: true,
            update: a => {
              this.camera.lookAt(target.x, target.y, target.z);
            }
          });
          return this.ani.finished;
        })
        .finally(() => {
          this.ani = null;
          this.props.offPick();
        });
    }
  }

  update(t) {
    // this.stats.begin();

    //=========      =========
    // this.renderer.clear();
    this.objs.forEach(e => {
      e.update(t, e);
    });
    this.renderer.render(this.scene, this.camera);

    //=========      =========
    // this.stats.end();
    this.animationID = requestAnimationFrame(t => this.update(t));
  }

  render() {
    return (
      <div className="App">
        <div ref={ref => (this.container = ref)} style={{ width: "1920px", height: "360px" }} />
        <div ref={ref => (this.canvas2 = ref)} />
      </div>
    );
  }
}
