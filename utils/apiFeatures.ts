interface QueryStrTypes {
    searchTerm?: string
    page?: number
    limit?: number
}

class ApiFeatures {
    query: any
    queryStr: any
    constructor(query: any, queryStr: any) {
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
        const currentPage = Number(this.queryStr.page) || 1

        const skip = resultPerPage * (currentPage - 1)

        this.query = this.query.limit(resultPerPage).skip(skip)

        return this
    }
}

export default ApiFeatures
