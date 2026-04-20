import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/get-user.decorator';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async checkout(
    @GetUser('userId') userId: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    // Dengan Guard, kita bisa mengambil userId langsung dari token (req.user)
    return this.orderService.createOrder({ ...createOrderDto, userId });
  }
  @Get()
  async findAll() {
    return await this.orderService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getDetail(@Param('id') id: string) {
    return this.orderService.getOrderById(id);
  }
}
