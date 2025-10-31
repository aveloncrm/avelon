import serverApi from '@/lib/api-server'

const URL = process.env.NEXT_PUBLIC_URL

export default async function sitemap() {
   const products = (await serverApi.get('/api/products')).map(
      ({ id, updatedAt }: any) => ({
         url: `${URL}/products/${id}`,
         lastModified: updatedAt,
      })
   )

   const blogs = (await serverApi.get('/api/blogs').catch(() => [])).map(({ slug, updatedAt }: any) => ({
      url: `${URL}/blog/${slug}`,
      lastModified: updatedAt,
   }))

   const routes = ['', '/products', '/blog'].map((route) => ({
      url: `${URL}${route}`,
      lastModified: new Date().toISOString(),
   }))

   return [...routes, ...products, ...blogs]
}
