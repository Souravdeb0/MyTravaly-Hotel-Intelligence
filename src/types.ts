export type BookingStatus = 'confirmed' | 'pending' | 'cancelled'
export type PaymentStatus = 'paid' | 'pending'
export type SortKey = 'checkIn' | 'amount' | 'guestName' | 'hotelName'
export type SortOrder = 'asc' | 'desc'

export interface Booking {
  id: string
  guestName: string
  hotelName: string
  checkIn: string
  checkOut: string
  status: BookingStatus
  amount: number
  currency: string
  roomType: string
  paymentStatus: PaymentStatus
  bookingDate: string
}

export interface Metrics {
  totalBookings: number
  confirmed: number
  pending: number
  cancelled: number
  totalRevenue: number
  averageBookingValue: number
  occupancyRate: number
  conversionRate: number
}

export interface TrendPoint {
  month: string
  bookings: number
  revenue: number
  avgRoomRate: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
}

export interface BookingsResponse extends ApiResponse<Booking[]> {
  count: number
  filters: Record<string, string>
}

export interface PeriodResponse<T> extends ApiResponse<T> {
  period: string
}

export interface BookingFilters {
  query: string
  status: BookingStatus | 'all'
  paymentStatus: PaymentStatus | 'all'
  hotel: string
  roomType: string
  sortKey: SortKey
  sortOrder: SortOrder
}
