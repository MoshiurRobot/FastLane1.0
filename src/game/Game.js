
import * as THREE from 'three';

import Car from '../player/Car.js';
import Controls from '../player/Controls.js';

import FollowCamera from '../camera/FollowCamera.js';

import Road from './Road.js';
import Environment from './Environment.js';
import Traffic from './Traffic.js';

import HUD from '../ui/HUD.js';

export default class Game {

    constructor() {

        // Game state
        this.running = false;

        this.score = 0;
        this.distance = 0;

        this.speed = 18;
        this.baseSpeed = 18;
        this.maxSpeed = 35;

        // Three.js scene
        this.scene = new THREE.Scene();

        this.scene.background = new THREE.Color(0x87ceeb);

        this.scene.fog = new THREE.Fog(
            0x87ceeb, 45, 180
        );

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            65,
            window.innerWidth / window.innerHeight,
            0.1,
            500
        );

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });

        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

        this.renderer.setPixelRatio(
            Math.min(window.devicePixelRatio, 2)
        );

        this.renderer.shadowMap.enabled = true;

        this.renderer.shadowMap.type =
            THREE.PCFSoftShadowMap;

        this.renderer.outputColorSpace =
            THREE.SRGBColorSpace;

        document
            .getElementById('game-container')
            .appendChild(this.renderer.domElement);

        // Lighting
        const ambientLight = new THREE.HemisphereLight(
            0xffffff,
            0x52734d,
            2
        );

        this.scene.add(ambientLight);

        const sunlight = new THREE.DirectionalLight(
            0xffffff,
            2
        );

        sunlight.position.set(-20, 35, 15);

        sunlight.castShadow = true;

        sunlight.shadow.mapSize.set(2048, 2048);

        this.scene.add(sunlight);

        // Game components
        this.road = new Road(this.scene);

        this.environment = new Environment(this.scene);

        this.car = new Car(this.scene);

        this.controls = new Controls(this.car);

        this.followCamera = new FollowCamera(
            this.camera,
            this.car
        );

        this.traffic = new Traffic(this.scene);

        this.hud = new HUD();

        // Time
        this.clock = new THREE.Clock();

        // Start / restart button
        this.hud.button.addEventListener(
            'click',
            () => this.start()
        );

        // Resize
        window.addEventListener(
            'resize',
            () => this.resize()
        );

        this.hud.showStart();

        this.animate();
    }

    start() {

        this.score = 0;
        this.distance = 0;

        this.speed = this.baseSpeed;

        this.running = true;

        this.controls.reset();

        this.car.group.position.x = 0;

        this.car.targetX = 0;
        this.car.x = 0;

        this.traffic.reset();

        this.clock.getDelta();

        this.hud.hide();

        this.hud.update(0, this.speed, 0);
    }

    gameOver() {

        this.running = false;

        this.hud.showGameOver(this.score);
    }

    update(delta) {

        // Gradually increase speed
        this.speed = Math.min(
            this.baseSpeed + this.distance * 0.025,
            this.maxSpeed
        );

        // Calculate distance
        this.distance += this.speed * delta;

        // Update game objects
        this.car.update(delta);

        this.road.update(delta, this.speed);

        this.environment.update(delta, this.speed);

        this.traffic.update(delta, this.speed);

        // Collision and score detection
        for (const trafficCar of this.traffic.cars) {

            const dx = Math.abs(
                this.car.group.position.x -
                trafficCar.group.position.x
            );

            const dz = Math.abs(
                this.car.group.position.z -
                trafficCar.group.position.z
            );

            // Collision detection
            if (dx < 1.6 && dz < 2.5) {

                this.gameOver();

                return;
            }

            // Passed opponent car
            if (
                !trafficCar.passed &&
                trafficCar.group.position.z > 8
            ) {

                trafficCar.passed = true;

                this.score += 100;
            }
        }

        // Update interface
        this.hud.update(
            this.score,
            this.speed,
            this.distance
        );
    }

    animate() {

        requestAnimationFrame(
            () => this.animate()
        );

        // Limit large frame gaps
        const delta = Math.min(
            this.clock.getDelta(),
            0.05
        );

        if (this.running) {
            this.update(delta);
        }

        // Camera follows the car
        this.followCamera.update(delta);

        // Render
        this.renderer.render(
            this.scene,
            this.camera
        );
    }

    resize() {

        this.camera.aspect =
            window.innerWidth / window.innerHeight;

        this.camera.updateProjectionMatrix();

        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

        this.renderer.setPixelRatio(
            Math.min(window.devicePixelRatio, 2)
        );
    }
}
