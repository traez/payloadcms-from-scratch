'use client'
import { Page, Form } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { useState } from 'react'

type NewsletterProps = Extract<Page['layout'][0], { blockType: 'newsletter-form' }>

type FormState = {
  loading: boolean
  error: string | null
  success: boolean
}

type InputFormField = Extract<
  NonNullable<Form['fields']>[number],
  {
    blockType:
      | 'text'
      | 'email'
      | 'textarea'
      | 'number'
      | 'checkbox'
      | 'select'
      | 'country'
      | 'state'
    name: string
    label?: string | null
    required?: boolean | null
  }
>

export default function NewsletterBlock({ block }: { block: NewsletterProps }) {
  const [formState, setFormState] = useState<FormState>({
    loading: false,
    error: null,
    success: false,
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!block.form || typeof block.form !== 'object') return

    setFormState({ loading: true, error: null, success: false })

    const formData = new FormData(e.target as HTMLFormElement)
    const data = Object.fromEntries(formData.entries())

    try {
      const response = await fetch('/api/form-submissions', {
        method: 'POST',
        body: JSON.stringify({
          form: block.form.id,
          submissionData: Object.entries(data).map(([field, value]) => ({
            field,
            value: value as string,
          })),
        }),
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) throw new Error('Failed to submit form')

      setFormState({ loading: false, error: null, success: true })
      ;(e.target as HTMLFormElement).reset()

      setTimeout(() => {
        setFormState({ loading: false, error: null, success: false })
      }, 5000)
    } catch (error) {
      console.error(error)
      setFormState({ loading: false, error: 'Failed to submit form', success: false })
    }
  }

  return (
    <div>
      {typeof block?.form === 'object' && (
        <div className="flex flex-col items-center w-full pb-5">
          <h2 className="text-xl font-semibold mb-4">{block.heading}</h2>
          <form className="w-full max-w-md space-y-4" onSubmit={handleSubmit}>
            {block.form.fields?.map((field) => {
              const inputField = field as InputFormField
              if (!('name' in field)) return null

              return (
                <div key={inputField.name} className="flex flex-col gap-2">
                  {inputField.label && (
                    <label htmlFor={inputField.name} className="text-sm font-medium">
                      {inputField.label}
                    </label>
                  )}
                  <input
                    type={inputField.blockType === 'email' ? 'email' : 'text'}
                    name={inputField.name}
                    required={inputField.required || false}
                    placeholder={inputField.label || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )
            })}

            {formState.error && <p className="text-red-600 text-sm">{formState.error}</p>}

            {formState.success ? (
              <div className="text-green-600 text-sm">
                <RichText data={block.form.confirmationMessage!} />
              </div>
            ) : (
              <button
                type="submit"
                disabled={formState.loading}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {formState.loading ? 'Submitting...' : block.form.submitButtonLabel || 'Submit'}
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  )
}
