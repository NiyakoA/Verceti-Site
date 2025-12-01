# Implementation Plan

- [ ] 1. Initialize Next.js project with core dependencies
  - Create Next.js 14+ project with App Router and TypeScript
  - Install and configure Tailwind CSS for styling
  - Install Prisma, Zod, NextAuth.js, and fast-check
  - Set up project structure (app/, lib/, components/, prisma/)
  - Configure TypeScript with strict mode
  - _Requirements: All requirements depend on this foundation_

- [ ] 2. Set up database schema and Prisma
  - Define Prisma schema with all models (Product, ProductVariant, ProductImage, Drop, Cart, Order, User, Discount, Review, InventoryReservation)
  - Configure PostgreSQL connection
  - Create initial migration
  - Set up Prisma Client singleton
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 7.1, 11.1, 12.1_

- [ ] 3. Implement product catalog core functionality
  - [ ] 3.1 Create Product and ProductVariant models with Zod schemas
    - Define TypeScript interfaces and Zod validation schemas
    - _Requirements: 1.1, 4.1_
  
  - [ ] 3.2 Implement ProductRepository for database operations
    - Write functions for create, read, update, delete products
    - Include variant and image relations in queries
    - _Requirements: 1.1, 4.1, 4.2_
  
  - [ ] 3.3 Implement ProductService with business logic
    - Create product with variants
    - Update product and variant details
    - Handle slug generation
    - _Requirements: 1.1, 4.1, 4.3_
  
  - [ ] 3.4 Write property test for product creation completeness
    - **Property 13: Product creation completeness**
    - **Validates: Requirements 4.1**
  
  - [ ] 3.5 Write property test for variant independence
    - **Property 15: Variant independence**
    - **Validates: Requirements 4.3**

- [ ] 4. Build product display pages
  - [ ] 4.1 Create product listing page with SSR
    - Implement /products route with server component
    - Fetch products from database
    - Display product grid with images and prices
    - _Requirements: 1.1_
  
  - [ ] 4.2 Create product detail page with variants
    - Implement /products/[slug] route with server component
    - Display product images, description, price
    - Render variant selector (size, color)
    - Show size guide if present
    - _Requirements: 1.1, 1.2, 1.3_
  
  - [ ] 4.3 Add client-side variant selection logic
    - Create VariantSelector component
    - Update price and stock when variant changes
    - _Requirements: 1.2_
  
  - [ ] 4.4 Write property test for product page completeness
    - **Property 1: Product page completeness**
    - **Validates: Requirements 1.1**
  
  - [ ] 4.5 Write property test for variant selection updates
    - **Property 2: Variant selection updates display**
    - **Validates: Requirements 1.2**

- [ ] 5. Implement inventory management system
  - [ ] 5.1 Create InventoryService with atomic operations
    - Implement reserve, release, deduct, add operations
    - Use database transactions for atomicity
    - _Requirements: 2.1, 12.4_
  
  - [ ] 5.2 Implement InventoryReservation model and repository
    - Create reservation with expiration time
    - Query and cleanup expired reservations
    - _Requirements: 2.1_
  
  - [ ] 5.3 Add stock status calculation logic
    - Implement function to determine in stock, low stock, out of stock
    - _Requirements: 12.1, 12.5_
  
  - [ ] 5.4 Write property test for concurrent purchase safety
    - **Property 47: Concurrent purchase safety**
    - **Validates: Requirements 12.4**
  
  - [ ] 5.5 Write property test for stock status calculation
    - **Property 45: Stock status calculation**
    - **Validates: Requirements 12.1**
  
  - [ ] 5.6 Write property test for sold out status on zero inventory
    - **Property 12: Sold out status on zero inventory**
    - **Validates: Requirements 3.5, 4.5**

