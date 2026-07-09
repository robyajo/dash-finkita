"use client"
import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface RupiahInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> {
  value: number
  onChange: (value: number) => void
  className?: string
}

export default function RupiahInput({
  value,
  onChange,
  className,
  ...props
}: RupiahInputProps) {
  const [displayValue, setDisplayValue] = useState("")

  // Format number to Rupiah string: 1000000 -> "1.000.000"
  const formatRupiah = (num: number | string) => {
    const numberString = num.toString().replace(/[^0-9]/g, "")

    if (!numberString) {
      return ""
    }

    const split = numberString.split(",")
    const sisa = split[0].length % 3
    let rupiah = split[0].substr(0, sisa)
    const ribuan = split[0].substr(sisa).match(/\d{3}/gi)

    if (ribuan) {
      const separator = sisa ? "." : ""
      rupiah += separator + ribuan.join(".")
    }

    rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah

    return rupiah
  }

  // Unformat string to number: "1.000.000" -> 1000000
  const unformatRupiah = (str: string) => {
    return parseInt(str.replace(/[^0-9]/g, ""), 10) || 0
  }

  useEffect(() => {
    setDisplayValue(formatRupiah(value))
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    const formatted = formatRupiah(rawValue)
    setDisplayValue(formatted)

    const numericValue = unformatRupiah(formatted)
    onChange(numericValue)
  }

  return (
    <div className="relative w-full">
      <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground select-none">
        Rp
      </span>
      <Input
        {...props}
        type="text"
        value={displayValue}
        onChange={handleChange}
        className={cn("pl-10", className)}
        placeholder="0"
      />
    </div>
  )
}
