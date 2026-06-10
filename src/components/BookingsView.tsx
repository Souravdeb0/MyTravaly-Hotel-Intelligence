import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  MapPin,
} from 'lucide-react'
import { formatCurrency, formatDate, getInitials } from '../lib/format'
import type { Booking } from '../types'

interface BookingsViewProps {
  bookings: Booking[]
  currentPage: number
  pageSize: number
  totalCount: number
  totalPages: number
  onPageChange: (page: number) => void
}

function StatusBadge({ status }: { status: Booking['status'] }) {
  return <span className={`status status--${status}`}>{status}</span>
}

function getVisiblePages(currentPage: number, totalPages: number) {
  const start = Math.max(1, Math.min(currentPage - 1, totalPages - 2))
  const end = Math.min(totalPages, start + 2)
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

export function BookingsView({
  bookings,
  currentPage,
  pageSize,
  totalCount,
  totalPages,
  onPageChange,
}: BookingsViewProps) {
  if (totalCount === 0) {
    return (
      <div className="empty-state">
        <span>0</span>
        <h3>No stays match this view</h3>
        <p>Try widening your filters or reset them to see all bookings.</p>
      </div>
    )
  }

  const firstVisibleBooking = (currentPage - 1) * pageSize + 1
  const lastVisibleBooking = Math.min(currentPage * pageSize, totalCount)
  const visiblePages = getVisiblePages(currentPage, totalPages)

  return (
    <>
      <div className="booking-table-wrap">
        <table className="booking-table">
          <thead>
            <tr>
              <th>Guest</th>
              <th>Property</th>
              <th>Stay</th>
              <th>Status</th>
              <th>Payment</th>
              <th className="align-right">Value</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>
                  <div className="guest-cell">
                    <span className="avatar">{getInitials(booking.guestName)}</span>
                    <span><strong>{booking.guestName}</strong><small>{booking.id}</small></span>
                  </div>
                </td>
                <td><strong>{booking.hotelName}</strong><small>{booking.roomType} room</small></td>
                <td><strong>{formatDate(booking.checkIn)}</strong><small>to {formatDate(booking.checkOut)}</small></td>
                <td><StatusBadge status={booking.status} /></td>
                <td><span className={`payment payment--${booking.paymentStatus}`}>{booking.paymentStatus}</span></td>
                <td className="align-right amount">{formatCurrency(booking.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="booking-cards">
        {bookings.map((booking) => (
          <article className="booking-card" key={booking.id}>
            <div className="booking-card__header">
              <div className="guest-cell">
                <span className="avatar">{getInitials(booking.guestName)}</span>
                <span><strong>{booking.guestName}</strong><small>{booking.id}</small></span>
              </div>
              <StatusBadge status={booking.status} />
            </div>
            <div className="booking-card__hotel">
              <MapPin size={16} />
              <span><strong>{booking.hotelName}</strong><small>{booking.roomType} room</small></span>
            </div>
            <div className="booking-card__details">
              <span><CalendarDays size={15} />{formatDate(booking.checkIn)}</span>
              <span><CreditCard size={15} />{booking.paymentStatus}</span>
              <strong>{formatCurrency(booking.amount)}</strong>
            </div>
          </article>
        ))}
      </div>

      <nav className="pagination" aria-label="Booking pages">
        <p aria-live="polite">
          Showing <strong>{firstVisibleBooking}-{lastVisibleBooking}</strong> of{' '}
          <strong>{totalCount}</strong> bookings
        </p>
        <div className="pagination__controls">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous booking page"
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>
          <div
            className="pagination__pages"
            aria-label={`Page ${currentPage} of ${totalPages}`}
          >
            {visiblePages.map((page) => (
              <button
                type="button"
                key={page}
                className={page === currentPage ? 'is-active' : ''}
                onClick={() => onPageChange(page)}
                aria-label={`Go to booking page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next booking page"
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </nav>
    </>
  )
}
