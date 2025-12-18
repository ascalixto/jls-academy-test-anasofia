import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  useFieldIds,
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
    mode: "onChange",
    reValidateMode: "onChange",
  })

  const isLoading = status === "loading"
  const canSubmit = form.formState.isValid && !isLoading

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

  function resetStatus() {
    if (status !== "idle") setStatus("idle")
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Tool"
        subtitle="Register a new internal or public tool"
      />

      <Card className="p-6">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          aria-busy={isLoading}
        >
          <div className="sr-only" aria-live="polite">
            {status === "loading" ? "Creating tool..." : null}
            {status === "success" ? "Tool created." : null}
            {status === "error" ? "Something went wrong." : null}
          </div>

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
            render={({ field, fieldState }) => {
              const ids = useFieldIds("name")
              const hasError = !!fieldState.error?.message
              const describedBy = hasError
                ? `${ids.descriptionId} ${ids.errorId}`
                : ids.descriptionId

              return (
                <Field>
                  <FieldLabel htmlFor={ids.inputId}>Tool Name</FieldLabel>

                  <Input
                    id={ids.inputId}
                    {...field}
                    placeholder="My Amazing Tool"
                    onChange={(e) => {
                      resetStatus()
                      field.onChange(e)
                    }}
                    aria-invalid={fieldState.invalid || undefined}
                    aria-describedby={describedBy}
                  />

                  <FieldDescription id={ids.descriptionId}>
                    Internal or external tool name.
                  </FieldDescription>

                  <FieldError id={ids.errorId} errors={[fieldState.error]} />
                </Field>
              )
            }}
          />

          <Controller
            name="category"
            control={form.control}
            render={({ field, fieldState }) => {
              const ids = useFieldIds("category")
              const hasError = !!fieldState.error?.message
              const describedBy = hasError ? ids.errorId : undefined

              return (
                <Field>
                  <FieldLabel htmlFor={ids.inputId}>Category</FieldLabel>

                  <Select
                    value={field.value}
                    onValueChange={(v) => {
                      resetStatus()
                      field.onChange(v)
                    }}
                  >
                    <SelectTrigger
                      id={ids.inputId}
                      aria-invalid={fieldState.invalid || undefined}
                      aria-describedby={describedBy}
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="dev">Developer Tool</SelectItem>
                      <SelectItem value="design">Design Tool</SelectItem>
                      <SelectItem value="ops">Operations Tool</SelectItem>
                    </SelectContent>
                  </Select>

                  <FieldError id={ids.errorId} errors={[fieldState.error]} />
                </Field>
              )
            }}
          />

          <Controller
            name="visibility"
            control={form.control}
            render={({ field, fieldState }) => {
              const ids = useFieldIds("visibility")
              const hasError = !!fieldState.error?.message
              const describedBy = hasError ? ids.errorId : undefined

              return (
                <Field>
                  <FieldLabel htmlFor={ids.inputId}>Visibility</FieldLabel>

                  <Select
                    value={field.value}
                    onValueChange={(v) => {
                      resetStatus()
                      field.onChange(v)
                    }}
                  >
                    <SelectTrigger
                      id={ids.inputId}
                      aria-invalid={fieldState.invalid || undefined}
                      aria-describedby={describedBy}
                    >
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="internal">Internal</SelectItem>
                    </SelectContent>
                  </Select>

                  <FieldError id={ids.errorId} errors={[fieldState.error]} />
                </Field>
              )
            }}
          />

          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => {
              const ids = useFieldIds("description")
              const hasError = !!fieldState.error?.message
              const describedBy = hasError
                ? `${ids.descriptionId} ${ids.errorId}`
                : ids.descriptionId

              return (
                <Field>
                  <FieldLabel htmlFor={ids.inputId}>
                    Short Description
                  </FieldLabel>

                  <Textarea
                    id={ids.inputId}
                    {...field}
                    placeholder="Short description of the tool..."
                    onChange={(e) => {
                      resetStatus()
                      field.onChange(e)
                    }}
                    aria-invalid={fieldState.invalid || undefined}
                    aria-describedby={describedBy}
                  />

                  <FieldDescription id={ids.descriptionId}>
                    Max 160 characters.
                  </FieldDescription>

                  <FieldError id={ids.errorId} errors={[fieldState.error]} />
                </Field>
              )
            }}
          />

          <Controller
            name="tags"
            control={form.control}
            render={({ field, fieldState }) => {
              const ids = useFieldIds("tags")
              const hasError = !!fieldState.error?.message
              const describedBy = hasError ? ids.errorId : undefined

              return (
                <Field>
                  <FieldLabel htmlFor={ids.inputId}>Tags</FieldLabel>

                  <Input
                    id={ids.inputId}
                    {...field}
                    placeholder="Optional tags (comma-separated)"
                    onChange={(e) => {
                      resetStatus()
                      field.onChange(e)
                    }}
                    aria-invalid={fieldState.invalid || undefined}
                    aria-describedby={describedBy}
                  />

                  <FieldError id={ids.errorId} errors={[fieldState.error]} />
                </Field>
              )
            }}
          />

          <Button type="submit" disabled={!canSubmit}>
            {isLoading ? "Creating..." : "Create Tool"}
          </Button>
        </form>
      </Card>
    </div>
  )
}
