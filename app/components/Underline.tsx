export function Underline() {
  return (
    <>
      <div
        className="absolute bottom-[3px] h-[1px] w-[100%] bg-white
    group-hover:translate-x-[100%]
    transition-transform ease-in-out-monoki duration-500"
      />
      <div
        className="absolute bottom-[3px] h-[1px] w-[100%] bg-white
    translate-x-[-100%]
    group-hover:translate-x-0
    transition-transform ease-in-out-monoki duration-[1.2s]"
      />
    </>
  );
}
