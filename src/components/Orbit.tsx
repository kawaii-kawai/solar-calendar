interface Props {
  radius: number;
}

export default function Orbit({ radius }: Props) {
  return (
    <circle
      cx={200}
      cy={200}
      r={radius}
      className="orbit-ring"
    />
  );
}