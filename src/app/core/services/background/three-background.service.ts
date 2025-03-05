import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import spline from '../../../imports/spline'

@Injectable({
  providedIn: 'root',
})
export class ThreeBackgroundService {
  private scene!: any;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private composer!: any;

  constructor() {}

  init(container: HTMLElement) {
    if (!THREE.WebGLRenderer) {
      console.error('WebGL not supported');
      return;
    }

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x000000, 0.8);

    // Camera
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
    this.camera.position.z = 3;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    container.appendChild(this.renderer.domElement);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.2;
    this.controls.minDistance = 2.3;
    this.controls.maxDistance = 8;

    // Post-processing
    const renderScene = new RenderPass(this.scene, this.camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 1.5, 0.4, 100);
    bloomPass.threshold = 0.001;
    bloomPass.strength = 3;
    bloomPass.radius = 0;
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderScene);
    this.composer.addPass(bloomPass);

    // Spline and Tube
    const points = spline.getPoints(80);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const tubeGeometry = new THREE.TubeGeometry(spline, 222, 0.65, 16, true);
    // const tubeMaterial = new THREE.MeshBasicMaterial({ color: 0x27e87b, wireframe: true });
        const tubeMaterial = new THREE.MeshBasicMaterial({ color: 0x2daa9e, wireframe: true });
    const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
    tube.name = 'tube'; // Add a name to the tube
    this.scene.add(tube);

    const edges = new THREE.EdgesGeometry(tubeGeometry, 0.2);
    // const lineMat = new THREE.LineBasicMaterial({ color: 0x8000ff });
    const lineMat = new THREE.LineBasicMaterial({ color: 0xe3d2c3 });
    const tubeLines = new THREE.LineSegments(edges, lineMat);
    this.scene.add(tubeLines);

    // Boxes
    const numBoxes = 50;
    const size = 0.070;
    const boxGeo = new THREE.BoxGeometry(size, size, size);
    for (let i = 0; i < numBoxes; i += 1) {
      const boxMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
      const box = new THREE.Mesh(boxGeo, boxMat);
      const p = (i / numBoxes + Math.random() * 0.1) % 1;
      const pos = tubeGeometry.parameters.path.getPointAt(p);
      pos.x += Math.random() - 0.4;
      pos.z += Math.random() - 0.4;
      box.position.copy(pos);
      const rote = new THREE.Vector3(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      box.rotation.set(rote.x, rote.y, rote.z);
      const boxEdges = new THREE.EdgesGeometry(boxGeo, 0.2);
      const boxLineMat = new THREE.LineBasicMaterial({ color: 0xefb036 });
      const boxLines = new THREE.LineSegments(boxEdges, boxLineMat);
      boxLines.position.copy(pos);
      boxLines.rotation.set(rote.x, rote.y, rote.z);
      this.scene.add(boxLines);
    }

    // Animation
    this.animate();

    // Window resize
    window.addEventListener('resize', () => this.onWindowResize(container));
  }

  private updateCamera(t: number) {
    const time = t * 0.1;
    const looptime = 12 * 1000; // 12 seconds loop
    const p = (time % looptime) / looptime; // Normalized progress (0 to 1)

    // Get the tube geometry from the scene
    const tube = this.scene.getObjectByName('tube');
    if (tube && tube.geometry && tube.geometry.parameters.path) {
      const path = tube.geometry.parameters.path;

      // Update camera position
      const pos = path.getPointAt(p);
      this.camera.position.copy(pos);

      // Update camera look-at point
      const lookAt = path.getPointAt((p + 0.03) % 1); // Slightly ahead on the path
      this.camera.lookAt(lookAt);
    }
  }

  private animate(t = 0) {
    this.updateCamera(t);
    this.composer.render(this.scene, this.camera);
    this.controls.update();
    requestAnimationFrame((time) => this.animate(time)); // Continuously call animate
  }

  private onWindowResize(container: HTMLElement) {
    const width = container.clientWidth;
    const height = container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
}