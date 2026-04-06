import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { cookies } from "next/headers";

export async function POST(request){
    try {
        await connectDB()
        const cookieStore = await cookies()
        cookieStore.delete('access_token')
        return response(true,200,'Logout Successful')
    } catch (error) {
        catchError(error)
    }
}