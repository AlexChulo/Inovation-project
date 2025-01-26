import * as THREE from 'three';
import { World } from './world';
import { updateStatus } from './utils';

export class CombatManager {
  /**
   * Main combat loop
   * @param {World} world 
   */
  async takeTurns(world) {
    while (true) {
      for (const player of world.players.children) {
        if (player.isDead) continue;
  
        // Wait for the model to load
        await player.modelReady;
  
        // Highlight the player
        player.mesh.traverse(child => {
          if (child.isMesh) {
            child.material.color.set(0xffff00); // Yellow
          }
        });
  
        updateStatus(`Waiting for ${player.name} to select an action`);
  
        let actionPerformed = false;
        do {
          const action = await player.requestAction();
          const result = await action.canPerform(world);
          if (result.value) {
            await action.perform(world);
            actionPerformed = true;
          } else {
            updateStatus(result.reason);
          }
        } while (!actionPerformed);
  
        // Reset the player's color
        player.mesh.traverse(child => {
          if (child.isMesh) {
            child.material.color.set(0x4040c0); // Blue
          }
        });
      }
    }
  }
}