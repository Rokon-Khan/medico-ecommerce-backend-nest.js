import { Permission } from 'src/auth/enums/permission-type.enum';
import { Role } from 'src/auth/enums/role-type.enum';

// Role hierarchy definition
export const RoleHierarchy: Record<Role, readonly Role[]> = {
  [Role.SUPER_ADMIN]: [Role.ADMIN],
  [Role.ADMIN]: [Role.MANAGER],
  [Role.MANAGER]: [Role.PREMIUM_USER],
  [Role.PREMIUM_USER]: [Role.USER],
  [Role.USER]: [],
} as const;

// Role-based permissions definition. role hierarchy (inheritance) SUPER_ADMIN > ADMIN > MANAGER > PREMIUM_USER > USER
export const RoleBasedPermissions: Record<Role, Permission[]> = {
  [Role.SUPER_ADMIN]: [],

  [Role.ADMIN]: [
    Permission.USER_MANAGE,
    Permission.CONTENT_MANAGE,
    Permission.PRODUCT_MANAGE,
    Permission.MEDIA_MANAGE,

    Permission.CATEGORY_CREATE,
    Permission.CATEGORY_READ,
    Permission.CATEGORY_UPDATE,
    Permission.CATEGORY_DELETE,

    Permission.BLOG_CATEGORY_CREATE,
    Permission.BLOG_CATEGORY_READ,
    Permission.BLOG_CATEGORY_UPDATE,
    Permission.BLOG_CATEGORY_DELETE,
    Permission.BLOG_CATEGORY_MANAGE,

    Permission.BUSINESS_WC_CREATE,
    Permission.BUSINESS_WC_READ,
    Permission.BUSINESS_WC_UPDATE,
    Permission.BUSINESS_WC_DELETE,

    Permission.WHY_CHOOSE_US_CREATE,
    Permission.WHY_CHOOSE_US_READ,
    Permission.WHY_CHOOSE_US_UPDATE,
    Permission.WHY_CHOOSE_US_DELETE,
    Permission.WHY_CHOOSE_US_MANAGE,

    Permission.PRICINGS_CREATE,
    Permission.PRICINGS_READ,
    Permission.PRICINGS_UPDATE,
    Permission.PRICINGS_DELETE,
    Permission.PRICINGS_MANAGE,

    Permission.PRICING_CATEGORY_CREATE,
    Permission.PRICING_CATEGORY_READ,
    Permission.PRICING_CATEGORY_UPDATE,
    Permission.PRICING_CATEGORY_DELETE,
    Permission.PRICING_CATEGORY_MANAGE,

    Permission.PRICING_FEATURE_CREATE,
    Permission.PRICING_FEATURE_READ,
    Permission.PRICING_FEATURE_UPDATE,
    Permission.PRICING_FEATURE_DELETE,
    Permission.PRICING_FEATURE_MANAGE,

    Permission.SERVICES_CREATE,
    Permission.SERVICES_READ,
    Permission.SERVICES_UPDATE,
    Permission.SERVICES_DELETE,
    Permission.SERVICES_MANAGE,

    Permission.HEROES_CREATE,
    Permission.HEROES_READ,
    Permission.HEROES_UPDATE,
    Permission.HEROES_DELETE,
    Permission.HEROES_MANAGE,

    Permission.TESTIMONIALS_CREATE,
    Permission.TESTIMONIALS_READ,
    Permission.TESTIMONIALS_UPDATE,
    Permission.TESTIMONIALS_DELETE,
    Permission.TESTIMONIALS_MANAGE,

    Permission.PARTNERS_CREATE,
    Permission.PARTNERS_READ,
    Permission.PARTNERS_UPDATE,
    Permission.PARTNERS_DELETE,
    Permission.PARTNERS_MANAGE,

    Permission.ASSIGEN_PRICING_FEATURE_CREATE,
    Permission.ASSIGEN_PRICEN_FEATURE_READ,
    Permission.ASSIGEN_PRICEN_FEATURE_UPDATE,
    Permission.ASSIGEN_PRICEN_FEATURE_DELETE,

    Permission.LEAD_READ,
    Permission.LEAD_UPDATE,
    Permission.LEAD_DELETE,
    Permission.ENQUIRY_READ,
    Permission.ENQUIRY_REPLY,
    Permission.ENQUIRY_DELETE,

    Permission.ORDER_READ,
    Permission.ORDER_UPDATE,
    Permission.ORDER_DELETE,
    Permission.PAYMENT_READ,
    Permission.PAYMENT_UPDATE,
    Permission.PAYMENT_DELETE,

    Permission.BLOGS_READ,
    Permission.BLOGS_UPDATE,
    Permission.BLOGS_DELETE,
    Permission.BLOGS_REVIEW,
    Permission.BLOGS_MANAGE,

    Permission.BLOG_DETAILS_READ,
    Permission.BLOG_DETAILS_UPDATE,
    Permission.BLOG_DETAILS_DELETE,
    Permission.BLOG_DETAILS_REVIEW,
    Permission.BLOG_DETAILS_MANAGE,

    Permission.PORTFOLIO_CATEGORY_CREATE,
    Permission.PORTFOLIO_CATEGORY_READ,
    Permission.PORTFOLIO_CATEGORY_UPDATE,
    Permission.PORTFOLIO_CATEGORY_DELETE,
    Permission.PORTFOLIO_CATEGORY_MANAGE,

    Permission.PORTFOLIO_CREATE,
    Permission.PORTFOLIO_READ,
    Permission.PORTFOLIO_UPDATE,
    Permission.PORTFOLIO_DELETE,
    Permission.PORTFOLIO_MANAGE,

    Permission.PORTFOLIO_DETAILS_READ,
    Permission.PORTFOLIO_DETAILS_UPDATE,
    Permission.PORTFOLIO_DETAILS_DELETE,
    Permission.PORTFOLIO_DETAILS_REVIEW,
    Permission.PORTFOLIO_DETAILS_MANAGE,

    Permission.SERVICE_FAQ_CREATE,
    Permission.SERVICE_FAQ_READ,
    Permission.SERVICE_FAQ_UPDATE,
    Permission.SERVICE_FAQ_DELETE,
    Permission.SERVICE_FAQ_MANAGE,

    Permission.SERVICE_WORK_FLOW_CREATE,
    Permission.SERVICE_WORK_FLOW_READ,
    Permission.SERVICE_WORK_FLOW_UPDATE,
    Permission.SERVICE_WORK_FLOW_DELETE,
    Permission.SERVICE_WORK_FLOW_MANAGE,

    Permission.PROFILE_READ,
    Permission.PROFILE_UPDATE,

    Permission.SETTINGS_READ,
    Permission.SETTINGS_UPDATE,
    Permission.ANALYTICS_READ,
    Permission.DATA_EXPORT,

    Permission.SYSTEM_READ,
    Permission.SYSTEM_UPDATE,
    Permission.BULK_OPERATION,

    Permission.SUBSCRIPTION_READ,
    Permission.SUBSCRIPTION_UPDATE,
    Permission.SUBSCRIPTION_DELETE,

    // OMS
    Permission.VIDEO_CREATE,
    Permission.VIDEO_UPDATE,
    Permission.VIDEO_DELETE,
    Permission.VIDEO_READ,
    Permission.VIDEO_MANAGE,

    Permission.BUSINESS_PARTNER_CREATE,
    Permission.BUSINESS_PARTNER_UPDATE,
    Permission.BUSINESS_PARTNER_DELETE,
    Permission.BUSINESS_PARTNER_READ,
    Permission.BUSINESS_PARTNER_MANAGE,

    Permission.AD_PLATFORM_CREATE,
    Permission.AD_PLATFORM_READ,
    Permission.AD_PLATFORM_UPDATE,
    Permission.AD_PLATFORM_DELETE,
    Permission.AD_PLATFORM_MANAGE,

    Permission.CREATIVE_CREATE,
    Permission.CREATIVE_UPDATE,
    Permission.CREATIVE_DELETE,
    Permission.CREATIVE_READ,
    Permission.CREATIVE_MANAGE,

    Permission.SERVICE_VIDEO_CREATE,
    Permission.SERVICE_VIDEO_UPDATE,
    Permission.SERVICE_VIDEO_DELETE,
    Permission.SERVICE_VIDEO_READ,
    Permission.SERVICE_VIDEO_MANAGE,

    Permission.SERVICE_REVIEW_DELETE,
    Permission.SERVICE_REVIEW_MANAGE,

    Permission.TRUSTED_COMPANIES_CREATE,
    Permission.TRUSTED_COMPANIES_READ,
    Permission.TRUSTED_COMPANIES_UPDATE,
    Permission.TRUSTED_COMPANIES_DELETE,
    Permission.TRUSTED_COMPANIES_MANAGE,

    Permission.OUR_WORK_PROCESSES_CREATE,
    Permission.OUR_WORK_PROCESSES_READ,
    Permission.OUR_WORK_PROCESSES_UPDATE,
    Permission.OUR_WORK_PROCESSES_DELETE,
    Permission.OUR_WORK_PROCESSES_MANAGE,

    Permission.QUESTION_ANSWER_CREATE,
    Permission.QUESTION_ANSWER_READ,
    Permission.QUESTION_ANSWER_UPDATE,
    Permission.QUESTION_ANSWER_DELETE,
    Permission.QUESTION_ANSWER_MANAGE,

    Permission.TEAM_CREATE,
    Permission.TEAM_READ,
    Permission.TEAM_UPDATE,
    Permission.TEAM_DELETE,
    Permission.TEAM_MANAGE,

    Permission.WHO_WE_ARE_CREATE,
    Permission.WHO_WE_ARE_READ,
    Permission.WHO_WE_ARE_UPDATE,
    Permission.WHO_WE_ARE_DELETE,
    Permission.WHO_WE_ARE_MANAGE,

    Permission.WHO_WE_ARE_FEATURE_CREATE,
    Permission.WHO_WE_ARE_FEATURE_READ,
    Permission.WHO_WE_ARE_FEATURE_UPDATE,
    Permission.WHO_WE_ARE_FEATURE_DELETE,
    Permission.WHO_WE_ARE_FEATURE_MANAGE,
  ],

  [Role.MANAGER]: [
    Permission.CONTENT_READ,
    Permission.CONTENT_UPDATE,

    Permission.PRODUCT_READ,
    Permission.PRODUCT_UPDATE,
    Permission.PRODUCT_REVIEW,

    Permission.LEAD_READ,
    Permission.LEAD_UPDATE,
    Permission.ENQUIRY_READ,
    Permission.ENQUIRY_REPLY,

    Permission.ORDER_READ,
    Permission.ORDER_UPDATE,

    Permission.ANALYTICS_READ,
  ],

  [Role.PREMIUM_USER]: [
    Permission.CONTENT_READ,
    Permission.PRODUCT_READ,
    Permission.PROFILE_READ,
    Permission.PROFILE_UPDATE,
  ],

  [Role.USER]: [
    Permission.CONTENT_READ,
    Permission.PRODUCT_READ,
    Permission.PROFILE_READ,
    Permission.PROFILE_UPDATE,
    Permission.SUBSCRIPTION_CREATE,

    Permission.SERVICE_REVIEW_CREATE,
    Permission.SERVICE_REVIEW_UPDATE,
    Permission.SERVICE_REVIEW_READ,
  ],
};
