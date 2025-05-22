import { POST } from '../../../api/auth/signup/route'
import { prisma } from '../../../../core/db/prisma'
import crypto from 'crypto'

// Utilidad para emails únicos
function uniqueEmail() {
  return `signup-${crypto.randomUUID().slice(0, 8)}@example.com`
}

describe('POST /api/auth/signup', () => {
  afterAll(async () => {
    // Elimina usuarios creados durante las pruebas
    await prisma.users.deleteMany({
      where: {
        mail: { contains: 'signup-' }
      }
    })

    await prisma.$disconnect()
  })

  it('should register a new user successfully', async () => {
    const email = uniqueEmail()
    const username = `user-${crypto.randomUUID().slice(0, 8)}`
    const body = JSON.stringify({
      username,
      mail: email,
      password: 'testpass123'
    })

    const req = new Request('http://localhost/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    })

    const res = await POST(req)
    const data = await res.json()
    console.log('Signup response:', data)
    expect(res.status).toBe(201)

   
    expect(data.success).toBe(true)
    expect(data.user).toBeDefined()
    expect(data.user.username).toBe(username)
  })

  it('should fail if email already exists', async () => {
    const email = uniqueEmail()

    // Crea usuario una vez
    await prisma.users.create({
      data: {
        username: 'existing',
        mail: email,
        password_hash: 'hashed', // puede ser cualquier string si Auth.register hace hashing
        user_role: 'user'
      }
    })

    const body = JSON.stringify({
      username: 'another',
      mail: email,
      password: 'newpass'
    })

    const req = new Request('http://localhost/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    })

    const res = await POST(req)

    expect(res.status).toBe(400)

    const data = await res.json()
    expect(data.success).toBe(false)
    expect(data.error.toLowerCase()).toContain('already') // ajusta si el mensaje de error es distinto
  })
})

