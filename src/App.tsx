import {
  lazy,
  Suspense,
  useDeferredValue,
  useEffect,
  useState,
} from 'react'
import { useQueries, useQueryClient } from '@tanstack/react-query'
import {
  ArrowUpRight,
  BedDouble,
  CalendarCheck,
  IndianRupee,
  RefreshCw,
  WalletCards,
} from 'lucide-react'
import './App.css'
import { Brand } from './components/Brand'
import { BookingFilters } from './components/BookingFilters'
import { BookingsView } from './components/BookingsView'
import { DashboardSkeleton } from './components/LoadingState'
import { MetricCard } from './components/MetricCard'
import { PerformanceRings } from './components/PerformanceRings'
import { getBookings, getMetrics, getTrends } from './lib/api'
import { defaultFilters, filterBookings, getFilterOptions } from './lib/bookings'
import { formatCurrency, formatRelativeTime } from './lib/format'
import type { BookingFilters as BookingFiltersType } from './types'

const dayOptions = [7, 30, 90, 180, 365]
const monthOptions = [3, 6, 9, 12]
const bookingsPerPage = 6
const RevenueChart = lazy(() =>
  import('./components/Charts').then((module) => ({
    default: module.RevenueChart,
  })),
)
const BookingsChart = lazy(() =>
  import('./components/Charts').then((module) => ({
    default: module.BookingsChart,
  })),
)

function ChartFallback() {
  return <div className="chart-placeholder" aria-label="Loading chart" />
}

