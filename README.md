# CoffeeECom

CoffeeECom is a demo e-commerce application for browsing coffee, coffee
equipment, and merchandise. It uses a React frontend, an Express REST
API, and MongoDB for product storage.

The project is being developed incrementally, with an emphasis on
keeping the frontend and backend separate so the application can grow to
support product management, a cart, and checkout.

## Features

### Product catalog API

-   Retrieve products with server-side filtering, sorting, and
    pagination.
-   Retrieve an individual product by its MongoDB ID.
-   Create, update, and delete products through REST endpoints.
-   Validate product payloads and return appropriate HTTP status codes.
-   Use MongoDB-generated `_id` values as the persistent product
    identifiers.
-   Retrieve category-specific filter options and numeric ranges from
    the backend.
-   Retrieve featured coffee products for the homepage.

### Frontend

-   React-based user interface using React-Bootstrap.
-   Shop pages with search, filters, sorting, and pagination.
-   Product detail pages that fetch an individual product from the API.
-   Homepage featured section that requests featured coffee products
    from the API.
-   Cart state managed on the frontend for the current demo workflow.

## Technology stack

-   **Frontend:** React, React-Bootstrap, React Router
-   **Backend:** Node.js, Express
-   **Database:** MongoDB
-   **HTTP requests:** Fetch API
-   **Development:** Vite (if configured in the frontend project)

## Getting started

### Prerequisites

Install the following before running the application:

-   A supported Node.js version
-   npm
-   MongoDB running locally or a MongoDB connection URI
-   Git (recommended)

### 1. Configure the backend

Open a terminal in the backend directory and install dependencies:

``` bash
npm install
```

Configure the environment variables used by the backend:

``` env
MONGODB_URI=mongodb://localhost:27017/
PORT=53140
```

The backend uses `CodenCoffeeDB` as its MongoDB database name unless the
code has been configured otherwise. The MongoDB URI and port should be
set in the backend environment; do not put database credentials in
frontend environment variables.

Start the backend using the script configured in its `package.json`. For
example, if a `start` script exists:

``` bash
npm start
```

Or, if the project uses a development script:

``` bash
npm run dev
```

The API base URL used by the frontend during local development is:

``` text
http://localhost:53140
```

### 2. Configure the frontend

Open a terminal in the frontend directory and install dependencies:

``` bash
npm install
```

Create a frontend `.env` file if needed:

``` env
VITE_API_BASE_URL=http://localhost:53140
```

Restart the Vite development server after changing environment
variables. Start the frontend using the script in its `package.json`,
commonly:

``` bash
npm run dev
```

Do not expose secrets in variables prefixed with `VITE_`; these values
are available to browser-side code.

## Product API

The examples below assume the API is running at
`http://localhost:53140`.

### List products

``` http
GET /products
```

Supported query parameters include:

  ---------------------------------------------------------------------------------------------
  Parameter               Purpose                 Example
  ----------------------- ----------------------- ---------------------------------------------
  `category`              Restrict products to a  `category=coffee`
                          category                

  `search`                Search supported        `search=arabica`
                          product text fields     

  `filters`               URL-encoded JSON object `filters={"roastLevel":["Light","Medium"]}`
                          describing selected     
                          filters                 

  `sort`                  Choose a supported sort `sort=price-asc`
                          order                   

  `page`                  1-based page number     `page=1`

  `limit`                 Number of results per   `limit=12`
                          page                    

  `featured`              Restrict results to     `featured=true`
                          featured status when    
                          supported               
  ---------------------------------------------------------------------------------------------

Example:

``` text
GET /products?category=coffee&sort=price-asc&page=1&limit=12
```

Example filter object:

``` json
{
  "roastLevel": ["Light", "Medium"],
  "origin": ["Nepal"],
  "price": {
    "min": 500,
    "max": 1500
  }
}
```

Checkbox selections for one field generally match any selected value for
that field; different fields are combined as additional query
conditions. The backend should validate the accepted filter fields and
values.

A successful list response uses a structure similar to:

``` json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 12,
    "totalItems": 0,
    "totalPages": 0
  }
}
```

### Retrieve one product

``` http
GET /products/:id
```

Use the MongoDB `_id` returned by the API. The frontend service may
expose a convenience `id` property mapped from `_id` for existing React
components.

### Retrieve filter options

