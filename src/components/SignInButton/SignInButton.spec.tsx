import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/client'
import { mocked } from 'ts-jest/utils'
import { SignInButton } from '.'

/*
Quando o mock de algum modulo é feito e precisar ser testado em varias condições
o ideal é mockar a importação da ferramento (modulo) e usar as tools do [ts-jest] para complementar o mock de cada test
*/
jest.mock('next-auth/client')

describe('SignInButton component', () => {
    it('render correctly when user is not logged in', () => {

        /*
            Dessa forma então o mock do modulo [next-auth/client] é utilizado de uma forma dentro deste teste
            e não afetará o funcionamento dos demais testes
        */
        const useSessionMocked = mocked(useSession)
        useSessionMocked.mockReturnValueOnce([null, false])

        render(
            <SignInButton />
        )

        expect(screen.getByText('Sign in with Github')).toBeInTheDocument()
    })

    it('renders correctly when user is logged in', () => {

        const useSessionMocked = mocked(useSession)
        useSessionMocked.mockReturnValueOnce([
            {
                user: {
                    name: 'John Doe',
                    email: 'john.doe@example.com'
                },
                expires: 'fake-expires'
            },
            true
        ])

        render(<SignInButton />)

        expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
})