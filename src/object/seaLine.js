import tObj from "./object";
import * as THREE from "three";
import anime from "animejs";
export default class seaLine extends tObj {
  constructor(points, color, point, pl) {
    let curve = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: color }));
    point.position.copy(points[0]);
    points = points.map((e, i) => {
      let { x, y, z } = e;
      return { x, y, z };
    });
    let target = points[0];
    let ani = anime({
      targets: target,
      keyframes: points,
      duration: 50000,
      loop: true,
      easing: "linear",
      update: a => {
        point.position.set(target.x, target.y, target.z);
        if (pl) pl.update();
      }
    });
    super(point, ani);
    this.pointArray = points;
    this.curve = curve;
  }

  getCurve() {
    return this.curve;
  }
}
