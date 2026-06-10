import type { Booking, BookingFilters } from '../types'

export const defaultFilters: BookingFilters = {
  query: '',
  status: 'all',
  paymentStatus: 'all',
  hotel: 'all',
  roomType: 'all',
  sortKey: 'checkIn',
  sortOrder: 'asc',
}

export function filterBookings(
  bookings: Booking[],
  filters: BookingFilters,
): Booking[] {
  const query = filters.query.trim().toLocaleLowerCase()

  return bookings
    .filter((booking) => {
      const matchesQuery =
        !query ||
        booking.guestName.toLocaleLowerCase().includes(query) ||
        booking.hotelName.toLocaleLowerCase().includes(query) ||
        booking.id.toLocaleLowerCase().includes(query)

      return (
        matchesQuery &&
        (filters.status === 'all' || booking.status === filters.status) &&
        (filters.paymentStatus === 'all' ||
          booking.paymentStatus === filters.paymentStatus) &&
        (filters.hotel === 'all' || booking.hotelName === filters.hotel) &&
        (filters.roomType === 'all' || booking.roomType === filters.roomType)
      )
    })
    .sort((a, b) => {
      const aValue = a[filters.sortKey]
      const bValue = b[filters.sortKey]
      const comparison =
        typeof aValue === 'number'
          ? aValue - (bValue as number)
          : aValue.localeCompare(bValue as string)

      return filters.sortOrder === 'asc' ? comparison : -comparison
    })
}

export function getFilterOptions(bookings: Booking[]) {
  return {
    hotels: [...new Set(bookings.map((booking) => booking.hotelName))].sort(),
    roomTypes: [...new Set(bookings.map((booking) => booking.roomType))].sort(),
  }
}
