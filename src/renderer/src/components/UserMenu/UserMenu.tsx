import { Avatar, Container, Menu } from '@mantine/core'

function UserMenu(): JSX.Element {
  return (
    <Container
      fluid
      py={10}
      style={{
        backgroundColor: '#f0f0f0',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <Menu>
        <Menu.Target>
          <Avatar src="" size="lg" radius="xl" mx="auto" style={{ cursor: 'pointer' }} />
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item>Profile</Menu.Item>
          <Menu.Item>Settings</Menu.Item>
          <Menu.Item color="red">Logout</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Container>
  )
}

export default UserMenu
