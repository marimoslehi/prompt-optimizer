"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Zap, User, Shield, Bell, CreditCard, Users, SettingsIcon, Key, Database, Globe, Mail, Smartphone, Lock, Eye, Download, Trash2, Plus, Edit, Save, AlertTriangle, CheckCircle, Info } from 'lucide-react'

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: "Sarah Chen",
    email: "sarah.chen@techcorp.com",
    role: "Head of AI Strategy",
    company: "TechCorp Inc.",
    timezone: "America/New_York",
    avatar: "",
  })

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    costAlerts: true,
    weeklyReports: true,
    teamUpdates: false,
    securityAlerts: true,
  })

  const [limits, setLimits] = useState({
    monthly: [1000],
    daily: [50],
    perQuery: [5],
  })

  const [privacy, setPrivacy] = useState({
    dataRetention: "90",
    shareAnalytics: false,
    allowTeamAccess: true,
    exportData: true,
  })

  const [security, setSecurity] = useState({
    twoFactor: true,
    sessionTimeout: "24",
    ipRestriction: false,
    auditLogs: true,
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-slate-900">Settings</h1>
                  <p className="text-sm text-slate-500">Manage your account and preferences</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Enterprise Plan</Badge>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white border border-slate-200">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4" />
              <span>Billing</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Team</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center space-x-2">
              <SettingsIcon className="w-4 h-4" />
              <span>Advanced</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="w-5 h-5 mr-2 text-blue-700" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={profile.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-blue-100 text-blue-700 text-xl">
                          {profile.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          Change Photo
                        </Button>
                        <p className="text-xs text-slate-500">JPG, PNG or GIF. Max size 2MB.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="role">Job Title</Label>
                        <Input
                          id="role"
                          value={profile.role}
                          onChange={(e) => setProfile((prev) => ({ ...prev, role: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={profile.company}
                          onChange={(e) => setProfile((prev) => ({ ...prev, company: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select value={profile.timezone} onValueChange={(value) => setProfile((prev) => ({ ...prev, timezone: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                          <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                          <SelectItem value="Europe/London">London (GMT)</SelectItem>
                          <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button className="bg-blue-700 hover:bg-blue-800">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Account Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Plan</span>
                      <Badge className="bg-blue-50 text-blue-700 border-blue-200">Enterprise</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Status</span>
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Member Since</span>
                      <span className="text-sm font-medium">Jan 2024</span>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">API Usage</span>
                        <span className="font-medium">2,847 / 10,000</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: "28%" }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Download className="w-4 h-4 mr-2" />
                      Download Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Key className="w-4 h-4 mr-2" />
                      Manage API Keys
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-blue-700" />
                    Authentication
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Two-Factor Authentication</Label>
                      <p className="text-sm text-slate-500">Add an extra layer of security to your account</p>
                    </div>
                    <Switch
                      checked={security.twoFactor}
                      onCheckedChange={(checked) => setSecurity((prev) => ({ ...prev, twoFactor: checked }))}
                    />
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-base font-medium">Session Timeout</Label>
                    <p className="text-sm text-slate-500 mb-3">Automatically log out after inactivity</p>
                    <Select
                      value={security.sessionTimeout}
                      onValueChange={(value) => setSecurity((prev) => ({ ...prev, sessionTimeout: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hour</SelectItem>
                        <SelectItem value="8">8 hours</SelectItem>
                        <SelectItem value="24">24 hours</SelectItem>
                        <SelectItem value="168">1 week</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">IP Restriction</Label>
                      <p className="text-sm text-slate-500">Only allow access from specific IP addresses</p>
                    </div>
                    <Switch
                      checked={security.ipRestriction}
                      onCheckedChange={(checked) => setSecurity((prev) => ({ ...prev, ipRestriction: checked }))}
                    />
                  </div>

                  {security.ipRestriction && (
                    <div>
                      <Label htmlFor="allowed-ips">Allowed IP Addresses</Label>
                      <Textarea
                        id="allowed-ips"
                        placeholder="192.168.1.1&#10;10.0.0.0/24"
                        className="mt-1"
                        rows={3}
                      />
                      <p className="text-xs text-slate-500 mt-1">One IP address or CIDR block per line</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="w-5 h-5 mr-2 text-blue-700" />
                    Data & Privacy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">Data Retention</Label>
                    <p className="text-sm text-slate-500 mb-3">How long to keep your data</p>
                    <Select
                      value={privacy.dataRetention}
                      onValueChange={(value) => setPrivacy((prev) => ({ ...prev, dataRetention: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">6 months</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                        <SelectItem value="forever">Forever</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Share Analytics</Label>
                      <p className="text-sm text-slate-500">Help improve our platform with anonymous usage data</p>
                    </div>
                    <Switch
                      checked={privacy.shareAnalytics}
                      onCheckedChange={(checked) => setPrivacy((prev) => ({ ...prev, shareAnalytics: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Audit Logs</Label>
                      <p className="text-sm text-slate-500">Keep detailed logs of account activity</p>
                    </div>
                    <Switch
                      checked={security.auditLogs}
                      onCheckedChange={(checked) => setSecurity((prev) => ({ ...prev, auditLogs: checked }))}
                    />
                  </div>

                  <Separator />

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-orange-900">Data Export</h4>
                        <p className="text-sm text-orange-700 mt-1">
                          You can export all your data at any time. This includes prompts, responses, and usage analytics.
                        </p>
                        <Button variant="outline" size="sm" className="mt-3 border-orange-300 text-orange-700 hover:bg-orange-100">
                          <Download className="w-4 h-4 mr-2" />
                          Export Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-blue-700" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-slate-900 mb-4">Delivery Methods</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Mail className="w-4 h-4 text-slate-500" />
                            <div>
                              <Label className="text-base font-medium">Email Notifications</Label>
                              <p className="text-sm text-slate-500">Receive notifications via email</p>
                            </div>
                          </div>
                          <Switch
                            checked={notifications.email}
                            onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, email: checked }))}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Smartphone className="w-4 h-4 text-slate-500" />
                            <div>
                              <Label className="text-base font-medium">Push Notifications</Label>
                              <p className="text-sm text-slate-500">Receive push notifications on your devices</p>
                            </div>
                          </div>
                          <Switch
                            checked={notifications.push}
                            onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, push: checked }))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-slate-900 mb-4">Notification Types</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base font-medium">Cost Alerts</Label>
                            <p className="text-sm text-slate-500">When approaching spending limits</p>
                          </div>
                          <Switch
                            checked={notifications.costAlerts}
                            onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, costAlerts: checked }))}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base font-medium">Weekly Reports</Label>
                            <p className="text-sm text-slate-500">Summary of your usage and savings</p>
                          </div>
                          <Switch
                            checked={notifications.weeklyReports}
                            onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, weeklyReports: checked }))}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base font-medium">Team Updates</Label>
                            <p className="text-sm text-slate-500">When team members share prompts or results</p>
                          </div>
                          <Switch
                            checked={notifications.teamUpdates}
                            onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, teamUpdates: checked }))}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base font-medium">Security Alerts</Label>
                            <p className="text-sm text-slate-500">Important security notifications</p>
                          </div>
                          <Switch
                            checked={notifications.securityAlerts}
                            onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, securityAlerts: checked }))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-900">Notification Schedule</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Notifications are sent during business hours (9 AM - 6 PM) in your timezone unless marked as urgent.
                      </p>
                    </div>
                  </div>
                </div>

                <Button className="bg-blue-700 hover:bg-blue-800">
                  <Save className="w-4 h-4 mr-2" />
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-2 text-blue-700" />
                      Usage Limits & Controls
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Label className="text-base font-medium">Monthly Spending Limit</Label>
                        <span className="text-lg font-semibold">${limits.monthly[0]}</span>
                      </div>
                      <Slider
                        value={limits.monthly}
                        onValueChange={(value) => setLimits((prev) => ({ ...prev, monthly: value }))}
                        max={5000}
                        min={100}
                        step={100}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-slate-500 mt-2">
                        <span>$100</span>
                        <span>$5,000</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Label className="text-base font-medium">Daily Spending Limit</Label>
                        <span className="text-lg font-semibold">${limits.daily[0]}</span>
                      </div>
                      <Slider
                        value={limits.daily}
                        onValueChange={(value) => setLimits((prev) => ({ ...prev, daily: value }))}
                        max={200}
                        min={10}
                        step={10}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-slate-500 mt-2">
                        <span>$10</span>
                        <span>$200</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Label className="text-base font-medium">Per-Query Limit</Label>
                        <span className="text-lg font-semibold">${limits.perQuery[0]}</span>
                      </div>
                      <Slider
                        value={limits.perQuery}
                        onValueChange={(value) => setLimits((prev) => ({ ...prev, perQuery: value }))}
                        max={20}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-slate-500 mt-2">
                        <span>$1</span>
                        <span>$20</span>
                      </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-emerald-900">Smart Limits Active</h4>
                          <p className="text-sm text-emerald-700 mt-1">
                            Your limits are automatically optimized based on usage patterns to maximize savings while maintaining quality.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Current Usage</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600">This Month</span>
                        <span className="font-medium">$247 / $1,000</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: "24.7%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600">Today</span>
                        <span className="font-medium">$12 / $50</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "24%" }}></div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">API Calls</span>
                        <span className="font-medium">2,847</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Avg Cost/Call</span>
                        <span className="font-medium">$0.087</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Total Savings</span>
                        <span className="font-medium text-emerald-600">$1,247</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Billing Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Plan</span>
                      <Badge className="bg-blue-50 text-blue-700 border-blue-200">Enterprise</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Billing Cycle</span>
                      <span className="text-sm font-medium">Monthly</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Next Bill</span>
                      <span className="text-sm font-medium">Feb 15, 2024</span>
                    </div>

                    <Separator />

                    <Button variant="outline" className="w-full bg-transparent">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Update Payment Method
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-700" />
                    Team Members
                  </CardTitle>
                  <Button className="bg-blue-700 hover:bg-blue-800">
                    <Plus className="w-4 h-4 mr-2" />
                    Invite Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Sarah Chen", email: "sarah.chen@techcorp.com", role: "Admin", status: "Active" },
                    { name: "Mike Johnson", email: "mike.johnson@techcorp.com", role: "Member", status: "Active" },
                    { name: "Lisa Wang", email: "lisa.wang@techcorp.com", role: "Member", status: "Pending" },
                  ].map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback className="bg-slate-100">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-slate-900">{member.name}</div>
                          <div className="text-sm text-slate-500">{member.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge
                          variant="outline"
                          className={member.role === "Admin" ? "border-blue-200 text-blue-700" : ""}
                        >
                          {member.role}
                        </Badge>
                        <Badge
                          className={
                            member.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-orange-50 text-orange-700 border-orange-200"
                          }
                        >
                          {member.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-blue-700" />
                    API Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="api-endpoint">Custom API Endpoint</Label>
                    <Input
                      id="api-endpoint"
                      placeholder="https://api.promptoptimizer.com/v1"
                      className="font-mono text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <Input
                      id="webhook-url"
                      placeholder="https://your-app.com/webhooks/prompt-optimizer"
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Enable Webhooks</Label>
                      <p className="text-sm text-slate-500">Receive real-time notifications</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-red-600">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Danger Zone
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <h4 className="font-medium text-red-900 mb-2">Delete Account</h4>
                    <p className="text-sm text-red-700 mb-4">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>

                  <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                    <h4 className="font-medium text-orange-900 mb-2">Reset All Settings</h4>
                    <p className="text-sm text-orange-700 mb-4">
                      Reset all settings to default values. Your data will be preserved.
                    </p>
                    <Button variant="outline" size="sm" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                      Reset Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
