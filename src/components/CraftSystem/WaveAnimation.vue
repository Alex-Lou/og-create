<template>
    <div ref="animationContainer" class="wave-animation"></div>
  </template>

  <script>
  import * as THREE from "three";

  export default {
    name: "WaveAnimation",
    mounted() {
      this.initWaveAnimation();
    },
    methods: {
      initWaveAnimation() {
        const SEPARATION = 40, AMOUNTX = 130, AMOUNTY = 35;

        let count = 0;

        const container = this.$refs.animationContainer;

        // Scene, Camera, Renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
          120,
          container.offsetWidth / container.offsetHeight,
          1,
          10000
        );
        camera.position.y = 150;
        camera.position.z = 300;
        camera.rotation.x = 0.35;

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        container.appendChild(renderer.domElement);

        // Create Particles
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = AMOUNTX * AMOUNTY;
        const positions = new Float32Array(particleCount * 3); // x, y, z for each particle

        let index = 0;
        for (let ix = 0; ix < AMOUNTX; ix++) {
          for (let iy = 0; iy < AMOUNTY; iy++) {
            positions[index++] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2; // x
            positions[index++] = 0; // y
            positions[index++] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2; // z
          }
        }

        particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        const particleMaterial = new THREE.PointsMaterial({
          color: 0x939393,
          size: 2, // Reduced size of particles
          opacity: 0.15, // Almost fully transparent particles
          transparent: true, // Enable transparency
        });

        const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particleSystem);

        // Handle Window Resize
        const onWindowResize = () => {
          camera.aspect = container.offsetWidth / container.offsetHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(container.offsetWidth, container.offsetHeight);
        };
        window.addEventListener("resize", onWindowResize, false);

        // Animate Particles
        const animate = () => {
          requestAnimationFrame(animate);

          const positions = particleGeometry.attributes.position.array;

          let i = 0;
          for (let ix = 0; ix < AMOUNTX; ix++) {
            for (let iy = 0; iy < AMOUNTY; iy++) {
              positions[i + 1] = // y position
                Math.sin((ix + count) * 0.1) * 10 + // Smaller amplitude
                Math.sin((iy + count) * 0.15) * 10; // Smaller amplitude
              i += 3; // Jump to next particle (x, y, z)
            }
          }

          particleGeometry.attributes.position.needsUpdate = true; // Notify Three.js of changes
          renderer.render(scene, camera);
          count += 0.03; // Slower movement
        };
        animate();
      },
    },
  };
  </script>

  <style scoped>
  .wave-animation {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
  }
  </style>