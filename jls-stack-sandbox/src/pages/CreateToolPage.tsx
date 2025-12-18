import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PageHeader } from "@/components/common/PageHeader"
import { InlineAlert } from "@/components/common/InlineAlert"

import { toolSchema, type ToolFormValues } from "@/schemas/toolSchema"

type SubmitStatus = "idle" | "loading" | "success" | "error"

export default function CreateToolPage() {
  const [status, setStatus] = useState<SubmitStatus>("idle")

  const form = useForm<ToolFormValues>({
    resolver: zodResolver(toolSchema),
    defaultValues: {
      name: "",
      category: "",
      visibility: "internal",
      description: "",
      tags: "",
    },
  })

  async function onSubmit(values: ToolFormValues) {
    try {
      setStatus("loading")

      await new Promise((r) => setTimeout(r, 1000))

      
      if (Math.random() < 0.25) {
        setStatus("error")
        return
      }

      console.log("Tool created:", values)
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Tool"
        subtitle="Register a new internal or public tool"
      />

      <Card className="p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {status === "success" ? (
            <InlineAlert
              title="Tool created"
              description="Your tool has been registered."
            />
          ) : null}

          {status === "error" ? (
            <InlineAlert
              tone="danger"
              title="Something went wrong"
              description="Please try again."
            />
          ) : null}

          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Tool Name</FieldLabel>
                <Input
                  {...field}
                  placeholder="My Amazing Tool"
                  onChange={(e) => {
                    setStatus("idle")
                    field.onChange(e)
                  }}
                />
                <FieldDescription>Internal or external tool name.</FieldDescription>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            name="category"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Category</FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={(v) => {
                    setStatus("idle")
                    field.onChange(v)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dev">Developer Tool</SelectItem>
                    <SelectItem value="design">Design Tool</SelectItem>
                    <SelectItem value="ops">Operations Tool</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            name="visibility"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Visibility</FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={(v) => {
                    setStatus("idle")
                    field.onChange(v)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="internal">Internal</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Short Description</FieldLabel>
                <Textarea
                  {...field}
                  placeholder="Short description of the tool..."
                  onChange={(e) => {
                    setStatus("idle")
                    field.onChange(e)
                  }}
                />
                <FieldDescription>Max 160 characters.</FieldDescription>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            name="tags"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Tags</FieldLabel>
                <Input
                  {...field}
                  placeholder="Optional tags (comma-separated)"
                  onChange={(e) => {
                    setStatus("idle")
                    field.onChange(e)
                  }}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Creating..." : "Create Tool"}
          </Button>
        </form>
      </Card>
    </div>
  )
}