- [ ] 6. Build shopping cart functionality
  - [ ] 6.1 Create Cart and CartItem models with Zod schemas
    - Define interfaces and validation
    - _Requirements: 2.1_
  
  - [ ] 6.2 Implement CartRepository for database operations
    - Create, read, update cart and items
    - Handle cart expiration
    - _Requirements: 2.1_
  
  - [ ] 6.3 Implement CartService with business logic
    - Add item to cart (with inventory reservation)
    - Remove item from cart (release reservation)
    - Update item quantity
    - Calculate cart totals
    - Apply discount codes
    - _Requirements: 2.1, 7.2_
  
  - [ ] 6.4 Create API route for cart operations
    - POST /api/cart - Add/update cart items
    - GET /api/cart - Get current cart
    - DELETE /api/cart/items/[id] - Remove item
    - _Requirements: 2.1_
  
  - [ ] 6.5 Write property test for adding to cart creates reservation
    - **Property 5: Adding to cart creates reservation**
    - **Validates: Requirements 2.1**
  
  - [ ] 6.6 Write property test for cart total calculation
    - **Property 6: Cart total calculation**
    - **Validates: Requirements 2.1**

- [ ] 7. Implement discount code system
  - [ ] 7.1 Create Discount model and repository
    - Define schema and database operations
    - _Requirements: 7.1_
  
  - [ ] 7.2 Implement DiscountService with validation logic
    - Validate discount code (exists, not expired, under usage limit)
    - Calculate discount amount (percentage or fixed)
    - Increment usage count
    - _Requirements: 7.2, 7.3, 7.4, 7.5_
  
  - [ ] 7.3 Write property test for valid discount application
    - **Property 26: Valid discount application**
    - **Validates: Requirements 7.2**
  
  - [ ] 7.4 Write property test for expired discount rejection
    - **Property 27: Expired discount rejection**
    - **Validates: Requirements 7.3**
  
  - [ ] 7.5 Write property test for invalid discount rejection
    - **Property 28: Invalid discount rejection**
    - **Validates: Requirements 7.4**
  
  - [ ] 7.6 Write property test for usage limit enforcement
    - **Property 29: Usage limit enforcement**
    - **Validates: Requirements 7.5**

- [ ] 8. Integrate Stripe payment processing
  - [ ] 8.1 Set up Stripe SDK and configuration
    - Install Stripe SDK
    - Configure API keys in environment variables
    - _Requirements: 2.3_
  
  - [ ] 8.2 Create PaymentService for Stripe integration
    - Create payment intent
    - Confirm payment
    - Handle payment failures
    - _Requirements: 2.3_
  
  - [ ] 8.3 Implement checkout API route
    - POST /api/checkout - Create payment intent
    - Validate cart and inventory
    - _Requirements: 2.2, 2.3_
  
  - [ ] 8.4 Implement Stripe webhook handler
    - POST /api/webhooks/stripe - Handle payment events
    - Verify webhook signature
    - Process successful payments (create order, deduct inventory)
    - Handle failed payments (release reservations)
    - _Requirements: 2.4, 2.5_
  
  - [ ] 8.5 Write property test for successful payment creates order
    - **Property 7: Successful payment creates order and deducts inventory**
    - **Validates: Requirements 2.4**
  
  - [ ] 8.6 Write property test for failed payment releases reservations
    - **Property 8: Failed payment releases reservations**
    - **Validates: Requirements 2.5**

- [ ] 9. Build checkout flow UI
  - [ ] 9.1 Create checkout page with order summary
    - Display cart items and totals
    - Show shipping form
    - _Requirements: 2.2_
  
  - [ ] 9.2 Integrate Stripe Checkout or Elements
    - Embed Stripe payment UI
    - Handle payment submission
    - _Requirements: 2.3_
  
  - [ ] 9.3 Create order confirmation page
    - Display order details after successful payment
    - _Requirements: 2.4_

