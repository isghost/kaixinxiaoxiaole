/**
 * Level Configuration System - Usage Examples
 * 
 * This file demonstrates how to use the level configuration system
 * in your game controllers and components.
 */

import LevelManager from './Model/LevelManager';
import LevelConfig from './Model/LevelConfig';
import { DEFAULT_LEVELS } from './Model/LevelData';
import GameModel from './Model/GameModel';
import { LevelConfigData, LevelObjectiveType } from './Model/LevelConfig';

/**
 * Example 1: Initialize the level system
 */
function initializeLevelSystem(): void {
    // Get the singleton instance
    const levelManager = LevelManager.getInstance();
    
    // Register all default levels
    levelManager.registerLevels(DEFAULT_LEVELS);
    
    console.log(`Loaded ${levelManager.getTotalLevelCount()} levels`);
}

/**
 * Example 2: Start a game with the current level
 */
function startGame(): GameModel {
    const levelManager = LevelManager.getInstance();
    
    // Get current level configuration
    const currentLevelConfig = levelManager.getCurrentLevelConfig();
    
    if (!currentLevelConfig) {
        throw new Error('No level configuration found');
    }
    
    // Create and initialize game model
    const gameModel = new GameModel();
    gameModel.initWithLevel(currentLevelConfig);
    
    console.log(`Started Level ${currentLevelConfig.getLevel()}: ${currentLevelConfig.getName()}`);
    console.log(`Max Moves: ${currentLevelConfig.getMaxMoves()}`);
    console.log(`Target Score: ${currentLevelConfig.getObjectives()[0].targetScore}`);
    
    return gameModel;
}

/**
 * Example 3: Check game state during gameplay
 */
function checkGameState(gameModel: GameModel): void {
    const score = gameModel.getScore();
    const movesUsed = gameModel.getMovesUsed();
    const remainingMoves = gameModel.getRemainingMoves();
    
    console.log(`Score: ${score}`);
    console.log(`Moves: ${movesUsed} / Remaining: ${remainingMoves}`);
    
    // Check if game is over
    if (gameModel.isGameOver()) {
        const levelComplete = gameModel.checkLevelComplete();
        const stars = gameModel.getStarsEarned();
        
        if (levelComplete) {
            console.log(`🎉 Level Complete! Stars: ${stars}`);
            handleLevelComplete(gameModel);
        } else {
            console.log(`😢 Level Failed. Try again!`);
        }
    }
}

/**
 * Example 4: Handle level completion
 */
function handleLevelComplete(gameModel: GameModel): void {
    const levelManager = LevelManager.getInstance();
    const levelConfig = gameModel.getLevelConfig();
    
    if (!levelConfig) return;
    
    const level = levelConfig.getLevel();
    const score = gameModel.getScore();
    const stars = gameModel.getStarsEarned();
    
    // Save progress
    levelManager.completeLevel(level, score, stars);
    
    console.log(`Level ${level} completed with ${stars} stars!`);
    console.log(`Total stars: ${levelManager.getTotalStars()}`);
}

/**
 * Example 5: Navigate between levels
 */
function navigateLevels(levelManager: LevelManager): void {
    // Go to next level
    if (levelManager.nextLevel()) {
        const nextLevel = levelManager.getCurrentLevelConfig();
        console.log(`Advanced to Level ${nextLevel?.getLevel()}`);
    } else {
        console.log('No more levels available');
    }
    
    // Go to specific level (if unlocked)
    if (levelManager.setCurrentLevel(3)) {
        console.log('Switched to Level 3');
    } else {
        console.log('Level 3 is locked');
    }
    
    // Restart current level
    levelManager.restartLevel();
    console.log('Restarting current level');
}

/**
 * Example 6: Create a custom level
 */
function createCustomLevel(): LevelConfigData {
    const customLevel: LevelConfigData = {
        level: 11,
        name: '自定义挑战',
        maxMoves: 25,
        cellTypeCount: 5,
        allowedCellTypes: [1, 2, 3, 4, 5],
        objectives: [
            {
                type: LevelObjectiveType.SCORE,
                targetScore: 15000
            }
        ],
        starScores: [15000, 20000, 25000]
    };
    
    // Register the custom level
    const levelManager = LevelManager.getInstance();
    levelManager.registerLevel(customLevel);
    
    return customLevel;
}

/**
 * Example 7: Check level progress
 */
function checkLevelProgress(): void {
    const levelManager = LevelManager.getInstance();
    
    // Check progress for a specific level
    const level1Progress = levelManager.getLevelProgress(1);
    if (level1Progress) {
        console.log(`Level 1 - Completed: ${level1Progress.completed}`);
        console.log(`Stars: ${level1Progress.stars}`);
        console.log(`Best Score: ${level1Progress.bestScore}`);
    }
    
    // Check which levels are unlocked
    console.log(`Max Unlocked Level: ${levelManager.getMaxUnlockedLevel()}`);
    
    // Get all levels
    const allLevels = levelManager.getAllLevels();
    console.log(`Available levels: ${allLevels.join(', ')}`);
}

/**
 * Example 8: Display level UI information
 */
function displayLevelUI(gameModel: GameModel): string {
    const levelConfig = gameModel.getLevelConfig();
    
    if (!levelConfig) {
        return 'No level loaded';
    }
    
    const level = levelConfig.getLevel();
    const name = levelConfig.getName();
    const score = gameModel.getScore();
    const remaining = gameModel.getRemainingMoves();
    const stars = gameModel.getStarsEarned();
    
    return `
关卡 ${level}: ${name}
分数: ${score}
剩余步数: ${remaining}
当前星级: ${'⭐'.repeat(stars)}
    `.trim();
}

/**
 * Example 9: Reset all progress (for testing)
 */
function resetAllProgress(): void {
    const levelManager = LevelManager.getInstance();
    levelManager.resetProgress();
    console.log('All progress has been reset');
}

// Export for use in other files
export {
    initializeLevelSystem,
    startGame,
    checkGameState,
    handleLevelComplete,
    navigateLevels,
    createCustomLevel,
    checkLevelProgress,
    displayLevelUI,
    resetAllProgress
};
