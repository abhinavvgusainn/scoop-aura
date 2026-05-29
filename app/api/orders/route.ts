import { NextResponse } from "next/server";
import { databases } from "@/lib/appwrite";

export async function GET() {
  try {
    const orders = await databases.listDocuments({
      databaseId:
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,

      collectionId:
        process.env
          .NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID!,
    });

    return NextResponse.json(orders.documents);
  } catch (error) {
    console.error("Failed to fetch orders:", error);

    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}