``` http
GET /products/filter-options?category=coffee
```

Returns distinct checkbox values and numeric ranges derived from active
products in the requested category. This endpoint allows the frontend to
display all available filter choices without deriving them from only the
products on the current page.

The response has a structure similar to:

``` json
{
  "category": "coffee",
  "options": {
    "brand": [],
    "roastLevel": [],
    "origin": []
  },
  "ranges": {
    "price": {
      "min": 0,
      "max": 0
    }
  }
}
```

The values above are placeholders; actual options and ranges depend on
the active products in MongoDB. The frontend's filter configuration
determines which of these fields are shown in the UI.

### Create a product

``` http
POST /products
Content-Type: application/json
```

Send a valid product document in the request body. The database
generates `_id`; clients should not supply their own `id` or `_id`. The
API should return `201 Created` and the created product.

### Update a product

``` http
PATCH /products/:id
Content-Type: application/json
```

Send only the fields to update. The backend should validate partial
updates and prevent changes to immutable identifier fields.

### Delete a product

``` http
DELETE /products/:id
```

A successful deletion returns `204 No Content` when using the described
API behavior.

## Supported product categories and filtering

The application currently uses these top-level categories:

-   `coffee`
-   `equipment`
-   `merch`

Product documents share common fields such as `sku`, `name`, `brand`,
`category`, `price`, `discountPercent`, `stock`, `isFeatured`, and
`isActive`. Other fields depend on the product type, such as
`roastLevel`, `origin`, `brewingMethod`, `material`, or
`merchandiseType`.

Keep the backend's product validation allowlist, filter-field allowlist,
and frontend filter definitions aligned when adding new product
attributes.

## Frontend data flow

### Shop page

The shop page sends the current category, search query, selected
filters, sort order, and pagination values to `GET /products`.
Filtering, sorting, and pagination are handled by the backend; the
frontend should not re-filter or re-sort only the currently returned
page.

The filter sidebar gets its available options from
`GET /products/filter-options?category=...`, rather than building the
complete option list from a static product array or from the current
page.

### Product details

The product details page reads the product ID from the route and
requests `GET /products/:id`. It should display loading,
not-found/inactive-product, and request-error states.

### Featured homepage section

The featured section requests a small page of active featured coffee
products, for example:

``` text
GET /products?category=coffee&featured=true&sort=featured&page=1&limit=4
```

The API must implement and validate the `featured` query parameter for
this request to work. Products must exist in MongoDB with
`category: "coffee"`, `isFeatured: true`, and `isActive: true`.

### Cart and checkout

The frontend cart can keep temporary cart state for display and demo
purposes. Before implementing real checkout or payment, the backend must
independently verify product IDs, current prices, discounts, stock, and
order totals. Never trust totals supplied by the browser as
authoritative.

## Sorting

The product API may support the following sort keys, depending on the
backend implementation:

-   `featured`
-   `name-asc`
-   `price-asc`
-   `price-desc`
-   `rating-desc`
-   `popular`
-   `discount-desc`

Price sorting should use the same price definition shown to customers.
If the UI shows discounted selling prices, price sorting and price-range
filtering should consistently use the discounted price.

## Development notes

-   Keep database credentials and secrets out of frontend code and
    version control.
-   Use `.env.example` files to document required environment variables
    without real secrets.
-   Use Git commits before significant AI-assisted or multi-file
    changes.
-   Test endpoints directly with a browser or an API client before
    debugging the React UI.
-   Ensure product-management routes are protected by authentication and
    authorization before public deployment.
-   Add tests for invalid IDs, missing products, invalid categories,
    malformed filters, duplicate SKUs, pagination boundaries, and
    inactive products.
-   Review indexes and query plans as the catalog grows; do not add
    indexes blindly for every filter combination.

## Current scope and future work

This is a learning/demo e-commerce application. Features such as
production authentication, admin authorization, image storage, order
persistence, inventory reservation, payment integration, caching, and
deployment hardening may not yet be implemented.

Potential next steps:

1.  Add automated tests for product and filter-option endpoints.
2.  Add protected product-management access.
3.  Replace any remaining static product imports with API service calls
    where appropriate.
4.  Implement server-authoritative order creation and stock validation.
5.  Add product image storage and deployment configuration.
6.  Add caching or advanced search only when useful for measured
    performance needs.
