'use client'

import * as THREE from 'three'
import { Box, useBreakpointValue, Container } from "@chakra-ui/react"
import {useEffect, useRef, useState} from 'react';
import throttle from 'lodash/throttle';
import { gsap } from "gsap";
import Stats from 'stats.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

export default function Scene() {

    const containerRef = useRef<HTMLDivElement | null>(null);
    //const breakpointValue = useBreakpointValue({ base: "base", sm: "sm", md: "md", lg: "lg", xl: "xl" } || "base");

    useEffect(()=> {
        if(typeof window !== 'undefined') {

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);
            const renderer = new THREE.WebGLRenderer({ antialias: true});

            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setClearColor(0xffffff);
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

            const groundGeometry = new THREE.PlaneGeometry(5,5)
            const groundMaterial = new THREE.MeshLambertMaterial({
                color: 0xffffff
            })
            const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial)
            groundMesh.position.set(0, -2, 0)
            groundMesh.rotation.set(Math.PI / -2, 0, 0)
            scene.add(groundMesh);

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
            console.log(pivot);
            pivot.add(cubeRotate);
            cubeRotate.position.set(0,0,-2);
            scene.add(pivot);

            // Use GSAP to animate the cube's movement
            // gsap.to(cubeRotate.rotation, {
            //     x: Math.PI * 2,
            //     y: Math.PI * 2,
            //     duration: 8,
            //     ease: "linear",
            //     repeat: -1,
            // })

            //use gsap to animate the pivot's movement
            gsap.to(pivot.rotation, {
                duration: 5,
                repeat: -1,
                ease: "linear",
                y: Math.PI * 2,
            }) 

            //------ Orbit Controls -------
            const orbitControls = new OrbitControls(camera, renderer.domElement);

            //------ Stats -------
            const stats = new Stats();
            stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
            document.body.appendChild( stats.dom );

            //------ Orbit Controls -------
            const gui = new GUI();
            const props = {
                cubeSpeed: 0.03
            };
            gui.add(props, 'cubeSpeed', -0.2, 0.2, 0.01)

            //------ Render Scene -------
            let newCubeSize: number;

            const renderScene = () => {
                cube.rotation.x += props.cubeSpeed;
                cube.rotation.y += props.cubeSpeed;

                renderer.render(scene, camera); 
                animationFrameId = requestAnimationFrame(renderScene);
                stats.update();
                orbitControls.update();
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
        <Container maxWidth={'100vw'} w={'100vw'} h={'100vh'} centerContent={true}>
            <Box ref={containerRef}/>
        </Container>
    );
}

