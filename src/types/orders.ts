export type PhysicalCardMaterial = 'pet_plastic' | 'wood' | 'metal'

export interface PhysicalCardProduct {
  id: string
  name: string
  material: PhysicalCardMaterial
  description: string
  price: string
  currency: string
  image: string | null
}

export interface ShippingAddress {
  full_name: string
  company: string
  phone: string
  address_line_1: string
  address_line_2: string
  city: string
  state: string
  postal_code: string
  country: string
}

export interface OrderItem {
  id: string
  product: PhysicalCardProduct
  quantity: number
  unit_price: string
  vcard: string | null
}

export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'processing'
  | 'printing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export interface ShippingEvent {
  id: string
  status: OrderStatus
  description: string
  tracking_number: string
  timestamp: string
}

export type OrderPaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface Order {
  id: string
  organization: string | null
  customer: string
  order_number: string
  status: OrderStatus
  payment_status: OrderPaymentStatus
  subtotal: string
  shipping_fee: string
  tax: string
  total: string
  currency: string
  shipping_address: ShippingAddress
  items: OrderItem[]
  shipping_events: ShippingEvent[]
  created_at: string
  updated_at: string
}

export interface OrderItemInput {
  product_id: string
  quantity: number
  vcard_id?: string | null
}

export interface OrderCreatePayload {
  organization_id?: string | null
  items: OrderItemInput[]
  shipping_address: ShippingAddress
  provider: 'stripe' | 'mpesa' | 'sasapay'
}

export interface OrderStatusUpdatePayload {
  status: OrderStatus
  tracking_number?: string
  description?: string
}
