import {
  Check,
  Crop,
  Trash2,
  Upload,
  ZoomIn,
  ZoomOut,
  Move,
} from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import Cropper from "react-easy-crop"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

interface Point {
  x: number
  y: number
}

interface Area {
  x: number
  y: number
  width: number
  height: number
}

interface UploadCropProps {
  name?: string
  value: File | string | null
  onChange: (file: File | null) => void
  previewUrl?: string | null
  error?: string
  disabled?: boolean
  label?: string
  description?: string
  maxSizeMB?: number
  aspectRatio?: number
  accept?: string
}

const ASPECT_PRESETS: { label: string; value: number | "free" }[] = [
  { label: "Free", value: "free" },
  { label: "1:1", value: 1 / 1 },
  { label: "4:5", value: 4 / 5 },
  { label: "9:16", value: 9 / 16 },
  { label: "16:9", value: 16 / 9 },
  { label: "3:4", value: 3 / 4 },
]

export default function UploadCrop({
  name = "photo",
  value,
  onChange,
  previewUrl,
  error,
  disabled = false,
  label = "Upload Foto",
  description = "Format PNG atau JPG, maks 2MB.",
  maxSizeMB = 2,
  aspectRatio = 3 / 4,
  accept = "image/jpeg,image/png,image/jpg",
}: UploadCropProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [localPreview, setLocalPreview] = useState<string | null>(null)
  const [cropImage, setCropImage] = useState<string | null>(null)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [selectedAspect, setSelectedAspect] = useState<number | "free">(
    aspectRatio
  )

  const hasFile = value instanceof File
  const maxBytes = maxSizeMB * 1024 * 1024

  useEffect(() => {
    if (!(value instanceof File)) {
      setLocalPreview(null)

      return
    }

    const url = URL.createObjectURL(value)
    setLocalPreview(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [value])

  const displaySrc = localPreview ?? previewUrl ?? null

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]

    if (!f) {
      return
    }

    setValidationError(null)

    if (!f.type.startsWith("image/")) {
      setValidationError("Pilih file gambar yang valid (JPEG/PNG).")
      e.currentTarget.value = ""

      return
    }

    if (f.size > maxBytes) {
      setValidationError(`Ukuran file maksimal ${maxSizeMB}MB.`)
      e.currentTarget.value = ""

      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setCropImage(reader.result as string)
      setCrop({ x: 0, y: 0 })
      setZoom(1)
      setSelectedAspect(aspectRatio)
      setIsCropDialogOpen(true)
    }
    reader.readAsDataURL(f)

    e.currentTarget.value = ""
  }

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleCropApply = useCallback(async () => {
    if (!cropImage || !croppedAreaPixels) {
      return
    }

    const canvas = document.createElement("canvas")
    const img = new Image()
    img.src = cropImage

    await new Promise((resolve) => {
      img.onload = resolve
    })

    const scaleX = img.naturalWidth / img.width
    const scaleY = img.naturalHeight / img.height

    canvas.width = croppedAreaPixels.width
    canvas.height = croppedAreaPixels.height

    const ctx = canvas.getContext("2d")

    if (ctx) {
      ctx.drawImage(
        img,
        croppedAreaPixels.x * scaleX,
        croppedAreaPixels.y * scaleY,
        croppedAreaPixels.width * scaleX,
        croppedAreaPixels.height * scaleY,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      )

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "cropped-photo.jpg", {
            type: "image/jpeg",
            lastModified: Date.now(),
          })
          onChange(file)
          setIsCropDialogOpen(false)
          setCropImage(null)
        }
      }, "image/jpeg")
    }
  }, [cropImage, croppedAreaPixels, onChange])

  const handleRemove = () => {
    onChange(null)
    setValidationError(null)

    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const openPicker = () => inputRef.current?.click()

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fakeEvent = {
        currentTarget: { value: "" },
        target: { files: e.dataTransfer.files },
      } as unknown as React.ChangeEvent<HTMLInputElement>
      handleSelect(fakeEvent)
    }
  }

  const displayError = error || validationError

  return (
    <div className="space-y-2">
      <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>

      <div className="flex items-start gap-4">
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload foto"
          onClick={disabled ? undefined : openPicker}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()

              if (!disabled) {
                openPicker()
              }
            }
          }}
          className={cn(
            "flex shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed transition-colors hover:bg-muted/20 disabled:cursor-not-allowed disabled:opacity-50",
            displaySrc ? "h-auto w-40" : "h-56 w-40",
            displayError && "border-destructive"
          )}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {displaySrc ? (
            <img
              src={displaySrc}
              alt="Preview foto"
              className="h-auto w-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
              <Upload className="h-8 w-8" />
              <span className="text-center text-xs leading-tight">
                Seret & lepas atau klik
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleSelect}
            disabled={disabled}
            name={name}
          />
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={openPicker}
              disabled={disabled}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {hasFile || previewUrl ? "Ganti Foto" : "Pilih Foto"}
            </Button>
            {(hasFile || previewUrl) && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                disabled={disabled}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>

      {displayError && (
        <p className="text-xs text-destructive">{displayError}</p>
      )}

      <Dialog open={isCropDialogOpen} onOpenChange={setIsCropDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crop className="h-4 w-4" />
              Potong Foto
            </DialogTitle>
          </DialogHeader>
          {cropImage && (
            <>
              <div className="relative h-80 w-full overflow-hidden rounded-lg">
                <Cropper
                  image={cropImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={
                    selectedAspect === "free" ? undefined : selectedAspect
                  }
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  cropShape="rect"
                  showGrid
                />
              </div>

              {/* Aspect Ratio Presets */}
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                <Move className="size-3.5 text-muted-foreground" />
                {ASPECT_PRESETS.map((preset) => (
                  <Button
                    key={preset.label}
                    type="button"
                    variant={
                      selectedAspect === preset.value ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedAspect(preset.value)}
                    className={`h-7 min-w-12 rounded-md px-2 text-[10px] font-medium ${
                      selectedAspect === preset.value
                        ? "shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <ZoomOut className="h-4 w-4 text-muted-foreground" />
                <Slider
                  value={[zoom]}
                  min={1}
                  max={3}
                  step={0.1}
                  onValueChange={(value) => setZoom(value[0])}
                  className="flex-1"
                />
                <ZoomIn className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCropDialogOpen(false)
                    setCropImage(null)
                  }}
                >
                  Batal
                </Button>
                <Button onClick={handleCropApply}>
                  <Check className="mr-1 h-4 w-4" />
                  Terapkan
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
