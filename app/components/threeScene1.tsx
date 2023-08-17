'use client'

import * as THREE from 'three'
import { Box, useBreakpointValue, Container } from "@chakra-ui/react"
import {useEffect, useRef, useState} from 'react';
import throttle from 'lodash/throttle';
import { gsap } from "gsap";


export default function Scene() {

    const containerRef = useRef<HTMLDivElement | null>(null);
    //const breakpointValue = useBreakpointValue({ base: "base", sm: "sm", md: "md", lg: "lg", xl: "xl" } || "base");

    useEffect(()=> {
        if(typeof window !== 'undefined') {

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ antialias: true});

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

            let animationFrameId: number; 

            //------ Stop Render Scene -------
            const stopAnimation = () => {
                cancelAnimationFrame(animationFrameId);
            }

            //------- gsap initial render -----
            const cubeRotate = new THREE.Object3D();
            cubeRotate.add(cube);
            scene.add(cubeRotate);

            // pivot initial render
            const pivot = new THREE.Object3D();
            pivot.add(cubeRotate);
            cubeRotate.position.set(0,0,-2);
            scene.add(pivot);

            // Use GSAP to animate the cube's movement
            gsap.to(cubeRotate.rotation, {
                x: Math.PI * 2,
                y: Math.PI * 2,
                duration: 4, // 4 sec
                ease: "linear",
                repeat: -1,
            })

            //use gsap to animate the pivot's movement
            gsap.to(pivot.rotation, {
                duration: 4,
                repeat: -1,
                ease: "linear",
                y: Math.PI * 2,
            }) 

            //------ Render Scene -------
            let newCubeSize: number;

            const renderScene = () => {
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

                // Update pivotDistance based on the current breakpoint value
                // switch (breakpointValue) {
                //     case "base":
                //         pivotDistance = 0.1;
                //         break;
                //     case "sm":
                //         pivotDistance = 0.5;
                //         break;
                //     case "md":
                //         pivotDistance = 1;
                //         break;
                //     case "lg":
                //         pivotDistance = 2;
                //         break;
                //     case "xl":
                //         pivotDistance = 2.5;
                //         break;
                //     default:
                //         break;
                // }

                // pivot1.position.x = -2.5;
                // pivot2.position.x = 2.5;
                               
                renderer.setSize(newWidth,newHeight);
            }
            

            window.addEventListener('resize', throttle(handleResize, 200));
            handleResize();
            animationFrameId = requestAnimationFrame(renderScene);
        }
    }, [])
    return (
        <Container maxWidth={'100vw'} w={'100vw'} h={'100vh'} centerContent={true}>
            <Box ref={containerRef}/>
        </Container>
    );
}

