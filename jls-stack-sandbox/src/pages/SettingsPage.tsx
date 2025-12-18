import { useState } from "react"
import { Controller, useForm } from "react-hook-form"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  useFieldIds,
} from "@/components/ui/field"

import { InlineAlert } from "@/components/common/InlineAlert"
import { PageHeader } from "@/components/common/PageHeader"

type FormData = {
  displayName: string
  role: string
  notifications: boolean
  bio: string
}

type SubmitStatus = "idle" | "loading" | "success" | "error"

export default function SettingsPage() {
  const [status, setStatus] = useState<SubmitStatus>("idle")

  const form = useForm<FormData>({
    defaultValues: {
      displayName: "",
      role: "",
      notifications: true,
      bio: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  })

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = form

  const isLoading = status === "loading"
  const canSubmit = isValid && !isLoading

  function resetStatus() {
    if (status !== "idle") setStatus("idle")
  }

  const onSubmit = async (data: FormData) => {
    setStatus("loading")
    await new Promise((res) => setTimeout(res, 1000))

    if (Math.random() < 0.25) {
      setStatus("error")
      return
    }

    console.log("Settings saved:", data)
    setStatus("success")
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Manage your profile and preferences"
      />

      <Card className="p-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          aria-busy={isLoading}
        >
          <div className="sr-only" aria-live="polite">
            {status === "loading" ? "Saving settings..." : null}
            {status === "success" ? "Settings saved." : null}
            {status === "error" ? "Something went wrong." : null}
          </div>

          {status === "success" ? (
            <InlineAlert
              title="Settings saved"
              description="Your changes were successfully updated."
            />
          ) : null}

          {status === "error" ? (
            <InlineAlert
              tone="danger"
              title="Something went wrong"
              description="We couldn’t save your changes. Try again."
            />
          ) : null}

          {/* Display Name */}
          {(() => {
            const ids = useFieldIds("displayName")
            const hasError = !!errors.displayName?.message
            const describedBy = hasError
              ? `${ids.descriptionId} ${ids.errorId}`
              : ids.descriptionId

            return (
              <Field>
                <FieldLabel htmlFor={ids.inputId}>Display Name</FieldLabel>

                <Input
                  id={ids.inputId}
                  placeholder="Your name"
                  {...register("displayName", {
                    required: "Required",
                    onChange: resetStatus,
                  })}
                  aria-invalid={!!errors.displayName || undefined}
                  aria-describedby={describedBy}
                />

                <FieldDescription id={ids.descriptionId}>
                  This is how your name appears in the app.
                </FieldDescription>

                <FieldError id={ids.errorId} errors={[errors.displayName]} />
              </Field>
            )
          })()}

          {/* Role */}
          <Controller
            name="role"
            control={control}
            rules={{ required: "Required" }}
            render={({ field, fieldState }) => {
              const ids = useFieldIds("role")
              const hasError = !!fieldState.error?.message
              const describedBy = hasError ? ids.errorId : undefined

              return (
                <Field>
                  <FieldLabel htmlFor={ids.inputId}>Role</FieldLabel>

                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      resetStatus()
                      field.onChange(value)
                    }}
                  >
                    <SelectTrigger
                      id={ids.inputId}
                      aria-invalid={fieldState.invalid || undefined}
                      aria-describedby={describedBy}
                    >
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>

                  <FieldError id={ids.errorId} errors={[fieldState.error]} />
                </Field>
              )
            }}
          />

          {/* Notifications */}
          <Controller
            name="notifications"
            control={control}
            render={({ field }) => {
              const ids = useFieldIds("notifications")
              return (
                <Field>
                  <div className="flex items-start justify-between gap-6">
                    <div className="space-y-1">
                      <FieldLabel htmlFor={ids.inputId}>
                        Notifications
                      </FieldLabel>
                      <FieldDescription id={ids.descriptionId}>
                        Receive product updates and alerts.
                      </FieldDescription>
                    </div>

                    <Switch
                      id={ids.inputId}
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        resetStatus()
                        field.onChange(checked)
                      }}
                      aria-describedby={ids.descriptionId}
                    />
                  </div>
                </Field>
              )
            }}
          />

          {/* Bio */}
          {(() => {
            const ids = useFieldIds("bio")
            const hasError = !!errors.bio?.message
            const describedBy = hasError
              ? `${ids.descriptionId} ${ids.errorId}`
              : ids.descriptionId

            return (
              <Field>
                <FieldLabel htmlFor={ids.inputId}>Bio</FieldLabel>

                <Textarea
                  id={ids.inputId}
                  placeholder="Optional short bio"
                  {...register("bio", { onChange: resetStatus })}
                  aria-invalid={!!errors.bio || undefined}
                  aria-describedby={describedBy}
                />

                <FieldDescription id={ids.descriptionId}>
                  Max 160 characters.
                </FieldDescription>

                <FieldError id={ids.errorId} errors={[errors.bio]} />
              </Field>
            )
          })()}

          <Button type="submit" disabled={!canSubmit}>
            {isLoading ? "Saving..." : "Save settings"}
          </Button>
        </form>
      </Card>
    </div>
  )
}
