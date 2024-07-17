import React, { useRef } from "react";

export default function VerificationInput({
  values,
  setValues,
}: {
  values: any;
  setValues: any;
}) {
  // const [values, setValues] = useState<string[]>(new Array(8).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  return (
    <div className="flex justify-between">
      {values.map((value: string, index: number) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={value}
          required
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          onChange={(e) => {
            const newVal = e.target.value;
            const newValues = [...values];
            newValues[index] = e.target.value;
            setValues(newValues);
            if (newVal !== "") {
              inputRefs.current[index + 1]?.focus();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace") {
              inputRefs.current[index - 1]?.focus();
            }
          }}
          className="mx-2 w-[8%] rounded-md border border-solid border-gray-400 p-1 text-center"
        />
      ))}
    </div>
  );
}
