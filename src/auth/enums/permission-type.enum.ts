export enum Permission {
  /* =========================
     AWS IAM–style mental models
     User Management 
  ========================= */
  USER_CREATE = 'user:create',
  USER_READ = 'user:read',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',
  USER_MANAGE = 'user:*',

  //   TRUSTED_COMPANIES_CREATE
  TRUSTED_COMPANIES_CREATE = 'trusted-companies:create',
  TRUSTED_COMPANIES_READ = 'trusted-companies:read',
  TRUSTED_COMPANIES_UPDATE = 'trusted-companies:update',
  TRUSTED_COMPANIES_DELETE = 'trusted-companies:delete',
  TRUSTED_COMPANIES_MANAGE = 'trusted-companies:*',

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
     BusinessWeCover Management
  ========================= */
  BUSINESS_WC_CREATE = 'business-we-cover:create',
  BUSINESS_WC_READ = 'business-we-cover:read',
  BUSINESS_WC_UPDATE = 'business-we-cover:update',
  BUSINESS_WC_DELETE = 'business-we-cover:delete',
  BUSINESS_WC_MANAGE = 'business-we-cover:*',

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
   Service Management
========================= */
  SERVICES_CREATE = 'services:create',
  SERVICES_READ = 'services:read',
  SERVICES_UPDATE = 'services:update',
  SERVICES_DELETE = 'services:delete',
  SERVICES_MANAGE = 'services:*',

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

  PARTNERS_CREATE = 'partners:create',
  PARTNERS_READ = 'partners:read',
  PARTNERS_UPDATE = 'partners:update',
  PARTNERS_DELETE = 'partners:delete',
  PARTNERS_MANAGE = 'partners:*',

  /* =========================
   Assign Pricing Feature Management
========================= */
  ASSIGEN_PRICING_FEATURE_CREATE = 'assigen-pricing-features:create',
  ASSIGEN_PRICEN_FEATURE_READ = 'assigen-pricing-features:read',
  ASSIGEN_PRICEN_FEATURE_UPDATE = 'assigen-pricing-features:update',
  ASSIGEN_PRICEN_FEATURE_DELETE = 'assigen-pricing-features:delete',
  ASSIGEN_PRICEN_FEATURE_MANAGE = 'assigen-pricing-features:*',

  /* =========================
     Product Management
  ========================= */
  PRODUCT_CREATE = 'product:create',
  PRODUCT_READ = 'product:read',
  PRODUCT_UPDATE = 'product:update',
  PRODUCT_DELETE = 'product:delete',
  PRODUCT_REVIEW = 'product:review',
  PRODUCT_MANAGE = 'product:*',

  BLOGS_CREATE = 'blogs:create',
  BLOGS_READ = 'blogs:read',
  BLOGS_UPDATE = 'blogs:update',
  BLOGS_DELETE = 'blogs:delete',
  BLOGS_REVIEW = 'blogs:review',
  BLOGS_MANAGE = 'blogs:*',

  BLOG_DETAILS_CREATE = 'blog-details:create',
  BLOG_DETAILS_READ = 'blog-details:read',
  BLOG_DETAILS_UPDATE = 'blog-details:update',
  BLOG_DETAILS_DELETE = 'blog-details:delete',
  BLOG_DETAILS_REVIEW = 'blog-details:review',
  BLOG_DETAILS_MANAGE = 'blog-details:*',

  PORTFOLIO_DETAILS_CREATE = 'portfolio-details:create',
  PORTFOLIO_DETAILS_READ = 'portfolio-details:read',
  PORTFOLIO_DETAILS_UPDATE = 'portfolio-details:update',
  PORTFOLIO_DETAILS_DELETE = 'portfolio-details:delete',
  PORTFOLIO_DETAILS_REVIEW = 'portfolio-details:review',
  PORTFOLIO_DETAILS_MANAGE = 'portfolio-details:*',

  PORTFOLIO_CATEGORY_CREATE = 'portfolio-category:create',
  PORTFOLIO_CATEGORY_READ = 'portfolio-category:read',
  PORTFOLIO_CATEGORY_UPDATE = 'portfolio-category:update',
  PORTFOLIO_CATEGORY_DELETE = 'portfolio-category:delete',
  PORTFOLIO_CATEGORY_MANAGE = 'portfolio-category:*',

  PORTFOLIO_DELETE = 'portfolio:delete',
  PORTFOLIO_CREATE = 'portfolio:create',
  PORTFOLIO_READ = 'portfolio:read',
  PORTFOLIO_UPDATE = 'portfolio:update',
  PORTFOLIO_MANAGE = 'portfolio:*',

  SERVICE_FAQ_CREATE = 'service-faq:create',
  SERVICE_FAQ_READ = 'service-faq:read',
  SERVICE_FAQ_UPDATE = 'service-faq:update',
  SERVICE_FAQ_DELETE = 'service-faq:delete',
  SERVICE_FAQ_MANAGE = 'service-faq:manage',

  SERVICE_WORK_FLOW_CREATE = 'service-work-flow:create',
  SERVICE_WORK_FLOW_READ = 'service-work-flow:read',
  SERVICE_WORK_FLOW_UPDATE = 'service-work-flow:update',
  SERVICE_WORK_FLOW_DELETE = 'service-work-flow:delete',
  SERVICE_WORK_FLOW_MANAGE = 'service-work-flow:*',

  /* =========================
     Profile
  ========================= */
  PROFILE_READ = 'profile:read',
  PROFILE_UPDATE = 'profile:update',

  /* =========================
     Media Management
  ========================= */
  MEDIA_UPLOAD = 'media:upload',
  MEDIA_READ = 'media:read',
  MEDIA_DELETE = 'media:delete',
  MEDIA_MANAGE = 'media:*',

  /* =========================
     Lead / Enquiry Management
  ========================= */
  LEAD_READ = 'lead:read',
  LEAD_UPDATE = 'lead:update',
  LEAD_DELETE = 'lead:delete',

  ENQUIRY_READ = 'enquiry:read',
  ENQUIRY_REPLY = 'enquiry:reply',
  ENQUIRY_DELETE = 'enquiry:delete',

  /* =========================
     Order & Payment
  ========================= */
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
     Analytics & Export
  ========================= */
  ANALYTICS_READ = 'analytics:read',
  DATA_EXPORT = 'data:export',

  /* =========================
     System Administration
  ========================= */
  SYSTEM_READ = 'system:read',
  SYSTEM_UPDATE = 'system:update',
  SYSTEM_MANAGE = 'system:*',
  BULK_OPERATION = 'system:bulk-operation',

  /* =========================
     Subscription
  ========================= */
  SUBSCRIPTION_CREATE = 'subscription:create',
  SUBSCRIPTION_READ = 'subscription:read',
  SUBSCRIPTION_UPDATE = 'subscription:update',
  SUBSCRIPTION_DELETE = 'subscription:delete',
  SUBSCRIPTION_MANAGE = 'subscription:*',

  //   service_video
  SERVICE_VIDEO_CREATE = 'service_video.create',
  SERVICE_VIDEO_READ = 'service_video.read',
  SERVICE_VIDEO_UPDATE = 'service_video.update',
  SERVICE_VIDEO_DELETE = 'service_video.delete',
  SERVICE_VIDEO_MANAGE = 'service_video:*',
  //  service_review_create
  SERVICE_REVIEW_CREATE = 'service_review_create',
  SERVICE_REVIEW_READ = 'service_review_read',
  SERVICE_REVIEW_UPDATE = 'service_review_update',
  SERVICE_REVIEW_DELETE = 'service_review_delete',
  SERVICE_REVIEW_MANAGE = 'service_review_delete',

  /* =========================
   OMS  Video
  ========================= */
  VIDEO_CREATE = 'video:create',
  VIDEO_READ = 'video:read',
  VIDEO_UPDATE = 'video:update',
  VIDEO_DELETE = 'video:delete',
  VIDEO_MANAGE = 'video:*',

  BUSINESS_PARTNER_CREATE = 'business_partner:create',
  BUSINESS_PARTNER_READ = 'business_partner:read',
  BUSINESS_PARTNER_UPDATE = 'business_partner:update',
  BUSINESS_PARTNER_DELETE = 'business_partner:delete',
  BUSINESS_PARTNER_MANAGE = 'business_partner:*',

  AD_PLATFORM_CREATE = 'ad_platform:create',
  AD_PLATFORM_READ = 'ad_platform:read',
  AD_PLATFORM_UPDATE = 'ad_platform:update',
  AD_PLATFORM_DELETE = 'ad_platform:delete',
  AD_PLATFORM_MANAGE = 'ad_platform:*',

  CREATIVE_CREATE = 'creative:create',
  CREATIVE_READ = 'creative:read',
  CREATIVE_UPDATE = 'creative:update',
  CREATIVE_DELETE = 'creative:delete',
  CREATIVE_MANAGE = 'creative:*',
}
