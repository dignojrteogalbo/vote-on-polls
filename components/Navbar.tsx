import Link from "next/link"
import { FunctionComponent } from "react"
import { Menu } from "semantic-ui-react"


type NavbarProps = {
    home?: boolean,
    items?: { path: string, content: string }[],
}

export const Navbar: FunctionComponent<NavbarProps> = ({ home, items }) => {
    const homeItem = (
        <Link href="/">
            <Menu.Item
                active
                key='home'
                name='Go Home'
                color='blue'
            />
        </Link>
    )

    return ( 
        <Menu
            inverted
            fluid
            fixed='top'
            size='massive'
        >
            {home && homeItem}
            {items && 
            items.map(item => 
                <Link 
                    key={item.path} 
                    href={item.path}
                >
                    <Menu.Item
                        active
                        name={item.content}
                        color='blue'
                    />
                </Link>
            )}
        </Menu>
    )
}