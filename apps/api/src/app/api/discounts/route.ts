import { NextResponse } from 'next/server'
import { db } from '@/db'
import { discountCodes } from '@/db/schema'
import { desc, eq } from 'drizzle-orm'

export async function GET(req: Request) {
    try {
        const storeId = req.headers.get('X-STORE-ID')

        if (!storeId) {
            return new NextResponse('Store context required', { status: 400 })
        }

        const discounts = await db.select().from(discountCodes)
            .where(eq(discountCodes.storeId, storeId))
            .orderBy(desc(discountCodes.createdAt))
        return NextResponse.json(discounts)
    } catch (error) {
        console.error('[DISCOUNTS_GET]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const userId = req.headers.get('X-USER-ID')
        const storeId = req.headers.get('X-STORE-ID')

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if (!storeId) {
            return new NextResponse('Store context required', { status: 400 })
        }

        const body = await req.json()
        const { code, percent, maxDiscountAmount, stock, startDate, endDate } = body

        if (!code || !percent || !startDate || !endDate) {
            return new NextResponse('Missing required fields', { status: 400 })
        }

        const discount = await db.insert(discountCodes).values({
            code,
            percent: Number(percent),
            maxDiscountAmount: Number(maxDiscountAmount),
            stock: Number(stock),
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            storeId,
        }).returning()

        return NextResponse.json(discount[0])
    } catch (error) {
        console.error('[DISCOUNTS_POST]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
