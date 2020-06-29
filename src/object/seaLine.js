import * as THREE from "three";
import anime from "animejs";

import curveTube from "./curveTube";
import "../settings";

const SET = global.Sets;
export default class seaLine {
  constructor(points, color, boat, scene, pls) {
    this.boat = boat;
    this.scene = scene;
    this.id = Math.random();
    this.launcher = pls;
    this.color = color;
    this.curves = [];
    this.pointArray = [];
    this.curveArray = [];
    this.curveLength = [];
    this.tickTime = 0;

    let splitpos = [0];

    for (let i = 0; i < points.length - 1; i++) {
      if (
        Math.abs(points[i].x - points[i + 1].x) >
        SET.earthS * SET.widthScale * 0.7
      ) {
        splitpos.push(i + 1);
      }
    }
    // console.log(points, splitpos);

    if (splitpos.length > 1) {
      let proPoints = points;
      points = [];
      for (let i = 0; i < splitpos.length; i++) {
        let start = splitpos[i],
          end = splitpos[i + 1] || proPoints.length,
          child = proPoints.slice(start, end);
        if (child) points.push(child);
      }
      for (let i = 0; i < points.length - 1; i++) {
        // let v = points[i][points[i].length - 1];
        // let mapWidth = SET.earthS * SET.widthScale;
        // let left = v.x < mapWidth / 2;
        // points[i].push(new THREE.Vector3(left ? 0 : mapWidth, v.y, v.z));
        // points[i + 1].unshift(new THREE.Vector3(left ? mapWidth : 0, v.y, v.z));
      }
    } else {
      points = [points];
    }
    points = points.filter((a) => a.length > 1);
    // console.log(boat.sealineInfo.lineC, points);
    this.pointArray = points;

    this.dashMat = new THREE.LineDashedMaterial({
      color: color,
      transparent: true,
      opacity: 0.5,
      dashSize: 1,
    });
    for (let i = 0; i < points.length; i++) {
      let path = points[i].map((e) => {
        return new THREE.Vector3(e.x, e.y, 1);
      });
      let bz = new THREE.CatmullRomCurve3(path);
      let bzPoints = bz.getPoints(path.length * 2);

      let curve = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(bzPoints),
        this.dashMat
      );
      curve.computeLineDistances();
      curve["sealineInfo"] = boat.sealineInfo;
      this.curves.push(curve);
      this.curveLength.push(bz.getLength());
      this.curveArray.push(bzPoints);
    }

    this.anime = this.play(0, true);
  }

  update(t) {
    this.anime.tick(t);
    this.tickTime = t;
  }

  play(index, init) {
    let i = index % this.curveArray.length;
    this.playing = i;
    if (this.launcher) {
      this.launcher.forEach((e) => {
        i === 0 && e.complete && e.complete();
        e.switch && e.switch(i);
      });
    }
    let bzPoints = this.curveArray[i];

    this.boat.position.copy(bzPoints[0]);
    let points = bzPoints.map((e, i) => {
      let { x, y, z } = e;
      let length = 0;
      if (i !== 0) {
        let pre = bzPoints[i - 1];
        let dx = pre.x - x;
        let dy = pre.y - y;
        let dz = pre.z - z;
        length = Math.sqrt(dx * dx + dy * dy + dz * dz);
      }
      return { x, y, z, duration: length / SET.sealineSpeed };
    });
    let target = points[0];
    let ani = anime({
      targets: target,
      keyframes: points,
      loop: false,
      autoplay: false,

      endDelay: i === this.curveArray.length - 1 ? 2000 : 0,
      easing: "linear",
      direction: "alternate",
      update: (a) => {
        this.boat.position.set(target.x, target.y, target.z + 0.1);
        if (this.focusing)
          this.launcher.forEach((e) => {
            e.update && e.update(this.tickTime);
          });
      },
      complete: (a) => {
        this.anime = this.play(i + 1);
      },
    });
    if (init) {
      ani.seek(ani.duration * Math.random());
    }
    return ani;
  }
  getCurve() {
    return this.curve;
  }
  show(scene) {
    scene.add(this.boat);
    this.curves.forEach((e) => {
      scene.add(e);
    });
  }

  hide(scene) {
    scene.remove(this.boat);
    this.curves.forEach((e) => {
      scene.remove(e);
    });
  }

  changeLineColor(color) {
    this.launcher[1].changeMatColor(color);
  }
  recoveLineColor() {
    this.launcher[1].changeMatColor(this.color);
  }

  focus() {
    this.focusing = true;
    if (!this.tube)
      this.tube = new curveTube(
        this.boat.color,
        this.scene,
        this.boat,
        this.curveArray
      );
    this.tube.show();
  }

  back() {
    this.focusing = false;
    this.tube.hide();
  }

  changeDashColor(color) {
    this.dashMat.color.set(new THREE.Color(color));
    this.dashMat.dashSize = 2;
  }

  recoveDashColor() {
    this.dashMat.color.set(new THREE.Color(this.color));
    this.dashMat.dashSize = 1;
  }
}
