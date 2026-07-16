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
import { Label } from "@/components/ui/label"
import { InputPassword } from "@/components/form/input-password"
import UploadCrop from "@/components/form/upload-crop"
import { User, Shield, KeyRound, Loader2 } from "lucide-react"

export default function AccountPage() {
  const router = useRouter()
  const { data: session, isPending, refetch } = authClient.useSession()

  // Profile Form State
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  // Sync session details when loaded
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "")
      setEmail(session.user.email || "")
      // Make sure image path resolves properly. If it is relative (e.g. /storage/...), prepend API URL
      const userImage = session.user.image
      if (userImage) {
        setAvatarPreview(userImage)
      } else {
        setAvatarPreview(null)
      }
    }
  }, [session])

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/")
    }
  }, [session, isPending, router])

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error("Name cannot be empty")
      return
    }

    try {
      setIsUpdatingProfile(true)
      let base64Image: string | null = avatarPreview

      if (avatarFile) {
        base64Image = await fileToBase64(avatarFile)
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      await axios.put(`${apiUrl}/api/profile`, {
        name,
        image: base64Image,
      })

      toast.success("Profile updated successfully")
      await refetch()
    } catch (err: any) {
      console.error(err)
      const errorMsg = err.response?.data?.error || "Failed to update profile. Please try again."
      toast.error(errorMsg)
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    const hasPassword = (session?.user as any)?.hasPassword

    if (hasPassword && !currentPassword) {
      toast.error("Please enter your current password")
      return
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    try {
      setIsUpdatingPassword(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      await axios.put(`${apiUrl}/api/profile`, {
        currentPassword: hasPassword ? currentPassword : undefined,
        password: newPassword,
        confirmPassword: confirmPassword,
      })

      toast.success("Password updated successfully")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      await refetch()
    } catch (err: any) {
      console.error(err)
      const errorMsg = err.response?.data?.error || "Failed to update password. Please try again."
      toast.error(errorMsg)
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  if (isPending || !session) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Loading account details...</p>
        </div>
      </div>
    )
  }

  const hasPassword = (session?.user as any)?.hasPassword

  return (
    <AdminMainPageAdmin breadcrumb={[{ label: "Users" }, { label: "Account" }]}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your profile details and security credentials.</p>
        </div>

        <Tabs defaultValue="profile" className="w-full space-y-4">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="size-4" />
              Profile Info
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <KeyRound className="size-4" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="outline-none">
            <Card className="border border-border bg-card/60 backdrop-blur-xs">
              <CardHeader>
                <CardTitle>Profile Details</CardTitle>
                <CardDescription>Update your personal information and avatar photo.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="w-full md:w-auto">
                      <UploadCrop
                        name="avatar"
                        value={avatarFile}
                        previewUrl={avatarPreview}
                        onChange={(file) => {
                          setAvatarFile(file)
                          if (!file) {
                            setAvatarPreview(null)
                          }
                        }}
                        label="Profile Picture"
                        description="Upload PNG/JPG up to 2MB"
                        aspectRatio={1 / 1}
                      />
                    </div>
                    <div className="flex-1 space-y-4 w-full">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="Your Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          disabled={isUpdatingProfile}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          disabled
                          className="bg-muted/40 cursor-not-allowed opacity-80"
                        />
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                          <Shield className="size-3 text-muted-foreground" />
                          Email cannot be changed as it is locked to your account identity.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-border">
                    <Button type="submit" disabled={isUpdatingProfile} className="min-w-[120px]">
                      {isUpdatingProfile ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Profile"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="outline-none">
            <Card className="border border-border bg-card/60 backdrop-blur-xs">
              <CardHeader>
                <CardTitle>Update Password</CardTitle>
                <CardDescription>
                  {hasPassword
                    ? "Change your password regularly to keep your account secure."
                    : "Set up a password for your account so you can log in directly with your email."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-xl">
                  {hasPassword ? (
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <InputPassword
                        id="current-password"
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        disabled={isUpdatingPassword}
                      />
                    </div>
                  ) : (
                    <div className="p-3 bg-muted/40 rounded-lg text-xs text-muted-foreground border border-border mb-2">
                      💡 Because you logged in with Google, you don't have a password set yet. You can set a password now without entering a current password.
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <InputPassword
                      id="new-password"
                      placeholder="Minimum 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      disabled={isUpdatingPassword}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <InputPassword
                      id="confirm-password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isUpdatingPassword}
                    />
                  </div>

                  <div className="flex justify-end pt-4 border-t border-border">
                    <Button type="submit" disabled={isUpdatingPassword} className="min-w-[120px]">
                      {isUpdatingPassword ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Password"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminMainPageAdmin>
  )
}
