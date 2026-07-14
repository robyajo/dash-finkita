"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputPassword } from "@/components/form/input-password"
import { authClient } from "@/lib/auth-client"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"
import GoogleButton from "./google-button"

type FormErrors = {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!form.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required"
    }

    if (!form.password) {
      newErrors.password = "Password is required"
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setIsLoading(true)

    try {
      const { error } = await authClient.signUp.email({
        name: form.name,
        email: form.email,
        password: form.password,
        image: "",
      })

      if (error) {
        toast.error(error.message || "Registration failed")
        return
      }

      toast.success("Account created successfully")
      router.push("/dashboard")
    } catch (err: any) {
      toast.error(err.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) setErrors({ ...errors, [field]: undefined })
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      noValidate
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col gap-2 text-left">
          <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">
            Get started with your free account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            required
            className={cn("bg-background", errors.name && "border-destructive")}
            value={form.name}
            onChange={(e) => {
              setForm({ ...form, name: e.target.value })
              clearError("name")
            }}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            className={cn("bg-background", errors.email && "border-destructive")}
            value={form.email}
            onChange={(e) => {
              setForm({ ...form, email: e.target.value })
              clearError("email")
            }}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <InputPassword
            id="password"
            required
            placeholder="Min. 8 characters"
            className={cn("bg-background", errors.password && "border-destructive")}
            value={form.password}
            onChange={(e) => {
              setForm({ ...form, password: e.target.value })
              clearError("password")
            }}
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password}</p>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <InputPassword
            id="confirm-password"
            required
            placeholder="Re-enter your password"
            className={cn("bg-background", errors.confirmPassword && "border-destructive")}
            value={form.confirmPassword}
            onChange={(e) => {
              setForm({ ...form, confirmPassword: e.target.value })
              clearError("confirmPassword")
            }}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword}</p>
          )}
        </Field>
        <Field>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </Field>
        <FieldSeparator>or continue with</FieldSeparator>
        <Field>
          <GoogleButton variant="signup" />
          <p className="text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link href="/" className="underline underline-offset-4 hover:text-foreground">
              Sign in
            </Link>
          </p>
        </Field>
      </FieldGroup>
    </form>
  )
}
