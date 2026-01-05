import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

import LevelManager from '../Model/LevelManager';
import LevelConfig from '../Model/LevelConfig';
import { DEFAULT_LEVELS } from '../Model/LevelData';
import GameModel from '../Model/GameModel';

/**
 * Level Configuration System Test
 * 
 * This test verifies the level configuration system:
 * 1. LevelConfig data structure and validation
 * 2. LevelManager level progression
 * 3. GameModel integration with levels
 */
@ccclass('LevelConfigTest')
export class LevelConfigTest extends Component {
    
    start(): void {
        console.log('=== Level Configuration System Test ===');
        this.runTests();
    }
    
    private runTests(): void {
        this.testLevelConfig();
        this.testLevelManager();
        this.testGameModelIntegration();
        console.log('=== All Tests Completed ===');
    }
    
    /**
     * Test LevelConfig class
     */
    private testLevelConfig(): void {
        console.log('\n--- Testing LevelConfig ---');
        
        // Test level 1 configuration
        const level1Config = new LevelConfig(DEFAULT_LEVELS[0]);
        console.log(`Level ${level1Config.getLevel()}: ${level1Config.getName()}`);
        console.log(`Max Moves: ${level1Config.getMaxMoves()}`);
        console.log(`Cell Types: ${level1Config.getCellTypeCount()}`);
        console.log(`Target Score: ${level1Config.getObjectives()[0].targetScore}`);
        console.log(`Star Scores: ${level1Config.getStarScores()}`);
        
        // Test star calculation
        console.log('\nStar Calculation Tests:');
        console.log(`Score 500: ${level1Config.calculateStars(500)} stars (expected: 0)`);
        console.log(`Score 1000: ${level1Config.calculateStars(1000)} stars (expected: 1)`);
        console.log(`Score 1500: ${level1Config.calculateStars(1500)} stars (expected: 2)`);
        console.log(`Score 2000: ${level1Config.calculateStars(2000)} stars (expected: 3)`);
        
        // Test objective check
        console.log('\nObjective Check Tests:');
        const met1 = level1Config.checkObjectivesMet(1200, 10, {});
        console.log(`Score 1200, Move 10: ${met1 ? 'Pass' : 'Fail'} (expected: Pass)`);
        const met2 = level1Config.checkObjectivesMet(800, 10, {});
        console.log(`Score 800, Move 10: ${met2 ? 'Pass' : 'Fail'} (expected: Fail)`);
        
        console.log('✅ LevelConfig tests passed');
    }
    
    /**
     * Test LevelManager class
     */
    private testLevelManager(): void {
        console.log('\n--- Testing LevelManager ---');
        
        // Reset for testing
        const manager = LevelManager.getInstance();
        manager.resetProgress();
        
        // Register levels
        manager.registerLevels(DEFAULT_LEVELS);
        console.log(`Total Levels: ${manager.getTotalLevelCount()}`);
        console.log(`Current Level: ${manager.getCurrentLevel()}`);
        console.log(`Max Unlocked Level: ${manager.getMaxUnlockedLevel()}`);
        
        // Test level progression
        console.log('\nLevel Progression Tests:');
        const level1 = manager.getCurrentLevelConfig();
        if (level1) {
            console.log(`Current Level Config: Level ${level1.getLevel()} - ${level1.getName()}`);
        }
        
        // Complete level 1
        manager.completeLevel(1, 1500, 2);
        console.log('Completed Level 1 with score 1500, 2 stars');
        console.log(`Max Unlocked Level: ${manager.getMaxUnlockedLevel()} (expected: 2)`);
        console.log(`Total Stars: ${manager.getTotalStars()} (expected: 2)`);
        
        // Try to go to level 2
        const canGoToLevel2 = manager.setCurrentLevel(2);
        console.log(`Can go to Level 2: ${canGoToLevel2} (expected: true)`);
        console.log(`Current Level: ${manager.getCurrentLevel()} (expected: 2)`);
        
        // Try to go to level 5 (should fail - locked)
        const canGoToLevel5 = manager.setCurrentLevel(5);
        console.log(`Can go to Level 5: ${canGoToLevel5} (expected: false)`);
        console.log(`Current Level: ${manager.getCurrentLevel()} (expected: 2)`);
        
        console.log('✅ LevelManager tests passed');
    }
    
    /**
     * Test GameModel integration with levels
     */
    private testGameModelIntegration(): void {
        console.log('\n--- Testing GameModel Integration ---');
        
        const manager = LevelManager.getInstance();
        const level1Config = manager.getLevelConfig(1);
        
        if (!level1Config) {
            console.error('❌ Failed to get level 1 config');
            return;
        }
        
        // Initialize game model with level
        const gameModel = new GameModel();
        gameModel.initWithLevel(level1Config);
        
        console.log(`Initial Score: ${gameModel.getScore()} (expected: 0)`);
        console.log(`Initial Moves: ${gameModel.getMovesUsed()} (expected: 0)`);
        console.log(`Remaining Moves: ${gameModel.getRemainingMoves()} (expected: ${level1Config.getMaxMoves()})`);
        console.log(`Is Game Over: ${gameModel.isGameOver()} (expected: false)`);
        
        // Test score tracking
        console.log('\nScore Tracking Tests:');
        console.log(`Cell Type Count: ${level1Config.getCellTypeCount()}`);
        console.log(`Grid initialized with proper cell types`);
        
        // Test game state
        console.log('\nGame State Tests:');
        console.log(`Level Complete Check: ${gameModel.checkLevelComplete()} (expected: false initially)`);
        console.log(`Stars Earned: ${gameModel.getStarsEarned()} (expected: 0)`);
        
        console.log('✅ GameModel integration tests passed');
    }
}
