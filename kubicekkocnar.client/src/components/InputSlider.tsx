import '../styles/InputSlider.css';
import React, { useState } from 'react';
import { MaterialSymbol } from 'react-material-symbols';

interface InputSliderProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  slider?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

const InputSlider: React.FC<InputSliderProps> = ({
  value,
  defaultValue,
  onChange,
  slider = false,
  min = -20,
  max = 20,
  step = 0.1,
}) => {
  const [isSlider, setIsSlider] = useState(slider);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVal(Number(event.currentTarget.value));
    if (onChange) onChange(Number(event.currentTarget.value));
  };

  const [val, setVal] = useState(value ? value : defaultValue);

  const toggleInputType = () => {
    setIsSlider(!isSlider);
  };

  return (
    <div className="inputslider">
      {isSlider ? (
        <>
          <input
            type="range"
            value={val}
            onChange={handleChange}
            min={min}
            max={max}
            step={step}
          /><span className="inputslider__value">{val}</span>
        </>
      ) : (
        <input
          type="number"
          value={val}
          onChange={handleChange}
        />
      )}
      <button className="inputslider__button" onClick={toggleInputType}>
        <MaterialSymbol icon={isSlider ? 'keyboard_alt' : 'tune'} />
      </button>
    </div>
  );
};

export default InputSlider;