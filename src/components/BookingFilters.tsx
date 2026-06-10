import { RotateCcw, Search, SlidersHorizontal } from 'lucide-react'
import type { BookingFilters as BookingFiltersType } from '../types'

interface BookingFiltersProps {
  filters: BookingFiltersType
  hotels: string[]
  roomTypes: string[]
  resultCount: number
  totalCount: number
  onChange: (next: BookingFiltersType) => void
  onReset: () => void
}

export function BookingFilters({
  filters,
  hotels,
  roomTypes,
  resultCount,
  totalCount,
  onChange,
  onReset,
}: BookingFiltersProps) {
  const update = <K extends keyof BookingFiltersType>(
    key: K,
    value: BookingFiltersType[K],
  ) => onChange({ ...filters, [key]: value })

  return (
    <div className="filters">
      <div className="filters__primary">
        <label className="search-field">
          <Search size={17} aria-hidden="true" />
          <span className="sr-only">Search bookings</span>
          <input
            value={filters.query}
            onChange={(event) => update('query', event.target.value)}
            placeholder="Search guest, hotel or booking ID"
          />
        </label>
        <label>
          <span>Status</span>
          <select value={filters.status} onChange={(event) => update('status', event.target.value as BookingFiltersType['status'])}>
            <option value="all">All statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
        <label>
          <span>Payment</span>
          <select value={filters.paymentStatus} onChange={(event) => update('paymentStatus', event.target.value as BookingFiltersType['paymentStatus'])}>
            <option value="all">All payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
        </label>
        <label>
          <span>Hotel</span>
          <select value={filters.hotel} onChange={(event) => update('hotel', event.target.value)}>
            <option value="all">All hotels</option>
            {hotels.map((hotel) => <option key={hotel}>{hotel}</option>)}
          </select>
        </label>
      </div>
      <div className="filters__secondary">
        <span className="result-count">
          <SlidersHorizontal size={15} />
          {resultCount} matches of {totalCount}
        </span>
        <label>
          <span>Room</span>
          <select value={filters.roomType} onChange={(event) => update('roomType', event.target.value)}>
            <option value="all">All rooms</option>
            {roomTypes.map((room) => <option key={room}>{room}</option>)}
          </select>
        </label>
        <label>
          <span>Sort</span>
          <select
            value={`${filters.sortKey}:${filters.sortOrder}`}
            onChange={(event) => {
              const [sortKey, sortOrder] = event.target.value.split(':')
              onChange({
                ...filters,
                sortKey: sortKey as BookingFiltersType['sortKey'],
                sortOrder: sortOrder as BookingFiltersType['sortOrder'],
              })
            }}
          >
            <option value="checkIn:asc">Check-in: soonest</option>
            <option value="checkIn:desc">Check-in: latest</option>
            <option value="amount:desc">Value: high to low</option>
            <option value="amount:asc">Value: low to high</option>
            <option value="guestName:asc">Guest: A-Z</option>
            <option value="hotelName:asc">Hotel: A-Z</option>
          </select>
        </label>
        <button className="text-button" type="button" onClick={onReset}>
          <RotateCcw size={15} />
          Reset
        </button>
      </div>
    </div>
  )
}
