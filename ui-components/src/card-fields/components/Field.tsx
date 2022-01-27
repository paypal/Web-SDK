type FieldProps = {
  name: string;
  style: any;
};

export function Field({ name = "card-field", style }: FieldProps) {
  return <input name={name} style={style} />;
}
