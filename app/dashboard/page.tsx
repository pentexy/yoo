"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Server, Monitor, Cpu, Wifi, Shield } from "lucide-react"

const rdpServices = [
  {
    id: 1,
    name: "Basic RDP",
    price: "$9.99/month",
    description: "Perfect for light usage and basic applications",
    specs: ["2 vCPU", "4GB RAM", "50GB SSD", "Windows Server 2022"],
    popular: false,
  },
  {
    id: 2,
    name: "Professional RDP",
    price: "$19.99/month",
    description: "Ideal for business applications and development",
    specs: ["4 vCPU", "8GB RAM", "100GB SSD", "Windows Server 2022"],
    popular: true,
  },
  {
    id: 3,
    name: "Enterprise RDP",
    price: "$39.99/month",
    description: "High-performance solution for demanding workloads",
    specs: ["8 vCPU", "16GB RAM", "200GB SSD", "Windows Server 2022"],
    popular: false,
  },
  {
    id: 4,
    name: "Gaming RDP",
    price: "$29.99/month",
    description: "Optimized for gaming and graphics-intensive tasks",
    specs: ["6 vCPU", "12GB RAM", "150GB SSD", "GPU Acceleration"],
    popular: false,
  },
  {
    id: 5,
    name: "Developer RDP",
    price: "$24.99/month",
    description: "Tailored for software development and testing",
    specs: ["4 vCPU", "8GB RAM", "120GB SSD", "Dev Tools Included"],
    popular: false,
  },
]

const vpsServices = [
  {
    id: 1,
    name: "Starter VPS",
    price: "$5.99/month",
    description: "Perfect for small websites and learning",
    specs: ["1 vCPU", "1GB RAM", "25GB SSD", "1TB Bandwidth"],
    popular: false,
  },
  {
    id: 2,
    name: "Business VPS",
    price: "$14.99/month",
    description: "Ideal for growing businesses and applications",
    specs: ["2 vCPU", "4GB RAM", "80GB SSD", "3TB Bandwidth"],
    popular: true,
  },
  {
    id: 3,
    name: "Pro VPS",
    price: "$29.99/month",
    description: "High-performance hosting for demanding projects",
    specs: ["4 vCPU", "8GB RAM", "160GB SSD", "5TB Bandwidth"],
    popular: false,
  },
  {
    id: 4,
    name: "Enterprise VPS",
    price: "$59.99/month",
    description: "Maximum performance for enterprise applications",
    specs: ["8 vCPU", "16GB RAM", "320GB SSD", "10TB Bandwidth"],
    popular: false,
  },
  {
    id: 5,
    name: "Cloud VPS",
    price: "$44.99/month",
    description: "Scalable cloud infrastructure with flexibility",
    specs: ["6 vCPU", "12GB RAM", "240GB SSD", "8TB Bandwidth"],
    popular: false,
  },
]

export default function Dashboard() {
  const [selectedService, setSelectedService] = useState<"rdp" | "vps">("rdp")
  const currentServices = selectedService === "rdp" ? rdpServices : vpsServices

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white">
      {/* Header */}
      <header className="border-b border-blue-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <Server className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                OpHosts
              </span>
            </motion.div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                Home
              </a>
              <a href="/dashboard" className="text-blue-600 font-medium">
                Dashboard
              </a>
              <a href="/profile" className="text-gray-600 hover:text-blue-600 transition-colors">
                Profile
              </a>
              <a href="/orders" className="text-gray-600 hover:text-blue-600 transition-colors">
                Orders
              </a>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4">
            Choose Your Service
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Select between our premium RDP and VPS solutions tailored for your needs
          </p>
        </motion.div>

        {/* Service Selection Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-white rounded-2xl p-2 shadow-lg border border-blue-100">
            <div className="flex space-x-2">
              <Button
                onClick={() => setSelectedService("rdp")}
                variant={selectedService === "rdp" ? "default" : "ghost"}
                size="lg"
                className={`px-8 py-4 rounded-xl transition-all duration-300 ${
                  selectedService === "rdp"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                <Monitor className="mr-2 h-5 w-5" />
                Remote Desktop (RDP)
              </Button>
              <Button
                onClick={() => setSelectedService("vps")}
                variant={selectedService === "vps" ? "default" : "ghost"}
                size="lg"
                className={`px-8 py-4 rounded-xl transition-all duration-300 ${
                  selectedService === "vps"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                <Server className="mr-2 h-5 w-5" />
                Virtual Private Server (VPS)
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Service Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedService}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {currentServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="relative"
              >
                <Card className="h-full border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 bg-white/80 backdrop-blur-sm">
                  {service.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full w-fit">
                      {selectedService === "rdp" ? (
                        <Monitor className="h-8 w-8 text-blue-600" />
                      ) : (
                        <Server className="h-8 w-8 text-blue-600" />
                      )}
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-800">{service.name}</CardTitle>
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                      {service.price}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <CardDescription className="text-center text-gray-600">{service.description}</CardDescription>

                    <div className="space-y-2">
                      {service.specs.map((spec, specIndex) => (
                        <div key={specIndex} className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-700">{spec}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      size="lg"
                    >
                      Buy Now
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Why Choose OpHosts?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center space-y-3">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800">99.9% Uptime</h3>
              <p className="text-gray-600 text-sm">Reliable infrastructure you can count on</p>
            </div>
            <div className="flex flex-col items-center space-y-3">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full">
                <Wifi className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Lightning Fast</h3>
              <p className="text-gray-600 text-sm">High-speed connections worldwide</p>
            </div>
            <div className="flex flex-col items-center space-y-3">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full">
                <Cpu className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Latest Hardware</h3>
              <p className="text-gray-600 text-sm">Cutting-edge servers and technology</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
