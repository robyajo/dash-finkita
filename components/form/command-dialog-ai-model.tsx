import {
  Check,
  ChevronsUpDown,
  Coins,
  ImageIcon,
  Cpu,
  Volume2,
  Video,
} from "lucide-react"
import * as React from "react"

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
} from "@/components/ui/command"
import { cn } from "@/lib/utils"

export interface AiModelSelectItem {
  id: number
  name: string
  model_id: string
  provider_name: string
  coin: number
  supports_image: boolean
  supports_text: boolean
  supports_audio: boolean
  supports_video: boolean
  description?: string | null
}

interface AiModelCommandSelectProps {
  providerGroups: {
    provider_id: number
    provider_name: string
    models: AiModelSelectItem[]
  }[]
  selectedId: number | null
  onChange: (id: number | null) => void
  balance?: number
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  label?: string
  modelType?:
    | "Text"
    | "Image"
    | "Voice"
    | "Video"
    | ("Text" | "Image" | "Voice" | "Video")[]
}

function matchesType(
  model: AiModelSelectItem,
  type: "Text" | "Image" | "Voice" | "Video"
): boolean {
  if (type === "Text") return model.supports_text
  if (type === "Image") return model.supports_image
  if (type === "Voice") return model.supports_audio
  if (type === "Video") return model.supports_video
  return true
}

function matchesAllTypes(
  model: AiModelSelectItem,
  modelType?:
    | "Text"
    | "Image"
    | "Voice"
    | "Video"
    | ("Text" | "Image" | "Voice" | "Video")[]
): boolean {
  if (!modelType) return true
  if (Array.isArray(modelType)) {
    return modelType.some((type) => matchesType(model, type))
  }
  return matchesType(model, modelType)
}

export function AiModelCommandSelect({
  providerGroups,
  selectedId,
  onChange,
  balance = 0,
  placeholder = "Pilih model AI...",
  searchPlaceholder = "Cari model AI...",
  emptyText = "Tidak ditemukan.",
  label,
  modelType,
}: AiModelCommandSelectProps) {
  const [open, setOpen] = React.useState(false)

  const allModels = React.useMemo(() => {
    let models = providerGroups.flatMap((g) => g.models)
    return models.filter((m) => matchesAllTypes(m, modelType))
  }, [providerGroups, modelType])

  const selectedModel = React.useMemo(
    () => allModels.find((m) => m.id === selectedId),
    [allModels, selectedId]
  )

  const filteredGroups = React.useMemo(() => {
    return providerGroups
      .map((g) => {
        let models = g.models.filter((m) => matchesAllTypes(m, modelType))
        return {
          ...g,
          models,
        }
      })
      .filter((g) => g.models.length > 0)
  }, [providerGroups, modelType])

  return (
    <div className="space-y-2">
      {label && <span className="text-sm font-medium">{label}</span>}

      <Button
        type="button"
        variant="outline"
        role="combobox"
        onClick={() => setOpen(true)}
        className="w-full justify-between text-left font-normal"
      >
        {selectedModel ? (
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Cpu className="size-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{selectedModel.name}</span>
            <Badge variant="secondary" className="ml-auto shrink-0 text-[10px]">
              {selectedModel.coin} coins
            </Badge>
          </div>
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className="sm:max-w-180 md:max-w-200"
      >
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            className="h-10"
          />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>

            {filteredGroups.map((group) => (
              <React.Fragment key={group.provider_id}>
                <CommandGroup heading={group.provider_name}>
                  {group.models.map((model) => {
                    const isSelected = selectedId === model.id
                    const affordable = balance >= model.coin

                    return (
                      <CommandItem
                        key={model.id}
                        value={`${model.name} ${model.model_id} ${group.provider_name}`.toLowerCase()}
                        onSelect={() => {
                          onChange(isSelected ? null : model.id)
                          if (!isSelected) setOpen(false)
                        }}
                        disabled={!affordable}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 py-3",
                          !affordable && "cursor-not-allowed opacity-50"
                        )}
                      >
                        <Check
                          className={cn(
                            "h-4 w-4 shrink-0",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-center gap-2">
                            <span className="truncate font-medium">
                              {model.name}
                            </span>
                            <Badge
                              variant={affordable ? "secondary" : "destructive"}
                              className="shrink-0 text-[10px]"
                            >
                              <Coins className="mr-0.5 size-2.5" />
                              {model.coin}
                            </Badge>
                          </div>
                          {model.description && (
                            <span className="line-clamp-1 text-[11px] text-muted-foreground">
                              {model.description}
                            </span>
                          )}
                          <div className="mt-1 flex flex-wrap gap-1.5">
                            {model.supports_text && (
                              <span className="inline-flex items-center gap-0.5 rounded bg-muted/60 px-1 py-0.5 text-[9px] font-medium text-muted-foreground">
                                <Cpu className="size-2.5" /> Copywriting (Text)
                              </span>
                            )}
                            {model.supports_image && (
                              <span className="inline-flex items-center gap-0.5 rounded bg-muted/60 px-1 py-0.5 text-[9px] font-medium text-muted-foreground">
                                <ImageIcon className="size-2.5" /> Image
                                Generation
                              </span>
                            )}
                            {model.supports_audio && (
                              <span className="inline-flex items-center gap-0.5 rounded bg-muted/60 px-1 py-0.5 text-[9px] font-medium text-muted-foreground">
                                <Volume2 className="size-2.5" /> Voice (Audio)
                              </span>
                            )}
                            {model.supports_video && (
                              <span className="inline-flex items-center gap-0.5 rounded bg-muted/60 px-1 py-0.5 text-[9px] font-medium text-muted-foreground">
                                <Video className="size-2.5" /> Video Generation
                              </span>
                            )}
                          </div>
                        </div>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </React.Fragment>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  )
}
