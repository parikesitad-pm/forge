import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema } from '../features/auth/schemas/authSchemas'

describe('Auth Schemas', () => {
  it('validates a correct login payload', () => {
    const result = loginSchema.safeParse({
      identifier: 'thinker',
      password: 'Password123!',
    })
    expect(result.success).toBe(true)
  })

  it('rejects an empty login identifier', () => {
    const result = loginSchema.safeParse({
      identifier: '',
      password: 'Password123!',
    })
    expect(result.success).toBe(false)
  })

  it('validates a compliant registration payload', () => {
    const result = registerSchema.safeParse({
      username: 'thinker_01',
      email: 'thinker@modula.local',
      password: 'StrongPassword1!',
      password_confirmation: 'StrongPassword1!',
    })
    expect(result.success).toBe(true)
  })

  it('rejects passwords that lack symbols or uppercase letters', () => {
    const result = registerSchema.safeParse({
      username: 'thinker_01',
      email: 'thinker@modula.local',
      password: 'weakpassword',
      password_confirmation: 'weakpassword',
    })
    expect(result.success).toBe(false)
  })

  it('rejects password confirmation mismatch', () => {
    const result = registerSchema.safeParse({
      username: 'thinker_01',
      email: 'thinker@modula.local',
      password: 'StrongPassword1!',
      password_confirmation: 'DifferentPassword1!',
    })
    expect(result.success).toBe(false)
  })
})
