import { NextResponse } from 'next/server'
import { db } from '@/db'
import { discountCodes } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
    req: Request,
    { params }: { params: Promise<{ discountId: string }> }
) {
    try {
        const { discountId } = await params
        if (!discountId) {
            return new NextResponse('Discount ID is required', { status: 400 })
        }

        const discount = await db.query.discountCodes.findFirst({
            where: eq(discountCodes.id, discountId),
        })

        return NextResponse.json(discount)
    } catch (error) {
        console.error('[DISCOUNT_GET]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ discountId: string }> }
) {
    try {
        const body = await req.json()
        const { code, percent, maxDiscountAmount, stock, startDate, endDate } = body
        const { discountId } = await params

        if (!discountId) {
            return new NextResponse('Discount ID is required', { status: 400 })
        }

        const discount = await db
            .update(discountCodes)
            .set({
                code,
                percent: percent ? Number(percent) : undefined,
                maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : undefined,
                stock: stock ? Number(stock) : undefined,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
            })
            .where(eq(discountCodes.id, discountId))
            .returning()

        return NextResponse.json(discount[0])
    } catch (error) {
        console.error('[DISCOUNT_PATCH]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ discountId: string }> }
) {
    try {
        const { discountId } = await params
        if (!discountId) {
            return new NextResponse('Discount ID is required', { status: 400 })
        }

        const discount = await db
            .delete(discountCodes)
            .where(eq(discountCodes.id, discountId))
            .returning()

        return NextResponse.json(discount[0])
    } catch (error) {
        console.error('[DISCOUNT_DELETE]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
