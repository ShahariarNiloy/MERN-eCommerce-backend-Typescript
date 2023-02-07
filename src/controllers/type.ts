import type { Document, Types } from 'mongoose'
import type { UserMethodsType, UserType } from '../model/UserModel/types'

export interface RequestUserType extends Request {
    user?:
        | (Document<unknown, any, UserType> &
              UserType & {
                  _id: Types.ObjectId
              } & UserMethodsType)
        | null
}