- [ ] 10. Implement order management
  - [ ] 10.1 Create Order and OrderItem models
    - Define schema with all required fields
    - _Requirements: 2.4, 6.1_
  
  - [ ] 10.2 Implement OrderRepository
    - Create order with items
    - Query orders with filters
    - Update order status
    - _Requirements: 2.4, 6.1, 6.3_
  
  - [ ] 10.3 Implement OrderService
    - Create order from cart
    - Generate order number
    - Associate with user if logged in
    - _Requirements: 2.4, 11.4_
  
  - [ ] 10.4 Write property test for order data completeness
    - **Property 21: Order data completeness**
    - **Validates: Requirements 6.1, 6.2**
  
  - [ ] 10.5 Write property test for order status update tracking
    - **Property 22: Order status update tracking**
    - **Validates: Requirements 6.3**

- [ ] 11. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Implement Drop Engine core functionality
  - [ ] 12.1 Create Drop model and repository
    - Define schema with launch dates and status
    - Query drops by status and date
    - _Requirements: 3.1, 5.1_
  
  - [ ] 12.2 Implement DropService with state management
    - Create and configure drops
    - Calculate countdown
    - Determine drop status based on current time
    - Check early access eligibility
    - _Requirements: 3.1, 3.2, 3.3, 5.3_
  
  - [ ] 12.3 Implement EarlyAccessService
    - Evaluate early access rules
    - Check user eligibility
    - _Requirements: 3.3, 3.4, 5.2_
  
  - [ ] 12.4 Write property test for countdown calculation accuracy
    - **Property 9: Countdown calculation accuracy**
    - **Validates: Requirements 3.1**
  
  - [ ] 12.5 Write property test for drop state transition at launch
    - **Property 10: Drop state transition at launch**
    - **Validates: Requirements 3.2**
  
  - [ ] 12.6 Write property test for early access control
    - **Property 11: Early access control**
    - **Validates: Requirements 3.3, 3.4**

- [ ] 13. Build Drop Engine UI components
  - [ ] 13.1 Create DropCountdown component
    - Display countdown timer
    - Update in real-time
    - _Requirements: 3.1_
  
  - [ ] 13.2 Create DropProductCard component
    - Show drop status (scheduled, live, sold out)
    - Display countdown or "Available Now"
    - Handle early access display
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [ ] 13.3 Add drop gating to product pages
    - Prevent purchase before launch
    - Enable purchase at launch time
    - _Requirements: 3.2_

- [ ] 14. Implement drop scheduling system
  - [ ] 14.1 Create Vercel Cron job for drop activation
    - Set up cron route at /api/cron/activate-drops
    - Query drops that should transition
    - Update drop status
    - _Requirements: 5.3, 5.5_
  
  - [ ] 14.2 Configure Vercel cron schedule
    - Set to run every minute
    - _Requirements: 5.3, 5.5_
  
  - [ ] 14.3 Write property test for drop activation timing
    - **Property 18: Drop activation timing**
    - **Validates: Requirements 5.3**
  
  - [ ] 14.4 Write property test for drop launch state transition
    - **Property 20: Drop launch state transition**
    - **Validates: Requirements 5.5**

- [ ] 15. Implement user authentication system
  - [ ] 15.1 Configure NextAuth.js
    - Set up credentials provider
    - Configure session strategy
    - _Requirements: 11.1, 11.2_
  
  - [ ] 15.2 Create UserService with auth logic
    - Register user (hash password with bcrypt)
    - Authenticate user
    - Generate password reset token
    - _Requirements: 11.1, 11.2, 11.5_
  
  - [ ] 15.3 Create auth API routes
    - POST /api/auth/register
    - POST /api/auth/reset-password
    - _Requirements: 11.1, 11.5_
  
  - [ ] 15.4 Write property test for user account creation
    - **Property 40: User account creation**
    - **Validates: Requirements 11.1**
  
  - [ ] 15.5 Write property test for authentication correctness
    - **Property 41: Authentication correctness**
    - **Validates: Requirements 11.2**

