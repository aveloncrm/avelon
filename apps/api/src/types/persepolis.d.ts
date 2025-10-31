declare module '@persepolis/mail' {
  export interface SendMailOptions {
    name?: string
    to: string | string[]
    subject: string
    html: string
    from?: string
  }

  export function sendMail(options: SendMailOptions): Promise<void>
}

declare module '@persepolis/regex' {
  export function isEmailValid(email: string): boolean
  export function isPhoneNumberValid(phone: string): boolean
}

declare module '@persepolis/sms' {
  export interface SendSMSOptions {
    to: string
    message: string
    from?: string
  }

  export function sendSMS(options: SendSMSOptions): Promise<void>
}

declare module '@persepolis/rng' {
  export function generateRandom(options?: any): any
}

declare module '@persepolis/slugify' {
  export function slugify(text: string, options?: any): string
}

