import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

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

type FormData = {
  displayName: string
  role: string
  notifications: boolean
  bio: string
}

type SubmitStatus = "idle" | "loading" | "success" | "error"

export default function SettingsPage() {
  const [status, setStatus] = useState<SubmitStatus>("idle")
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      displayName: "",
      role: "",
      notifications: true,
      bio: "",
    },
  })

  useEffect(() => {
    const subscription = watch(() => {
      if (status === "success" || status === "error") setStatus("idle")
    })
    return () => subscription.unsubscribe()
  }, [watch, status])

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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

          <Field>
            <FieldLabel>Display Name</FieldLabel>
            <Input {...register("displayName", { required: "Required" })} placeholder="Your name" />
            <FieldDescription>This is how your name appears in the app.</FieldDescription>
            <FieldError errors={[errors.displayName]} />
          </Field>

          <Field>
            <FieldLabel>Role</FieldLabel>
            <Select
              onValueChange={(value) => setValue("role", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
            <FieldError errors={[errors.role]} />
          </Field>

          <Field>
            <div className="flex items-center justify-between gap-6">
              <div className="space-y-1">
                <FieldLabel>Notifications</FieldLabel>
                <FieldDescription>
                  Receive product updates and alerts.
                </FieldDescription>
              </div>
              <Switch
                onCheckedChange={(checked) => setValue("notifications", checked)}
                checked={watch("notifications")}
              />
            </div>
          </Field>

          <Field>
            <FieldLabel>Bio</FieldLabel>
            <Textarea {...register("bio")} placeholder="Optional short bio" />
            <FieldDescription>Max 160 characters.</FieldDescription>
            <FieldError errors={[errors.bio]} />
          </Field>

          <Button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Saving..." : "Save settings"}
          </Button>
        </form>
      </Card>
    </div>
  )
}
