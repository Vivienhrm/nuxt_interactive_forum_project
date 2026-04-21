export const useAuth = () => {
  const user = useState<any>('user', () => null)

  const fetchUser = async () => {
    try {
      const data = await $fetch<{ user: any }>('/api/auth/me')
      user.value = data.user
    } catch (e) {
      user.value = null
    }
  }

  const login = async (credentials: any) => {
    const data = await $fetch<{ user: any }>('/api/auth/login', {
      method: 'POST',
      body: credentials
    })
    user.value = data.user
    return data.user
  }

  const register = async (credentials: any) => {
    return await $fetch('/api/auth/register', {
      method: 'POST',
      body: credentials
    })
  }

  const logout = async () => {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    navigateTo('/')
  }

  return {
    user,
    fetchUser,
    login,
    register,
    logout,
    isAuthenticated: computed(() => !!user.value),
    isAdmin: computed(() => user.value?.role === 'admin')
  }
}

