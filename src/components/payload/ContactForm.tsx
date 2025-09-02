'use client'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { useEffect, useRef, useState } from 'react'

const ContactForm = ({ formId }: { formId: string }) => {
  const [cmsForm, setCmsForm] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/forms/${formId}`)
      .then((res) => res.json())
      .then((data) => {
        setCmsForm(data)
        console.log('cmsForm', data)
      })
      .catch((err) => setError('Error loading form'))
  }, [formId])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const dataToSend = Array.from(formData.entries()).map(([name, value]) => ({
      field: name,
      value: value.toString(),
    }))

    // send the form data to payload
    const response = await fetch('/api/form-submissions', {
      method: 'POST',
      body: JSON.stringify({
        form: formId,
        submissionData: dataToSend,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    console.log('response', response)
  }

  return (
    <div>
      <h2>Form</h2>
      <form onSubmit={handleSubmit}>
        {cmsForm?.fields?.map((field: any) => (
          <div key={field.id}>
            <label htmlFor={field.name}>{field.label}</label>
            <input type={field.blockType} name={field.name} id={field.name} />
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default ContactForm
