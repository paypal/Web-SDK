import { NavLink as ReactRouterLink, LinkProps } from "react-router-dom";

export function Link({ children, to, ...props }: LinkProps) {
  return (
    <>
      <ReactRouterLink to={to} {...props}>
        {children}
      </ReactRouterLink>
    </>
  );
}
