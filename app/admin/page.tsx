"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  LayoutDashboard,
  Server,
  Users,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Activity,
  Edit,
  Send,
  LogOut,
  Menu,
  X,
} from "lucide-react"

type TabType = "dashboard" | "plans" | "orders" | "support" | "admins"

interface Order {
  id: string
  customer: string
  plan: string
  status: "active" | "pending" | "cancelled"
  amount: number
  date: string
}

interface ChatMessage {
  id: string
  user: string
  message: string
  timestamp: string
  isAdmin: boolean
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard")
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [orders, setOrders] = useState<Order[]>([
    { id: "1", customer: "John Doe", plan: "Pro VPS", status: "active", amount: 35, date: "2024-01-15" },
    { id: "2", customer: "Jane Smith", plan: "Starter RDP", status: "pending", amount: 15, date: "2024-01-14" },
    { id: "3", customer: "Bob Johnson", plan: "Enterprise", status: "active", amount: 75, date: "2024-01-13" },
  ])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: "1", user: "John Doe", message: "Hi, I need help with my VPS setup", timestamp: "10:30 AM", isAdmin: false },
    {
      id: "2",
      user: "Admin",
      message: "Hello! I'd be happy to help you with that.",
      timestamp: "10:32 AM",
      isAdmin: true,
    },
  ])
  const [newMessage, setNewMessage] = useState("")

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "plans", label: "Plans", icon: Server },
    { id: "orders", label: "Orders", icon: DollarSign },
    { id: "support", label: "Support", icon: MessageSquare },
    { id: "admins", label: "Admins", icon: Users },
  ]

  const dashboardStats = [
    { title: "Total Revenue", value: "$12,450", change: "+12%", icon: DollarSign },
    { title: "Active Customers", value: "1,234", change: "+8%", icon: Users },
    { title: "Server Uptime", value: "99.9%", change: "+0.1%", icon: Activity },
    { title: "Support Tickets", value: "23", change: "-15%", icon: MessageSquare },
  ]

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        user: "Admin",
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isAdmin: true,
      }
      setChatMessages([...chatMessages, message])
      setNewMessage("")
    }
  }

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    setIsMobileSidebarOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = () => setIsMobileSidebarOpen(false)
    if (isMobileSidebarOpen) {
      document.addEventListener("click", handleClickOutside)
      return () => document.removeEventListener("click", handleClickOutside)
    }
  }, [isMobileSidebarOpen])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex">
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold font-display text-blue-600">OpHosts Admin</h1>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation()
              setIsMobileSidebarOpen(!isMobileSidebarOpen)
            }}
            className="p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
          >
            <motion.div animate={{ rotate: isMobileSidebarOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
              {isMobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.div>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{
          x: 0,
          opacity: 1,
          translateX: isMobileSidebarOpen ? 0 : -300,
        }}
        transition={{ duration: 0.5 }}
        className={`w-64 bg-white shadow-xl border-r border-gray-200 fixed lg:relative z-50 h-full lg:h-auto ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } transition-transform duration-300 lg:transition-none`}
      >
        <div className="p-6 border-b border-gray-200 pt-20 lg:pt-6">
          <h1 className="text-2xl font-bold font-display text-blue-600 hidden lg:block">OpHosts Admin</h1>
        </div>

        <nav className="mt-6">
          {sidebarItems.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.button
                key={item.id}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => handleTabChange(item.id as TabType)}
                className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-all duration-200 hover:bg-blue-50 hover:border-r-4 hover:border-blue-500 group touch-manipulation ${
                  activeTab === item.id ? "bg-blue-50 border-r-4 border-blue-500 text-blue-600" : "text-gray-700"
                }`}
              >
                <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.2 }}>
                  <Icon className="w-5 h-5" />
                </motion.div>
                <span className="font-medium">{item.label}</span>
              </motion.button>
            )
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50 touch-manipulation"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </motion.div>

      <div className="flex-1 overflow-hidden pt-20 lg:pt-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full overflow-y-auto"
          >
            {activeTab === "dashboard" && <DashboardContent stats={dashboardStats} />}
            {activeTab === "plans" && <PlansContent />}
            {activeTab === "orders" && <OrdersContent orders={orders} setOrders={setOrders} />}
            {activeTab === "support" && (
              <SupportContent
                messages={chatMessages}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                onSendMessage={handleSendMessage}
              />
            )}
            {activeTab === "admins" && <AdminsContent />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function DashboardContent({ stats }: { stats: any[] }) {
  return (
    <div className="p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-bold font-display text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600 text-sm md:text-base">
          Welcome back! Here's what's happening with your hosting business.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 touch-manipulation">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-xl md:text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p
                        className={`text-xs md:text-sm ${stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                      >
                        {stat.change} from last month
                      </p>
                    </div>
                    <div className="p-2 md:p-3 bg-blue-50 rounded-full">
                      <Icon className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  "New customer John Doe signed up for Pro VPS",
                  "Server maintenance completed successfully",
                  "Payment received from Jane Smith",
                  "Support ticket #123 resolved",
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                    <span className="text-xs md:text-sm text-gray-700">{activity}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
                <Server className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                <span>Server Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "US East", status: "Online", uptime: "99.9%" },
                  { name: "EU West", status: "Online", uptime: "99.8%" },
                  { name: "Asia Pacific", status: "Maintenance", uptime: "98.5%" },
                ].map((server, index) => (
                  <motion.div
                    key={server.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          server.status === "Online" ? "bg-green-500" : "bg-yellow-500"
                        }`}
                      />
                      <span className="font-medium text-sm md:text-base">{server.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs md:text-sm font-medium">{server.status}</p>
                      <p className="text-xs text-gray-600">{server.uptime} uptime</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

function PlansContent() {
  const [plans, setPlans] = useState([
    { id: "1", name: "Starter RDP", price: 15, features: ["2 CPU Cores", "4GB RAM", "50GB SSD"] },
    { id: "2", name: "Pro VPS", price: 35, features: ["4 CPU Cores", "8GB RAM", "100GB SSD"] },
    { id: "3", name: "Enterprise", price: 75, features: ["8 CPU Cores", "16GB RAM", "200GB SSD"] },
  ])

  return (
    <div className="p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-bold font-display text-gray-900 mb-2">Hosting Plans</h2>
        <p className="text-gray-600 text-sm md:text-base">Manage your hosting plans and pricing.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 touch-manipulation">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg md:text-xl">
                  <span>{plan.name}</span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="touch-manipulation">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="mx-4 max-w-md">
                      <DialogHeader>
                        <DialogTitle>Edit Plan</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="planName">Plan Name</Label>
                          <Input id="planName" defaultValue={plan.name} className="touch-manipulation" />
                        </div>
                        <div>
                          <Label htmlFor="planPrice">Price ($)</Label>
                          <Input
                            id="planPrice"
                            type="number"
                            defaultValue={plan.price}
                            className="touch-manipulation"
                          />
                        </div>
                        <Button className="w-full touch-manipulation">Save Changes</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-2xl md:text-3xl font-bold text-blue-600">${plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="text-xs md:text-sm text-gray-700">
                      • {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function OrdersContent({ orders, setOrders }: { orders: Order[]; setOrders: (orders: Order[]) => void }) {
  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  return (
    <div className="p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-bold font-display text-gray-900 mb-2">Orders Management</h2>
        <p className="text-gray-600 text-sm md:text-base">Track and manage customer orders.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-white shadow-lg">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs md:text-sm">Customer</TableHead>
                    <TableHead className="text-xs md:text-sm">Plan</TableHead>
                    <TableHead className="text-xs md:text-sm">Status</TableHead>
                    <TableHead className="text-xs md:text-sm">Amount</TableHead>
                    <TableHead className="text-xs md:text-sm">Date</TableHead>
                    <TableHead className="text-xs md:text-sm">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <TableCell className="font-medium text-xs md:text-sm">{order.customer}</TableCell>
                      <TableCell className="text-xs md:text-sm">{order.plan}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.status === "active"
                              ? "default"
                              : order.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                          className="text-xs"
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs md:text-sm">${order.amount}</TableCell>
                      <TableCell className="text-xs md:text-sm">{order.date}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="touch-manipulation">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="mx-4 max-w-md">
                            <DialogHeader>
                              <DialogTitle>Edit Order</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Status</Label>
                                <select
                                  className="w-full p-2 border rounded-lg touch-manipulation"
                                  defaultValue={order.status}
                                  onChange={(e) => updateOrderStatus(order.id, e.target.value as Order["status"])}
                                >
                                  <option value="active">Active</option>
                                  <option value="pending">Pending</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </div>
                              <Button className="w-full touch-manipulation">Save Changes</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

function SupportContent({
  messages,
  newMessage,
  setNewMessage,
  onSendMessage,
}: {
  messages: ChatMessage[]
  newMessage: string
  setNewMessage: (message: string) => void
  onSendMessage: () => void
}) {
  return (
    <div className="p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-bold font-display text-gray-900 mb-2">Support Chat</h2>
        <p className="text-gray-600 text-sm md:text-base">Communicate with customers in real-time.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-white shadow-lg h-80 md:h-96">
          <CardContent className="p-0 h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`flex ${message.isAdmin ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-3 md:px-4 py-2 rounded-lg ${
                      message.isAdmin ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-xs md:text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 ${message.isAdmin ? "text-blue-100" : "text-gray-500"}`}>
                      {message.user} • {message.timestamp}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === "Enter" && onSendMessage()}
                  className="flex-1 touch-manipulation"
                />
                <Button onClick={onSendMessage} className="bg-blue-600 hover:bg-blue-700 touch-manipulation">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

function AdminsContent() {
  const admins = [
    { id: "1", name: "John Admin", email: "john@ophosts.com", role: "Super Admin", lastLogin: "2024-01-15" },
    { id: "2", name: "Jane Manager", email: "jane@ophosts.com", role: "Manager", lastLogin: "2024-01-14" },
  ]

  return (
    <div className="p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-bold font-display text-gray-900 mb-2">Admin Management</h2>
        <p className="text-gray-600 text-sm md:text-base">Manage admin users and permissions.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-white shadow-lg">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs md:text-sm">Name</TableHead>
                    <TableHead className="text-xs md:text-sm">Email</TableHead>
                    <TableHead className="text-xs md:text-sm">Role</TableHead>
                    <TableHead className="text-xs md:text-sm">Last Login</TableHead>
                    <TableHead className="text-xs md:text-sm">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.map((admin, index) => (
                    <motion.tr
                      key={admin.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <TableCell className="font-medium text-xs md:text-sm">{admin.name}</TableCell>
                      <TableCell className="text-xs md:text-sm">{admin.email}</TableCell>
                      <TableCell>
                        <Badge variant={admin.role === "Super Admin" ? "default" : "secondary"} className="text-xs">
                          {admin.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs md:text-sm">{admin.lastLogin}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="touch-manipulation">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
