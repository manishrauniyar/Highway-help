
import AdminNav from '../../components/admin/AdminNav'
import DataTable from '../../components/admin/DataTable'
import StatCard from '../../components/admin/StatCard'
import { useBookings } from '../../context/BookingContext'
import { WalletIcon } from '../../components/common/Icons'
import { formatCurrency, formatDate } from '../../utils/helpers'

export default function AdminPayments() {
  const { bookings } = useBookings()
  const paid = bookings.filter((b) => b.status === 'completed')
  const totalOnline = paid.filter((b) => b.paymentStatus === 'paid').reduce((s, b) => s + (Number(b.finalPrice) || 0), 0)
  const totalCash = paid.filter((b) => b.paymentStatus === 'due').reduce((s, b) => s + (Number(b.finalPrice) || 0), 0)

  const columns = [
    { key: 'id', label: 'Booking ID', render: (r) => `#${String(r.id).slice(-6).toUpperCase()}` },
    { key: 'customerName', label: 'Customer' },
    { key: 'finalPrice', label: 'Amount', render: (r) => formatCurrency(r.finalPrice) },
    {
      key: 'paymentStatus',
      label: 'Method',
      render: (r) => (r.paymentStatus === 'paid' ? 'Online' : r.paymentStatus === 'due' ? 'Cash' : 'Pending'),
    },
    { key: 'completedAt', label: 'Date', render: (r) => formatDate(r.completedAt) },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-2xl sm:text-3xl tracking-wide mb-1">Payments</h1>
      <p className="text-slate-muted text-sm mb-6">Track how customers are paying for completed services.</p>
      <AdminNav />
      <div className="grid grid-cols-2 gap-4 mb-8 max-w-md">
        <StatCard label="Total Paid Online" value={formatCurrency(totalOnline)} icon={WalletIcon} />
        <StatCard label="Total Cash Collected" value={formatCurrency(totalCash)} icon={WalletIcon} />
      </div>
      <DataTable columns={columns} rows={paid} emptyLabel="No completed payments yet." />
    </div>
  )
}
