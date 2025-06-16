// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./interfaces/ICastProtocol.sol";

/**
 * @title SocialGuildSystem
 * @dev Sistema avanzado de guilds sociales con integración de Cast Protocol
 */
contract SocialGuildSystem is Ownable, ReentrancyGuard {
    // Estructuras
    struct Guild {
        string name;
        address founder;
        uint256 level;
        uint256 totalMembers;
        uint256 socialScore;
        uint256 treasuryBalance;
        bool isActive;
        mapping(address => Member) members;
        mapping(uint256 => Achievement) achievements;
    }

    struct Member {
        uint256 joinedAt;
        uint256 contribution;
        uint256 reputation;
        bool isActive;
        Role role;
    }

    struct Achievement {
        string name;
        string description;
        uint256 rewardPoints;
        bool isUnlocked;
    }

    enum Role { MEMBER, MODERATOR, LEADER }

    // Variables de estado
    mapping(uint256 => Guild) public guilds;
    mapping(address => uint256[]) public userGuilds;
    uint256 public nextGuildId;
    
    ICastProtocol public castProtocol;
    IERC20 public socialToken;
    IERC721 public heroNFT;

    // Eventos
    event GuildCreated(uint256 indexed guildId, string name, address founder);
    event MemberJoined(uint256 indexed guildId, address member);
    event SocialAchievementUnlocked(uint256 indexed guildId, uint256 achievementId);
    event RewardDistributed(uint256 indexed guildId, address member, uint256 amount);
    event CastAmplified(uint256 indexed guildId, string contentId, uint256 reach);

    constructor(
        address _castProtocol,
        address _socialToken,
        address _heroNFT
    ) {
        castProtocol = ICastProtocol(_castProtocol);
        socialToken = IERC20(_socialToken);
        heroNFT = IERC721(_heroNFT);
        nextGuildId = 1;
    }

    // Funciones principales
    function createGuild(
        string memory _name,
        uint256 _initialStake
    ) external nonReentrant {
        require(_initialStake >= 100 * 10**18, "Minimum 100 SOCIAL tokens required");
        require(socialToken.transferFrom(msg.sender, address(this), _initialStake), "Stake transfer failed");

        uint256 guildId = nextGuildId++;
        Guild storage newGuild = guilds[guildId];
        newGuild.name = _name;
        newGuild.founder = msg.sender;
        newGuild.level = 1;
        newGuild.totalMembers = 1;
        newGuild.socialScore = 100;
        newGuild.treasuryBalance = _initialStake;
        newGuild.isActive = true;

        // Configurar fundador como primer miembro
        newGuild.members[msg.sender] = Member({
            joinedAt: block.timestamp,
            contribution: _initialStake,
            reputation: 100,
            isActive: true,
            role: Role.LEADER
        });

        userGuilds[msg.sender].push(guildId);
        emit GuildCreated(guildId, _name, msg.sender);
    }

    function joinGuild(uint256 _guildId) external nonReentrant {
        require(heroNFT.balanceOf(msg.sender) > 0, "Must own a Hero NFT");
        Guild storage guild = guilds[_guildId];
        require(guild.isActive, "Guild not active");
        require(!guild.members[msg.sender].isActive, "Already a member");

        uint256 joinFee = calculateJoinFee(_guildId);
        require(socialToken.transferFrom(msg.sender, address(this), joinFee), "Join fee transfer failed");

        guild.members[msg.sender] = Member({
            joinedAt: block.timestamp,
            contribution: joinFee,
            reputation: 50,
            isActive: true,
            role: Role.MEMBER
        });

        guild.totalMembers++;
        guild.treasuryBalance += joinFee;
        userGuilds[msg.sender].push(_guildId);

        emit MemberJoined(_guildId, msg.sender);
    }

    function amplifyWithCast(
        uint256 _guildId,
        string memory _contentId,
        string memory _platform
    ) external nonReentrant {
        Guild storage guild = guilds[_guildId];
        require(guild.members[msg.sender].isActive, "Not a guild member");
        
        // Integración con Cast Protocol
        uint256 reach = castProtocol.amplifyContent(_contentId, _platform);
        uint256 rewardPoints = calculateAmplificationReward(reach);
        
        guild.members[msg.sender].reputation += rewardPoints;
        guild.socialScore += rewardPoints;

        // Distribuir recompensas
        distributeRewards(_guildId, msg.sender, rewardPoints);
        
        emit CastAmplified(_guildId, _contentId, reach);
    }

    function distributeRewards(
        uint256 _guildId,
        address _member,
        uint256 _points
    ) internal {
        Guild storage guild = guilds[_guildId];
        uint256 rewardAmount = (_points * guild.treasuryBalance) / 10000; // 0.01% por punto
        
        if (rewardAmount > 0 && guild.treasuryBalance >= rewardAmount) {
            guild.treasuryBalance -= rewardAmount;
            require(socialToken.transfer(_member, rewardAmount), "Reward transfer failed");
            emit RewardDistributed(_guildId, _member, rewardAmount);
        }
    }

    // Funciones auxiliares
    function calculateJoinFee(uint256 _guildId) public view returns (uint256) {
        Guild storage guild = guilds[_guildId];
        return (guild.level * 10 * 10**18) + (guild.socialScore * 10**16);
    }

    function calculateAmplificationReward(uint256 _reach) public pure returns (uint256) {
        if (_reach < 1000) return 1;
        if (_reach < 10000) return 5;
        if (_reach < 100000) return 15;
        return 50;
    }

    // Funciones de vista
    function getGuildInfo(uint256 _guildId) external view returns (
        string memory name,
        address founder,
        uint256 level,
        uint256 totalMembers,
        uint256 socialScore,
        uint256 treasuryBalance,
        bool isActive
    ) {
        Guild storage guild = guilds[_guildId];
        return (
            guild.name,
            guild.founder,
            guild.level,
            guild.totalMembers,
            guild.socialScore,
            guild.treasuryBalance,
            guild.isActive
        );
    }

    function getMemberInfo(uint256 _guildId, address _member) external view returns (
        uint256 joinedAt,
        uint256 contribution,
        uint256 reputation,
        bool isActive,
        Role role
    ) {
        Guild storage guild = guilds[_guildId];
        Member memory member = guild.members[_member];
        return (
            member.joinedAt,
            member.contribution,
            member.reputation,
            member.isActive,
            member.role
        );
    }
} 