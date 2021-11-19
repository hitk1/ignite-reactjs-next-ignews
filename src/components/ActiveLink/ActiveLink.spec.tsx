import { render } from '@testing-library/react'
import { ActiveLink } from '.'

jest.mock('next/router', () => {
    return {
        useRouter() {
            return {
                asPath: '/'
            }
        }
    }
})

describe('Active Link', () => {
    test('active link render correctly', () => {
        const refDom = render(
            <ActiveLink href='/' activeClassName="active">
                <a>Home</a>
            </ActiveLink>
        )

        //Test simples para verificar se o componente foi renderizado procurando por um elemento que contenha o text 'Home'
        expect(refDom.getByText('Home')).toBeInTheDocument()
    })

    test('active link is receiving active class name', () => {
        const refDom = render(
            <ActiveLink href='/' activeClassName="active">
                <a>Home</a>
            </ActiveLink>
        )

        //Teste simples para verificar se o componente renderizado contem a classe 'active' com base nas regras do component
        expect(refDom.getByText('Home')).toHaveClass('active')
    })
})