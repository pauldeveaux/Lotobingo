/**
 * Composable for handling file input → base64 conversion with preview.
 * Reads a file from an <input type="file">, converts to data URL,
 * and keeps a reactive preview in sync with the form field.
 */
export function useImageUpload(
  getField: () => string | null,
  setField: (value: string | null) => void,
) {
  const preview = ref<string | null>(null)

  function onChange(event: Event): void {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setField(result)
        preview.value = result
      }
      reader.readAsDataURL(file)
    }
  }

  function remove(): void {
    setField(null)
    preview.value = null
  }

  watch(getField, (val) => {
    preview.value = val
  }, { immediate: true })

  return { preview, onChange, remove }
}