- [ ] 16. Build user account pages
  - [ ] 16.1 Create login and registration pages
    - Build forms with validation
    - Handle authentication flow
    - _Requirements: 11.1, 11.2_
  
  - [ ] 16.2 Create account dashboard page
    - Display user information
    - Show order history
    - _Requirements: 11.3_
  
  - [ ] 16.3 Implement order history display
    - Query user's orders
    - Display with status and details
    - _Requirements: 11.3_
  
  - [ ] 16.4 Write property test for order history isolation
    - **Property 42: Order history isolation**
    - **Validates: Requirements 11.3**
  
  - [ ] 16.5 Write property test for order-user association
    - **Property 43: Order-user association**
    - **Validates: Requirements 11.4**

- [ ] 17. Implement email notification system
  - [ ] 17.1 Set up email service (Resend or SendGrid)
    - Install SDK and configure API key
    - _Requirements: 6.5, 11.5_
  
  - [ ] 17.2 Create EmailService
    - Send order confirmation email
    - Send password reset email
    - _Requirements: 6.5, 11.5_
  
  - [ ] 17.3 Create email templates
    - Order confirmation template
    - Password reset template
    - _Requirements: 6.5, 11.5_
  
  - [ ] 17.4 Write property test for order confirmation email
    - **Property 24: Order confirmation email**
    - **Validates: Requirements 6.5**
  
  - [ ] 17.5 Write property test for password reset token generation
    - **Property 44: Password reset token generation**
    - **Validates: Requirements 11.5**

- [ ] 18. Build admin dashboard foundation
  - [ ] 18.1 Create admin layout and navigation
    - Build admin sidebar with sections
    - Add authentication middleware for admin routes
    - _Requirements: 4.1, 5.1, 6.1, 7.1, 8.1_
  
  - [ ] 18.2 Create admin authentication guard
    - Check user role is admin
    - Redirect non-admins
    - _Requirements: All admin requirements_

- [ ] 19. Implement admin product management
  - [ ] 19.1 Create product list page for admin
    - Display all products with edit/delete actions
    - _Requirements: 4.1_
  
  - [ ] 19.2 Create product create/edit form
    - Form for product details
    - Variant management UI
    - Image upload
    - _Requirements: 4.1, 4.3_
  
  - [ ] 19.3 Implement image upload service
    - Handle file upload
    - Optimize images (resize, convert to WebP/AVIF)
    - Store URLs in database
    - _Requirements: 4.4_
  
  - [ ] 19.4 Create admin API routes for products
    - POST /api/admin/products
    - PUT /api/admin/products/[id]
    - DELETE /api/admin/products/[id]
    - _Requirements: 4.1, 4.2_
  
  - [ ] 19.5 Write property test for inventory update immediacy
    - **Property 14: Inventory update immediacy**
    - **Validates: Requirements 4.2**
  
  - [ ] 19.6 Write property test for image optimization output
    - **Property 16: Image optimization output**
    - **Validates: Requirements 4.4**

- [ ] 20. Implement admin drop management
  - [ ] 20.1 Create drop list page for admin
    - Display all drops with status
    - _Requirements: 5.1_
  
  - [ ] 20.2 Create drop create/edit form
    - Form for launch date and time
    - Early access configuration
    - Product selection
    - _Requirements: 5.1, 5.2_
  
  - [ ] 20.3 Create admin API routes for drops
    - POST /api/admin/drops
    - PUT /api/admin/drops/[id]
    - _Requirements: 5.1, 5.4_
  
  - [ ] 20.4 Write property test for drop configuration persistence
    - **Property 17: Drop configuration persistence**
    - **Validates: Requirements 5.1, 5.2**
  
  - [ ] 20.5 Write property test for drop update propagation
    - **Property 19: Drop update propagation**
    - **Validates: Requirements 5.4**

