"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"
import axios from "@/lib/axios"

import AdminMainPageAdmin from "@/components/common/admin-main-page"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

import { 
  Wallet, 
  PiggyBank, 
  Coins, 
  CreditCard, 
  Landmark, 
  Briefcase, 
  ShoppingBag, 
  Star, 
  Edit2, 
  Trash2, 
  Plus, 
  Loader2, 
  Sparkles, 
  FolderHeart,
  PlusCircle
} from "lucide-react"

// Types matching Hono schema
interface MasterPocket {
  id: string
  name: string
  icon: string
  description: string | null
}

interface UserPocket {
  id: string
  name: string
  icon: string
  description: string | null
  balance: number
  isFavorite: boolean
  masterPocketId: string | null
}

// Icon Mapping helper
const ICON_MAP: Record<string, React.ComponentType<any>> = {
  wallet: Wallet,
  "piggy-bank": PiggyBank,
  coins: Coins,
  "credit-card": CreditCard,
  landmark: Landmark,
  briefcase: Briefcase,
  "shopping-bag": ShoppingBag,
}

const getIcon = (name: string, className = "size-5 text-primary") => {
  const IconComponent = ICON_MAP[name.toLowerCase()] || Wallet
  return <IconComponent className={className} />
}

export default function PocketsPage() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  // Data States
  const [pockets, setPockets] = useState<UserPocket[]>([])
  const [masterPockets, setMasterPockets] = useState<MasterPocket[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Modal control states
  const [isPocketDialogOpen, setIsPocketDialogOpen] = useState(false)
  const [isMasterDialogOpen, setIsMasterDialogOpen] = useState(false)
  const [isDeletePocketOpen, setIsDeletePocketOpen] = useState(false)
  const [isDeleteMasterOpen, setIsDeleteMasterOpen] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)

  // Selected item states (for Edit & Delete)
  const [selectedPocket, setSelectedPocket] = useState<UserPocket | null>(null)
  const [selectedMaster, setSelectedMaster] = useState<MasterPocket | null>(null)

  // Form Field States
  const [pocketName, setPocketName] = useState("")
  const [pocketIcon, setPocketIcon] = useState("wallet")
  const [pocketDescription, setPocketDescription] = useState("")
  const [pocketBalance, setPocketBalance] = useState("0")
  const [pocketIsFavorite, setPocketIsFavorite] = useState(false)
  const [pocketMasterId, setPocketMasterId] = useState("")

  const [masterName, setMasterName] = useState("")
  const [masterIcon, setMasterIcon] = useState("wallet")
  const [masterDescription, setMasterDescription] = useState("")

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch Data
  const fetchData = async () => {
    try {
      setIsLoading(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      
      const [pocketsRes, masterRes] = await Promise.all([
        axios.get(`${apiUrl}/api/pockets`),
        axios.get(`${apiUrl}/api/pockets/master`),
      ])

      setPockets(pocketsRes.data)
      setMasterPockets(masterRes.data)
    } catch (err) {
      console.error("Error fetching pockets data:", err)
      toast.error("Failed to fetch pockets data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!isPending && session) {
      fetchData()
    }
  }, [session, isPending])

  // Redirect if unauthenticated
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/")
    }
  }, [session, isPending, router])

  // Pocket Handlers
  const openAddPocket = () => {
    setSelectedPocket(null)
    setPocketName("")
    setPocketIcon("wallet")
    setPocketDescription("")
    setPocketBalance("0")
    setPocketIsFavorite(false)
    setPocketMasterId("")
    setIsPocketDialogOpen(true)
  }

  const openEditPocket = (pocket: UserPocket) => {
    setSelectedPocket(pocket)
    setPocketName(pocket.name)
    setPocketIcon(pocket.icon)
    setPocketDescription(pocket.description || "")
    setPocketBalance(pocket.balance.toString())
    setPocketIsFavorite(pocket.isFavorite)
    setPocketMasterId(pocket.masterPocketId || "")
    setIsPocketDialogOpen(true)
  }

  const openDeletePocket = (pocket: UserPocket) => {
    setSelectedPocket(pocket)
    setIsDeletePocketOpen(true)
  }

  const handlePocketSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pocketName.trim()) {
      toast.error("Pocket name is required")
      return
    }

    try {
      setIsSubmitting(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      const payload = {
        name: pocketName,
        icon: pocketIcon,
        description: pocketDescription || undefined,
        balance: parseFloat(pocketBalance) || 0,
        isFavorite: pocketIsFavorite,
        masterPocketId: pocketMasterId || null,
      }

      if (selectedPocket) {
        // Edit Mode
        await axios.put(`${apiUrl}/api/pockets/${selectedPocket.id}`, payload)
        toast.success("Pocket updated successfully")
      } else {
        // Create Mode
        await axios.post(`${apiUrl}/api/pockets`, payload)
        toast.success("Pocket created successfully")
      }

      setIsPocketDialogOpen(false)
      fetchData()
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.error || "Failed to save pocket")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePocketDelete = async () => {
    if (!selectedPocket) return
    try {
      setIsSubmitting(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      await axios.delete(`${apiUrl}/api/pockets/${selectedPocket.id}`)
      toast.success("Pocket deleted successfully")
      setIsDeletePocketOpen(false)
      fetchData()
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.error || "Failed to delete pocket")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleFavorite = async (pocket: UserPocket) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      await axios.put(`${apiUrl}/api/pockets/${pocket.id}`, {
        isFavorite: !pocket.isFavorite,
      })
      toast.success(pocket.isFavorite ? "Removed from favorites" : "Added to favorites")
      fetchData()
    } catch (err) {
      console.error(err)
      toast.error("Failed to update favorite status")
    }
  }

  const handleInitializeDefaults = async () => {
    try {
      setIsInitializing(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      const res = await axios.post(`${apiUrl}/api/pockets/initialize`)
      toast.success(res.data.message || "Templates initialized successfully")
      fetchData()
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.error || "Failed to initialize default templates")
    } finally {
      setIsInitializing(false)
    }
  }

  // Master Pocket Handlers (Admin Only)
  const openAddMaster = () => {
    setSelectedMaster(null)
    setMasterName("")
    setMasterIcon("wallet")
    setMasterDescription("")
    setIsMasterDialogOpen(true)
  }

  const openEditMaster = (master: MasterPocket) => {
    setSelectedMaster(master)
    setMasterName(master.name)
    setMasterIcon(master.icon)
    setMasterDescription(master.description || "")
    setIsMasterDialogOpen(true)
  }

  const openDeleteMaster = (master: MasterPocket) => {
    setSelectedMaster(master)
    setIsDeleteMasterOpen(true)
  }

  const handleMasterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!masterName.trim()) {
      toast.error("Template name is required")
      return
    }

    try {
      setIsSubmitting(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      const payload = {
        name: masterName,
        icon: masterIcon,
        description: masterDescription || undefined,
      }

      if (selectedMaster) {
        await axios.put(`${apiUrl}/api/pockets/master/${selectedMaster.id}`, payload)
        toast.success("Master template updated successfully")
      } else {
        await axios.post(`${apiUrl}/api/pockets/master`, payload)
        toast.success("Master template created successfully")
      }

      setIsMasterDialogOpen(false)
      fetchData()
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.error || "Failed to save master template")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMasterDelete = async () => {
    if (!selectedMaster) return
    try {
      setIsSubmitting(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      await axios.delete(`${apiUrl}/api/pockets/master/${selectedMaster.id}`)
      toast.success("Master template deleted successfully")
      setIsDeleteMasterOpen(false)
      fetchData()
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.error || "Failed to delete template")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Currency Formatter
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (isPending || isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Loading pockets data...</p>
        </div>
      </div>
    )
  }

  const isAdmin = (session?.user as any)?.role === "ADMIN"

  return (
    <AdminMainPageAdmin breadcrumb={[{ label: "Pockets" }]}>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pocket Management</h1>
            <p className="text-muted-foreground mt-1">Separate budgets, set favorites, and monitor individual wallet category balances.</p>
          </div>
          <div className="flex items-center gap-2">
            {pockets.length === 0 && masterPockets.length > 0 && (
              <Button 
                variant="outline" 
                onClick={handleInitializeDefaults} 
                disabled={isInitializing}
                className="flex items-center gap-1.5"
              >
                {isInitializing ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4 text-amber-500" />}
                Import Default Templates
              </Button>
            )}
            <Button onClick={openAddPocket} className="flex items-center gap-1.5">
              <Plus className="size-4" />
              Add Pocket
            </Button>
          </div>
        </div>

        {isAdmin ? (
          <Tabs defaultValue="user-pockets" className="w-full space-y-4">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="user-pockets">My Pockets</TabsTrigger>
              <TabsTrigger value="master-pockets">Master Templates (Admin)</TabsTrigger>
            </TabsList>

            <TabsContent value="user-pockets" className="outline-none space-y-4">
              {pockets.length === 0 ? (
                <Card className="border-dashed flex flex-col items-center justify-center py-16 text-center space-y-4">
                  <div className="size-12 rounded-full bg-muted flex items-center justify-center">
                    <FolderHeart className="size-6 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">No pockets created yet</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">Create your first custom pocket, or import default pockets created by the admin.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {masterPockets.length > 0 && (
                      <Button onClick={handleInitializeDefaults} disabled={isInitializing} variant="outline">
                        {isInitializing && <Loader2 className="mr-2 size-4 animate-spin" />}
                        Import Predefined Templates
                      </Button>
                    )}
                    <Button onClick={openAddPocket}>
                      Create Pocket
                    </Button>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pockets.map((pocket) => (
                    <Card key={pocket.id} className="relative group overflow-hidden border border-border bg-card/60 backdrop-blur-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg">
                      <button
                        onClick={() => handleToggleFavorite(pocket)}
                        className="absolute top-4 right-4 z-10 p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-amber-500 transition-colors"
                        title={pocket.isFavorite ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Star className={`size-4.5 ${pocket.isFavorite ? "fill-amber-500 text-amber-500" : "text-muted-foreground"}`} />
                      </button>

                      <CardHeader className="flex flex-row items-center gap-4 pb-2">
                        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          {getIcon(pocket.icon, "size-5 text-primary")}
                        </div>
                        <div className="flex-1 min-w-0 pr-6">
                          <CardTitle className="text-base font-semibold truncate">{pocket.name}</CardTitle>
                          <CardDescription className="text-xs truncate">{pocket.description || "No description"}</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Current Balance</p>
                          <p className="text-2xl font-bold tracking-tight text-foreground">{formatCurrency(pocket.balance)}</p>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-border/60">
                          {pocket.masterPocketId ? (
                            <Badge variant="secondary" className="text-[10px] py-0.5">Template</Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] py-0.5">Custom</Badge>
                          )}
                          <div className="flex items-center gap-1">
                            <Button size="icon" variant="ghost" className="size-8 text-muted-foreground hover:text-foreground" onClick={() => openEditPocket(pocket)}>
                              <Edit2 className="size-3.5" />
                            </Button>
                            <Button size="icon" variant="ghost" className="size-8 text-destructive hover:bg-destructive/10" onClick={() => openDeletePocket(pocket)}>
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="master-pockets" className="outline-none space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">Default Master Templates</h3>
                  <p className="text-xs text-muted-foreground">Admin can manage standard budget separation templates available to all users.</p>
                </div>
                <Button onClick={openAddMaster} size="sm" variant="outline" className="flex items-center gap-1.5">
                  <PlusCircle className="size-4 text-primary" />
                  Add Master Template
                </Button>
              </div>

              {masterPockets.length === 0 ? (
                <Card className="border-dashed flex flex-col items-center justify-center py-12 text-center space-y-2">
                  <p className="text-sm text-muted-foreground">No master pocket templates registered in the system.</p>
                  <Button size="sm" onClick={openAddMaster}>Create Template</Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {masterPockets.map((master) => (
                    <Card key={master.id} className="border border-border bg-card/60 backdrop-blur-xs flex flex-col justify-between">
                      <CardHeader className="flex flex-row items-center gap-3 pb-3">
                        <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          {getIcon(master.icon, "size-4 text-primary")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm font-semibold truncate">{master.name}</CardTitle>
                          <CardDescription className="text-xs font-mono">{master.icon}</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                        <p className="text-xs text-muted-foreground line-clamp-2 min-h-8">{master.description || "No description provided."}</p>
                        <div className="flex justify-end gap-1.5 pt-3 border-t border-border/40">
                          <Button size="sm" variant="outline" onClick={() => openEditMaster(master)}>
                            Edit
                          </Button>
                          <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => openDeleteMaster(master)}>
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          /* User Mode: Simply list pockets without templates tab */
          <div className="space-y-4">
            {pockets.length === 0 ? (
              <Card className="border-dashed flex flex-col items-center justify-center py-16 text-center space-y-4">
                <div className="size-12 rounded-full bg-muted flex items-center justify-center">
                  <FolderHeart className="size-6 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">No pockets created yet</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">Create your first custom pocket, or import default pockets created by the admin.</p>
                </div>
                <div className="flex items-center gap-2">
                  {masterPockets.length > 0 && (
                    <Button onClick={handleInitializeDefaults} disabled={isInitializing} variant="outline">
                      {isInitializing && <Loader2 className="mr-2 size-4 animate-spin" />}
                      Import Predefined Templates
                    </Button>
                  )}
                  <Button onClick={openAddPocket}>
                    Create Pocket
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pockets.map((pocket) => (
                  <Card key={pocket.id} className="relative group overflow-hidden border border-border bg-card/60 backdrop-blur-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg">
                    <button
                      onClick={() => handleToggleFavorite(pocket)}
                      className="absolute top-4 right-4 z-10 p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-amber-500 transition-colors"
                      title={pocket.isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Star className={`size-4.5 ${pocket.isFavorite ? "fill-amber-500 text-amber-500" : "text-muted-foreground"}`} />
                    </button>

                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                      <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        {getIcon(pocket.icon, "size-5 text-primary")}
                      </div>
                      <div className="flex-1 min-w-0 pr-6">
                        <CardTitle className="text-base font-semibold truncate">{pocket.name}</CardTitle>
                        <CardDescription className="text-xs truncate">{pocket.description || "No description"}</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Current Balance</p>
                        <p className="text-2xl font-bold tracking-tight text-foreground">{formatCurrency(pocket.balance)}</p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-border/60">
                        {pocket.masterPocketId ? (
                          <Badge variant="secondary" className="text-[10px] py-0.5">Template</Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] py-0.5">Custom</Badge>
                        )}
                        <div className="flex items-center gap-1">
                          <Button size="icon" variant="ghost" className="size-8 text-muted-foreground hover:text-foreground" onClick={() => openEditPocket(pocket)}>
                            <Edit2 className="size-3.5" />
                          </Button>
                          <Button size="icon" variant="ghost" className="size-8 text-destructive hover:bg-destructive/10" onClick={() => openDeletePocket(pocket)}>
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* DIALOGS & MODALS */}
      {/* ========================================== */}

      {/* 1. Add/Edit Pocket Dialog */}
      <Dialog open={isPocketDialogOpen} onOpenChange={setIsPocketDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedPocket ? "Edit Pocket" : "Add Pocket"}</DialogTitle>
            <DialogDescription>
              {selectedPocket ? "Update your pocket specifications." : "Create a separate wallet allocation category."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePocketSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pocket-name">Pocket Name</Label>
              <Input
                id="pocket-name"
                placeholder="e.g., Daily Food"
                value={pocketName}
                onChange={(e) => setPocketName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pocket-icon">Icon</Label>
                <NativeSelect
                  id="pocket-icon"
                  value={pocketIcon}
                  onChange={(e) => setPocketIcon(e.target.value)}
                  className="w-full"
                >
                  <NativeSelectOption value="wallet">Wallet 💼</NativeSelectOption>
                  <NativeSelectOption value="piggy-bank">Piggy Bank 🐷</NativeSelectOption>
                  <NativeSelectOption value="coins">Coins 🪙</NativeSelectOption>
                  <NativeSelectOption value="credit-card">Credit Card 💳</NativeSelectOption>
                  <NativeSelectOption value="landmark">Landmark 🏛️</NativeSelectOption>
                  <NativeSelectOption value="briefcase">Briefcase 💼</NativeSelectOption>
                  <NativeSelectOption value="shopping-bag">Shopping Bag 🛍️</NativeSelectOption>
                </NativeSelect>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pocket-template">Template Reference (Optional)</Label>
                <NativeSelect
                  id="pocket-template"
                  value={pocketMasterId}
                  onChange={(e) => {
                    setPocketMasterId(e.target.value)
                    // Autofill name and icon if template is selected
                    const selected = masterPockets.find((mp) => mp.id === e.target.value)
                    if (selected) {
                      setPocketName(selected.name)
                      setPocketIcon(selected.icon)
                      setPocketDescription(selected.description || "")
                    }
                  }}
                  className="w-full"
                >
                  <NativeSelectOption value="">None (Custom)</NativeSelectOption>
                  {masterPockets.map((mp) => (
                    <NativeSelectOption key={mp.id} value={mp.id}>
                      {mp.name}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pocket-balance">Initial Balance (Rp)</Label>
              <Input
                id="pocket-balance"
                type="number"
                value={pocketBalance}
                onChange={(e) => setPocketBalance(e.target.value)}
                min="0"
                step="any"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pocket-description">Description</Label>
              <Textarea
                id="pocket-description"
                placeholder="Optional notes about budget usage"
                value={pocketDescription}
                onChange={(e) => setPocketDescription(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Checkbox
                id="pocket-favorite"
                checked={pocketIsFavorite}
                onCheckedChange={(checked) => setPocketIsFavorite(!!checked)}
              />
              <Label htmlFor="pocket-favorite" className="cursor-pointer text-xs">
                Mark as favorite pocket
              </Label>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsPocketDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                Save Pocket
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. Add/Edit Master Template Dialog */}
      <Dialog open={isMasterDialogOpen} onOpenChange={setIsMasterDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedMaster ? "Edit Master Template" : "Add Master Template"}</DialogTitle>
            <DialogDescription>
              Create predefined category guidelines for user budget envelopes.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleMasterSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="master-name">Template Name</Label>
              <Input
                id="master-name"
                placeholder="e.g., Vacation Fund"
                value={masterName}
                onChange={(e) => setMasterName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="master-icon">Icon</Label>
              <NativeSelect
                id="master-icon"
                value={masterIcon}
                onChange={(e) => setMasterIcon(e.target.value)}
                className="w-full"
              >
                <NativeSelectOption value="wallet">Wallet 💼</NativeSelectOption>
                <NativeSelectOption value="piggy-bank">Piggy Bank 🐷</NativeSelectOption>
                <NativeSelectOption value="coins">Coins 🪙</NativeSelectOption>
                <NativeSelectOption value="credit-card">Credit Card 💳</NativeSelectOption>
                <NativeSelectOption value="landmark">Landmark 🏛️</NativeSelectOption>
                <NativeSelectOption value="briefcase">Briefcase 💼</NativeSelectOption>
                <NativeSelectOption value="shopping-bag">Shopping Bag 🛍️</NativeSelectOption>
              </NativeSelect>
            </div>

            <div className="space-y-2">
              <Label htmlFor="master-description">Description</Label>
              <Textarea
                id="master-description"
                placeholder="Guidelines for users setting up this budget"
                value={masterDescription}
                onChange={(e) => setMasterDescription(e.target.value)}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsMasterDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                Save Template
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 3. Delete Pocket Confirmation Dialog */}
      <Dialog open={isDeletePocketOpen} onOpenChange={setIsDeletePocketOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Pocket</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete pocket <strong>{selectedPocket?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2 gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeletePocketOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handlePocketDelete} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 4. Delete Master Confirmation Dialog */}
      <Dialog open={isDeleteMasterOpen} onOpenChange={setIsDeleteMasterOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete template <strong>{selectedMaster?.name}</strong>? Existing pockets built from this template will remain but lose their reference.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2 gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleteMasterOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleMasterDelete} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminMainPageAdmin>
  )
}
