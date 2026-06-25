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

    Permission.PRODUCT_CATEGORY_CREATE,
    Permission.PRODUCT_CATEGORY_READ,
    Permission.PRODUCT_CATEGORY_UPDATE,
    Permission.PRODUCT_CATEGORY_DELETE,
    Permission.PRODUCT_CATEGORY_MANAGE,

    Permission.CATEGORY_CREATE,
    Permission.CATEGORY_READ,
    Permission.CATEGORY_UPDATE,
    Permission.CATEGORY_DELETE,

    Permission.BLOG_CATEGORY_CREATE,
    Permission.BLOG_CATEGORY_READ,
    Permission.BLOG_CATEGORY_UPDATE,
    Permission.BLOG_CATEGORY_DELETE,
    Permission.BLOG_CATEGORY_MANAGE,

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

    Permission.ORDER_READ,
    Permission.ORDER_UPDATE,
    Permission.ORDER_DELETE,
    Permission.PAYMENT_READ,
    Permission.PAYMENT_UPDATE,
    Permission.PAYMENT_DELETE,

    Permission.PROFILE_READ,
    Permission.PROFILE_UPDATE,

    Permission.SETTINGS_READ,
    Permission.SETTINGS_UPDATE,

    Permission.SYSTEM_READ,
    Permission.SYSTEM_UPDATE,
    Permission.BULK_OPERATION,

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

    Permission.ORDER_READ,
    Permission.ORDER_UPDATE,
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
  ],
};
