import { Badge, NavLink } from "@mantine/core";
import { Link, useRoute } from "wouter";
import { IconChevronRight } from "@tabler/icons-react";

interface Props {
  href: string;
  title: string;
  count?: number;
}

export default function NavbarLink({ href, title, count }: Props) {
  const [isActiveRoute] = useRoute(href);

  return (
    <NavLink
      href={href}
      label={title}
      active={isActiveRoute}
      component={Link}
      leftSection={
        count ? (
          <Badge size="xs" circle>
            {count}
          </Badge>
        ) : null
      }
      rightSection={
        <IconChevronRight
          size={12}
          stroke={1.5}
          className="mantine-rotate-rtl"
        />
      }
    />
  );
}
