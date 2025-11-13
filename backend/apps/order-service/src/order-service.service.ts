import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { OrderEntity } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrderServiceService {
  private readonly productServiceUrl: string;

  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.productServiceUrl =
      this.configService.get<string>('app.productServiceUrl') || '';
  }

  async create(createOrderDto: CreateOrderDto): Promise<OrderEntity> {
    const { productId, quantity } = createOrderDto;

    // Fetch product
    let product;
    try {
      const res = await firstValueFrom(
        this.httpService.get(`${this.productServiceUrl}/${productId}`),
      );
      product = res.data;
    } catch {
      throw new BadRequestException('Product not found');
    }

    // Update stock
    try {
      await firstValueFrom(
        this.httpService.put(`${this.productServiceUrl}/${productId}/stock`, {
          quantity,
        }),
      );
    } catch {
      throw new BadRequestException('Insufficient stock or update failed');
    }

    const totalPrice = product.price * quantity;
    const order = this.orderRepository.create({
      ...createOrderDto,
      totalPrice,
      status: 'completed',
    });
    const savedOrder = await this.orderRepository.save(order);
    return savedOrder;
  }

  async findAll(): Promise<OrderEntity[]> {
    return this.orderRepository.find();
  }

  async findOne(id: number): Promise<OrderEntity> {
    const order = await this.orderRepository.findOneBy({ id });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(
    id: number,
    updateOrderDto: UpdateOrderDto,
  ): Promise<OrderEntity> {
    const order = await this.findOne(id);
    Object.assign(order, updateOrderDto);
    const updatedOrder = await this.orderRepository.save(order);
    return updatedOrder;
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await this.orderRepository.remove(order);
  }

  async findAllWithProducts(): Promise<any[]> {
    const orders = await this.findAll();
    return Promise.all(
      orders.map(async (order) => {
        let product = null;
        try {
          const res = await firstValueFrom(
            this.httpService.get(
              `${this.productServiceUrl}/${order.productId}`,
            ),
          );
          product = res.data;
        } catch {}
        return { ...order, product };
      }),
    );
  }
}
