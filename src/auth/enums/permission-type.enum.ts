export enum Permission {
  /* =========================
     User Management 
  ========================= */
  USER_CREATE = 'user:create',
  USER_READ = 'user:read',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',
  USER_MANAGE = 'user:*',

  /* =========================
      PRODUCT_CATEGORY Management
   ========================= */

  PRODUCT_CATEGORY_CREATE = 'product_category:create',
  PRODUCT_CATEGORY_READ = 'product_category:read',
  PRODUCT_CATEGORY_UPDATE = 'product_category:update',
  PRODUCT_CATEGORY_DELETE = 'product_category:delete',
  PRODUCT_CATEGORY_MANAGE = 'product_category:*',

  /* =========================
     Product Management
  ========================= */
  PRODUCT_CREATE = 'product:create',
  PRODUCT_READ = 'product:read',
  PRODUCT_UPDATE = 'product:update',
  PRODUCT_DELETE = 'product:delete',
  PRODUCT_REVIEW = 'product:review',
  PRODUCT_MANAGE = 'product:*',

  /* =========================
   PRODUCT DETAIL Management
========================= */

  PRODUCT_DETAIL_CREATE = 'product_detail:create',
  PRODUCT_DETAIL_READ = 'product_detail:read',
  PRODUCT_DETAIL_UPDATE = 'product_detail:update',
  PRODUCT_DETAIL_DELETE = 'product_detail:delete',
  PRODUCT_DETAIL_MANAGE = 'product_detail:*',

  /* =========================
    PRODUCT_VARIANT Management
========================= */

  PRODUCT_VARIANT_CREATE = 'product_variant:create',
  PRODUCT_VARIANT_READ = 'product_variant:read',
  PRODUCT_VARIANT_UPDATE = 'product_variant:update',
  PRODUCT_VARIANT_DELETE = 'product_variant:delete',
  PRODUCT_VARIANT_MANAGE = 'product_variant:*',

  /* =========================
    RELATED_PRODUCT Management
========================= */

  RELATED_PRODUCT_CREATE = 'related_product:create',
  RELATED_PRODUCT_READ = 'related_product:read',
  RELATED_PRODUCT_UPDATE = 'related_product:update',
  RELATED_PRODUCT_DELETE = 'related_product:delete',
  RELATED_PRODUCT_MANAGE = 'related_product:*',

  /* =========================
    GENERIC Management
========================= */

  GENERIC_CREATE = 'generic:create',
  GENERIC_READ = 'generic:read',
  GENERIC_UPDATE = 'generic:update',
  GENERIC_DELETE = 'generic:delete',
  GENERIC_MANAGE = 'generic:*',

  /* =========================
    BRAND Management
========================= */

  BRAND_CREATE = 'brand:create',
  BRAND_READ = 'brand:read',
  BRAND_UPDATE = 'brand:update',
  BRAND_DELETE = 'brand:delete',
  BRAND_MANAGE = 'brand:*',

  /* =========================
      ADDRESS Management
   ========================= */

  ADDRESS_CREATE = 'address:create',
  ADDRESS_READ = 'address:read',
  ADDRESS_UPDATE = 'address:update',
  ADDRESS_DELETE = 'address:delete',
  ADDRESS_MANAGE = 'address:*',

  /* =========================
      CART Management
========================= */

  CART_CREATE = 'cart:create',
  CART_READ = 'cart:read',
  CART_UPDATE = 'cart:update',
  CART_DELETE = 'cart:delete',
  CART_MANAGE = 'cart:*',

  /* =========================
      CART_ITEM Management
   ========================= */

  CART_ITEM_CREATE = 'cart_item:create',
  CART_ITEM_READ = 'cart_item:read',
  CART_ITEM_UPDATE = 'cart_item:update',
  CART_ITEM_DELETE = 'cart_item:delete',
  CART_ITEM_MANAGE = 'cart_item:*',

  /* =========================
      WISHLIST Management
   ========================= */

  WISHLIST_CREATE = 'wishlist:create',
  WISHLIST_READ = 'wishlist:read',
  WISHLIST_UPDATE = 'wishlist:update',
  WISHLIST_DELETE = 'wishlist:delete',
  WISHLIST_MANAGE = 'wishlist:*',

  INVENTORY_LOG_CREATE = 'inventory_log:create',
  INVENTORY_LOG_READ = 'inventory_log:read',
  INVENTORY_LOG_UPDATE = 'inventory_log:update',
  INVENTORY_LOG_DELETE = 'inventory_log:delete',

  REVIEW_CREATE = 'review:create',
  REVIEW_READ = 'review:read',
  REVIEW_UPDATE = 'review:update',
  REVIEW_DELETE = 'review:delete',

  REVIEW_APPROVE = 'review:approve',
  REVIEW_REJECT = 'review:reject',

  REVIEW_MANAGE = 'review:manage',

  //   prescription

  PRESCRIPTION_CREATE = 'prescription:create',
  PRESCRIPTION_READ = 'prescription:read',
  PRESCRIPTION_UPDATE = 'prescription:update',
  PRESCRIPTION_DELETE = 'prescription:delete',

  PRESCRIPTION_APPROVE = 'prescription:approve',
  PRESCRIPTION_REJECT = 'prescription:reject',

  PRESCRIPTION_MANAGE = 'prescription:manage',

  BANNER_CREATE = 'banner:create',
  BANNER_READ = 'banner:read',
  BANNER_UPDATE = 'banner:update',
  BANNER_DELETE = 'banner:delete',
  BANNER_MANAGE = 'banner:manage',

  AUDIT_LOG_CREATE = 'audit_log:create',
  AUDIT_LOG_READ = 'audit_log:read',
  AUDIT_LOG_UPDATE = 'audit_log:update',
  AUDIT_LOG_DELETE = 'audit_log:delete',
  AUDIT_LOG_MANAGE = 'audit_log:manage',

  /* =========================
     Profile
  ========================= */
  PROFILE_READ = 'profile:read',
  PROFILE_UPDATE = 'profile:update',

  /* =========================
     Order & Payment
  ========================= */
  ORDER_CREATE = 'order:create',
  ORDER_READ = 'order:read',
  ORDER_UPDATE = 'order:update',
  ORDER_DELETE = 'order:delete',

  // ==================== ORDER TRACKING PERMISSIONS ====================
  ORDER_TRACKING_READ = 'order-tracking:read',
  ORDER_TRACKING_UPDATE = 'order-tracking:update',
  ORDER_TRACKING_BULK_UPDATE = 'order-tracking:bulk-update',
  ORDER_TRACKING_MANAGE = 'order-tracking:manage',

  PAYMENT_CREATE = 'payment:create',
  PAYMENT_READ = 'payment:read',
  PAYMENT_UPDATE = 'payment:update',
  PAYMENT_DELETE = 'payment:delete',

  COUPON_CREATE = 'coupon:create',
  COUPON_READ = 'coupon:read',
  COUPON_APPLY = 'coupon:apply',
  COUPON_UPDATE = 'coupon:update',
  COUPON_DELETE = 'coupon:delete',
  COUPON_MANAGE = 'coupon:manage',
  COUPON_USAGE_READ = 'coupon-usage:read',

  /* =========================
     Settings
  ========================= */
  SETTINGS_READ = 'settings:read',
  SETTINGS_UPDATE = 'settings:update',

  /* =========================


  /* =========================
     System Administration
  ========================= */
  SYSTEM_READ = 'system:read',
  SYSTEM_UPDATE = 'system:update',
  SYSTEM_MANAGE = 'system:*',
  BULK_OPERATION = 'system:bulk-operation',
}