- [ ] 21. Implement admin order management
  - [ ] 21.1 Create order list page for admin
    - Display all orders with filters
    - Search by customer, order number, date
    - _Requirements: 6.1, 6.4_
  
  - [ ] 21.2 Create order detail page for admin
    - Display complete order information
    - Status update controls
    - _Requirements: 6.2, 6.3_
  
  - [ ] 21.3 Create admin API routes for orders
    - GET /api/admin/orders (with search/filter)
    - PUT /api/admin/orders/[id] (status update)
    - _Requirements: 6.1, 6.3, 6.4_
  
  - [ ] 21.4 Write property test for order search accuracy
    - **Property 23: Order search accuracy**
    - **Validates: Requirements 6.4**

- [ ] 22. Implement admin discount management
  - [ ] 22.1 Create discount list page for admin
    - Display all discount codes
    - Show usage stats
    - _Requirements: 7.1_
  
  - [ ] 22.2 Create discount create/edit form
    - Form for code, type, value, expiration
    - Usage limit configuration
    - _Requirements: 7.1_
  
  - [ ] 22.3 Create admin API routes for discounts
    - POST /api/admin/discounts
    - PUT /api/admin/discounts/[id]
    - _Requirements: 7.1_
  
  - [ ] 22.4 Write property test for discount code creation
    - **Property 25: Discount code creation**
    - **Validates: Requirements 7.1**

- [ ] 23. Implement analytics system
  - [ ] 23.1 Create AnalyticsService
    - Calculate revenue metrics (total, average, count)
    - Aggregate product sales
    - Calculate conversion metrics
    - Calculate drop performance metrics
    - _Requirements: 8.1, 8.2, 8.3, 8.5_
  
  - [ ] 23.2 Create analytics dashboard page
    - Display key metrics with date range selector
    - Show revenue, orders, AOV
    - Display top products
    - Show conversion rates
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  
  - [ ] 23.3 Create analytics API route
    - GET /api/admin/analytics (with date range)
    - _Requirements: 8.1, 8.4_
  
  - [ ] 23.4 Write property test for revenue metrics calculation
    - **Property 30: Revenue metrics calculation**
    - **Validates: Requirements 8.1**
  
  - [ ] 23.5 Write property test for product sales aggregation
    - **Property 31: Product sales aggregation**
    - **Validates: Requirements 8.2**
  
  - [ ] 23.6 Write property test for conversion metrics calculation
    - **Property 32: Conversion metrics calculation**
    - **Validates: Requirements 8.3**
  
  - [ ] 23.7 Write property test for time range filtering
    - **Property 33: Time range filtering**
    - **Validates: Requirements 8.4**
  
  - [ ] 23.8 Write property test for drop performance metrics
    - **Property 34: Drop performance metrics**
    - **Validates: Requirements 8.5**

- [ ] 24. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 25. Implement SEO and performance optimizations
  - [ ] 25.1 Add metadata to all pages
    - Implement generateMetadata for each route
    - Include title, description, Open Graph tags
    - _Requirements: 10.2, 10.3_
  
  - [ ] 25.2 Add structured data to product pages
    - Implement JSON-LD for Product schema
    - Include name, price, availability, image
    - _Requirements: 10.1_
  
  - [ ] 25.3 Implement sitemap generation
    - Create /sitemap.xml route
    - Include all products and static pages
    - _Requirements: 10.4_
  
  - [ ] 25.4 Optimize images throughout site
    - Use Next.js Image component everywhere
    - Configure lazy loading
    - Specify WebP/AVIF formats
    - _Requirements: 9.3_
  
  - [ ] 25.5 Write property test for structured data presence
    - **Property 36: Structured data presence**
    - **Validates: Requirements 10.1**
  
  - [ ] 25.6 Write property test for meta tags completeness
    - **Property 37: Meta tags completeness**
    - **Validates: Requirements 10.2, 10.3**
  
  - [ ] 25.7 Write property test for sitemap completeness
    - **Property 38: Sitemap completeness**
    - **Validates: Requirements 10.4**
  
  - [ ] 25.8 Write property test for server-side rendering
    - **Property 39: Server-side rendering**
    - **Validates: Requirements 10.5**
  
  - [ ] 25.9 Write property test for image optimization attributes
    - **Property 35: Image optimization attributes**
    - **Validates: Requirements 9.3**

