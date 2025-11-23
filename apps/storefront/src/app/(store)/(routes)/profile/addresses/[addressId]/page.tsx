import serverApi from '@/lib/api-server'

import { AddressForm } from './components/address-form'

export default async function AddressPage({
   params,
}: {
   params: Promise<{ addressId: string }>
}) {
   const { addressId } = await params
   let address = null
   try {
      address = await serverApi.get(`/api/addresses/${addressId}`)
   } catch (error) {
      console.error('Error fetching address:', error)
   }

   return (
      <div className="flex-col">
         <div className="flex-1 space-y-4 p-8 pt-6">
            <AddressForm initialData={address} />
         </div>
      </div>
   )
}
