import React, { Component } from "react";
import * as THREE from "three";
import mapVec from "./geoJsons/world-110m.json";
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
import boatImg from "./sources/boat.png";
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
    this.boatBoard = null;
    this.updateStack = [];
  }

  componentDidMount() {
    this.init();

    var boxsize = 999999;

    let boatTex = new THREE.TextureLoader().load(boatImg);
    this.boatBoard = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: boatTex, transparent: true })
    );
    this.boatBoard.scale.set(10, 7, 1);
    this.boatBoard.layers.set(3);
    this.scene.add(this.boatBoard);

    let light = new THREE.DirectionalLight(SET.sunLightColor);
    this.scene.add(light);
    this.objs.push({
      obj: light,
      update: (time, context) => {
        context.obj.position.set(
          3 * Math.cos(time / 900),
          3 * Math.sin(time / 900),
          1
        );
      },
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

    let world = drawThreeGeo(mapVec, 1, "plane", ["ATA"]);
    console.log(world);
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
      if (pos[i].points.length === 0) {
        continue;
      }
      let coords = pos[i].points.map((e) => {
        let xy = millerXY(e[1], e[0]);
        return new THREE.Vector2(xy[0], xy[1]);
      });
      let color =
        SET.boatColors[parseInt(Math.random() * SET.boatColors.length)];
      let boat = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: spriteTex,
          color: color,
          transparent: true,
        })
      );
      boat.color = color;

      let { areaC, cmpyC, lineC, day } = pos[i];
      boat["sealineInfo"] = { ...pos[i] };

      boat.scale.set(SET.boatSize, SET.boatSize, SET.boatSize);

      // let spriteLauncher = new lineLauncher(color, this.scene);
      // boat.add(spriteLauncher);
      let trail = new lineTrail(color, this.scene, boat);

      let particleLauncher = new ParticleLauncher(
        spriteTex,
        color,
        boat,
        this.scene
      );
      boat.add(particleLauncher);

      let textFrag = this.textFactory.frag(boat, pos[i].lineC, 44, "#f4f4f4");
      boat.add(textFrag.obj);

      let sl = new seaLine(coords, SET.geoLineColor, boat, this.scene, [
        particleLauncher,
        trail,
      ]);
      sl.show(this.scene);
      pos[i]["sealine"] = sl;
    }
    
    this.lineFilter(this.props.pickState);

    // cities points generator
    for (let k in cities) {
      let city = cities[k].location;
      let cood = millerXY(city.lng, city.lat);
      let citypos = new THREE.Vector3(cood[0], cood[1], 1);
      let color = "#FFAB00";
      let cityPoint = new beatPoint(0.7, color, citypos);
      let board = this.textFactory.frag(cityPoint, k, 44, color);
      cityPoint.add(board.obj);
      board.obj.position.z = 3;
      board.obj.layers = cityPoint.layers;
      this.scene.add(cityPoint);
    }
    this.renderer.render(this.scene, this.camera);
    this.update(0);

    this.containerDBclick = (e) => {
      this.back();
    };
    this.container.addEventListener("dblclick", this.containerDBclick);
  }
  componentWillUnmount() {
    this.container.removeEventListener("dblclick", this.containerDBclick);
  }
  componentDidUpdate() {
    let flag = this.props.pickState;
    this.lineFilter(flag);
    if (flag.pickLine) {
      this.focuse(flag.pickLine);
    }
  }

  lineFilter(flag) {
    let picked = {};
    this.props.pickedLine.forEach((e) => (picked[e.lineC] = true));
    let handeler = (e) => {
      if (e.children || e.children.length > 0) {
        e.children.forEach(handeler);
      }
      let eflag = e.sealineInfo;

      if (!eflag) return;
      // console.log(eflag, flag);
      if (picked[eflag.lineC]) {
        e.layers.set(0);
      } else {
        e.layers.set(1);
      }
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
    this.camera = new THREE.PerspectiveCamera(
      40,
      this.cvWidth / this.cvHeight,
      1,
      10000
    );
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

  focuse(line) {
    this.ani && this.ani.pause();
    let sealine = line.sealine;
    this.focuseLine = sealine;
    let endPoint = sealine.boat.position;
    this.boatBoard.position.copy(endPoint);
    this.boatBoard.position.y += 2;
    this.boatBoard.position.z = 3;

    if (sealine) {
      let boat = sealine.boat;
      let { x, y, z } = this.camera.position;
      let target = { x, y, z };
      this.ani = anime({
        targets: target,
        duration: 1000,
        // endDelay: 100000000,
        easing: "easeInQuad",
        x: endPoint.x + 20,
        y: endPoint.y - 70,
        z: 120,
        autoplay: true,
        round: 1,
        update: (a) => {
          let boatPos = boat.position;
          this.camera.position.copy(target);
          this.camera.lookAt(endPoint);
          this.camera.rotation.z = 0;
          this.land.meshMat.opacity = (100 - 5 * a.progress) / 100;
          this.land.lineMat.opacity = Math.max(30, 5 * a.progress) / 100;
          sealine.focus();
        },
        changeComplete: (a) => {
          this.camera.layers.enable(3);

          this.camera.lookAt(endPoint);
          this.camera.rotation.z = 0;
          this.focusing(boat);
        },
      });
    }
  }

  focusing(boat) {
    this.ani && this.ani.pause();
    const target = { x: 0 };
    this.ani = anime({
      targets: target,
      duration: 1000,
      // endDelay: 100000000,
      easing: "easeInQuad",
      x: 100,
      autoplay: true,
      loop: true,
      update: (a) => {
        let boatPos = boat.position;
        this.camera.position.set(boatPos.x + 20, boatPos.y - 70, 120);
        this.camera.lookAt(boatPos);
      },
    });
  }

  back() {
    let line = this.focuseLine;
    line && line.recoveDashColor();
    line && line.back();

    this.ani && this.ani.pause();
    let centerX = SET.center[0] * SET.widthScale,
      centerY = SET.center[1] * SET.heightScale;
    this.camera.layers.disable(3);
    this.camera.position.set(centerX, centerY, 400);
    this.camera.rotation.z = 0;
    this.camera.lookAt(centerX, centerY, 0);
    this.land.meshMat.opacity = 1;
    this.land.lineMat.opacity = 0.3;
    this.ani = null;
    this.props.offPick();
    this.focuseLine = null;
  }

  update(t) {
    // this.stats.begin();

    //=========      =========
    // this.renderer.clear();
    this.objs.forEach((e) => {
      e.update(t, e);
    });
    this.renderer.render(this.scene, this.camera);

    //=========      =========
    // this.stats.end();
    this.animationID = requestAnimationFrame((t) => this.update(t));
  }

  render() {
    return (
      <div className="App">
        <div
          ref={(ref) => (this.container = ref)}
          style={{ width: "1920px", height: "1080px" }}
        />
        <div ref={(ref) => (this.canvas2 = ref)} />
      </div>
    );
  }
}
