-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" REAL NOT NULL,
    "tax" REAL NOT NULL,
    "total" REAL NOT NULL,
    "xmlData" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "buyerName" TEXT NOT NULL,
    "cnp" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Order" ("amount", "buyerName", "cnp", "createdAt", "gender", "id", "productName", "tax", "total", "xmlData") SELECT "amount", "buyerName", "cnp", "createdAt", "gender", "id", "productName", "tax", "total", "xmlData" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
