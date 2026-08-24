export type RentalRequestStatus = 'pending' | 'accepted' | 'rejected';

export interface RentalRequest {
  id: number;
  product_title: string;
  renter_name: string;
  start_time: string;
  end_time: string;
  total_price: number;
  category: string;
  owner_status: RentalRequestStatus;
}