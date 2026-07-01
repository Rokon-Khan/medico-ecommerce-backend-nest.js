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

    Permission.PRODUCT_MANAGE,

    Permission.PRODUCT_CATEGORY_CREATE,
    Permission.PRODUCT_CATEGORY_DELETE,
    Permission.PRODUCT_CATEGORY_MANAGE,

    Permission.PRODUCT_DETAIL_CREATE,
    Permission.PRODUCT_DETAIL_UPDATE,
    Permission.PRODUCT_DETAIL_DELETE,
    Permission.PRODUCT_DETAIL_MANAGE,

    Permission.RELATED_PRODUCT_CREATE,

    Permission.RELATED_PRODUCT_UPDATE,
    Permission.RELATED_PRODUCT_DELETE,
    Permission.RELATED_PRODUCT_MANAGE,

    Permission.GENERIC_CREATE,
    Permission.GENERIC_UPDATE,
    Permission.GENERIC_DELETE,
    Permission.GENERIC_MANAGE,

    Permission.BRAND_CREATE,
    Permission.BRAND_UPDATE,
    Permission.BRAND_DELETE,
    Permission.BRAND_MANAGE,

    Permission.PRODUCT_VARIANT_CREATE,
    Permission.PRODUCT_VARIANT_UPDATE,
    Permission.PRODUCT_VARIANT_DELETE,
    Permission.PRODUCT_VARIANT_MANAGE,

    Permission.ADDRESS_DELETE,
    Permission.ADDRESS_MANAGE,

    Permission.ORDER_DELETE,
    Permission.ORDER_CREATE,

    Permission.PAYMENT_READ,
    Permission.PAYMENT_UPDATE,
    Permission.PAYMENT_DELETE,

    Permission.INVENTORY_LOG_CREATE,
    Permission.INVENTORY_LOG_READ,
    Permission.INVENTORY_LOG_UPDATE,
    Permission.INVENTORY_LOG_DELETE,

    Permission.PROFILE_READ,
    Permission.PROFILE_UPDATE,

    Permission.SETTINGS_READ,
    Permission.SETTINGS_UPDATE,

    Permission.SYSTEM_READ,
    Permission.SYSTEM_UPDATE,
    Permission.BULK_OPERATION,

    Permission.COUPON_CREATE,
    Permission.COUPON_READ,
    Permission.COUPON_UPDATE,
    Permission.COUPON_DELETE,
    Permission.COUPON_MANAGE,
    Permission.COUPON_USAGE_READ,

    Permission.AUDIT_LOG_CREATE,
    Permission.AUDIT_LOG_READ,
    Permission.AUDIT_LOG_UPDATE,
    Permission.AUDIT_LOG_DELETE,
    Permission.AUDIT_LOG_MANAGE,

    Permission.PRODUCT_UPDATE,

    //  Order Tracking Permissions

    Permission.ORDER_TRACKING_UPDATE,
    Permission.ORDER_TRACKING_BULK_UPDATE,
    Permission.ORDER_TRACKING_MANAGE,
  ],

  [Role.MANAGER]: [
    Permission.PRODUCT_UPDATE,
    Permission.PRODUCT_REVIEW,

    Permission.ORDER_READ,
    Permission.ORDER_UPDATE,

    Permission.REVIEW_APPROVE,
    Permission.REVIEW_REJECT,

    Permission.REVIEW_MANAGE,

    Permission.PRESCRIPTION_APPROVE,
    Permission.PRESCRIPTION_REJECT,
    Permission.PRESCRIPTION_MANAGE,

    Permission.BANNER_CREATE,
    Permission.BANNER_UPDATE,
    Permission.BANNER_DELETE,
    Permission.BANNER_MANAGE,
  ],

  [Role.PREMIUM_USER]: [Permission.PROFILE_READ, Permission.PROFILE_UPDATE],

  [Role.USER]: [
    Permission.PRODUCT_READ,
    Permission.PROFILE_READ,
    Permission.PROFILE_UPDATE,

    Permission.PRODUCT_CATEGORY_READ,
    Permission.PRODUCT_DETAIL_READ,
    Permission.GENERIC_READ,
    Permission.BRAND_READ,
    Permission.PRODUCT_VARIANT_READ,
    Permission.RELATED_PRODUCT_READ,

    Permission.ADDRESS_CREATE,
    Permission.ADDRESS_READ,
    Permission.ADDRESS_UPDATE,

    Permission.CART_CREATE,
    Permission.CART_READ,
    Permission.CART_UPDATE,
    Permission.CART_DELETE,
    Permission.CART_MANAGE,

    Permission.CART_ITEM_CREATE,
    Permission.CART_ITEM_READ,
    Permission.CART_ITEM_UPDATE,
    Permission.CART_ITEM_DELETE,
    Permission.CART_ITEM_MANAGE,

    Permission.WISHLIST_CREATE,
    Permission.WISHLIST_READ,
    Permission.WISHLIST_UPDATE,
    Permission.WISHLIST_DELETE,
    Permission.WISHLIST_MANAGE,

    Permission.REVIEW_CREATE,
    Permission.REVIEW_READ,
    Permission.REVIEW_UPDATE,
    Permission.REVIEW_DELETE,

    Permission.COUPON_APPLY,

    Permission.PRESCRIPTION_CREATE,
    Permission.PRESCRIPTION_READ,
    Permission.PRESCRIPTION_UPDATE,
    Permission.PRESCRIPTION_DELETE,

    Permission.BANNER_READ,

    Permission.ORDER_TRACKING_READ,
  ],
};
