import { useRouter } from "next/router"
import Link, { LinkProps } from "next/link"
import { ReactElement, cloneElement } from "react"

interface IProps extends LinkProps {
    children: ReactElement
    activeClassName: string
}

export const ActiveLink: React.FC<IProps> = ({ children, activeClassName, ...restProps }) => {
    const { asPath } = useRouter()

    const className = asPath === restProps.href ? activeClassName : ''
    return (
        <Link {...restProps}>
            {
                cloneElement(
                    children,
                    {
                        className
                    }
                )
            }
        </Link>
    )
}