import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Lock,
  Users,
  CheckCircle2,
  AlertCircle,
  Zap,
  FileCheck,
  Globe,
  Play
} from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">关于 VeilCivic</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            基于 Zama 全同态加密（FHE）技术的隐私优先身份与治理平台
          </p>
        </div>

        {/* Project Overview */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            项目概述
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            VeilCivic 是新一代去中心化平台，将<strong>加密身份管理</strong>与<strong>隐私保护治理</strong>相结合。
            通过 Zama 的全同态加密（FHE）技术，VeilCivic 使社区、DAO 和组织能够管理敏感身份数据并进行安全投票，
            而无需在链上暴露机密信息。
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-1">端到端加密</h3>
                <p className="text-sm text-muted-foreground">
                  所有敏感数据在客户端加密后提交到链上
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-1">链上计算</h3>
                <p className="text-sm text-muted-foreground">
                  直接在加密数据上进行计算，无需解密
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-1">去中心化治理</h3>
                <p className="text-sm text-muted-foreground">
                  支持多种投票类型，保护投票者隐私
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Problems We Solve */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-primary" />
            解决的痛点
          </h2>
          <div className="space-y-4">
            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-2">透明度 vs 隐私的困境</h3>
              <p className="text-muted-foreground">
                传统区块链系统的公开账本会暴露所有交易数据，使得隐私敏感应用难以实现。
                VeilCivic 通过 FHE 技术实现了数据的链上加密存储与计算。
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-2">身份管理难题</h3>
              <p className="text-muted-foreground">
                KYC/身份数据无法在不损害用户隐私的情况下存储在链上。
                我们的加密身份保险库允许用户在保持完全隐私的同时验证身份属性。
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-2">投票安全问题</h3>
              <p className="text-muted-foreground">
                传统加密投票需要信任第三方或会暴露投票者选择。
                FHE 实现了真正的秘密投票，无需任何可信第三方。
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-2">合规性差距</h3>
              <p className="text-muted-foreground">
                监管要求的隐私保护是标准区块链无法提供的。
                VeilCivic 符合 GDPR 等数据保护法规，同时保持区块链的去中心化特性。
              </p>
            </div>
          </div>
        </Card>

        {/* How It Works */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FileCheck className="h-6 w-6 text-primary" />
            运行机制
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">全同态加密（FHE）工作原理</h3>
              <p className="text-muted-foreground mb-4">
                全同态加密是一种特殊的加密技术，允许在不解密数据的情况下对加密数据进行计算。
                这意味着可以在完全保护隐私的同时处理敏感信息。
              </p>

              <div className="bg-muted p-4 rounded-lg mb-4">
                <h4 className="font-semibold mb-2">投票流程示例</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>用户在浏览器中选择投票选项</li>
                  <li>fhevmjs SDK 在客户端加密投票数据（euint32）</li>
                  <li>生成加密证明以验证数据正确性</li>
                  <li>提交加密投票和证明到 FHEBallot 合约</li>
                  <li>智能合约在链上验证加密证明</li>
                  <li>使用 FHE.add() 直接累加加密投票</li>
                  <li>投票数据永久加密存储在链上</li>
                  <li>投票期结束后，请求 Zama Gateway 解密最终结果</li>
                  <li>Zama Gateway 解密加密的计票结果</li>
                  <li>最终结果发布到链上供所有人查看</li>
                </ol>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3">核心功能</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    加密身份保险库
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>客户端加密身份数据（姓名、年龄、国籍、净资产）</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>基于加密净资产阈值的访问级别管理</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>零知识证明验证身份属性</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>用户完全控制自己的加密数据</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    隐私保护投票系统
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>单选、多选、加权、二次方投票</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>投票全程保持加密状态</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>自动执行时间门控投票周期</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>白名单支持限制投票参与者</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Demo Video */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Play className="h-6 w-6 text-primary" />
            演示视频
          </h2>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Play className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">演示视频即将上线</p>
              <p className="text-sm text-muted-foreground mt-2">
                查看如何使用 VeilCivic 创建加密身份和参与隐私投票
              </p>
            </div>
          </div>
        </Card>

        {/* Roadmap */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" />
            发展路线图
          </h2>

          <div className="space-y-6">
            {/* Phase 1 */}
            <div className="relative pl-8 border-l-2 border-green-500">
              <div className="absolute left-0 top-0 -translate-x-1/2">
                <div className="h-4 w-4 rounded-full bg-green-500"></div>
              </div>
              <div className="mb-4">
                <Badge className="bg-green-500 mb-2">已完成</Badge>
                <h3 className="text-lg font-semibold">第一阶段：基础建设</h3>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✅ 智能合约架构设计</li>
                <li>✅ Zama fhEVM FHE 技术集成</li>
                <li>✅ 身份保险库合约实现</li>
                <li>✅ 基础投票机制（单选、多选、加权投票）</li>
                <li>✅ React 前端应用搭建</li>
                <li>✅ 钱包集成（MetaMask、WalletConnect）</li>
              </ul>
            </div>

            {/* Phase 2 */}
            <div className="relative pl-8 border-l-2 border-green-500">
              <div className="absolute left-0 top-0 -translate-x-1/2">
                <div className="h-4 w-4 rounded-full bg-green-500"></div>
              </div>
              <div className="mb-4">
                <Badge className="bg-green-500 mb-2">已完成</Badge>
                <h3 className="text-lg font-semibold">第二阶段：核心功能</h3>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✅ 加密身份创建与管理</li>
                <li>✅ 客户端 FHE 加密（fhevmjs）</li>
                <li>✅ 多种投票类型实现</li>
                <li>✅ 时间门控投票周期</li>
                <li>✅ 白名单管理系统</li>
                <li>✅ 二次方投票公式</li>
                <li>✅ 通过 Gateway 解密结果</li>
                <li>✅ Tailwind CSS 响应式 UI</li>
              </ul>
            </div>

            {/* Phase 3 */}
            <div className="relative pl-8 border-l-2 border-blue-500">
              <div className="absolute left-0 top-0 -translate-x-1/2">
                <div className="h-4 w-4 rounded-full bg-blue-500 animate-pulse"></div>
              </div>
              <div className="mb-4">
                <Badge className="bg-blue-500 mb-2">进行中</Badge>
                <h3 className="text-lg font-semibold">第三阶段：增强治理</h3>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✅ 从合约读取真实投票数据</li>
                <li>✅ FHE 加密投票</li>
                <li>✅ 投票详情页面与实时结果</li>
                <li>⏳ 治理管理仪表板</li>
                <li>⏳ 投票数据分析与统计</li>
                <li>⏳ 投票委托系统</li>
                <li>⏳ 提案创建 UI</li>
                <li>⏳ 多签名投票结果验证</li>
              </ul>
            </div>

            {/* Phase 4 */}
            <div className="relative pl-8 border-l-2 border-gray-300">
              <div className="absolute left-0 top-0 -translate-x-1/2">
                <div className="h-4 w-4 rounded-full bg-gray-300"></div>
              </div>
              <div className="mb-4">
                <Badge variant="outline" className="mb-2">计划中</Badge>
                <h3 className="text-lg font-semibold">第四阶段：高级功能</h3>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>📋 身份验证：集成真实 KYC 服务商</li>
                <li>📋 跨链支持：桥接至 Polygon、Arbitrum</li>
                <li>📋 DAO 模板：预构建的治理结构</li>
                <li>📋 移动应用：React Native 移动端</li>
                <li>📋 无 Gas 交易：元交易改善用户体验</li>
                <li>📋 IPFS 集成：去中心化提案存储</li>
                <li>📋 ENS 支持：人类可读地址</li>
              </ul>
            </div>

            {/* Phase 5 */}
            <div className="relative pl-8 border-l-2 border-gray-300">
              <div className="absolute left-0 top-0 -translate-x-1/2">
                <div className="h-4 w-4 rounded-full bg-gray-300"></div>
              </div>
              <div className="mb-4">
                <Badge variant="outline" className="mb-2">计划中</Badge>
                <h3 className="text-lg font-semibold">第五阶段：企业级与规模化</h3>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>📋 API 平台：第三方集成 REST API</li>
                <li>📋 白标解决方案：可定制企业版</li>
                <li>📋 审计与安全：专业智能合约审计</li>
                <li>📋 主网部署：以太坊主网生产发布</li>
                <li>📋 治理代币：平台原生治理代币</li>
                <li>📋 质押机制：质押代币获得投票权</li>
                <li>📋 金库管理：DAO 多签金库</li>
              </ul>
            </div>

            {/* Phase 6 */}
            <div className="relative pl-8 border-l-2 border-gray-300">
              <div className="absolute left-0 top-0 -translate-x-1/2">
                <div className="h-4 w-4 rounded-full bg-gray-300"></div>
              </div>
              <div className="mb-4">
                <Badge variant="outline" className="mb-2">计划中</Badge>
                <h3 className="text-lg font-semibold">第六阶段：生态系统增长</h3>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>📋 SDK 发布：开发者集成工具包</li>
                <li>📋 插件系统：可扩展投票机制</li>
                <li>📋 市场平台：治理模板和模块</li>
                <li>📋 分析平台：高级投票洞察</li>
                <li>📋 教育中心：教程和文档</li>
                <li>📋 资助计划：资助社区项目</li>
                <li>📋 生态合作：与主流 DAO 集成</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Technology Stack */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">技术栈</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-3">前端</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• React 18</li>
                <li>• TypeScript</li>
                <li>• Vite</li>
                <li>• Tailwind CSS</li>
                <li>• shadcn/ui</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Web3 集成</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• wagmi v2</li>
                <li>• viem</li>
                <li>• RainbowKit</li>
                <li>• Privy SDK</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">区块链 & 加密</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Solidity 0.8.19</li>
                <li>• Zama fhEVM</li>
                <li>• fhevmjs</li>
                <li>• Hardhat</li>
                <li>• Sepolia Testnet</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Footer CTA */}
        <div className="text-center py-8">
          <h3 className="text-xl font-semibold mb-2">准备好开始了吗？</h3>
          <p className="text-muted-foreground mb-4">
            探索隐私优先的去中心化身份和治理
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/identity/new"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6"
            >
              创建身份
            </a>
            <a
              href="/voting"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-6"
            >
              参与投票
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
