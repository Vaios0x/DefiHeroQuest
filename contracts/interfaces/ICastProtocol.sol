// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ICastProtocol {
    // Estructuras
    struct CastContent {
        string contentId;
        string platform;
        uint256 reach;
        uint256 engagement;
        bool isVerified;
    }

    struct AmplificationResult {
        uint256 reach;
        uint256 engagement;
        uint256 viralScore;
        string[] platforms;
    }

    // Eventos
    event ContentAmplified(string contentId, string platform, uint256 reach);
    event ViralContentDetected(string contentId, uint256 viralScore);
    event CrossPlatformShare(string contentId, string[] platforms);

    // Funciones principales
    function amplifyContent(string memory contentId, string memory platform) external returns (uint256);
    function verifyContent(string memory contentId) external view returns (bool);
    function getContentStats(string memory contentId) external view returns (CastContent memory);
    function getAmplificationResult(string memory contentId) external view returns (AmplificationResult memory);
    
    // Funciones de configuración
    function setPlatformWeights(string memory platform, uint256 weight) external;
    function setViralThreshold(uint256 threshold) external;
    function addSupportedPlatform(string memory platform) external;
    
    // Funciones de vista
    function getSupportedPlatforms() external view returns (string[] memory);
    function getPlatformWeight(string memory platform) external view returns (uint256);
    function getViralThreshold() external view returns (uint256);
} 