import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/User.model";

export async function PUT(request) {
    try {
        await connectDB()
        const payload = await request.json()
        const validationSchema = zSchema.pick({
            email: true, password: true
        })
        const validateData = validationSchema.safeParse(payload)
        if (!validateData.success) {
            return response(false, 401, 'Invalid or missing input field', validateData.error)
        }
        const { email, password } = validateData.data

        const getUser = await UserModel.findOne({ deletedAt: null, email }).select("+password")

        if (!getUser) {
            return response(false, 404, 'User not found')
        }
        getUser.password = password
        await getUser.save()

        return response(true, 200, 'Password updated successfully')
    } catch (error) {
        catchError(error)
        return response(false, 500, 'Internal server error')
    }
}