// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./SocialGuildSystem.sol";

contract SocialAchievementNFT is ERC721Enumerable, ERC721URIStorage, ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;

    // Estructuras
    struct Achievement {
        string name;
        string description;
        uint256 rarity;
        uint256 socialScore;
        bool isSpecial;
        mapping(address => bool) claimed;
    }

    struct NFTMetadata {
        string name;
        string description;
        string image;
        uint256 rarity;
        uint256 socialScore;
        uint256 achievementId;
        uint256 mintedAt;
        address owner;
    }

    // Variables de estado
    Counters.Counter private _tokenIds;
    mapping(uint256 => Achievement) public achievements;
    mapping(uint256 => NFTMetadata) public nftMetadata;
    mapping(address => uint256[]) public userAchievements;
    
    SocialGuildSystem public guildSystem;
    uint256 public nextAchievementId;
    
    // Eventos
    event AchievementCreated(uint256 indexed achievementId, string name, uint256 rarity);
    event AchievementUnlocked(address indexed user, uint256 indexed achievementId, uint256 tokenId);
    event SpecialNFTMinted(address indexed user, uint256 indexed tokenId, string name);

    // Modificadores
    modifier achievementExists(uint256 achievementId) {
        require(bytes(achievements[achievementId].name).length > 0, "Achievement does not exist");
        _;
    }

    constructor(address _guildSystem) ERC721("Social Achievement NFT", "SANFT") {
        guildSystem = SocialGuildSystem(_guildSystem);
        nextAchievementId = 1;
        
        // Inicializar logros predeterminados
        _createDefaultAchievements();
    }

    function _createDefaultAchievements() private {
        _createAchievement("Social Pioneer", "First to join a guild", 1, 100, false);
        _createAchievement("Viral Sensation", "Content reached 100k+ amplification", 2, 250, false);
        _createAchievement("Community Leader", "Led a guild to level 10", 3, 500, true);
        _createAchievement("DeFi Influencer", "1M+ total social reach", 4, 1000, true);
    }

    function createAchievement(
        string memory name,
        string memory description,
        uint256 rarity,
        uint256 socialScore,
        bool isSpecial
    ) external onlyOwner {
        _createAchievement(name, description, rarity, socialScore, isSpecial);
    }

    function _createAchievement(
        string memory name,
        string memory description,
        uint256 rarity,
        uint256 socialScore,
        bool isSpecial
    ) private {
        uint256 achievementId = nextAchievementId++;
        Achievement storage newAchievement = achievements[achievementId];
        newAchievement.name = name;
        newAchievement.description = description;
        newAchievement.rarity = rarity;
        newAchievement.socialScore = socialScore;
        newAchievement.isSpecial = isSpecial;

        emit AchievementCreated(achievementId, name, rarity);
    }

    function unlockAchievement(
        uint256 achievementId,
        address user
    ) external achievementExists(achievementId) nonReentrant {
        require(msg.sender == address(guildSystem), "Only guild system can unlock achievements");
        require(!achievements[achievementId].claimed[user], "Achievement already claimed");

        Achievement storage achievement = achievements[achievementId];
        achievement.claimed[user] = true;

        // Mint NFT
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(user, newTokenId);

        // Generar metadata
        string memory tokenURI = generateTokenURI(achievementId, newTokenId, user);
        _setTokenURI(newTokenId, tokenURI);

        // Almacenar metadata
        nftMetadata[newTokenId] = NFTMetadata({
            name: achievement.name,
            description: achievement.description,
            image: string(abi.encodePacked("https://api.defiheroquest.com/nft/", newTokenId.toString())),
            rarity: achievement.rarity,
            socialScore: achievement.socialScore,
            achievementId: achievementId,
            mintedAt: block.timestamp,
            owner: user
        });

        userAchievements[user].push(achievementId);
        emit AchievementUnlocked(user, achievementId, newTokenId);

        if (achievement.isSpecial) {
            emit SpecialNFTMinted(user, newTokenId, achievement.name);
        }
    }

    function generateTokenURI(
        uint256 achievementId,
        uint256 tokenId,
        address user
    ) internal view returns (string memory) {
        // Aquí implementarías la lógica para generar el URI dinámicamente
        // Podrías usar un servicio como IPFS o tu propio API
        return string(abi.encodePacked(
            "https://api.defiheroquest.com/nft/metadata/",
            tokenId.toString()
        ));
    }

    // Override funciones necesarias
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // Funciones de vista
    function getAchievementInfo(
        uint256 achievementId
    ) external view returns (
        string memory name,
        string memory description,
        uint256 rarity,
        uint256 socialScore,
        bool isSpecial
    ) {
        Achievement storage achievement = achievements[achievementId];
        return (
            achievement.name,
            achievement.description,
            achievement.rarity,
            achievement.socialScore,
            achievement.isSpecial
        );
    }

    function getUserAchievements(
        address user
    ) external view returns (uint256[] memory) {
        return userAchievements[user];
    }

    function hasAchievement(
        address user,
        uint256 achievementId
    ) external view returns (bool) {
        return achievements[achievementId].claimed[user];
    }
} 