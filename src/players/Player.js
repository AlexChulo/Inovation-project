import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GameObject } from '../objects/GameObject';
import { Action, MeleeAttackAction, MovementAction, RangedAttackAction, WaitAction } from '../actions';

/**
 * Base player class that human and computer players derive from
 */
export class Player extends GameObject {
  name = 'Player';

  /**
   * Instantiates a new instance of the player
   * @param {THREE.Vector3} coords
   */
  constructor(coords) {
    const loader = new GLTFLoader();

    // Placeholder geometry while the model is loading
    const placeholderGeometry = new THREE.CapsuleGeometry(0.2 , 0.8, 2, 16, 1);
    const invisibleMaterial = new THREE.MeshStandardMaterial({
      color: 0x4040c0,
      opacity: 0,
      transparent: true // This ensures the material is invisible but the mesh is still there
    });
    const placeholderMesh = new THREE.Mesh(placeholderGeometry, invisibleMaterial);
    placeholderMesh.position.set(0.5, 0.5, 0.5);

    super(coords, placeholderMesh); // Use placeholder initially

    this.healthOverlay.visible = true;

    // Load the actual 3D model
    loader.load(
      './models/guard.glb',
      (gltf) => {
        // Remove the placeholder and add the actual model
        this.mesh.remove(placeholderMesh);
        const model = gltf.scene;
        model.position.set(0, -0.5, 0);
        model.scale.set(0.5, 0.5, 0.5);
        model.rotation.set(0, 0, 0);
        this.mesh.add(model);
        resolve();
      },
      (xhr) => {
        console.log(`Model loading: ${Math.round((xhr.loaded / xhr.total) * 100)}% complete`);
      },
      (error) => {
        console.error('An error occurred while loading the model:', error);
      }
    );

    this.moveTo(coords);
  }

  /**
   * @returns {Action[]}
   */
  getActions() {
    return [
      new MovementAction(this),
      new MeleeAttackAction(this),
      new RangedAttackAction(this),
      new WaitAction()
    ];
  }

  /**
   * Wait for the player to choose a target square
   * @returns {Promise<Vector3 | null>}
   */
  async getTargetSquare() {
    return null;
  }

  /**
   * Wait for the player to choose a target GameObject
   * @returns {Promise<GameObject | null>}
   */
  async getTargetObject() {
    return null;
  }

  /**
   * Wait for the player to select an action to perform
   * @returns {Promise<Action | null>}
   */
  async requestAction() {
    return null;
  }
}
