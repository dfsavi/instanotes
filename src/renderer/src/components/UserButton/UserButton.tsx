import { UnstyledButton, Group, Avatar, Text, rem } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import classes from "./UserButton.module.css";

export function UserButton() {
	return (
		<UnstyledButton className={classes.user}>
			<Group>
				<Avatar src="" radius="xl" />

				<div style={{ flex: 1 }}>
					<Text size="sm" fw={500}>
						Harriette Spoonlicker
					</Text>

					<Text c="dimmed" size="xs">
						hspoonlicker@outlook.com
					</Text>
				</div>

				<IconChevronRight
					style={{ width: rem(14), height: rem(14) }}
					stroke={1.5}
				/>
			</Group>
		</UnstyledButton>
	);
}
