# System Class & Data Model Diagrams

This document details the object model, domain entities, and structural architecture of the **Kakutausa** project.

---

## 1. Domain Entity & Database Class Diagram

This diagram displays the database entities, their properties (with types), and their relationships as defined in [schema.prisma](./backend/prisma/schema.prisma).

```mermaid
classDiagram
    direction TB

    class Role {
        <<enumeration>>
        ADMIN
        USER
    }

    class User {
        +Int id
        +String username
        +String email
        +String password
        +Role role
    }

    class Category {
        +Int id
        +String name
    }

    class Product {
        +Int id
        +String name
        +String details
        +String description
        +Int categoryId
    }

    class Size {
        +Int id
        +Int productId
        +String holdingCapacityMetric
        +String weightMetric
        +String handleMovesMetric
        +String barMovesMetric
        +String drawingMovementMetric
        +String holdingCapacityInch
        +String weightInch
        +String handleMovesInch
        +String barMovesInch
        +String drawingMovementInch
    }

    class ProductImage {
        +Int id
        +Int productId
        +String imageUrl
    }

    class ProductModel {
        +Int id
        +Int productId
        +String gltfUrl
        +String binUrl
        +String stepUrl
    }

    class Request3D {
        +Int id
        +String email
        +String firstName
        +String lastName
        +String message
        +Int productId
        +DateTime createdAt
        +Boolean handled
    }

    class ContentType {
        +Int id
        +String name
    }

    class Content {
        +Int id
        +Int contentTypeId
        +String language
        +String title
        +String detail
        +String imageUrl
        +Boolean isPublished
        +DateTime createdAt
        +DateTime updatedAt
    }

    class AddressType {
        +Int id
        +String name
    }

    class Address {
        +Int id
        +Int addressTypeId
        +String address
        +String phone1
        +String phone2
        +String email
        +DateTime createdAt
        +DateTime updatedAt
    }

    %% Relationships
    User --> Role : has role
    Product "0..*" --> "1" Category : belongs to
    Size "0..*" --> "1" Product : applies to
    ProductImage "0..*" --> "1" Product : showcases
    ProductModel "0..*" --> "1" Product : has files for
    Request3D "0..*" --> "0..1" Product : references
    Content "0..*" --> "1" ContentType : of type
    Address "0..*" --> "1" AddressType : of type
```

---

## 2. Architectural MVC Dependency Diagram

The system follows a classic Router-Controller-Service pattern where Node/Express routes request parameters to Controller functions, which interact with the database via Prisma and return results to the React frontend.

```mermaid
classDiagram
    direction LR

    class FrontendClient {
        +React Components
        +Services / API Calls
    }

    class ExpressRouter {
        +use(path, router)
        +get(path, handler)
        +post(path, handler)
        +put(path, handler)
        +delete(path, handler)
    }

    class BackendRoutes {
        +authRouter
        +categoryRouter
        +productRouter
        +sizeRouter
        +contentTypeRouter
        +contentRouter
        +addressTypeRouter
        +addressRouter
        +request3DRouter
        +dashboardRouter
    }

    class BackendControllers {
        +authController
        +categoryController
        +productController
        +sizeController
        +contentTypeController
        +contentController
        +addressTypeController
        +addressController
        +request3DController
        +dashboardController
    }

    class PrismaORM {
        +client
        +transaction()
    }

    class PostgreSQL {
        <<Database>>
    }

    %% Dependency flow
    FrontendClient ..> ExpressRouter : sends HTTP Requests
    ExpressRouter <|-- BackendRoutes : implements
    BackendRoutes --> BackendControllers : delegates to handlers
    BackendControllers --> PrismaORM : queries / updates
    PrismaORM --> PostgreSQL : executes SQL queries
```
