'use client'

import * as THREE from 'three'
import { Box, useBreakpointValue} from "@chakra-ui/react"
import {useEffect, useRef} from 'react'

export default function Scene() {

    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(()=> {
        if(typeof window !== 'undefined') {

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer();

            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            camera.position.z = 5;

            const geometry = new THREE.BoxGeometry();
            const material = new THREE.MeshPhongMaterial({color: 0x00ffff});
            const cube = new THREE.Mesh(geometry, material);
            scene.add(cube);

            const color = 0xFFFFFF;
            const intensity = 3;
            const light = new THREE.DirectionalLight(color, intensity);
            light.position.set(-1, 2, 4);
            scene.add(light);

            containerRef.current?.appendChild(renderer.domElement);
            
            cube.position.set(0 , 0, 0);

            //------ Render Scene -------
            const renderScene = () => {
                cube.rotation.x += 0.01;
                cube.rotation.y += 0.01;

                // if(cube.position.x < 2) {
                //     cube.position.x += 0.02
                // }
                renderer.render(scene, camera);

                requestAnimationFrame(renderScene);
            }

            //------ Resizing function that will run on window resize --------
            const handleResize = () => {
                const newWidth = window.innerWidth;
                const newHeight = window.innerHeight;
                camera.aspect = newWidth / newHeight;
                camera.updateProjectionMatrix();

                const newCubeSize = Math.max(0.3, Math.min(1, newWidth / 1000));
                cube.scale.set(newCubeSize, newCubeSize, newCubeSize);
                console.log(`new size: ${newCubeSize}`)

                renderer.setSize(newWidth,newHeight);

            }

            window.addEventListener('resize', handleResize);
            handleResize();

            renderScene()
        }
    },[])
    return <Box ref={containerRef} w={'100%'} h={'100vh'} m={'0'}/>;
}

