import { IBillingRepository, SupabaseBillingRepository } from "@/repositories/billing.repository"
import { ITestRepository, SupabaseTestRepository } from "@/repositories/test.repository"
import { CreateOrderDTO, Order } from "@/types/billing"

export class BillingService {
  constructor(
    private readonly repository: IBillingRepository,
    private readonly testRepository: ITestRepository
  ) {}

  async createOrder(data: CreateOrderDTO): Promise<Order> {
    const tests = await this.testRepository.getTests()
    const selectedTests = tests.filter(t => data.testIds.includes(t.id))
    
    let subtotal = 0
    selectedTests.forEach(t => subtotal += t.price)
    
    const taxRate = 0.05 // 5% GST
    const taxAmount = subtotal * taxRate
    const total = subtotal + taxAmount - data.discountAmount

    return this.repository.createOrder(data, total, taxAmount, subtotal)
  }

  async getAllOrders(): Promise<Order[]> {
    return this.repository.getOrders()
  }

  async getOrder(id: string): Promise<Order | null> {
    return this.repository.getOrderById(id)
  }
}

const testRepository = new SupabaseTestRepository()
const billingRepository = new SupabaseBillingRepository()
export const billingService = new BillingService(billingRepository, testRepository)
