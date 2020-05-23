import * as THREE from "three";
import anime from "animejs";
import "../settings";

const SET = global.Sets;
export default class seaLine {
  constructor(points, color, boat, pls) {
    this.boat = boat;
    this.id = Math.random();
    this.launcher = pls;
    this.color = color;
    this.curves = [];
    this.pointArray = [];
    this.curveArray = [];
    this.curveLength = [];

    let splitpos = [];

    for (let i = 0; i < points.length - 1; i++) {
      if (
        Math.abs(points[i].x - points[i + 1].x) >
        SET.earthS * SET.widthScale * 0.7
      ) {
        splitpos.push(i);
      }
    }
    console.log(boat.sealineInfo, points);

    if (splitpos.length > 0) {
      let proPoints = points;
      points = [];
      points.push(proPoints.slice(0, splitpos[0]));
      for (let i = 0; i < splitpos.length; i++) {
        points.push(proPoints.slice(splitpos[i] + 1, splitpos[i + 1]));
        let v = points[i][points[i].length - 1];
        let mapWidth = SET.earthS * SET.widthScale;
        let left = v.x < mapWidth / 2;
        points[i].push(new THREE.Vector3(left ? 0 : mapWidth, v.y, v.z));
        points[i + 1].unshift(new THREE.Vector3(left ? mapWidth : 0, v.y, v.z));
      }
    } else {
      points = [points];
    }
    this.pointArray = points;

    this.dashMat = new THREE.LineDashedMaterial({
      color: color,
      transparent: true,
      opacity: 0.5,
      dashSize: 1,
    });
    for (let i = 0; i < points.length; i++) {
      let bz = new THREE.SplineCurve(points[i]);
      let bzPoints = bz.getPoints(100);
      bzPoints = bzPoints.map((e) => {
        return new THREE.Vector3(e.x, e.y, 1);
      });
      let curve = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(bzPoints),
        this.dashMat
      );
      curve.computeLineDistances();

      this.curves.push(curve);
      this.curveLength.push(bz.getLength());
      this.curveArray.push(bzPoints);
    }
    this.anime = this.play(0);
  }

  play(index) {
    let i = index % this.curveArray.length;
    this.playing = i;
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
      endDelay: i === this.curveArray.length - 1 ? 2000 : 0,
      easing: "linear",
      direction: "alternate",
      update: (a) => {
        this.boat.position.set(target.x, target.y, target.z + 0.1);
        this.launcher.forEach((e) => {
          e.update && e.update();
        });
      },
      complete: (a) => {
        this.anime = this.play(i + 1);
      },
    });
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
    if (this.launcher) {
      let e = this.launcher[1];
      e.complete();
      e.switch(new THREE.CatmullRomCurve3(this.curveArray[this.playing]));
    }
  }

  back() {
    this.launcher[1].complete();
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
