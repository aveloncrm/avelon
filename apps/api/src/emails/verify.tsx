import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface VerifyEmailProps {
  code?: string
  name?: string
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : ''

export const VerifyEmail = ({
  code = '123456',
  name = 'Avelon',
}: VerifyEmailProps) => {
  const previewText = `Your verification code: ${code}`
  
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src={`${baseUrl}/static/logo.png`}
                width="40"
                height="37"
                alt={name}
                className="my-0 mx-auto"
              />
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Verify your email
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello!
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Thank you for signing up for {name}. To complete your registration,
              please use the verification code below:
            </Text>
            <Section className="bg-[#f4f4f4] rounded-lg my-[32px] mx-0 p-[20px]">
              <Text className="text-center text-[32px] font-bold tracking-[8px] m-0">
                {code}
              </Text>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              This code will expire in 10 minutes. If you didn&apos;t request this code,
              you can safely ignore this email.
            </Text>
            <Text className="text-[#666666] text-[12px] leading-[24px] mt-[32px]">
              If you didn&apos;t request this verification code, please ignore this email.
              If you are concerned about your account&apos;s safety, please reply to this
              email to get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default VerifyEmail