- [ ] 26. Implement product reviews system
  - [ ] 26.1 Create Review model and repository
    - Define schema with rating, title, comment
    - Query reviews by product
    - _Requirements: 1.4_
  
  - [ ] 26.2 Add reviews display to product page
    - Show all reviews with ratings
    - Calculate average rating
    - _Requirements: 1.4_
  
  - [ ] 26.3 Create review submission form
    - Allow logged-in users to submit reviews
    - Validate rating and content
    - _Requirements: 1.4_
  
  - [ ] 26.4 Write property test for reviews display
    - **Property 4: Reviews display**
    - **Validates: Requirements 1.4**

- [ ] 27. Add size guide functionality
  - [ ] 27.1 Add size guide field to product form
    - Allow admin to input size guide content
    - _Requirements: 1.3_
  
  - [ ] 27.2 Display size guide on product page
    - Show size guide modal or section
    - _Requirements: 1.3_
  
  - [ ] 27.3 Write property test for size guide display
    - **Property 3: Size guide display**
    - **Validates: Requirements 1.3**

- [ ] 28. Implement inventory validation and messaging
  - [ ] 28.1 Add out-of-stock validation to cart
    - Prevent adding out-of-stock variants
    - Display error message
    - _Requirements: 12.3_
  
  - [ ] 28.2 Add low stock messaging to product page
    - Display "Only X left" when below threshold
    - _Requirements: 12.5_
  
  - [ ] 28.3 Write property test for out-of-stock cart prevention
    - **Property 46: Out-of-stock cart prevention**
    - **Validates: Requirements 12.3**
  
  - [ ] 28.4 Write property test for low stock messaging
    - **Property 48: Low stock messaging**
    - **Validates: Requirements 12.5**

- [ ] 29. Implement reservation cleanup job
  - [ ] 29.1 Create Vercel Cron job for expired reservations
    - Set up cron route at /api/cron/cleanup-reservations
    - Query and delete expired reservations
    - Run every 5 minutes
    - _Requirements: 2.1_

- [ ] 30. Build mobile-responsive UI
  - [ ] 30.1 Ensure all pages are mobile-responsive
    - Test and adjust layouts for mobile screens
    - Optimize touch targets
    - _Requirements: 1.5, 9.1_
  
  - [ ] 30.2 Implement mobile navigation
    - Create hamburger menu
    - Mobile-friendly cart drawer
    - _Requirements: 1.5, 9.1_

- [ ] 31. Add error handling and loading states
  - [ ] 31.1 Create error boundaries
    - Add error.tsx files for route segments
    - Display user-friendly error messages
    - _Requirements: All requirements_
  
  - [ ] 31.2 Add loading states
    - Create loading.tsx files for route segments
    - Add skeleton loaders for async components
    - _Requirements: All requirements_
  
  - [ ] 31.3 Implement form validation feedback
    - Display field-level errors
    - Show success messages
    - _Requirements: All form-related requirements_

- [ ] 32. Configure production environment
  - [ ] 32.1 Set up environment variables
    - Configure for development, staging, production
    - Document all required variables
    - _Requirements: All requirements_
  
  - [ ] 32.2 Configure database connection pooling
    - Set up Prisma Data Proxy or PgBouncer
    - _Requirements: All requirements_
  
  - [ ] 32.3 Set up error monitoring
    - Integrate Sentry
    - Configure error reporting
    - _Requirements: All requirements_

- [ ] 33. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 34. Deploy to Vercel
  - [ ] 34.1 Connect repository to Vercel
    - Configure build settings
    - Set environment variables
    - _Requirements: All requirements_
  
  - [ ] 34.2 Configure custom domain
    - Set up DNS records
    - Enable HTTPS
    - _Requirements: All requirements_
  
  - [ ] 34.3 Verify production deployment
    - Test all critical flows
    - Check performance metrics
    - _Requirements: All requirements_
