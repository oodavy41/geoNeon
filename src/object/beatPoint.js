import * as THREE from "three";
import anime from "animejs";

export default class beatPoint extends THREE.Object3D {
  constructor(size, color, position) {
    super();
    this.layers.set(3);
    this.position.copy(position);
    this.mat = new THREE.MeshPhongMaterial({ color: color, transparent: true, opacity: 0.8 });
    let halo = new THREE.Mesh(new THREE.RingGeometry(size * 0.6, size, 6, 8), this.mat);
    this.add(halo);
    halo.layers = this.layers;
    let pointer = new THREE.Mesh(new THREE.OctahedronGeometry(size * 0.6, 0), this.mat);
    this.add(pointer);
    pointer.layers = this.layers;
    pointer.scale.z = 1.5;
    pointer.position.z = size * 1.5;
    let T = { rotate: 0 };
    this.ani = anime({
      targets: T,
      rotate: 360,
      easing: "linear",
      duration: 10000,
      loop: true,
      update: a => {
        pointer.rotation.z = (T.rotate / 180) * Math.PI;
      }
    });
  }
}
