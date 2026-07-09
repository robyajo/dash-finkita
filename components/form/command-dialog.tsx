import { Check, ChevronsUpDown } from "lucide-react"
import * as React from "react"
import Image from "next/image"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"

interface SelectItem {
  id: string | number
  name: string
  logo?: string
}

interface CommandSelectProps {
  items: SelectItem[]
  selectedIds: (string | number)[]
  onChange: (ids: (string | number)[]) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  label?: string
  multiple?: boolean
  triggerClassName?: string
}

export function CommandSelect({
  items,
  selectedIds,
  onChange,
  placeholder = "Pilih...",
  searchPlaceholder = "Cari...",
  emptyText = "Tidak ditemukan.",
  label,
  multiple = true,
  triggerClassName,
}: CommandSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const selectedSet = React.useMemo(() => new Set(selectedIds), [selectedIds])

  const allSelected = items.length > 0 && selectedIds.length === items.length

  const selectedItems = React.useMemo(
    () => items.filter((item) => selectedSet.has(item.id)),
    [items, selectedSet]
  )

  const filteredItems = React.useMemo(
    () =>
      search.trim()
        ? items.filter((item) =>
            item.name.toLowerCase().includes(search.toLowerCase())
          )
        : items,
    [items, search]
  )

  const toggle = (id: string | number) => {
    if (!multiple) {
      onChange([id])
      setOpen(false)

      return
    }

    const next = new Set(selectedSet)

    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }

    onChange(Array.from(next))
  }

  const handleSelectAll = () => {
    if (allSelected) {
      onChange([])
    } else {
      onChange(items.map((i) => i.id))
    }
  }

  return (
    <div className="space-y-2">
      {label && (
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </span>
      )}

      <Button
        type="button"
        variant="outline"
        role="combobox"
        onClick={() => setOpen(true)}
        className={cn(
          "w-full justify-between text-left font-normal",
          triggerClassName
        )}
      >
        {selectedItems.length > 0 ? (
          <div className="flex items-center gap-2 truncate">
            {!multiple && selectedItems[0].logo ? (
              <Image
                width={640}
                height={480}
                src={`/storage/${selectedItems[0].logo}`}
                alt={selectedItems[0].name}
                className="h-6 w-6 shrink-0 rounded-md border border-border object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                }}
              />
            ) : !multiple ? (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-[10px] font-bold text-muted-foreground uppercase">
                {selectedItems[0].name.substring(0, 2)}
              </div>
            ) : null}
            <span className="truncate">
              {multiple
                ? `${selectedItems.length} dipilih`
                : selectedItems[0].name}
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {multiple && selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedItems.map((item) => (
            <Badge
              key={item.id}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => toggle(item.id)}
            >
              {item.name}
              <span className="ml-1 text-xs">&times;</span>
            </Badge>
          ))}
        </div>
      )}

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            className="h-10"
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {filteredItems.map((item) => {
                const isSelected = selectedSet.has(item.id)

                return (
                  <CommandItem
                    key={item.id}
                    value={item.id.toString()}
                    onSelect={() => {
                      toggle(item.id)
                    }}
                    className="flex cursor-pointer items-center gap-2 py-3"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <Check
                        className={cn(
                          "h-4 w-4 shrink-0",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {item.logo ? (
                        <Image
                          width={640}
                          height={480}
                          src={`/storage/${item.logo}`}
                          alt={item.name}
                          className="h-6 w-6 shrink-0 rounded-md border border-border object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none"
                          }}
                        />
                      ) : (
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-[10px] font-bold text-muted-foreground uppercase">
                          {item.name.substring(0, 2)}
                        </div>
                      )}
                      <span className="truncate font-medium">{item.name}</span>
                    </div>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {multiple && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem onSelect={handleSelectAll}>
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        allSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {allSelected ? "Hapus Semua" : "Pilih Semua"}
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  )
}
