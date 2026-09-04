import AddAddress from "@/modules/account/components/address-card/add-address"
import EditAddress from "@/modules/account/components/address-card/edit-address-modal"
import { B2BCustomer } from "@/types/global"
import { HttpTypes } from "@medusajs/types"
import { Locale } from "@/lib/i18n"

type AddressBookProps = {
  customer: B2BCustomer
  region: HttpTypes.StoreRegion
  locale: Locale
}

const AddressBook: React.FC<AddressBookProps> = ({
  customer,
  region,
  locale,
}) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 mt-4">
        <AddAddress region={region} locale={locale} />
        {customer.addresses.map((address) => {
          return (
            <EditAddress
              region={region}
              address={address}
              key={address.id}
              customer={customer}
              locale={locale}
            />
          )
        })}
      </div>
    </div>
  )
}

export default AddressBook
