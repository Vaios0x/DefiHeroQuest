// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./interfaces/IHeroNFT.sol";

contract BattleSystem is Ownable, ReentrancyGuard {
    IHeroNFT public heroNFT;
    
    struct Battle {
        address challenger;
        address opponent;
        uint256 challengerHeroId;
        uint256 opponentHeroId;
        uint256 stake;
        uint256 timestamp;
        bool isActive;
        bool isCompleted;
        address winner;
    }

    struct BattleResult {
        uint256 challengerScore;
        uint256 opponentScore;
        string battleLog;
    }

    mapping(uint256 => Battle) public battles;
    mapping(uint256 => BattleResult) public battleResults;
    uint256 public nextBattleId;
    uint256 public minStake = 0.01 ether;
    uint256 public battleTimeout = 24 hours;

    event BattleCreated(uint256 battleId, address challenger, address opponent, uint256 stake);
    event BattleAccepted(uint256 battleId, address opponent);
    event BattleCompleted(uint256 battleId, address winner, uint256 reward);
    event BattleCancelled(uint256 battleId);

    constructor(address _heroNFT) {
        heroNFT = IHeroNFT(_heroNFT);
    }

    function createBattle(uint256 _challengerHeroId, address _opponent, uint256 _opponentHeroId) external payable {
        require(msg.value >= minStake, "Stake too low");
        require(heroNFT.ownerOf(_challengerHeroId) == msg.sender, "Not hero owner");
        require(heroNFT.ownerOf(_opponentHeroId) == _opponent, "Invalid opponent hero");

        battles[nextBattleId] = Battle({
            challenger: msg.sender,
            opponent: _opponent,
            challengerHeroId: _challengerHeroId,
            opponentHeroId: _opponentHeroId,
            stake: msg.value,
            timestamp: block.timestamp,
            isActive: true,
            isCompleted: false,
            winner: address(0)
        });

        emit BattleCreated(nextBattleId, msg.sender, _opponent, msg.value);
        nextBattleId++;
    }

    function acceptBattle(uint256 _battleId) external payable nonReentrant {
        Battle storage battle = battles[_battleId];
        require(battle.isActive, "Battle not active");
        require(!battle.isCompleted, "Battle completed");
        require(msg.sender == battle.opponent, "Not opponent");
        require(msg.value == battle.stake, "Wrong stake amount");

        emit BattleAccepted(_battleId, msg.sender);
        _executeBattle(_battleId);
    }

    function _executeBattle(uint256 _battleId) private {
        Battle storage battle = battles[_battleId];
        
        // Get hero stats
        (uint256 cAtk, uint256 cDef, uint256 cMag) = heroNFT.getHeroStats(battle.challengerHeroId);
        (uint256 oAtk, uint256 oDef, uint256 oMag) = heroNFT.getHeroStats(battle.opponentHeroId);

        // Calculate battle scores using stats and randomness
        uint256 challengerScore = _calculateBattleScore(cAtk, cDef, cMag);
        uint256 opponentScore = _calculateBattleScore(oAtk, oDef, oMag);

        // Determine winner
        address winner;
        if (challengerScore > opponentScore) {
            winner = battle.challenger;
        } else if (opponentScore > challengerScore) {
            winner = battle.opponent;
        } else {
            // In case of a tie, use block hash for randomness
            winner = uint256(blockhash(block.number - 1)) % 2 == 0 ? battle.challenger : battle.opponent;
        }

        // Record battle result
        battleResults[_battleId] = BattleResult({
            challengerScore: challengerScore,
            opponentScore: opponentScore,
            battleLog: _generateBattleLog(battle.challengerHeroId, battle.opponentHeroId, challengerScore, opponentScore)
        });

        // Update battle state
        battle.isCompleted = true;
        battle.winner = winner;

        // Transfer rewards
        uint256 reward = battle.stake * 2;
        (bool success, ) = winner.call{value: reward}("");
        require(success, "Reward transfer failed");

        // Emit completion event
        emit BattleCompleted(_battleId, winner, reward);
    }

    function _calculateBattleScore(uint256 atk, uint256 def, uint256 mag) private view returns (uint256) {
        uint256 baseScore = (atk * 2 + def + mag * 3);
        uint256 randomFactor = uint256(blockhash(block.number - 1)) % 20;
        return baseScore + randomFactor;
    }

    function _generateBattleLog(uint256 heroId1, uint256 heroId2, uint256 score1, uint256 score2) 
        private pure returns (string memory) {
        return string(abi.encodePacked(
            "Hero #", _toString(heroId1), " (", _toString(score1), ") vs ",
            "Hero #", _toString(heroId2), " (", _toString(score2), ")"
        ));
    }

    function _toString(uint256 value) private pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    function cancelBattle(uint256 _battleId) external nonReentrant {
        Battle storage battle = battles[_battleId];
        require(battle.isActive, "Battle not active");
        require(!battle.isCompleted, "Battle completed");
        require(
            msg.sender == battle.challenger || 
            block.timestamp > battle.timestamp + battleTimeout,
            "Not authorized"
        );

        battle.isActive = false;
        (bool success, ) = battle.challenger.call{value: battle.stake}("");
        require(success, "Refund failed");

        emit BattleCancelled(_battleId);
    }

    function setMinStake(uint256 _minStake) external onlyOwner {
        minStake = _minStake;
    }

    function setBattleTimeout(uint256 _timeout) external onlyOwner {
        battleTimeout = _timeout;
    }
} 