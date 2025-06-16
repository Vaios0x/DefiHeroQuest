import cron from 'node-cron';

interface PortfolioData {
  userId: string;
  totalValue: number;
  positions: Array<{
    protocol: string;
    asset: string;
    amount: number;
    apy: number;
    riskScore: number;
  }>;
  riskTolerance: 'low' | 'medium' | 'high';
  targetAPY: number;
}

interface RebalanceRecommendation {
  action: 'increase' | 'decrease' | 'maintain';
  protocol: string;
  asset: string;
  currentAmount: number;
  recommendedAmount: number;
  reason: string;
  expectedAPYImprovement: number;
  socialValidation?: {
    communityScore: number;
    similarUsersSuccess: number;
  };
}

class PortfolioRebalancer {
  private isRunning = false;

  constructor() {
    // Schedule to run every 4 hours
    cron.schedule('0 */4 * * *', () => {
      this.runRebalanceAnalysis();
    });
  }

  async runRebalanceAnalysis(userId?: string) {
    if (this.isRunning) return;
    this.isRunning = true;

    try {
      console.log("🔄 Starting social portfolio rebalancing analysis", { userId });

      // Mock portfolio data - in real app, this would come from your backend
      const portfolioData = await this.getUserPortfolio(userId || 'default-user');
      
      console.log("📊 Portfolio data retrieved", { 
        totalValue: portfolioData.totalValue,
        positionCount: portfolioData.positions.length 
      });

      // Get community insights for similar portfolios
      const communityInsights = await this.getCommunityInsights();

      // Analyze portfolio with social validation
      const recommendations = await this.analyzePortfolioWithSocialContext(
        portfolioData, 
        communityInsights
      );
      
      console.log("💡 Generated socially-validated recommendations", { 
        recommendationCount: recommendations.length 
      });

      // Calculate potential improvements
      const currentAPY = this.calculateWeightedAPY(portfolioData.positions, portfolioData.totalValue);
      const projectedAPY = this.calculateProjectedAPY(portfolioData.positions, recommendations, portfolioData.totalValue);
      
      // Update hero stats based on optimization and social engagement
      const heroStatBonus = this.calculateSocialHeroStatBonus(
        projectedAPY - currentAPY,
        communityInsights.engagementScore
      );
      
      console.log("🎮 Social hero stat bonus calculated", heroStatBonus);

      return {
        userId: userId || 'default-user',
        currentAPY,
        projectedAPY,
        improvement: projectedAPY - currentAPY,
        recommendations,
        heroStatBonus,
        communityValidation: communityInsights,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error("Error in portfolio rebalancing:", error);
    } finally {
      this.isRunning = false;
    }
  }

  private async getUserPortfolio(userId: string): Promise<PortfolioData> {
    // Mock data - replace with actual API call
    return {
      userId,
      totalValue: 10000,
      positions: [
        {
          protocol: 'Aave',
          asset: 'AVAX',
          amount: 5000,
          apy: 8.5,
          riskScore: 4
        },
        {
          protocol: 'Trader Joe',
          asset: 'USDC',
          amount: 3000,
          apy: 12.3,
          riskScore: 6
        },
        {
          protocol: 'Benqi',
          asset: 'USDT',
          amount: 2000,
          apy: 6.8,
          riskScore: 3
        }
      ],
      riskTolerance: 'medium',
      targetAPY: 10
    };
  }

  private async getCommunityInsights() {
    // Mock community insights - replace with actual social data
    return {
      engagementScore: 0.75,
      protocolPerformance: {
        'Aave': { successRate: 0.85, similarUsersCount: 150, alternativeScore: 0.7, migrationCount: 25 },
        'Trader Joe': { successRate: 0.92, similarUsersCount: 200, alternativeScore: 0.8, migrationCount: 10 },
        'Benqi': { successRate: 0.78, similarUsersCount: 100, alternativeScore: 0.6, migrationCount: 40 }
      }
    };
  }

  private async analyzePortfolioWithSocialContext(
    portfolio: PortfolioData, 
    communityInsights: any
  ): Promise<RebalanceRecommendation[]> {
    const recommendations: RebalanceRecommendation[] = [];
    
    // Analyze each position with community data
    for (const position of portfolio.positions) {
      const communityData = communityInsights.protocolPerformance[position.protocol];
      
      if (position.apy < portfolio.targetAPY && position.riskScore <= this.getRiskThreshold(portfolio.riskTolerance)) {
        // Check community success rate for this strategy
        if (communityData && communityData.successRate > 0.8) {
          recommendations.push({
            action: 'increase',
            protocol: position.protocol,
            asset: position.asset,
            currentAmount: position.amount,
            recommendedAmount: position.amount * 1.2,
            reason: `High APY with strong community validation (${Math.round(communityData.successRate * 100)}% success rate)`,
            expectedAPYImprovement: 1.5,
            socialValidation: {
              communityScore: communityData.successRate,
              similarUsersSuccess: communityData.similarUsersCount
            }
          });
        }
      }
      
      if (position.apy < 7 && position.riskScore < 3) {
        recommendations.push({
          action: 'decrease',
          protocol: position.protocol,
          asset: position.asset,
          currentAmount: position.amount,
          recommendedAmount: position.amount * 0.8,
          reason: 'Low APY, community suggests better allocation',
          expectedAPYImprovement: 0.8,
          socialValidation: {
            communityScore: communityData?.alternativeScore || 0.6,
            similarUsersSuccess: communityData?.migrationCount || 0
          }
        });
      }
    }
    
    return recommendations;
  }

  private calculateWeightedAPY(positions: PortfolioData['positions'], totalValue: number): number {
    const weightedSum = positions.reduce((sum, pos) => {
      const weight = pos.amount / totalValue;
      return sum + (pos.apy * weight);
    }, 0);
    
    return Math.round(weightedSum * 100) / 100;
  }

  private calculateProjectedAPY(
    positions: PortfolioData['positions'], 
    recommendations: RebalanceRecommendation[], 
    totalValue: number
  ): number {
    const projectedPositions = positions.map(pos => {
      const rec = recommendations.find(r => r.protocol === pos.protocol && r.asset === pos.asset);
      if (rec) {
        return { ...pos, amount: rec.recommendedAmount };
      }
      return pos;
    });
    
    return this.calculateWeightedAPY(projectedPositions, totalValue);
  }

  private calculateSocialHeroStatBonus(apyImprovement: number, socialEngagement: number) {
    return {
      magic: Math.floor(apyImprovement * 2) + Math.floor(socialEngagement * 1), // Social bonus
      experience: Math.floor(apyImprovement * 50) + Math.floor(socialEngagement * 25), // Community EXP
      defense: apyImprovement > 2 ? 1 : 0,
      social: Math.floor(socialEngagement * 3) // New social stat
    };
  }

  private getRiskThreshold(tolerance: 'low' | 'medium' | 'high'): number {
    switch (tolerance) {
      case 'low': return 3;
      case 'medium': return 6;
      case 'high': return 9;
      default: return 6;
    }
  }
}

// Export singleton instance
export const portfolioRebalancer = new PortfolioRebalancer();