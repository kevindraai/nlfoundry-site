export type ProjectStatus = 'Active development' | 'In development';
export type DeliveryModel = 'Open source' | 'Hosted product';

export interface Project {
  slug: string;
  name: string;
  summary: string;
  status: ProjectStatus;
  deliveryModel: DeliveryModel;
  href: string;
  repository?: string;
  focus: string;
}

export const projects: Project[] = [
  {
    slug: 'exitlane',
    name: 'ExitLane',
    summary:
      'A manageable whole-network VPN gateway for routing devices, services and VLANs through controlled exit locations.',
    status: 'Active development',
    deliveryModel: 'Open source',
    href: '/projects/exitlane/',
    repository: 'https://github.com/kevindraai/exitlane',
    focus: 'Operational clarity, safe failure behaviour and reproducible deployment.',
  },
  {
    slug: 'clubpos',
    name: 'ClubPOS',
    summary:
      'A modern point-of-sale platform shaped around members, open tabs, vouchers, internal budgets and volunteer-run organisations.',
    status: 'In development',
    deliveryModel: 'Hosted product',
    href: '/projects/clubpos/',
    focus: 'Real club workflows, auditable financial behaviour and a managed delivery model.',
  },
];
