'use client'

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeScene = () => {
  const scene = useRef(new THREE.Scene());
  const camera = useRef(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
  const renderer = useRef(new THREE.WebGLRenderer());

  useEffect(() => {
    // Set up renderer
    renderer.current.setSize(window.innerWidth, window.innerHeight);
    const appElement = document.getElementById('app');
  if (appElement) {
    appElement.appendChild(renderer.current.domElement);
  }

    // Create a cube object and add it to the scene
    const cube = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100), new THREE.MeshBasicMaterial({ color: 0x0000ff }));
    scene.current.add(cube);

    // Set the camera position
    camera.current.position.z = 500;

    // Render the scene
    renderer.current.render(scene.current, camera.current);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate the cube
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      // Render the updated scene
      renderer.current.render(scene.current, camera.current);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      camera.current.aspect = newWidth / newHeight;
      camera.current.updateProjectionMatrix();
      renderer.current.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Clean up event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
      <div id="app" />
    </div>
  );
};

export default ThreeScene;
