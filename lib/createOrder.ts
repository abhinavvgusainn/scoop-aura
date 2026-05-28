import { ID } from "appwrite";
import { databases } from "./appwrite";

export async function createOrder(data: Record<string, any>) {
  return databases.createDocument({
    databaseId:
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,

    collectionId:
      process.env
        .NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID!,

    documentId: ID.unique(),

    data,
  });
}