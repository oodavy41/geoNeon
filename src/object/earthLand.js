import * as THREE from "three";
import tObj from "./object";

export default class earthLand extends tObj {
  constructor(landJson, lineColor, landTex, normalTex) {
    let container = new THREE.Object3D();
    super(container);
    this.lineColor = lineColor;
    this.landTex = landTex;
    this.normalTex = normalTex ? normalTex : null;

    let funMap = { point: Point, line: Line, mesh: Mesh };
    landJson.forEach(e => {
      if (e.geometry) {
        funMap[e.type](e.geometry, this);
      }
    });
  }
}
function Point(e, that) {
  let geo = new THREE.Geometry();
  for (let ind = 0; ind < e.length; ind++) {
    geo.vertices.push(new THREE.Vector3(e[0].x, e[0].y, e[0].z));
  }
  that.mesh.add(new THREE.ParticleSystem(geo, new THREE.SpriteMaterial({ color: that.lineColor })));
}

function Line(e, that) {
  let geo = new THREE.Geometry();

  for (let i = 0; i < e.length; i++) {
    geo.vertices.push(new THREE.Vector3(e[i].x, e[i].y, e[i].z));
  }

  that.mesh.add(new THREE.Line(geo, new THREE.LineBasicMaterial({ color: that.lineColor, opacity: 0.3, transparent: true })));
}

function Mesh(e, that) {
  let face_geom = new THREE.BufferGeometry();
  face_geom.setIndex(e.face);
  face_geom.addAttribute("position", new THREE.BufferAttribute(new Float32Array(e.position), 3));
  face_geom.addAttribute("uv", new THREE.BufferAttribute(new Float32Array(e.uv), 2));
  let mat = new THREE.MeshPhongMaterial({
    map: that.landTex,
    normalMap: that.normalTex,
    normalMapType: THREE.ObjectSpaceNormalMap,
    shininess: 32
  });
  that.mesh.add(new THREE.Mesh(face_geom, mat));
}
