// main.js
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a cube
const cubeSize = 3;
const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);

// Create an array to hold particles
const particles = [];

// Create a particle geometry and material
const particleGeometry = new THREE.SphereGeometry(0.1, 32, 32);
const particleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

// Function to create particles
function createParticle() {
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);

    // Set a random initial position within the cube
    particle.position.x = (Math.random() - 0.5) * cubeSize;
    particle.position.y = (Math.random() - 0.5) * cubeSize;
    particle.position.z = (Math.random() - 0.5) * cubeSize;

    // Set a random velocity
    particle.velocity = new THREE.Vector3((Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1);

    // Add the particle to the scene
    scene.add(particle);
    particles.push(particle);
}

// Create 100 particles
for (let i = 0; i < 100; i++) {
    createParticle();
}

// Function to animate particles
function animateParticles() {
    particles.forEach((particle) => {
        // Update the particle's position
        particle.position.add(particle.velocity);

        // Bounce off the cube's walls
        if (particle.position.x < -cubeSize / 2 || particle.position.x > cubeSize / 2) {
            particle.velocity.x *= -1;
        }
        if (particle.position.y < -cubeSize / 2 || particle.position.y > cubeSize / 2) {
            particle.velocity.y *= -1;
        }
        if (particle.position.z < -cubeSize / 2 || particle.position.z > cubeSize / 2) {
            particle.velocity.z *= -1;
        }
    });
}

// Render loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the cube
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // Animate particles
    animateParticles();

    renderer.render(scene, camera);
}

animate();
