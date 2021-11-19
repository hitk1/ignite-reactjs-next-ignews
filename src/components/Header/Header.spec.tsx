import { render, screen } from '@testing-library/react'
import { Header } from '.'

jest.mock('next/router', () => {
    return {
        useRouter() {
            return {
                asPath: '/'
            }
        }
    }
})

jest.mock('next-auth/client', () => {
    return {
        useSession() {
            return [null, false]
        }
    }
})

describe('Header component', () => {
    it('render correctly', () => {
        render(
            <Header />
        )

        // [screen] é um objct importado de dentro do testing-library que contem o virtualDOM dos componentes renderizados
        expect(screen.getByText('Home')).toBeInTheDocument()
        expect(screen.getByText('Posts')).toBeInTheDocument()
    })
})