function App() {
  const queryClient = useQueryClient()
  const [days, setDays] = useState(30)
  const [months, setMonths] = useState(6)
  const [filters, setFilters] = useState<BookingFiltersType>(defaultFilters)
  const [bookingPage, setBookingPage] = useState(1)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 10_000)
    return () => window.clearInterval(timer)
  }, [])

  const results = useQueries({
    queries: [
      {
        queryKey: ['bookings', days],
        queryFn: ({ signal }: { signal: AbortSignal }) => getBookings(days, signal),
        staleTime: 60_000,
      },
      {
        queryKey: ['metrics', days],
        queryFn: ({ signal }: { signal: AbortSignal }) => getMetrics(days, signal),
        staleTime: 60_000,
      },
      {
        queryKey: ['trends', months],
        queryFn: ({ signal }: { signal: AbortSignal }) => getTrends(months, signal),
        staleTime: 60_000,
      },
    ],
  })

  const [bookingsQuery, metricsQuery, trendsQuery] = results
  const deferredQuery = useDeferredValue(filters.query)
  const bookings = bookingsQuery.data?.data ?? []
  const filteredBookings = filterBookings(bookings, {
    ...filters,
    query: deferredQuery,
  })
  const totalBookingPages = Math.max(
    1,
    Math.ceil(filteredBookings.length / bookingsPerPage),
  )
  const currentBookingPage = Math.min(bookingPage, totalBookingPages)
  const visibleBookings = filteredBookings.slice(
    (currentBookingPage - 1) * bookingsPerPage,
    currentBookingPage * bookingsPerPage,
  )
  const options = getFilterOptions(bookings)
  const metrics = metricsQuery.data?.data
  const trends = trendsQuery.data?.data ?? []
  const isInitialLoading = results.some((result) => result.isPending && !result.data)
  const isRefreshing = results.some((result) => result.isFetching)
  const firstError = results.find((result) => result.error)?.error
  const lastUpdated = Math.max(...results.map((result) => result.dataUpdatedAt))

  const refresh = () => {
    void queryClient.invalidateQueries()
  }

  const updateFilters = (nextFilters: BookingFiltersType) => {
    setFilters(nextFilters)
    setBookingPage(1)
  }

  if (isInitialLoading) {
    return (
      <>
        <header className="site-header"><Brand /></header>
        <main><DashboardSkeleton /></main>
      </>
    )
  }

  if (firstError || !metrics) {
    return (
      <main className="fatal-error">
        <span className="fatal-error__mark">!</span>
        <p className="eyebrow">The front desk is reconnecting</p>
        <h1>We could not reach the hotel data.</h1>
        <p>Render may be waking up after a quiet period. Give it another try in a moment.</p>
        <button className="primary-button" type="button" onClick={refresh}>
          <RefreshCw size={17} />Try again
        </button>
        <small>{firstError?.message}</small>
      </main>
    )
  }

  return (
    <div id="top" className={`app-shell${isRefreshing ? ' is-refreshing' : ''}`}>
      <div className="refresh-progress" aria-hidden="true" />
      <header className="site-header">
        <Brand />
        <nav aria-label="Dashboard sections">
          <a href="#overview">Overview</a>
          <a href="#bookings">Bookings</a>
        </nav>
        <div className="header-actions">
          <span className="live-indicator"><i />Live data</span>
          <button
            className="refresh-button"
            type="button"
            onClick={refresh}
            disabled={isRefreshing}
            aria-label={
              isRefreshing ? 'Refreshing dashboard data' : 'Refresh dashboard data'
            }
          >
            <RefreshCw size={16} className={isRefreshing ? 'spin' : ''} />
            <span>{isRefreshing ? 'Refreshing' : 'Refresh'}</span>
          </button>
        </div>
      </header>

      <main>
        <section className="hero-section" id="overview">
          <div className="hero-section__copy">
            <h1>Every stay,<br /><em>in clear view.</em></h1>
            <p className="hero-section__description">
              A living snapshot of demand, revenue and guest movement across your hotel portfolio.
            </p>
          </div>
          <div className="hero-section__controls">
            <label>
              Analytics window
              <select
                value={days}
                onChange={(event) => {
                  setDays(Number(event.target.value))
                  setBookingPage(1)
                }}
              >
                {dayOptions.map((option) => <option value={option} key={option}>Next {option} days</option>)}
              </select>
            </label>
            <p aria-live="polite">
              Updated {formatRelativeTime(lastUpdated, now)}
              <span>Data changes on every refresh</span>
            </p>
          </div>
          <span className="hero-section__folio">01</span>
        </section>

        <section className="metrics-grid" aria-label="Key hotel metrics">
          <MetricCard label="Total bookings" value={metrics.totalBookings.toLocaleString('en-IN')} detail={`${metrics.confirmed} confirmed stays`} icon={CalendarCheck} tone="ink" />
          <MetricCard label="Revenue" value={formatCurrency(metrics.totalRevenue, true)} detail={`Across the next ${days} days`} icon={IndianRupee} tone="coral" />
          <MetricCard label="Average booking" value={formatCurrency(metrics.averageBookingValue)} detail="Value per reservation" icon={WalletCards} tone="sage" />
          <MetricCard label="Rooms in motion" value={`${metrics.confirmed + metrics.pending}`} detail={`${metrics.cancelled} cancellations`} icon={BedDouble} />
        </section>

        <section className="analytics-grid">
          <article className="panel panel--wide">
            <div className="panel__header">
              <div><p className="eyebrow">Revenue rhythm</p><h2>Portfolio performance</h2></div>
              <label className="compact-select">
                <span className="sr-only">Trend period</span>
                <select value={months} onChange={(event) => setMonths(Number(event.target.value))}>
                  {monthOptions.map((option) => <option value={option} key={option}>{option} months</option>)}
                </select>
              </label>
            </div>
            <div className="chart-area">
              <Suspense fallback={<ChartFallback />}>
                <RevenueChart data={trends} />
              </Suspense>
            </div>
          </article>

          <article className="panel panel--bookings">
            <div className="panel__header">
              <div><p className="eyebrow">Demand</p><h2>Bookings by month</h2></div>
              <ArrowUpRight size={20} aria-hidden="true" />
            </div>
            <div className="chart-area chart-area--small">
              <Suspense fallback={<ChartFallback />}>
                <BookingsChart data={trends} />
              </Suspense>
            </div>
          </article>

          <article className="panel panel--performance">
            <div className="panel__header">
              <div><p className="eyebrow">Efficiency</p><h2>Operating pulse</h2></div>
            </div>
            <PerformanceRings occupancy={metrics.occupancyRate} conversion={metrics.conversionRate} />
            <p className="performance-note"><strong>{metrics.pending}</strong> reservations are waiting for confirmation.</p>
          </article>
        </section>

        <section className="bookings-section" id="bookings">
          <div className="section-heading">
            <div><p className="eyebrow">Guest ledger</p><h2>Upcoming bookings</h2></div>
            <p>Explore every reservation in the current window. Filters are applied locally for an instant response.</p>
          </div>
          <BookingFilters
            filters={filters}
            hotels={options.hotels}
            roomTypes={options.roomTypes}
            resultCount={filteredBookings.length}
            totalCount={bookings.length}
            onChange={updateFilters}
            onReset={() => updateFilters(defaultFilters)}
          />
          <BookingsView
            bookings={visibleBookings}
            currentPage={currentBookingPage}
            pageSize={bookingsPerPage}
            totalCount={filteredBookings.length}
            totalPages={totalBookingPages}
            onPageChange={setBookingPage}
          />
        </section>
      </main>

      <footer>
        <Brand />
        <p>Hotel intelligence, without the noise.</p>
        <span>Live assignment build · 2026</span>
      </footer>
    </div>
  )
}

export default App
