import { Users, HeartPulse, Church, Megaphone, ClipboardCheck } from 'lucide-react'

// One icon per topic cluster — used on score rows and section headers so the
// page reads at a glance instead of leaning on two-letter codes.
export const CLUSTER_ICON = {
  identity: Users,
  body: HeartPulse,
  belief: Church,
  expression: Megaphone,
  duties: ClipboardCheck,
}
