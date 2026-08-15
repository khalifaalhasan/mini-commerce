// import { PrismaService } from '../prisma/prisma.service';
// import { ProductService } from './product.service';
// import { CreateProductDto } from './dto/create-product.dto';
// import { InternalServerErrorException } from '@nestjs/common/exceptions/internal-server-error.exception';
// import { Logger } from '@nestjs/common';
// import { Test, TestingModule } from '@nestjs/testing';
// import {
//   describe,
//   it,
//   beforeEach,
//   afterEach,
//   expect,
//   jest,
// } from '@jest/globals';

// const mockPrismaService = {
//   product: {
//     create: jest.fn(),
//   },
// };

// const mockLogger = {
//   log: jest.fn(),
//   error: jest.fn(),
// };

// describe('ProductService', () => {
//   let service: ProductService;
//   //   let prisma: PrismaService;
//   //   let logger: Logger;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         ProductService,
//         { provide: PrismaService, useValue: mockPrismaService },
//         { provide: Logger, useValue: mockLogger },
//       ],
//     }).compile();

//     service = module.get<ProductService>(ProductService);
//     // prisma = module.get<PrismaService>(PrismaService);
//     // logger = module.get<Logger>(Logger);
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('create', () => {
//     const mockDto: CreateProductDto = {
//       name: 'Test Product',
//       price: 100,
//       stock: 10,
//       description: 'Test Description',
//       categoryId: 'test-categoryId-123',
//       images: ['image1.jpg', 'image2.jpg'],
//       sku: 'TESTSKU',
//     };

//     it('should successfully create a product', async () => {
//       const expectedResult = {
//         id: 'prod-123',
//         ...mockDto,
//         slug: 'test-product',
//       };
//       mockPrismaService.product.create.mockResolvedValue(expectedResult);

//       const result = await service.create(mockDto);

//       expect(result).toEqual(expectedResult);
//       expect(mockPrismaService.product.create).toHaveBeenCalledWith({
//         data: expect.objectContaining({
//           name: mockDto.name,
//           price: mockDto.price,
//           stock: mockDto.stock,
//           description: mockDto.description,
//           categoryId: mockDto.categoryId,
//           images: mockDto.images,
//           sku: mockDto.sku,
//           slug: 'test-product',
//         }),
//       });

//       expect(mockLogger.log).toHaveBeenCalledWith();
//     });

//     it('should throw InternalServerErrorException when prisma fails to create a product', async () => {
//       const mockError = new Error('Database error');
//       mockPrismaService.product.create.mockRejectedValue(mockError);

//       await expect(service.create(mockDto)).rejects.toThrow(
//         InternalServerErrorException,
//       );

//       expect(mockLogger.error).toHaveBeenCalledWith(
//         'failed to insert product into database',
//         mockError,
//         ProductService.name,
//       );
//     });
//   });
// });
