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
  email?: string
  password?: string
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState<FormErrors>({})

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!form.email.trim()) {
      newErrors.email = "Email is required"
    }

    if (!form.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setIsLoading(true)

    try {
      const { error } = await authClient.signIn.email({
        email: form.email,
        password: form.password,
      })

      if (error) {
        toast.error(error.message || "Login failed")
        return
      }

      toast.success("Login successful")
      router.push("/dashboard")
    } catch (err: any) {
      toast.error(err.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
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
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>
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
              if (errors.email) setErrors({ ...errors, email: undefined })
            }}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Link
              href="/forgot-password"
              className="ml-auto text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <InputPassword
            id="password"
            required
            placeholder="Enter your password"
            className={cn("bg-background", errors.password && "border-destructive")}
            value={form.password}
            onChange={(e) => {
              setForm({ ...form, password: e.target.value })
              if (errors.password) setErrors({ ...errors, password: undefined })
            }}
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password}</p>
          )}
        </Field>
        <Field>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </Field>
        <FieldSeparator>or continue with</FieldSeparator>
        <Field>
          <GoogleButton variant="signin" />
          <p className="text-center text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline underline-offset-4 hover:text-foreground">
              Create one
            </Link>
          </p>
        </Field>
      </FieldGroup>
    </form>
  )
}
