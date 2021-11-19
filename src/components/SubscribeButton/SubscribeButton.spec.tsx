import { fireEvent, render, screen } from '@testing-library/react'
import { signIn, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { mocked } from 'ts-jest/utils'

import { SubscribeButton } from '.'

jest.mock('next-auth/client')

// jest.mock('next/router', () => {
//     return {
//         useRouter() {
//             return {
//                 push: jest.fn()
//             }
//         }
//     }
// })

describe('SubscribeButton', () => {
    it('renders correctly', () => {
        render(<SubscribeButton />)
        const useSessionMocked = mocked(useSession)

        useSessionMocked.mockReturnValueOnce([null, false])

        expect(screen.getByText('Subscribe Now')).toBeInTheDocument()
    })

    it('redirects user to sign in when is not logged in', () => {
        const signInMocked = mocked(signIn)
        const useSessionMocked = mocked(useSession)

        useSessionMocked.mockReturnValueOnce([null, false])
        render(<SubscribeButton />)

        const subscribeButton = screen.getByText('Subscribe Now')

        fireEvent.click(subscribeButton)

        expect(signInMocked).toHaveBeenCalled()
    })

    it('redirects to posts when user already has a subscription', () => {
        const useRouterMocked = mocked(useRouter)
        const useSessionMocked = mocked(useSession)
        const pushMock = jest.fn()

        useSessionMocked.mockReturnValueOnce([
            {
                user: {
                    name: 'John Doe',
                    email: 'john.doe@example.com'
                },
                activeSubscription: 'fake-active-subscription',
                expires: 'fake-expires'
            },
            true
        ])

        useRouterMocked.mockReturnValueOnce({
            push: pushMock
        } as any)

        render(<SubscribeButton />)

        const subscribeButton = screen.getByText('Subscribe Now')
        fireEvent.click(subscribeButton)

        expect(pushMock).toHaveBeenCalled()
    })
})