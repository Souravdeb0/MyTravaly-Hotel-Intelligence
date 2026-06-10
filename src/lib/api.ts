import type {
  BookingsResponse,
  Metrics,
  PeriodResponse,
  TrendPoint,
} from '../types'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'https://mt-task.onrender.com'

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { signal })
  if (!response.ok) {
    throw new Error(`The API returned ${response.status}. Please try again.`)
  }

  const body = (await response.json()) as T & { success?: boolean }
  if (body.success === false) {
    throw new Error('The API could not complete this request.')
  }
  return body
}

export function getBookings(days: number, signal?: AbortSignal) {
  return request<BookingsResponse>(`/api/bookings?days=${days}`, signal)
}

export function getMetrics(days: number, signal?: AbortSignal) {
  return request<PeriodResponse<Metrics>>(`/api/metrics?days=${days}`, signal)
}

export function getTrends(months: number, signal?: AbortSignal) {
  return request<PeriodResponse<TrendPoint[]>>(
    `/api/trends?months=${months}`,
    signal,
  )
}
