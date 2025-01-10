import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();
textureLoader.setCrossOrigin('anonymous');

export class Enemy {
    public health: number;
    public damage: number;
    public mesh: THREE.Mesh | null = null;

    constructor(health: number, damage: number)
    {
        this.health = health;
        this.damage = damage;
    }
}

export class EnemyRenderer {
    public enemies: Enemy[] = [];
    public scene: THREE.Scene;
    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.enemies.push(new Enemy(100, 10));
        this.render();
    }
    public render() {
        this.enemies.forEach(enemy => {
            console.log("Rendering enemy");
            const loadedTexture = textureLoader.load("/obunga.webp");
            const geometry = new THREE.PlaneGeometry( 3,3 );
            const material = new THREE.MeshStandardMaterial( {map: loadedTexture, side: THREE.DoubleSide, transparent: true} );
            const plane = new THREE.Mesh( geometry, material );
            plane.position.set(0, 2, 0);
            enemy.mesh = plane;
            this.scene.add( plane );
        });
    }
    public update() {
        const player = this.scene.userData.camera
        this.enemies.forEach(enemy => {
            if (enemy.mesh) {
                enemy.mesh.lookAt(player.position);
                //move to player a bit
                enemy.mesh.position.lerp(player.position, 0.01);
            }
        });
    }
}