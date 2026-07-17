import { Patient } from "./patient"
import { LabTest } from "./test"

export interface OrderItem {
  id?: string;
  orderId?: string;
  testId?: string;
  packageId?: string;
  price: number;
  test?: LabTest;
}

export interface Order {
  id: string;
  orderNumber: string;
  patientId: string;
  doctorId?: string;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: "unpaid" | "partial" | "paid" | "refunded";
  orderStatus: "pending" | "partial" | "completed" | "cancelled";
  createdAt: string;
  patient?: Patient;
  items?: OrderItem[];
}

export interface CreateOrderDTO {
  patientId: string;
  testIds: string[];
  discountAmount: number;
  paidAmount: number;
}
