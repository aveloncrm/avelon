import db from '@/lib/db'
import { users, orders, addresses } from '@/db/schema'
import { eq, and, or, ilike, count, desc } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const body = await req.json()

      const { 
         email, 
         phone, 
         name, 
         birthday, 
         isBanned, 
         isEmailVerified, 
         isPhoneVerified, 
         isEmailSubscribed, 
         isPhoneSubscribed 
      } = body

      // Validate required fields
      if (!email && !phone) {
         return new NextResponse('Email or phone is required', { status: 400 })
      }

      const [user] = await db
         .insert(users)
         .values({
            email: email || null,
            phone: phone || null,
            name: name || null,
            birthday: birthday || null,
            isBanned: isBanned || false,
            isEmailVerified: isEmailVerified || false,
            isPhoneVerified: isPhoneVerified || false,
            isEmailSubscribed: isEmailSubscribed || false,
            isPhoneSubscribed: isPhoneSubscribed || false,
         })
         .returning()

      // Fetch related data
      const userWithRelations = await db.query.users.findFirst({
         where: eq(users.id, user.id),
         with: {
            orders: true,
            addresses: true,
            cart: {
               with: {
                  items: {
                     with: {
                        product: true,
                     },
                  },
               },
            },
         },
      })

      return NextResponse.json(userWithRelations)
   } catch (error: any) {
      console.error('[USERS_POST]', error)
      
      if (error.code === '23505') { // Unique constraint violation in PostgreSQL
         return new NextResponse('Email or phone already exists', { status: 400 })
      }
      
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function GET(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const { searchParams } = new URL(req.url)
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '10')
      const isBanned = searchParams.get('isBanned') === 'true' ? true : searchParams.get('isBanned') === 'false' ? false : undefined
      const search = searchParams.get('search') || undefined

      // Build where conditions
      const conditions = []
      if (isBanned !== undefined) {
         conditions.push(eq(users.isBanned, isBanned))
      }
      if (search) {
         conditions.push(
            or(
               ilike(users.name, `%${search}%`),
               ilike(users.email, `%${search}%`),
               ilike(users.phone, `%${search}%`)
            )
         )
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined

      // Get users with relations
      const usersResult = await db.query.users.findMany({
         where: whereClause,
         with: {
            orders: true,
            addresses: true,
         },
         limit,
         offset: (page - 1) * limit,
         orderBy: [desc(users.createdAt)],
      })

      // Get total count
      const [{ value: total }] = await db
         .select({ value: count() })
         .from(users)
         .where(whereClause)

      return NextResponse.json({
         users: usersResult,
         pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
         },
      })
   } catch (error) {
      console.error('[USERS_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
