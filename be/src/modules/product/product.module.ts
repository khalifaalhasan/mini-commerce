import { Logger, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [ProductController],
  imports: [PrismaModule],
  providers: [ProductService, Logger],
})
export class ProductModule {}
