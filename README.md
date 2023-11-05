# [The HIVE](https://hive.ece.gatech.edu) 3D printing dashboard

A bespoke webapp to optimize 3D printing workflows and user experience at The HIVE makerspace at Georgia Tech. Kinda
like 3dprinteros but without the license fees.

The webapp has been designed with expandability in mind, so in the future, The HIVE can gradually centralize more of its
operations for the other tech areas, hiring, and staff management into one place.

### Features

-   Intuitive design with detail-rich interfaces for both users and staff
-   Detailed 3D print logging with STL file storage
-   Live print tracking (via a locally running webserver at the makerspace which monitors the printers)
    -   We can automatically track a print from queue to starts, failures, and completion
    -   _Note: The HIVE uses Ultimaker, Formlabs, and Stratasys printers as our general use printers._
-   Theoretical compatability with any printer brand/type
    -   If a printer cannot be automatically monitored, staff can manually mark prints as printing/failed/completed

### Tech stack

-   Next.js: frontend/serverless backend/API
    -   chakraUI: components
-   MongoDB: database
-   Firebase: auth/file storage
