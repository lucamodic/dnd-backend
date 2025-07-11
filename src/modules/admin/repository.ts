import Admin, { IAdmin } from "../../db/models/Admin"

export class Repository {
  static async post(data: IAdmin) {
    return Admin.create(data)
  }

  static async patch(data: IAdmin) {
    try {
      const updatedAdmin = await Admin.findByIdAndUpdate(data.id, data, { new: true })
      if (!updatedAdmin) {
        return { error: "Admin not found", status: 404 }
      }
      return { updatedAdmin }
    } catch (error) {
      return { error, status: 400 }
    }
  }

  static async delete(id: string) {
    try {
      const deletedAdmin = await Admin.findByIdAndDelete(id)
      if (!deletedAdmin) {
        return { error: "Admin not found", status: 404 }
      }
      return { message: "Admin deleted successfully" }
    } catch (error) {
      return { error, status: 400 }
    }
  }

  static async getById(id: string) {
    try {
      const admin = await Admin.findById(id)
      if (!admin) {
        return { error: "Admin not found", status: 404 }
      }
      return { admin }
    } catch (error) {
      return { error, status: 400 }
    }
  }
}
