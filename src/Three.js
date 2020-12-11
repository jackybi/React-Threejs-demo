import React, { Component } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import  './index.css'
import UI from "./UI";

class Three extends Component {

    componentDidMount() {
        this.cubes = new Array(100).fill(0)
            .map(() => new Array(100).fill(0)
                .map(() => new Array(100).fill(0)))
        this.init()
        this.animate()

    }

    init = () => {
        const scene = new THREE.Scene()
        this.scene =scene
        const camera = new THREE.PerspectiveCamera(60,this.mount.clientWidth/this.mount.clientHeight,0.1, 1000);
        this.camera = camera
        camera.position.z = 100
        camera.position.x = 50
        camera.position.y = 50
        camera.lookAt(scene.position)

        const renderer = new THREE.WebGLRenderer({antialias:true})

        const spotLight = new THREE.SpotLight( 0xffffff, 6 );
        this.spotLight = spotLight
        spotLight.position.set( 100, 100, 100 );
        spotLight.angle = 1;
        spotLight.penumbra = 0.1;
        spotLight.decay = 1;
        spotLight.distance = 200;

        scene.add( spotLight );

        const spotLight2 = spotLight.clone()
        spotLight2.position.set( -100, 100, -100 );
        scene.add(spotLight2)
        // const spotLight3 = spotLight.clone()
        // spotLight3.position.set( 100, -100, -100 );
        // scene.add(spotLight3)
        // const spotLight4 = spotLight.clone()
        // spotLight4.position.set( -100, -100, 100 );
        // scene.add(spotLight4)
        this.renderer = renderer
        renderer.setSize(this.mount.clientWidth,this.mount.clientHeight)
        this.mount.appendChild(renderer.domElement)

        const addAxis = (x,y,z,color=0x0000ff) => {
            const points = []
            points.push(new THREE.Vector3(-x,-y,-z))
            points.push(new THREE.Vector3(x,y,z))
            const geometry = new THREE.BufferGeometry().setFromPoints(points)
            const material = new THREE.LineBasicMaterial({color: color})
            const line = new THREE.Line(geometry,material)
            this.scene.add(line)
            return points
        }
        addAxis(200,0,0,0xff0000)
        addAxis(0,200,0,0x00ff00)
        addAxis(0,0,200,0x0000ff)
        this.addCube(0,0,0)
        this.addCube(1,0,0)
        this.addCube(1,1,0)
        this.addCube(1,1,1)
        window.addEventListener('resize', this.onWindowResize, false);
        document.addEventListener('click', this.onClick, false);
        document.addEventListener('contextmenu', this.onRightClick, false);
        this.controls = new OrbitControls( camera, renderer.domElement);
        this.controls.update();
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
    }

    getClickedBox = (mouse) => {
        this.mouse.x = (mouse.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(mouse.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children);
        if (intersects.length > 0)
            for (let i = 0; i < intersects.length; i++) {
                if (intersects[i].object instanceof THREE.Mesh) {
                    return intersects[i]
                }
            }
        else return null
    }

    isBoxExist = (x,y,z) => {
        return !!this.scene.getObjectByName(x + "-" + y + "-" + z)
    }

    onClick = (e) => {
        e.preventDefault()
        const clickedBox = this.getClickedBox(e)

        if(clickedBox) {
            const clickedPoint = clickedBox.point
            const [clickX, clickY, clickZ] =
                [Math.floor((clickedPoint.x + 0.000001) / 10)
                    , Math.floor((clickedPoint.y + 0.000001) / 10)
                    , Math.floor((clickedPoint.z + 0.000001) / 10)]
            if (Math.abs(clickedPoint.x - Math.floor((clickedPoint.x + 9.999999) / 10) * 10) < 0.000001) {
                if (!this.isBoxExist(clickX - 1,clickY,clickZ)) {
                    this.addCube(clickX - 1, clickY, clickZ)
                } else if (!this.isBoxExist(clickX,clickY,clickZ)) {
                    this.addCube(clickX, clickY, clickZ)
                }
            } else if (Math.abs(clickedPoint.y - Math.floor((clickedPoint.y + 9.999999) / 10) * 10) < 0.000001) {
                if (!this.isBoxExist(clickX,clickY - 1,clickZ)) {
                    this.addCube(clickX, clickY - 1, clickZ)
                } else if (!this.isBoxExist(clickX,clickY,clickZ)) {
                    this.addCube(clickX, clickY, clickZ)
                }
            } else if (Math.abs(clickedPoint.z - Math.floor((clickedPoint.z + 9.999999) / 10) * 10) < 0.000001) {
                if (!this.isBoxExist(clickX,clickY,clickZ - 1)) {
                    this.addCube(clickX, clickY, clickZ - 1)
                } else if (!this.isBoxExist(clickX,clickY,clickZ)) {
                    this.addCube(clickX, clickY, clickZ)
                }
            }
        }
    }

    onRightClick = (e) => {
        e.preventDefault()
        const clickedBox = this.getClickedBox(e)
        if(clickedBox && clickedBox.object.name !== "0-0-0"){
            this.scene.remove(clickedBox.object)
        }
    }

    getRandomColor = () => {
        const colors = [0x393d3f,0xfdfdff,0xc6c5b9,0x62929e,0x546a7b,0xca7df9,0x048ba8]
        return colors[Math.floor(Math.random()*7)];
    }

    addCube = (x=0,y=0,z=0) => {
        if(this.isBoxExist(x,y,z)){
            return
        }
        const geometry = new THREE.BoxGeometry( 10, 10, 10, 4 );
        const material = new THREE.MeshPhongMaterial( { color: this.getRandomColor(), dithering: true } );
        const cube = new THREE.Mesh( geometry, material );
        cube.name = x+"-"+y+"-"+z

        cube.position.x = x * 10 +5
        cube.position.y = y * 10 +5
        cube.position.z = z * 10 +5
        cube.receiveShadow = true;
        this.cube = cube
        this.scene.add( cube );

    }

    animate =() => {
        requestAnimationFrame( this.animate );
        this.controls.update()

        this.renderer.render( this.scene, this.camera );
    }

    onWindowResize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onWindowResize)
        document.removeEventListener("click", this.onClick)
        document.removeEventListener('dblclick', this.onRightClick);
        this.mount.removeChild(this.renderer.domElement)
    }

    render() {
        return (
            <div
                id= "canvas"
                style={{ width: '100%', height: '100vh',background:'#888' }}
                ref={(mount) => { this.mount = mount }}
            >

            </div>
        );
    }
}

export default Three;