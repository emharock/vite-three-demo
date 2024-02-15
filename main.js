import gsap from 'gsap'
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const gui = new dat.GUI();
const world = {
  plane: {
    width: 400,
    height: 400,
    widthSegments: 50,
    heightSegments: 50
  }
}

gui.add(world.plane, 'width', 1, 500).
  onChange(generatePlane);
gui.add(world.plane, 'height', 1, 500).
  onChange(generatePlane);
gui.add(world.plane, 'widthSegments', 1, 100).
  onChange(generatePlane);
gui.add(world.plane, 'heightSegments', 1, 100).
  onChange(generatePlane);

function generatePlane() {
  planeMesh.geometry.dispose(); 
  planeMesh.geometry = new THREE.
    PlaneGeometry(
    world.plane.width, 
    world.plane.height, 
    world.plane.widthSegments, 
    world.plane.heightSegments
    )
    
const {array} = planeMesh.geometry.attributes.position;
const randomValues = []
for (let i = 0; i < array.length; i++) {
  if ( i % 3 === 0) { 
  const x = array[i];
  const y = array[i + 1];
  const z = array[i + 2];

  array[i] = x + (Math.random() - 0.5) * 1
  array[i +1] = y + (Math.random() - 0.5) * 1
  array[i + 2] = z + Math.random() - 0.5 * 3
  }

randomValues.push(Math.random() *  Math.PI * 5)

}

planeMesh.geometry.attributes.position.randomValues = randomValues
planeMesh.geometry.attributes.position.originalPosition = 
planeMesh.geometry.attributes.position.array

  const colors = []
  for (let i = 0; i < planeMesh.geometry.
      attributes.position.count; i++) {
      colors.push(0, 0, 0.4)
  }
    
    planeMesh.geometry.setAttribute(
      'color', 
      new THREE.BufferAttribute(new 
        Float32Array(colors), 3)
  )  
}

const raycaster = new THREE.Raycaster();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)
camera.position.z = 50

const planeGeometry = new THREE.
  PlaneGeometry(world.plane.width, world.plane.height, 
  world.plane.widthSegments, world.plane.heightSegments)
const planeMaterial = new THREE.MeshPhongMaterial({
  side: THREE.DoubleSide,
  flatShading: true,
  vertexColors: true
})
const planeMesh = new THREE.Mesh(
  planeGeometry, planeMaterial);
scene.add(planeMesh);
generatePlane()

const light = new THREE.DirectionalLight
  (0xffffff, 1);
light.position.set(0, 1, 1);
scene.add(light);

const backLight = new THREE.DirectionalLight
  (0xffffff, 1);
backLight.position.set(0, 1, -1);
scene.add(backLight);

const mouse = {
  x: undefined,
  y: undefined
};

let frame = 0
function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  raycaster.setFromCamera(mouse, camera)
  frame += 0.01

  const { array, originalPosition, randomValues } = planeMesh.geometry.attributes.position
  for (let i = 0; i < array.length; i += 3) {
    array[i] = 
      originalPosition[i] + Math.cos(frame + randomValues[i]) 
      * 0.016
    array[i + 1] = 
      originalPosition[i + 1] + Math.sin(frame + randomValues[i + 1]) 
      * 0.016
  
  }

  planeMesh.geometry.attributes.position.needsUpdate = true

  const intersects = raycaster.intersectObject(planeMesh)
  if (intersects.length > 0) {
    const { color } = intersects[0].object.geometry.attributes

  const face = intersects[0].face;
    color.setXYZ(face.a, 0.1, 0.5, 1); 
    color.setXYZ(face.b, 0.1, 0.5, 1); 
    color.setXYZ(face.c, 0.1, 0.5, 1);
    
    color.needsUpdate = true;

  const initialColor = {
    r: 0,
    g:  0,
    b:  0.4
  }  
  
  const hoverColor = {
    r: 0.1,
    g:  0.5,
    b:  1
  }
  gsap.to(hoverColor, {
    r: initialColor.r,
    g: initialColor.g,
    b: initialColor.b,
    onUpdate: () => {
      color.setXYZ(face.a, hoverColor.r, hoverColor.g, hoverColor.b)
      color.setXYZ(face.b, hoverColor.r, hoverColor.g, hoverColor.b)
      color.setXYZ(face.c, hoverColor.r, hoverColor.g, hoverColor.b)
      color.needsUpdate = true;
    }
  })

  }
}
animate();

document.addEventListener('mousemove', mouseMove);

function mouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

