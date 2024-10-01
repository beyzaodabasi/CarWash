class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
    this.message = message
  }

  static notFound() {
    this.message = 'Böyle bir kayıt bulunamadı...'
    this.status = 404
  }
}

module.exports = ApiError
