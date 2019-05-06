import * as THREE from "three";
import "../settings";

export default class lineTrail {
  constructor(color, scene, head) {
    this.head = head;
    this.color = color;
    this.scene = scene;
    this.curves = [];
    this.index = 0;
  }

  update() {
    let now = new THREE.Vector3();
    now.copy(this.head.position);
    this.curves[this.index].points.push(now);
    this.curves[this.index].obj.geometry.setFromPoints(this.curves[this.index].points);
    this.curves[this.index].obj.geometry.verticesNeedUpdate = true;
  }

  switch(index) {
    if (!this.curves[index]) {
      let geo = new THREE.BufferGeometry();
      let mat = new THREE.LineBasicMaterial({
        color: this.color,
        transparent: true,
        opacity: global.Sets.trailOpacity
      });
      let line = new THREE.Line(geo, mat);
      this.curves[index] = { obj: line, points: [] };
    }
    this.curves[index].obj.geometry.setFromPoints(this.curves[this.index].points);
    this.scene.add(this.curves[index].obj);
    this.index = index;
  }
  complete() {
    this.curves.forEach(e => {
      this.scene.remove(e.obj);
      e.points = [];
    });
  }
}
