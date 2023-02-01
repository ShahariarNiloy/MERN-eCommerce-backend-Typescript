import { Document, Query, Types } from 'mongoose'
import { ProductTypes } from '../model/ProductModel/types'

interface QueryStrTypes {
    searchTerm?: string
    page?: string | number
    limit?: string | number
}

type QueryType = Query<
    (Document<ProductTypes> &
        ProductTypes & {
            _id: Types.ObjectId
        })[],
    Document<ProductTypes> &
        ProductTypes & {
            _id: Types.ObjectId
        },
    {},
    ProductTypes
>

class ApiFeatures {
    query: QueryType
    queryStr: QueryStrTypes
    constructor(query: QueryType, queryStr: QueryStrTypes) {
        this.query = query
        this.queryStr = queryStr
    }

    search() {
        const searchTerm = this.queryStr?.searchTerm
            ? {
                  name: {
                      $regex: this.queryStr?.searchTerm,
                      $options: 'i',
                  },
              }
            : {}

        this.query = this.query.find({ ...searchTerm })

        return this
    }

    filter() {
        const queryCopy: any = { ...this.queryStr }
        //   Removing some fields for category
        const removeFields = ['searchTerm', 'page', 'limit']

        removeFields.forEach((key) => delete queryCopy[key])

        // Filter For Price and Rating

        let queryStr = JSON.stringify(queryCopy)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`)

        this.query = this.query.find(JSON.parse(queryStr))

        return this
    }

    pagination(resultPerPage: number) {
        const currentPage = Number(this.queryStr?.page) || 1

        const skip = resultPerPage * (currentPage - 1)

        this.query = this.query.limit(resultPerPage).skip(skip)

        return this
    }
}

export default ApiFeatures
