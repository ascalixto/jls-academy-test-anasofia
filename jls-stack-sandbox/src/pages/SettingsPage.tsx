import { useEffect, useState } from "react"
import { Controller, useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

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
} from "@/components/ui/field"

import { InlineAlert } from "@/components/common/InlineAlert"
import { PageHeader } from "@/components/common/PageHeader"
import {
  settingsSchema,
  type SettingsFormValues,
} from "@/schemas/settingsSchema"

type SubmitStatus = "idle" | "loading" | "success" | "error"

export default function SettingsPage() {
  const [status, setStatus] = useState<SubmitStatus>("idle")

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      displayName: "",
      role: "",
      bio: "",
      notifications: true,
    },
  })

  useEffect(() => {
    const sub = form.watch(() => {
      if (status === "success" || status === "error") setStatus("idle")
    })
    return () => sub.unsubscribe()
  }, [form, status])

  const onSubmit: SubmitHandler<SettingsFormValues> = async (values) => {
    setStatus("loading")

    await new Promise((res) => setTimeout(res, 1000))

    if (Math.random() < 0.25) {
      setStatus("error")
      return
    }

    console.log("Settings saved:", values)
    setStatus("success")
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Manage your profile and preferences"
      />

      <Card className="p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {status === "success" && (
            <InlineAlert
              title="Settings saved"
              description="Your changes were successfully updated."
            />
          )}

          {status === "error" && (
            <InlineAlert
              tone="danger"
              title="Something went wrong"
              description="We couldn’t save your changes. Try again."
            />
          )}

          <Controller
            name="displayName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Display Name</FieldLabel>
                <Input {...field} placeholder="Your name" />
                <FieldDescription>
                  This is how your name appears in the app.
                </FieldDescription>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            name="role"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Role</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            name="notifications"
            control={form.control}
            render={({ field }) => (
              <Field>
                <div className="flex items-center justify-between gap-6">
                  <div className="space-y-1">
                    <FieldLabel>Notifications</FieldLabel>
                    <FieldDescription>
                      Receive product updates and alerts.
                    </FieldDescription>
                  </div>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </div>
              </Field>
            )}
          />

          <Controller
            name="bio"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Bio</FieldLabel>
                <Textarea {...field} placeholder="Optional short bio" />
                <FieldDescription>Max 160 characters.</FieldDescription>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Saving..." : "Save settings"}
          </Button>
        </form>
      </Card>
    </div>
  )
}
