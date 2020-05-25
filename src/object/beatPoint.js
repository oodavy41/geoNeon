import * as THREE from "three";
import anime from "animejs";

import pinIcon from "../sources/pin.png";

export default class beatPoint extends THREE.Object3D {
  constructor(size, color, position) {
    super();
    this.layers.set(3);
    this.position.copy(position);
    const tex = new THREE.TextureLoader().load(pinIcon);
    this.mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
    let halo = new THREE.Mesh(new THREE.PlaneGeometry(size * 3, size * 3), this.mat);
    this.add(halo);
    halo.layers = this.layers;

    this.ballMat = new THREE.MeshPhongMaterial({ color: "#1E99FF", transparent: true, opacity: 0.8 });
    let pointer = new THREE.Mesh(new THREE.SphereGeometry(size * 0.35, 16, 16), this.ballMat);
    this.add(pointer);
    pointer.layers = this.layers;
    pointer.position.z = size * 1.2;
  }
}
