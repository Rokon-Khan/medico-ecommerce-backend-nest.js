import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import environmentValidation from './config/environment.validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { DataQueryModule } from './common/data-query/data-query.module';
import { DatabaseExceptionFilter } from './common/errors/global.errors';
import { JwtOrApiKeyGuard } from './auth/guards/jwt-or-api-key.guard';
import { MailModule } from './modules/mail/mail.module';
import { DataResponseInterceptor } from './common/interceptors/data-response/data-response.interceptor';
import { AccessTokenStrategy, RefreshTokenStrategy } from './auth/strategies';
import { FileUploadsModule } from './common/file-uploads/file-uploads.modules';
import { ProductCategoryModule } from './modules/product-category/product-category.module';
import { GenericsModule } from './modules/generics/generics.module';
import { BrandsModule } from './modules/brands/brands.module';
import { ProductsModule } from './modules/products/products.module';
import { ProductDetailsModule } from './modules/product-details/product-details.module';
import { ProductVariantsModule } from './modules/product-variants/product-variants.module';
import { RelatedProductsModule } from './modules/related-products/related-products.module';
import { AddressModule } from './modules/address/address.module';
import { CartsModule } from './modules/carts/carts.module';
import { CartItemsModule } from './modules/cart-items/cart-items.module';
import { WishlistsModule } from './modules/wishlists/wishlists.module';
import { OrdersModule } from './modules/orders/orders.module';
import { OrderItemsModule } from './modules/order-items/order-items.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { InventoryLogsModule } from './modules/inventory-logs/inventory-logs.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { CouponUsagesModule } from './modules/coupon-usages/coupon-usages.module';
import { PrescriptionsModule } from './modules/prescriptions/prescriptions.module';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    // Rate Limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60, // 60 seconds
        limit: 20,
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ENV ? `.env.${ENV}` : '.env',
      load: [appConfig, databaseConfig],
      validationSchema: environmentValidation,
    }),

    // Database connection with async configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.user'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        autoLoadEntities: configService.get<boolean>(
          'database.autoLoadEntities',
        ),
        synchronize: configService.get<boolean>('database.synchronize'),
        // ssl: configService.get('database.ssl'),
        ssl:
          process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      }),
    }),

    // JWT configure
    JwtModule.register({}),

    // Cron / Scheduler
    ScheduleModule.forRoot(),
    UsersModule,
    DataQueryModule,
    MailModule,
    FileUploadsModule,
    ProductCategoryModule,
    GenericsModule,
    BrandsModule,
    ProductsModule,
    ProductDetailsModule,
    ProductVariantsModule,
    RelatedProductsModule,
    AddressModule,
    CartsModule,
    CartItemsModule,
    WishlistsModule,
    OrdersModule,
    OrderItemsModule,
    PaymentsModule,
    InventoryLogsModule,
    ReviewsModule,
    CouponsModule,
    CouponUsagesModule,
    PrescriptionsModule,
  ],

  controllers: [AppController],

  providers: [
    AppService,
    JwtOrApiKeyGuard,
    AccessTokenStrategy,
    RefreshTokenStrategy,

    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },

    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },

    {
      provide: APP_FILTER,
      useClass: DatabaseExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: DataResponseInterceptor,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    },
  ],
  exports: [JwtOrApiKeyGuard],
})
export class AppModule {}
