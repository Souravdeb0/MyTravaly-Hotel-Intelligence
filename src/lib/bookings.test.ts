import { describe, expect, it } from 'vitest'
import type { Booking } from '../types'
import { defaultFilters, filterBookings } from './bookings'
import { formatCurrency, formatDate, getInitials } from './format'

const bookings: Booking[] = [
  {
    id: 'BOOK002',
    guestName: 'Priya Anjali',
    hotelName: 'Heritage Palace Jaipur',
    checkIn: '2026-06-14',
    checkOut: '2026-06-17',
    status: 'confirmed',
    amount: 22000,
    currency: 'INR',
    roomType: 'Villa',
    paymentStatus: 'paid',
    bookingDate: '2026-06-01T00:00:00.000Z',
  },
  {
    id: 'BOOK001',
    guestName: 'Raj Meera',
    hotelName: 'Grand Plaza Delhi',
    checkIn: '2026-06-11',
    checkOut: '2026-06-12',
    status: 'pending',
    amount: 8000,
    currency: 'INR',
    roomType: 'Deluxe',
    paymentStatus: 'pending',
    bookingDate: '2026-06-02T00:00:00.000Z',
  },
]

describe('filterBookings', () => {
  it('searches guest, hotel and booking ID case-insensitively', () => {
    expect(filterBookings(bookings, { ...defaultFilters, query: 'heritage' })).toHaveLength(1)
    expect(filterBookings(bookings, { ...defaultFilters, query: 'book001' })[0].id).toBe('BOOK001')
  })

  it('combines filters and sorts by value', () => {
    const result = filterBookings(bookings, {
      ...defaultFilters,
      paymentStatus: 'paid',
      status: 'confirmed',
      sortKey: 'amount',
      sortOrder: 'desc',
    })
    expect(result.map((booking) => booking.id)).toEqual(['BOOK002'])
  })

  it('sorts upcoming check-ins in ascending order by default', () => {
    expect(filterBookings(bookings, defaultFilters)[0].id).toBe('BOOK001')
  })
})

describe('format utilities', () => {
  it('formats Indian currency and dates', () => {
    expect(formatCurrency(22000)).toContain('22,000')
    expect(formatDate('2026-06-14')).toBe('14 Jun 2026')
  })

  it('creates two-letter initials', () => {
    expect(getInitials('Priya Anjali')).toBe('PA')
  })
})
