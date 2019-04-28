import * as THREE from "three";
import anime from "animejs";
import "../settings";

const SET = global.Sets;
export default class seaLine {
  constructor(points, color, boat, pl) {
    this.boat = boat;
    this.launcher = pl;
    this.curves = [];
    this.pointArray = [];
    this.curveArray = [];
    this.curveLength = [];

    let splitpos = [];

    for (let i = 0; i < points.length - 1; i++) {
      if (Math.abs(points[i].x - points[i + 1].x) > SET.earthS * SET.widthScale * 0.7) {
        splitpos.push(i);
      }
    }

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

    for (let i = 0; i < points.length; i++) {
      let bz = new THREE.SplineCurve(points[i]);
      let bzPoints = bz.getPoints(100);
      bzPoints = bzPoints.map(e => {
        return new THREE.Vector3(e.x, e.y, 1000);
      });
      let curve = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(bzPoints),
        new THREE.LineBasicMaterial({
          color: color,
          transparent: true,
          linewidth: SET.trailWidth,
          opacity: 0.3
        })
      );

      this.curves.push(curve);
      this.curveLength.push(bz.getLength());
      this.curveArray.push(bzPoints);
    }
    this.anime = this.play(0);
  }

  play(index) {
    let i = index % this.curveArray.length;
    let bzPoints = this.curveArray[i];
    this.boat.position.copy(bzPoints[0]);
    let points = bzPoints.map((e, i) => {
      let { x, y, z } = e;
      return { x, y, z };
    });
    let target = points[0];
    let ani = anime({
      targets: target,
      keyframes: points,
      duration: Math.max(10000, this.curveLength[i] / SET.sealineSpeed),
      loop: false,
      endDelay: i === this.curveArray.length - 1 ? 2000 : 0,
      easing: "linear",
      direction: "alternate",
      update: a => {
        this.boat.position.set(target.x, target.y, target.z);
        if (this.launcher) {
          this.launcher.update();
        }
      },
      complete: a => {
        this.anime = this.play(i + 1);
      }
    });
    return ani;
  }
  getCurve() {
    return this.curve;
  }
}
