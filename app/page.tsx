"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/client-auth"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Server, Shield, Zap, Globe, Users, Activity, Menu, X } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white">
      <ParticleBackground />
      <Header />
      <HeroSection />
      <StatsSection />
      <PricingSection />
      <FeaturesSection />
      <Footer />
    </div>
  )
}

function ParticleBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-blue-400/20 rounded-full animate-particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${8 + Math.random() * 4}s`,
          }}
        />
      ))}
    </div>
  )
}

function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = () => setIsMobileMenuOpen(false)
    if (isMobileMenuOpen) {
      document.addEventListener("click", handleClickOutside)
      return () => document.removeEventListener("click", handleClickOutside)
    }
  }, [isMobileMenuOpen])

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <motion.div whileHover={{ scale: 1.05 }} className="text-2xl font-bold font-display text-blue-600">
          OpHosts
        </motion.div>

        <nav className="hidden md:flex space-x-8">
          {["Home", "Pricing", "Features", "Support"].map((item) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              whileHover={{ y: -2 }}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              {item}
            </motion.a>
          ))}
        </nav>

        <div className="hidden md:flex space-x-4">
          <Link href="/login">
            <Button variant="ghost" className="hover:bg-blue-50">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Get Started</Button>
          </Link>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation()
            setIsMobileMenuOpen(!isMobileMenuOpen)
          }}
          className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
        >
          <motion.div animate={{ rotate: isMobileMenuOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.div>
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isMobileMenuOpen ? 1 : 0,
          height: isMobileMenuOpen ? "auto" : 0,
        }}
        transition={{ duration: 0.3 }}
        className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 overflow-hidden"
      >
        <div className="container mx-auto px-4 py-4 space-y-4">
          {["Home", "Pricing", "Features", "Support"].map((item, index) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isMobileMenuOpen ? 1 : 0, x: isMobileMenuOpen ? 0 : -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-gray-700 hover:text-blue-600 transition-colors duration-200 py-2"
            >
              {item}
            </motion.a>
          ))}
          <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start hover:bg-blue-50">
                Login
              </Button>
            </Link>
            <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Get Started</Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.header>
  )
}

function HeroSection() {
  const router = useRouter()

  const handleGetStarted = () => {
    if (isAuthenticated()) {
      router.push("/dashboard")
    } else {
      router.push("/register")
    }
  }

  return (
    <section className="pt-32 pb-20 px-4">
      <div className="container mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold font-display mb-6 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent leading-tight"
          >
            Premium RDP & VPS
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed px-4"
          >
            Lightning-fast servers with 99.9% uptime guarantee.
            <br className="hidden sm:block" />
            Experience the future of cloud hosting.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16 px-4"
          >
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 touch-manipulation"
            >
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold hover:scale-105 transition-all duration-200 bg-transparent touch-manipulation"
            >
              View Pricing
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="relative max-w-2xl mx-auto px-4"
        >
          <div className="relative animate-float">
            <div className="w-full h-48 md:h-64 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-2xl animate-pulse-glow">
              <div className="absolute inset-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <div className="flex items-center justify-center h-full">
                  <Server className="w-16 h-16 md:w-24 md:h-24 text-white/80" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function StatsSection() {
  return (
    <section className="py-20 bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimatedCounter
            icon={<Users className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />}
            end={15000}
            label="Total Customers"
            suffix="+"
          />
          <AnimatedCounter
            icon={<Activity className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />}
            end={99.9}
            label="Uptime Guarantee"
            suffix="%"
            decimals={1}
          />
          <AnimatedCounter
            icon={<Globe className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />}
            end={25}
            label="Countries Served"
            suffix="+"
          />
        </div>
      </div>
    </section>
  )
}

function AnimatedCounter({
  icon,
  end,
  label,
  suffix = "",
  decimals = 0,
}: {
  icon: React.ReactNode
  end: number
  label: string
  suffix?: string
  decimals?: number
}) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = end / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(current)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [end])

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <div className="flex justify-center mb-4">{icon}</div>
      <div className="text-3xl md:text-4xl font-bold font-display text-blue-600 mb-2">
        {count.toFixed(decimals)}
        {suffix}
      </div>
      <div className="text-gray-600 font-medium text-sm md:text-base">{label}</div>
    </motion.div>
  )
}

function PricingSection() {
  const router = useRouter()

  const handleGetStarted = () => {
    if (isAuthenticated()) {
      router.push("/dashboard")
    } else {
      router.push("/register")
    }
  }

  const plans = [
    {
      name: "Starter RDP",
      price: 15,
      features: ["2 CPU Cores", "4GB RAM", "50GB SSD", "1Gbps Network", "24/7 Support"],
      popular: false,
    },
    {
      name: "Pro VPS",
      price: 35,
      features: ["4 CPU Cores", "8GB RAM", "100GB SSD", "1Gbps Network", "Priority Support", "Free Backups"],
      popular: true,
    },
    {
      name: "Enterprise",
      price: 75,
      features: ["8 CPU Cores", "16GB RAM", "200GB SSD", "10Gbps Network", "Dedicated Support", "Advanced Security"],
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display mb-4 text-gray-900">
            Choose Your Plan
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Flexible pricing for every need. All plans include our 99.9% uptime guarantee.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="relative"
            >
              <Card
                className={`h-full transition-all duration-300 hover:shadow-2xl cursor-pointer touch-manipulation ${
                  plan.popular
                    ? "border-blue-500 shadow-lg shadow-blue-500/20 scale-105 md:scale-110"
                    : "border-gray-200"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white">
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-xl md:text-2xl font-display">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-3xl md:text-4xl font-bold text-blue-600">${plan.price}</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center space-x-3">
                      <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm md:text-base text-gray-700">{feature}</span>
                    </div>
                  ))}

                  <Button
                    onClick={handleGetStarted}
                    className={`w-full mt-8 touch-manipulation ${
                      plan.popular
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                    } transition-all duration-200 hover:scale-105 active:scale-95`}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    {
      icon: <Zap className="w-10 h-10 md:w-12 md:h-12 text-blue-600" />,
      title: "Lightning Fast",
      description: "NVMe SSD storage and high-performance CPUs for maximum speed.",
    },
    {
      icon: <Shield className="w-10 h-10 md:w-12 md:h-12 text-blue-600" />,
      title: "Enterprise Security",
      description: "Advanced DDoS protection and enterprise-grade security measures.",
    },
    {
      icon: <Globe className="w-10 h-10 md:w-12 md:h-12 text-blue-600" />,
      title: "Global Network",
      description: "Servers in 25+ countries for optimal performance worldwide.",
    },
  ]

  return (
    <section id="features" className="py-20 bg-gradient-to-br from-blue-50/50 to-white px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display mb-4 text-gray-900">
            Why Choose OpHosts?
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="text-center p-6 md:p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer touch-manipulation"
            >
              <div className="flex justify-center mb-6">{feature.icon}</div>
              <h3 className="text-xl md:text-2xl font-bold font-display mb-4 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="text-2xl font-bold font-display text-blue-400 mb-4">OpHosts</div>
            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
              Premium RDP and VPS hosting solutions with unmatched performance and reliability.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-base md:text-lg">Services</h4>
            <ul className="space-y-2 text-gray-400 text-sm md:text-base">
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  RDP Hosting
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  VPS Hosting
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Dedicated Servers
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-base md:text-lg">Support</h4>
            <ul className="space-y-2 text-gray-400 text-sm md:text-base">
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Status Page
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-base md:text-lg">Company</h4>
            <ul className="space-y-2 text-gray-400 text-sm md:text-base">
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm md:text-base">
          <p>&copy; 2024 OpHosts. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
