export interface HelloWorldProps {
  name?: string;
}

export function HelloWorld({ name = 'World' }: HelloWorldProps) {
  return <div data-testid="hello-world">Hello {name}</div>;
}
