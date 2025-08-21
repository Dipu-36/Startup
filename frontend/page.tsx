// "use client"

// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { ArrowRight, Users, Target, TrendingUp, Shield } from "lucide-react"
// import Link from "next/link"
// import { FadeIn } from "@/components/ui/animated"
// import { GradientText, FloatingElement, ScaleOnHover, BlurIn } from "@/components/ui/magic-effects"
// import { ParticleBackground, Shimmer, TypewriterEffect } from "@/components/ui/particle-effects"
// import { motion } from "framer-motion"

// export default function HomePage() {
//   return (
//     <div className="min-h-screen bg-background relative overflow-hidden">
//       <ParticleBackground />
      
//       {/* Navigation */}
//       <motion.nav 
//         initial={{ y: -100, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.8, ease: [0.25, 0.25, 0, 1] }}
//         className="border-b border-border bg-card/80 backdrop-blur-lg sticky top-0 z-50"
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center space-x-4">
//               <FloatingElement delay={1}>
//                 <h1 className="text-2xl font-bold">
//                   <GradientText>AdFluence</GradientText>
//                 </h1>
//               </FloatingElement>
//             </div>
//             <div className="flex items-center space-x-4">
//               <Link href="/auth/login">
//                 <ScaleOnHover>
//                   <Button variant="ghost">Sign In</Button>
//                 </ScaleOnHover>
//               </Link>
//               <Link href="/auth/register">
//                 <ScaleOnHover>
//                   <Shimmer>
//                     <Button className="animate-pulse-glow">Get Started</Button>
//                   </Shimmer>
//                 </ScaleOnHover>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </motion.nav>

//       {/* Hero Section */}
//       <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
//         <div className="max-w-7xl mx-auto text-center">
//           <FadeIn delay={0.2}>
//             <Badge className="mb-4 animate-float" variant="secondary">
//               Trusted by 10,000+ Creators & Brands
//             </Badge>
//           </FadeIn>
          
//           <BlurIn delay={0.4}>
//             <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
//               Connect Creators with{" "}
//               <TypewriterEffect 
//                 texts={["Brands", "Opportunities", "Success", "Growth"]}
//                 className="text-primary"
//               />
//             </h1>
//           </BlurIn>
          
//           <FadeIn delay={0.6} direction="up">
//             <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
//               AdFluence is the professional platform where content creators and brands collaborate on authentic influencer
//               marketing campaigns. Build trust, track performance, and grow together.
//             </p>
//           </FadeIn>
          
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <FadeIn delay={0.8}>
//               <Link href="/auth/register?type=creator">
//                 <ScaleOnHover>
//                   <Button size="lg" className="w-full sm:w-auto group animate-pulse-glow">
//                     Join as Creator
//                     <motion.div
//                       animate={{ x: [0, 5, 0] }}
//                       transition={{ duration: 1.5, repeat: Infinity }}
//                     >
//                       <ArrowRight className="ml-2 h-4 w-4" />
//                     </motion.div>
//                   </Button>
//                 </ScaleOnHover>
//               </Link>
//             </FadeIn>
//             <FadeIn delay={1.0}>
//               <Link href="/auth/register?type=brand">
//                 <ScaleOnHover>
//                   <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent backdrop-blur-sm">
//                     Join as Brand
//                   </Button>
//                 </ScaleOnHover>
//               </Link>
//             </FadeIn>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50 relative">
//         <div className="max-w-7xl mx-auto">
//           <FadeIn delay={0.2}>
//             <div className="text-center mb-16">
//               <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
//                 Why Choose <GradientText>AdFluence</GradientText>?
//               </h2>
//               <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//                 Built for transparency, trust, and successful collaborations between creators and brands.
//               </p>
//             </div>
//           </FadeIn>

//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
//             <FadeIn delay={0.3}>
//               <ScaleOnHover className="h-full">
//                 <Card className="h-full hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/50">
//                   <CardHeader>
//                     <FloatingElement delay={0.5}>
//                       <Users className="h-8 w-8 text-primary mb-2" />
//                     </FloatingElement>
//                     <CardTitle>Verified Profiles</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <CardDescription>
//                       All creators link their social accounts for verification. Brands see real metrics and engagement data.
//                     </CardDescription>
//                   </CardContent>
//                 </Card>
//               </ScaleOnHover>
//             </FadeIn>

//             <FadeIn delay={0.4}>
//               <ScaleOnHover className="h-full">
//                 <Card className="h-full hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/50">
//                   <CardHeader>
//                     <FloatingElement delay={0.7}>
//                       <Target className="h-8 w-8 text-primary mb-2" />
//                     </FloatingElement>
//                     <CardTitle>Smart Matching</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <CardDescription>
//                       Our algorithm matches creators with relevant brand campaigns based on audience, niche, and performance.
//                     </CardDescription>
//                   </CardContent>
//                 </Card>
//               </ScaleOnHover>
//             </FadeIn>

//             <FadeIn delay={0.5}>
//               <ScaleOnHover className="h-full">
//                 <Card className="h-full hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/50">
//                   <CardHeader>
//                     <FloatingElement delay={0.9}>
//                       <TrendingUp className="h-8 w-8 text-primary mb-2" />
//                     </FloatingElement>
//                     <CardTitle>Performance Analytics</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <CardDescription>
//                       Track campaign performance, engagement rates, and ROI with comprehensive analytics and reporting.
//                     </CardDescription>
//                   </CardContent>
//                 </Card>
//               </ScaleOnHover>
//             </FadeIn>

//             <FadeIn delay={0.6}>
//               <ScaleOnHover className="h-full">
//                 <Card className="h-full hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/50">
//                   <CardHeader>
//                     <FloatingElement delay={1.1}>
//                       <Shield className="h-8 w-8 text-primary mb-2" />
//                     </FloatingElement>
//                     <CardTitle>Trust & Safety</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <CardDescription>
//                       Public reputation scores and payment reliability ratings help both sides make informed decisions.
//                     </CardDescription>
//                   </CardContent>
//                 </Card>
//               </ScaleOnHover>
//             </FadeIn>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-20 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-4xl mx-auto text-center">
//           <FadeIn delay={0.2}>
//             <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
//               Ready to Start <GradientText>Collaborating</GradientText>?
//             </h2>
//           </FadeIn>
//           <FadeIn delay={0.4}>
//             <p className="text-xl text-muted-foreground mb-8">
//               Join thousands of creators and brands already using AdFluence to build successful partnerships.
//             </p>
//           </FadeIn>
//           <FadeIn delay={0.6}>
//             <Link href="/auth/register">
//               <ScaleOnHover>
//                 <Shimmer>
//                   <Button size="lg" className="animate-pulse-glow">
//                     Get Started Today
//                     <ArrowRight className="ml-2 h-4 w-4" />
//                   </Button>
//                 </Shimmer>
//               </ScaleOnHover>
//             </Link>
//           </FadeIn>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="border-t border-border bg-card/80 backdrop-blur-lg py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto text-center">
//           <FadeIn delay={0.2}>
//             <h3 className="text-2xl font-bold mb-4">
//               <GradientText>AdFluence</GradientText>
//             </h3>
//             <p className="text-muted-foreground">
//               Connecting creators and brands for authentic influencer marketing campaigns.
//             </p>
//           </FadeIn>
//         </div>
//       </footer>
//     </div>
//   )
// }
