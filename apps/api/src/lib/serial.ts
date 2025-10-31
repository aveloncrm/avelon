/**
 * Generate a serial number (OTP code)
 * @param options - Configuration options
 * @param options.length - Length of the OTP (default: 6)
 * @param options.type - Type of characters to use: 'numeric' | 'alphanumeric' (default: 'numeric')
 * @returns Generated OTP string
 */
export function generateSerial(options?: {
  length?: number
  type?: 'numeric' | 'alphanumeric'
}): string {
  const { length = 6, type = 'numeric' } = options || {}

  if (type === 'numeric') {
    // Generate numeric OTP
    let otp = ''
    for (let i = 0; i < length; i++) {
      otp += Math.floor(Math.random() * 10).toString()
    }
    return otp
  } else {
    // Generate alphanumeric OTP
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    let otp = ''
    for (let i = 0; i < length; i++) {
      otp += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return otp
  }
}

