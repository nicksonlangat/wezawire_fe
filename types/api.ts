// types/api.ts

export interface Journalist {
    id: string;
    email: string;
    name: string;
    phone: string;
    country: string;
    title: string;
    media_house: string;
    total_points: number;
    points_in_ksh: number;
  }
  
  export interface PressRelease {
    id: string;
    title: string;
    description: string;
    client: string;
    country: string;
    is_published: boolean;
    author_name: string;
    created_at: string;
  }
  
  export interface PublishedLink {
    id: string;
    journalist: string;
    journalist_name: string;
    press_release: string;
    press_release_title: string;
    url: string;
    title: string;
    publication_date: string;
    status: 'pending' | 'approved' | 'rejected';
    notes: string | null;
    reviewed_by: number | null;
    reviewer_name: string | null;
    reviewed_at: string | null;
    created_at: string;
  }
  
  export interface PointTransaction {
    id: string;
    journalist: string;
    journalist_name: string;
    points: number;
    transaction_type: 'earned' | 'withdrawal';
    description: string;
    related_press_release: string | null;
    created_at: string;
  }
  
  export interface WithdrawalRequest {
    id: string;
    journalist: string;
    journalist_name: string;
    points: number;
    amount: number;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    payment_method: string;
    payment_details: any;
    processed_by: string | null;
    processor_name: string | null;
    processed_at: string | null;
    transaction_reference: string | null;
    notes: string | null;
    created_at: string;
  }
  
  export interface JournalistDashboard {
    journalist: Journalist;
    press_releases: PressRelease[];
    published_links: PublishedLink[];
    total_points: number;
    points_in_ksh: number;
    withdrawal_requests: WithdrawalRequest[];
  }
  
  export interface AdminDashboard {
    pending_links: number;
    pending_withdrawals: number;
    total_points_awarded: number;
    total_points_withdrawn: number;
    total_ksh_processed: number;
    top_journalists: {
      name: string;
      email: string;
      points: number;
    }[];
  }
  
  export interface PressReleaseStats {
    press_release: PressRelease & {
      published_links: PublishedLink[];
    };
    links_stats: {
      status: 'pending' | 'approved' | 'rejected';
      count: number;
    }[];
    journalists_shared: number;
    journalists_published: number;
    engagement_rate: number;
  }