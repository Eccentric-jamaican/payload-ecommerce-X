/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

export interface Config {
  auth: {
    users: UserAuthOperations;
  };
  collections: {
    users: User;
    media: Media;
    products: Product;
    categories: Category;
    technologies: Technology;
    transactions: Transaction;
    reviews: Review;
    notifications: Notification;
    'product-files': ProductFile;
    carts: Cart;
    'discount-codes': DiscountCode;
    wishlists: Wishlist;
    blogs: Blog;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsJoins: {
    users: {
      transactions: 'transactions';
    };
  };
  collectionsSelect: {
    users: UsersSelect<false> | UsersSelect<true>;
    media: MediaSelect<false> | MediaSelect<true>;
    products: ProductsSelect<false> | ProductsSelect<true>;
    categories: CategoriesSelect<false> | CategoriesSelect<true>;
    technologies: TechnologiesSelect<false> | TechnologiesSelect<true>;
    transactions: TransactionsSelect<false> | TransactionsSelect<true>;
    reviews: ReviewsSelect<false> | ReviewsSelect<true>;
    notifications: NotificationsSelect<false> | NotificationsSelect<true>;
    'product-files': ProductFilesSelect<false> | ProductFilesSelect<true>;
    carts: CartsSelect<false> | CartsSelect<true>;
    'discount-codes': DiscountCodesSelect<false> | DiscountCodesSelect<true>;
    wishlists: WishlistsSelect<false> | WishlistsSelect<true>;
    blogs: BlogsSelect<false> | BlogsSelect<true>;
    'payload-locked-documents': PayloadLockedDocumentsSelect<false> | PayloadLockedDocumentsSelect<true>;
    'payload-preferences': PayloadPreferencesSelect<false> | PayloadPreferencesSelect<true>;
    'payload-migrations': PayloadMigrationsSelect<false> | PayloadMigrationsSelect<true>;
  };
  db: {
    defaultIDType: string;
  };
  globals: {
    'site-settings': SiteSetting;
    banner: Banner;
  };
  globalsSelect: {
    'site-settings': SiteSettingsSelect<false> | SiteSettingsSelect<true>;
    banner: BannerSelect<false> | BannerSelect<true>;
  };
  locale: null;
  user: User & {
    collection: 'users';
  };
  jobs: {
    tasks: unknown;
    workflows: unknown;
  };
}
export interface UserAuthOperations {
  forgotPassword: {
    email: string;
    password: string;
  };
  login: {
    email: string;
    password: string;
  };
  registerFirstUser: {
    email: string;
    password: string;
  };
  unlock: {
    email: string;
    password: string;
  };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users".
 */
export interface User {
  id: string;
  avatar?: (string | null) | Media;
  firstName: string;
  lastName: string;
  role?: ('admin' | 'user') | null;
  dateOfBirth?: string | null;
  /**
   * Deactivate this user if needed.
   */
  isActive?: boolean | null;
  lastActive?: string | null;
  phoneNumber?: string | null;
  address?: {
    street?: string | null;
    city?: string | null;
    state?: string | null;
    zipCode?: string | null;
    country?: string | null;
  };
  socialMedia?: {
    facebook?: string | null;
    twitter?: string | null;
    instagram?: string | null;
    linkedin?: string | null;
  };
  ratings?:
    | {
        rating: number;
        review?: string | null;
        reviewer: string | User;
        date: string;
        id?: string | null;
      }[]
    | null;
  transactions?: {
    docs?: (string | Transaction)[] | null;
    hasNextPage?: boolean | null;
  } | null;
  paymentMethod?: ('creditCard' | 'paypal' | 'bankTransfer') | null;
  paymentDetails?: {
    cardNumber?: string | null;
    expiryDate?: string | null;
    paypalEmail?: string | null;
    bankAccount?: string | null;
  };
  updatedAt: string;
  createdAt: string;
  enableAPIKey?: boolean | null;
  apiKey?: string | null;
  apiKeyIndex?: string | null;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media".
 */
export interface Media {
  id: string;
  alt: string;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  thumbnailURL?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  focalX?: number | null;
  focalY?: number | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "transactions".
 */
export interface Transaction {
  id: string;
  /**
   * Stripe session ID used as order ID
   */
  orderId: string;
  /**
   * The buyer who made the purchase
   */
  buyer: string | User;
  /**
   * Total amount of the transaction
   */
  amount: number;
  /**
   * Current status of the transaction
   */
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  /**
   * Payment method used for the transaction
   */
  paymentMethod: 'stripe';
  /**
   * Stripe session ID for reference
   */
  stripeSessionId?: string | null;
  /**
   * Digital product purchased in this transaction
   */
  products: (string | Product)[];
  createdAt: string;
  updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "products".
 */
export interface Product {
  id: string;
  /**
   * Enter the name of your digital product
   */
  name: string;
  /**
   * Provide a detailed description of the digital product
   */
  description: string;
  /**
   * Select the type of digital product
   */
  productType:
    | 'website-template'
    | 'design-asset'
    | '3d-model'
    | 'font'
    | 'cad-file'
    | 'ui-kit'
    | 'github-repo'
    | 'other';
  githubDetails?: {
    /**
     * GitHub username or organization that owns the repository
     */
    repositoryOwner: string;
    /**
     * Name of the private GitHub repository
     */
    repositoryName: string;
    /**
     * GitHub Personal Access Token with repo and admin:org scopes
     */
    githubAccessToken: string;
  };
  /**
   * Select the most appropriate category for your product
   */
  category: string | Category;
  /**
   * Select relevant technologies associated with this product
   */
  technology: (string | Technology)[];
  /**
   * Select the creator/seller of this digital product
   */
  seller: string | User;
  /**
   * Current status of the digital product
   */
  status: 'draft' | 'active' | 'inactive' | 'rejected';
  /**
   * List software, platforms, or versions this product is compatible with
   */
  compatibility?:
    | {
        /**
         * Specify compatible software versions (e.g., Figma 2023, Adobe CC 2024)
         */
        softwareVersion?: string | null;
        id?: string | null;
      }[]
    | null;
  /**
   * List all file formats included in the product
   */
  supportedFormats?:
    | {
        /**
         * Specify file formats included (e.g., .psd, .sketch, .figma)
         */
        format?: string | null;
        id?: string | null;
      }[]
    | null;
  /**
   * Add multiple preview images to showcase your product
   */
  previewImages?:
    | {
        /**
         * Upload high-quality preview images showcasing the product
         */
        image?: (string | null) | Media;
        /**
         * Provide a brief description of what this preview image shows
         */
        imageDescription?: string | null;
        id?: string | null;
      }[]
    | null;
  /**
   * Add tags to help users find your product more easily
   */
  tags?:
    | {
        /**
         * Add relevant tags to improve searchability
         */
        tag?: string | null;
        id?: string | null;
      }[]
    | null;
  /**
   * Upload one or more files for your digital product
   */
  productFiles?:
    | {
        file: string | ProductFile;
        /**
         * Provide a brief description of this specific file
         */
        fileDescription?: string | null;
        /**
         * Specify the type or purpose of this file
         */
        fileType?: ('main' | 'documentation' | 'additional' | 'example') | null;
        id?: string | null;
      }[]
    | null;
  /**
   * Set the price for your digital product (in pennies)
   */
  price: number;
  /**
   * The type of product to create in Stripe
   */
  stripeProductType?: ('product' | 'subscription') | null;
  /**
   * Select the licensing terms for this digital product
   */
  licensingOptions?: ('single-use' | 'multiple-use' | 'commercial' | 'personal') | null;
  /**
   * Can this product be included in sales or promotional discounts?
   */
  discountEligibility?: boolean | null;
  createdAt: string;
  lastUpdated?: string | null;
  /**
   * Number of times this product has been purchased
   */
  salesCount?: number | null;
  /**
   * Average rating for this digital product
   */
  averageRating?: number | null;
  stripeID?: string | null;
  skipSync?: boolean | null;
  updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "categories".
 */
export interface Category {
  id: string;
  name: string;
  /**
   * A URL-friendly identifier for the category (auto-generated if left blank).
   */
  slug: string;
  /**
   * Optional description of the category.
   */
  description?: string | null;
  /**
   * Optional icon for the category.
   */
  icon?: (string | null) | Media;
  createdAt: string;
  updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "technologies".
 */
export interface Technology {
  id: string;
  name: string;
  /**
   * A URL-friendly identifier for the technology (auto-generated if left blank).
   */
  slug: string;
  /**
   * Optional description of the technology.
   */
  description?: string | null;
  /**
   * Optional icon for the technology.
   */
  icon?: (string | null) | Media;
  createdAt: string;
  updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "product-files".
 */
export interface ProductFile {
  id: string;
  name: string;
  description: string;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  thumbnailURL?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  focalX?: number | null;
  focalY?: number | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "reviews".
 */
export interface Review {
  id: string;
  /**
   * The template being reviewed.
   */
  template: string | Product;
  /**
   * The buyer who left the review.
   */
  user: string | User;
  /**
   * Rating from 1 (poor) to 5 (excellent).
   */
  rating: number;
  /**
   * Optional review comment.
   */
  comment?: string | null;
  /**
   * Approval status of the review.
   */
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "notifications".
 */
export interface Notification {
  id: string;
  user: string | User;
  message: string;
  type: 'order_update' | 'new_template' | 'message';
  read?: boolean | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "carts".
 */
export interface Cart {
  id: string;
  user: string | User;
  items?:
    | {
        product: string | Product;
        quantity: number;
        id?: string | null;
      }[]
    | null;
  lastUpdated?: string | null;
  abandonedEmailSent?: boolean | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "discount-codes".
 */
export interface DiscountCode {
  id: string;
  /**
   * The Stripe coupon ID for this discount code (optional, leave empty for Stripe to create a new coupon)
   */
  stripeCouponId?: string | null;
  code: string;
  type: 'percentage' | 'fixed';
  /**
   * For percentage discounts, enter a number between 0-100. For fixed amounts, enter the discount value.
   */
  value: number;
  /**
   * Minimum purchase amount required to use this discount code (optional)
   */
  minPurchaseAmount?: number | null;
  /**
   * Maximum number of times this code can be used (optional)
   */
  maxUses?: number | null;
  usedCount: number;
  /**
   * When this discount code becomes valid (optional)
   */
  startDate?: string | null;
  /**
   * When this discount code expires (optional)
   */
  endDate?: string | null;
  /**
   * Whether this discount code is currently active
   */
  isActive: boolean;
  /**
   * Specific categories or products this discount applies to (optional, leave empty for all products)
   */
  appliesTo?:
    | (
        | {
            relationTo: 'categories';
            value: string | Category;
          }
        | {
            relationTo: 'products';
            value: string | Product;
          }
      )[]
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "wishlists".
 */
export interface Wishlist {
  id: string;
  user: string | User;
  products?: (string | Product)[] | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "blogs".
 */
export interface Blog {
  id: string;
  title: string;
  /**
   * A URL-friendly version of the title. No spaces or special characters allowed.
   */
  slug: string;
  author: string | User;
  publishedDate: string;
  featuredImage?: (string | null) | Media;
  excerpt: string;
  content: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  };
  status?: ('draft' | 'published') | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents".
 */
export interface PayloadLockedDocument {
  id: string;
  document?:
    | ({
        relationTo: 'users';
        value: string | User;
      } | null)
    | ({
        relationTo: 'media';
        value: string | Media;
      } | null)
    | ({
        relationTo: 'products';
        value: string | Product;
      } | null)
    | ({
        relationTo: 'categories';
        value: string | Category;
      } | null)
    | ({
        relationTo: 'technologies';
        value: string | Technology;
      } | null)
    | ({
        relationTo: 'transactions';
        value: string | Transaction;
      } | null)
    | ({
        relationTo: 'reviews';
        value: string | Review;
      } | null)
    | ({
        relationTo: 'notifications';
        value: string | Notification;
      } | null)
    | ({
        relationTo: 'product-files';
        value: string | ProductFile;
      } | null)
    | ({
        relationTo: 'carts';
        value: string | Cart;
      } | null)
    | ({
        relationTo: 'discount-codes';
        value: string | DiscountCode;
      } | null)
    | ({
        relationTo: 'wishlists';
        value: string | Wishlist;
      } | null)
    | ({
        relationTo: 'blogs';
        value: string | Blog;
      } | null);
  globalSlug?: string | null;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences".
 */
export interface PayloadPreference {
  id: string;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations".
 */
export interface PayloadMigration {
  id: string;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users_select".
 */
export interface UsersSelect<T extends boolean = true> {
  avatar?: T;
  firstName?: T;
  lastName?: T;
  role?: T;
  dateOfBirth?: T;
  isActive?: T;
  lastActive?: T;
  phoneNumber?: T;
  address?:
    | T
    | {
        street?: T;
        city?: T;
        state?: T;
        zipCode?: T;
        country?: T;
      };
  socialMedia?:
    | T
    | {
        facebook?: T;
        twitter?: T;
        instagram?: T;
        linkedin?: T;
      };
  ratings?:
    | T
    | {
        rating?: T;
        review?: T;
        reviewer?: T;
        date?: T;
        id?: T;
      };
  transactions?: T;
  paymentMethod?: T;
  paymentDetails?:
    | T
    | {
        cardNumber?: T;
        expiryDate?: T;
        paypalEmail?: T;
        bankAccount?: T;
      };
  updatedAt?: T;
  createdAt?: T;
  enableAPIKey?: T;
  apiKey?: T;
  apiKeyIndex?: T;
  email?: T;
  resetPasswordToken?: T;
  resetPasswordExpiration?: T;
  salt?: T;
  hash?: T;
  loginAttempts?: T;
  lockUntil?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media_select".
 */
export interface MediaSelect<T extends boolean = true> {
  alt?: T;
  updatedAt?: T;
  createdAt?: T;
  url?: T;
  thumbnailURL?: T;
  filename?: T;
  mimeType?: T;
  filesize?: T;
  width?: T;
  height?: T;
  focalX?: T;
  focalY?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "products_select".
 */
export interface ProductsSelect<T extends boolean = true> {
  name?: T;
  description?: T;
  productType?: T;
  githubDetails?:
    | T
    | {
        repositoryOwner?: T;
        repositoryName?: T;
        githubAccessToken?: T;
      };
  category?: T;
  technology?: T;
  seller?: T;
  status?: T;
  compatibility?:
    | T
    | {
        softwareVersion?: T;
        id?: T;
      };
  supportedFormats?:
    | T
    | {
        format?: T;
        id?: T;
      };
  previewImages?:
    | T
    | {
        image?: T;
        imageDescription?: T;
        id?: T;
      };
  tags?:
    | T
    | {
        tag?: T;
        id?: T;
      };
  productFiles?:
    | T
    | {
        file?: T;
        fileDescription?: T;
        fileType?: T;
        id?: T;
      };
  price?: T;
  stripeProductType?: T;
  licensingOptions?: T;
  discountEligibility?: T;
  createdAt?: T;
  lastUpdated?: T;
  salesCount?: T;
  averageRating?: T;
  stripeID?: T;
  skipSync?: T;
  updatedAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "categories_select".
 */
export interface CategoriesSelect<T extends boolean = true> {
  name?: T;
  slug?: T;
  description?: T;
  icon?: T;
  createdAt?: T;
  updatedAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "technologies_select".
 */
export interface TechnologiesSelect<T extends boolean = true> {
  name?: T;
  slug?: T;
  description?: T;
  icon?: T;
  createdAt?: T;
  updatedAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "transactions_select".
 */
export interface TransactionsSelect<T extends boolean = true> {
  orderId?: T;
  buyer?: T;
  amount?: T;
  status?: T;
  paymentMethod?: T;
  stripeSessionId?: T;
  products?: T;
  createdAt?: T;
  updatedAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "reviews_select".
 */
export interface ReviewsSelect<T extends boolean = true> {
  template?: T;
  user?: T;
  rating?: T;
  comment?: T;
  status?: T;
  createdAt?: T;
  updatedAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "notifications_select".
 */
export interface NotificationsSelect<T extends boolean = true> {
  user?: T;
  message?: T;
  type?: T;
  read?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "product-files_select".
 */
export interface ProductFilesSelect<T extends boolean = true> {
  name?: T;
  description?: T;
  updatedAt?: T;
  createdAt?: T;
  url?: T;
  thumbnailURL?: T;
  filename?: T;
  mimeType?: T;
  filesize?: T;
  width?: T;
  height?: T;
  focalX?: T;
  focalY?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "carts_select".
 */
export interface CartsSelect<T extends boolean = true> {
  user?: T;
  items?:
    | T
    | {
        product?: T;
        quantity?: T;
        id?: T;
      };
  lastUpdated?: T;
  abandonedEmailSent?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "discount-codes_select".
 */
export interface DiscountCodesSelect<T extends boolean = true> {
  stripeCouponId?: T;
  code?: T;
  type?: T;
  value?: T;
  minPurchaseAmount?: T;
  maxUses?: T;
  usedCount?: T;
  startDate?: T;
  endDate?: T;
  isActive?: T;
  appliesTo?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "wishlists_select".
 */
export interface WishlistsSelect<T extends boolean = true> {
  user?: T;
  products?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "blogs_select".
 */
export interface BlogsSelect<T extends boolean = true> {
  title?: T;
  slug?: T;
  author?: T;
  publishedDate?: T;
  featuredImage?: T;
  excerpt?: T;
  content?: T;
  status?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents_select".
 */
export interface PayloadLockedDocumentsSelect<T extends boolean = true> {
  document?: T;
  globalSlug?: T;
  user?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences_select".
 */
export interface PayloadPreferencesSelect<T extends boolean = true> {
  user?: T;
  key?: T;
  value?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations_select".
 */
export interface PayloadMigrationsSelect<T extends boolean = true> {
  name?: T;
  batch?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "site-settings".
 */
export interface SiteSetting {
  id: string;
  /**
   * Email address for customer queries
   */
  supportEmail: string;
  updatedAt?: string | null;
  createdAt?: string | null;
}
/**
 * Manage banner messages that appear at the top of the site
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "banner".
 */
export interface Banner {
  id: string;
  banners?:
    | {
        message: string;
        backgroundColor: 'bg-blue-500' | 'bg-green-500' | 'bg-red-500' | 'bg-yellow-500' | 'bg-purple-500';
        isActive?: boolean | null;
        id?: string | null;
      }[]
    | null;
  updatedAt?: string | null;
  createdAt?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "site-settings_select".
 */
export interface SiteSettingsSelect<T extends boolean = true> {
  supportEmail?: T;
  updatedAt?: T;
  createdAt?: T;
  globalType?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "banner_select".
 */
export interface BannerSelect<T extends boolean = true> {
  banners?:
    | T
    | {
        message?: T;
        backgroundColor?: T;
        isActive?: T;
        id?: T;
      };
  updatedAt?: T;
  createdAt?: T;
  globalType?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "auth".
 */
export interface Auth {
  [k: string]: unknown;
}


declare module 'payload' {
  export interface GeneratedTypes extends Config {}
}