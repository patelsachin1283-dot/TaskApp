export default function FieldError({ errors, name }) {
  if (!errors || !errors[name]) return null;
  return <p className="field-error">{errors[name][0]}</p>;
}