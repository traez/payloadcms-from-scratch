//src\app\my-route\route.ts
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const GET = async (request: Request) => {
  console.log('Incoming request:', request.method, request.url) // Log the request details to avoid lint errors
  const payload = await getPayload({
    config: configPromise,
  })

  console.log('Payload initialized:', !!payload) // Log that payload has been initialized to avoid lint errors

  return Response.json({
    message: 'This is an example of a custom route.',
  })
}
