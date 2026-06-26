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

    Permission.ORDER_DELETE,
    Permission.ORDER_CREATE,

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
  ],

  [Role.MANAGER]: [
    Permission.CONTENT_READ,
    Permission.CONTENT_UPDATE,
    Permission.PRODUCT_UPDATE,
    Permission.PRODUCT_REVIEW,

    Permission.ORDER_READ,
    Permission.ORDER_UPDATE,
  ],

  [Role.PREMIUM_USER]: [
    Permission.CONTENT_READ,
    Permission.PROFILE_READ,
    Permission.PROFILE_UPDATE,
  ],

  [Role.USER]: [
    Permission.CONTENT_READ,
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
  ],
};
