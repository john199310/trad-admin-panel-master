export const SIDEBAR_NAMES = {
  DASHBOARD: 'dashboard',
  MY_WORK: 'myWork',
  APPLICATION: 'application',
  ALERTS: 'alerts',
  CLIENT: 'client',
  DEBTOR: 'debtor',
  CLAIM: 'claim',
  OVERDUE: 'overdue',
  INSURER: 'insurer',
  USER: 'user',
  REPORT: 'report',
  SETTINGS: 'settings',
};

export const SIDEBAR_URLS = [
  {
    label: 'Dashboard',
    title: 'Dashboard',
    icon: 'assessment',
    url: '/dashboard',
    name: SIDEBAR_NAMES.DASHBOARD,
  },
  {
    label: 'My Work',
    title: 'My Work',
    icon: 'event',
    url: '/my-work',
    name: SIDEBAR_NAMES.MY_WORK,
  },
  {
    label: 'Application',
    title: 'Application',
    icon: 'business_center',
    url: '/applications',
    name: SIDEBAR_NAMES.APPLICATION,
  },
  {
    label: 'Alerts',
    title: 'Alerts',
    icon: 'notifications_active',
    url: '/alerts',
    name: SIDEBAR_NAMES.ALERTS,
  },
  {
    label: 'Clients',
    title: 'Clients',
    icon: 'supervisor_account',
    url: '/clients',
    name: SIDEBAR_NAMES.CLIENT,
  },
  {
    label: 'Debtors',
    title: 'Debtor Management',
    icon: 'account_circle',
    url: '/debtors',
    name: SIDEBAR_NAMES.DEBTOR,
  },
  {
    label: 'Reports',
    title: 'Reports',
    icon: 'pie_chart',
    url: '/reports',
    name: SIDEBAR_NAMES.REPORT,
  },
  {
    label: 'Claims',
    title: 'Claims',
    icon: 'class',
    url: '/claims',
    name: SIDEBAR_NAMES.CLAIM,
  },
  {
    label: 'Overdues',
    title: 'Overdues',
    icon: 'list_alt',
    url: '/over-dues',
    name: SIDEBAR_NAMES.OVERDUE,
  },
  {
    label: 'Insurer',
    title: 'Insurer',
    icon: 'text_snippet',
    url: '/insurer',
    name: SIDEBAR_NAMES.INSURER,
  },
  {
    label: 'Users',
    title: 'User Management',
    icon: 'admin_panel_settings',
    url: '/users',
    name: SIDEBAR_NAMES.USER,
  },
  {
    label: 'Settings',
    title: 'Settings',
    icon: 'settings',
    url: '/settings',
    name: SIDEBAR_NAMES.SETTINGS,
  },
];