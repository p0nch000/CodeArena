import { POST } from 'src/app/api/auth/login/route'

// Usa objetos Request nativos (Node 18+)
describe('POST /api/auth/login', () => {
  it('should return 200 and set a cookie on valid credentials', async () => {
    const body = JSON.stringify({
      mail: 'test@example.com',
      password: 'test123',
    })

    const req = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    })

    const res = await POST(req)

    expect(res.status).toBe(200)

    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.user).toBeDefined()
    expect(json.user.mail).toBe('test@example.com')

    const cookie = res.cookies.get('auth-token')
    expect(cookie?.value).toBeDefined()
  })

  it('should return 400 for wrong password', async () => {
    const body = JSON.stringify({
      mail: 'test@example.com',
      password: 'wrongpassword',
    })

    const req = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    })

    const res = await POST(req)

    expect(res.status).toBe(400)

    const json = await res.json()
    expect(json.success).toBe(false)
    expect(json.error).toMatch(/invalid/i)
  })

  it('should return 400 for unknown user', async () => {
    const body = JSON.stringify({
      mail: 'notfound@example.com',
      password: 'whatever',
    })

    const req = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    })

    const res = await POST(req)

    expect(res.status).toBe(400)

    const json = await res.json()
    expect(json.success).toBe(false)
    expect(json.error).toMatch(/invalid/i)
  })
})
