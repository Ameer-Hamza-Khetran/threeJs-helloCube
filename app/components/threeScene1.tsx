'use client'

import * as THREE from 'three'
import { Box, useBreakpointValue, Container } from "@chakra-ui/react"
import {useEffect, useRef, useState} from 'react';
import throttle from 'lodash/throttle';
import { gsap } from "gsap";


export default function Scene() {

    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(()=> {
        if(typeof window !== 'undefined') {

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ antialias: true});

            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            camera.position.z = 5;

            const geometry = new THREE.BoxGeometry();
            const material = new THREE.MeshBasicMaterial({color: 0x00ffff});
            const cube = new THREE.Mesh(geometry, material);
            scene.add(cube);

            containerRef.current?.appendChild(renderer.domElement);
            
            cube.position.set(0 , 0, 0);

            let animationFrameId: number; 

            //------ Stop Render Scene -------
            const stopAnimation = () => {
                cancelAnimationFrame(animationFrameId);
            }

            //------- gsap initial render -----
     
      
            // Use GSAP to animate the cube's movement
            

            //------ Render Scene -------
            let newCubeSize: number;

            const renderScene = () => {
                cube.rotation.x += 0.01;
                cube.rotation.y += 0.01;
                console.log(`Cube Size: ${newCubeSize}`)

                renderer.render(scene, camera); 
                animationFrameId = requestAnimationFrame(renderScene);
            }
            
            //------ Resizing function that will run on window resize --------
            
            const handleResize = () => {
                const newWidth = window.innerWidth;
                const newHeight = window.innerHeight;
                camera.aspect = newWidth / newHeight;
                camera.updateProjectionMatrix();
                
                newCubeSize = Math.max(0.3, Math.min(1, newWidth / 1000));
                cube.scale.set(newCubeSize, newCubeSize, newCubeSize);
                               
                renderer.setSize(newWidth,newHeight);
            }
            

            window.addEventListener('resize', throttle(handleResize, 200));
            handleResize();
            animationFrameId = requestAnimationFrame(renderScene);
        }
    }, [])
    return (
        <Container maxWidth={'full'} w={'full'} h={'100vh'} centerContent={true}>
            <Box ref={containerRef}/>
        </Container>
    );
}

