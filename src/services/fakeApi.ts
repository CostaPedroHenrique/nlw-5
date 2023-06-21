import data from '../../server.json'

export const api = {
  get: (url: string, params?: any) => {
    const limit = params?._limit ?? 12
    const sort = params?._sort ?? 'published_at'
    const order = params?._order ?? 'desc'

    const [router, slug] = url.split('/')
    if (slug) {
      return data[router].find((item: any) => item.slug === slug)
    }

    return data[router]
      .sort((a: any, b: any) => {
        if (order === 'asc') {
          return a[sort] - b[sort]
        }

        return b[sort] - a[sort]
      })
      .slice(0, limit)
  }
}
