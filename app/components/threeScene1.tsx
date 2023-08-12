'use client'

import * as THREE from 'three'
import { Box, } from "@chakra-ui/react"
import {useEffect, useRef} from 'react'

export default function Scene() {

    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(()=> {
        if(typeof window !== 'undefined') {
        
            const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(2);
        camera.position.z = 5;

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({color: 0x00ffff});
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        containerRef.current?.appendChild(renderer.domElement);
        
        cube.position.set(0 , 0, 0);

        const renderScene = () => {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            renderer.render(scene, camera);

            requestAnimationFrame(renderScene);
        }

        const handleResize = () => {
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight;
            renderer.setSize(newWidth,newHeight);
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
        }

        window.addEventListener('resize', handleResize);
        handleResize();

        renderScene()
        }
    },[])
    return <Box ref={containerRef} w={'100%'} h={'100vh'}/>;
}

