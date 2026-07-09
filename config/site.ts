import {
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  CreditCard,
  FileText,
  Grid,
  History,
  Layers,
  Receipt,
  Tags,
  UserCog,
  Users,
  Wallet,
} from "lucide-react"

const nameApp = process.env.NEXT_PUBLIC_APP_NAME
const urlApp = process.env.NEXT_PUBLIC_APP_URL

export const runtime = "edge"

export const siteConfig: any = {
  name: `${nameApp}`,
  author: "Roby Ajo",
  description: `${nameApp} - Aplikasi Pencatatan Keuangan Rumah Tangga. Kelola pengeluaran, pemasukan, dompet, dan utang dalam satu tempat.`,
  keywords: [
    `${nameApp}`,
    "Pencatatan Keuangan",
    "Keuangan Rumah Tangga",
    "Manajemen Dompet",
    "Pengeluaran & Pemasukan",
    "Utang Piutang",
    "Anggaran Bulanan",
    "Laporan Keuangan",
    "Financial Tracker",
    "Household Finance",
  ],
  url: {
    base: `${urlApp}`,
    author: "https://portfolio-roby.vercel.app",
  },
  links: {
    github: "https://github.com/robyajo",
  },
  ogImage: `${urlApp}/og.jpg`,
  locale: "id_ID",
  type: "website",
  publishedTime: new Date().toISOString(),
  twitterCard: "summary_large_image",
}

export const modulesConfig = {
  // ─── Dashboard ────────────────────────────────────────────────────────────
  dashboard: {
    label: "Dashboard",
    path: "dashboard",
    icon: Grid,
  },

  // ─── Wallet / Dompet ─────────────────────────────────────────────────────
  wallets: {
    label: "Dompet",
    path: "wallets",
    moduleDir: "wallets",
    icon: Wallet,
    subPaths: {
      create: { path: "create", label: "Tambah", file: "create" },
      edit: { path: "edit", label: "Edit", file: "edit" },
      show: { path: "show", label: "Detail", file: "show" },
    },
  },

  // ─── Kategori ─────────────────────────────────────────────────────────────
  categories: {
    label: "Kategori",
    path: "categories",
    moduleDir: "categories",
    icon: Tags,
    subPaths: {
      create: { path: "create", label: "Tambah", file: "create" },
      edit: { path: "edit", label: "Edit", file: "edit" },
    },
  },

  // ─── Transaksi ────────────────────────────────────────────────────────────
  transactionsIncome: {
    label: "Pemasukan",
    path: "transactions/income",
    moduleDir: "transactions",
    icon: ArrowDownLeft,
    subPaths: {
      create: { path: "create", label: "Tambah", file: "create" },
      show: { path: "show", label: "Detail", file: "show" },
      edit: { path: "edit", label: "Edit", file: "edit" },
    },
  },
  transactionsExpense: {
    label: "Pengeluaran",
    path: "transactions/expense",
    moduleDir: "transactions",
    icon: ArrowUpRight,
    subPaths: {
      create: { path: "create", label: "Tambah", file: "create" },
      show: { path: "show", label: "Detail", file: "show" },
      edit: { path: "edit", label: "Edit", file: "edit" },
    },
  },
  transactionsTransfer: {
    label: "Transfer",
    path: "transactions/transfer",
    moduleDir: "transactions",
    icon: CreditCard,
    subPaths: {
      create: { path: "create", label: "Tambah", file: "create" },
      show: { path: "show", label: "Detail", file: "show" },
    },
  },
  transactionHistory: {
    label: "Riwayat Transaksi",
    path: "transactions/history",
    moduleDir: "transactions",
    icon: History,
    subPaths: {
      show: { path: "show", label: "Detail", file: "show" },
    },
  },

  // ─── Utang / Piutang ──────────────────────────────────────────────────────
  debts: {
    label: "Utang & Piutang",
    path: "debts",
    moduleDir: "debts",
    icon: Receipt,
    subPaths: {
      create: { path: "create", label: "Tambah", file: "create" },
      show: { path: "show", label: "Detail", file: "show" },
      edit: { path: "edit", label: "Edit", file: "edit" },
    },
  },

  // ─── Laporan ──────────────────────────────────────────────────────────────
  reportsSummary: {
    label: "Ringkasan",
    path: "reports/summary",
    moduleDir: "reports",
    icon: Layers,
  },
  reportsByCategory: {
    label: "Per Kategori",
    path: "reports/by-category",
    moduleDir: "reports",
    icon: Tags,
  },
  reportsByWallet: {
    label: "Per Dompet",
    path: "reports/by-wallet",
    moduleDir: "reports",
    icon: Wallet,
  },
  reportsMonthly: {
    label: "Bulanan",
    path: "reports/monthly",
    moduleDir: "reports",
    icon: FileText,
  },

  // ─── Admin ────────────────────────────────────────────────────────────────
  users: {
    label: "Pengguna",
    path: "users",
    moduleDir: "users",
    icon: UserCog,
    subPaths: {
      create: { path: "create", label: "Tambah", file: "create" },
      edit: { path: "edit", label: "Edit", file: "edit" },
      show: { path: "show", label: "Detail", file: "show" },
      changePassword: {
        path: "change-password",
        label: "Ganti Password",
        file: "change-password",
      },
    },
  },
} as const

export type ModuleKey = keyof typeof modulesConfig
