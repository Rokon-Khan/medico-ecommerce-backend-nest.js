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

  /* =========================
       Our Work Process Management
   ========================= */
  OUR_WORK_PROCESSES_CREATE = 'our-work-processes:create',
  OUR_WORK_PROCESSES_READ = 'our-work-processes:read',
  OUR_WORK_PROCESSES_UPDATE = 'our-work-processes:update',
  OUR_WORK_PROCESSES_DELETE = 'our-work-processes:delete',
  OUR_WORK_PROCESSES_MANAGE = 'our-work-processes:*',

  TEAM_CREATE = 'team:create',
  TEAM_READ = 'team:read',
  TEAM_UPDATE = 'team:update',
  TEAM_DELETE = 'team:delete',
  TEAM_MANAGE = 'team:*',

  WHO_WE_ARE_CREATE = 'who-we-are:create',
  WHO_WE_ARE_READ = 'who-we-are:read',
  WHO_WE_ARE_UPDATE = 'who-we-are:update',
  WHO_WE_ARE_DELETE = 'who-we-are:delete',
  WHO_WE_ARE_MANAGE = 'who-we-are:*',

  WHO_WE_ARE_FEATURE_CREATE = 'who-we-are-features:create',
  WHO_WE_ARE_FEATURE_READ = 'who-we-are-features:read',
  WHO_WE_ARE_FEATURE_UPDATE = 'who-we-are-features:update',
  WHO_WE_ARE_FEATURE_DELETE = 'who-we-are-features:delete',
  WHO_WE_ARE_FEATURE_MANAGE = 'who-we-are-features:*',
  /* =========================
       Question Answer Management
   ========================= */
  QUESTION_ANSWER_CREATE = 'question-answer:create',
  QUESTION_ANSWER_READ = 'question-answer:read',
  QUESTION_ANSWER_UPDATE = 'question-answer:update',
  QUESTION_ANSWER_DELETE = 'question-answer:delete',
  QUESTION_ANSWER_MANAGE = 'question-answer:*',

  /* =========================
     Content Management
  ========================= */
  CONTENT_CREATE = 'content:create',
  CONTENT_READ = 'content:read',
  CONTENT_UPDATE = 'content:update',
  CONTENT_DELETE = 'content:delete',
  CONTENT_MANAGE = 'content:*',
  /* =========================
     CATEGORY Management
  ========================= */
  CATEGORY_CREATE = 'category:create',
  CATEGORY_READ = 'category:read',
  CATEGORY_UPDATE = 'category:update',
  CATEGORY_DELETE = 'category:delete',
  CATEGORY_MANAGE = 'category:*',
  /* =========================
     CATEGORY Management
  ========================= */
  BLOG_CATEGORY_CREATE = 'blog-category:create',
  BLOG_CATEGORY_READ = 'blog-category:read',
  BLOG_CATEGORY_UPDATE = 'blog-category:update',
  BLOG_CATEGORY_DELETE = 'blog-category:delete',
  BLOG_CATEGORY_MANAGE = 'category:*',

  /* =========================
   Why Choose Us Management
========================= */
  WHY_CHOOSE_US_CREATE = 'why-choose-us:create',
  WHY_CHOOSE_US_READ = 'why-choose-us:read',
  WHY_CHOOSE_US_UPDATE = 'why-choose-us:update',
  WHY_CHOOSE_US_DELETE = 'why-choose-us:delete',
  WHY_CHOOSE_US_MANAGE = 'why-choose-us:*',

  /* =========================
   Pricings Management
========================= */
  PRICINGS_CREATE = 'pricings:create',
  PRICINGS_READ = 'pricings:read',
  PRICINGS_UPDATE = 'pricings:update',
  PRICINGS_DELETE = 'pricings:delete',
  PRICINGS_MANAGE = 'pricings:*',

  /* =========================
   Pricing Category Management
========================= */
  PRICING_CATEGORY_CREATE = 'pricing-category:create',
  PRICING_CATEGORY_READ = 'pricing-category:read',
  PRICING_CATEGORY_UPDATE = 'pricing-category:update',
  PRICING_CATEGORY_DELETE = 'pricing-category:delete',
  PRICING_CATEGORY_MANAGE = 'pricing-category:*',

  /* =========================
   Pricing Feature Management
========================= */
  PRICING_FEATURE_CREATE = 'pricing-feature:create',
  PRICING_FEATURE_READ = 'pricing-feature:read',
  PRICING_FEATURE_UPDATE = 'pricing-feature:update',
  PRICING_FEATURE_DELETE = 'pricing-feature:delete',
  PRICING_FEATURE_MANAGE = 'pricing-feature:*',

  /* =========================
   Hero Management
========================= */
  HEROES_CREATE = 'heroes:create',
  HEROES_READ = 'heroes:read',
  HEROES_UPDATE = 'heroes:update',
  HEROES_DELETE = 'heroes:delete',
  HEROES_MANAGE = 'heroes:*',
  /* =========================
   Testimonial Management
========================= */
  TESTIMONIALS_CREATE = 'testimonials:create',
  TESTIMONIALS_READ = 'testimonials:read',
  TESTIMONIALS_UPDATE = 'testimonials:update',
  TESTIMONIALS_DELETE = 'testimonials:delete',
  TESTIMONIALS_MANAGE = 'testimonials:*',

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

  PAYMENT_READ = 'payment:read',
  PAYMENT_UPDATE = 'payment:update',
  PAYMENT_DELETE = 'payment:delete',

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
