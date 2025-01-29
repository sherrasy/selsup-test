import React, { ChangeEvent, useRef, useState } from 'react';
// Типы
interface Param {
  id: number;
  name: string;
  type: 'string';
}

interface ParamValue {
  paramId: number;
  value: string;
}

interface Color {
  colorId: number;
  value: string;
}

interface Model {
  paramValues: ParamValue[];
  colors: Color[];
}

interface Props {
  params: Param[];
  model: Model;
}

interface State {
  paramValues: ParamValue[];
}

interface FormFieldProps {
  label: string;
  value: string;
  type: string;
  onChange: (value: string) => void;
}

// Моковые данные для отображения
const DEFAULT_PARAMS: Param[] = [
  {
    id: 1,
    name: 'Назначение',
    type: 'string',
  },
  {
    id: 2,
    name: 'Длина',
    type: 'string',
  },
];

const DEFAULT_MODEL: Model = {
  paramValues: [
    {
      paramId: 1,
      value: 'повседневное',
    },
    {
      paramId: 2,
      value: 'макси',
    },
  ],
  colors: [{ colorId: 1, value: 'red' }],
};

// Классовый компонент формы
class ParamEditor extends React.Component<Props, State> {
  #params: Param[];
  constructor(props: Props) {
    super(props);
    this.state = {
      paramValues: props.model.paramValues,
    };
    this.#params = props.params;
  }
  public getModel(): Model {
    return {
      paramValues: this.state.paramValues,
      colors: this.props.model.colors,
    };
  }

  #changeParamValue = (paramId: number, value: string) => {
    const updatedParamValues = this.state.paramValues.map((item) =>
      item.paramId === paramId ? { ...item, value } : item
    );
    this.setState(() => ({
      paramValues: updatedParamValues,
    }));
  };

  #getParamValue = (id: number) => {
    const { paramValues } = this.state;
    const paramValue = paramValues.find((item) => item.paramId === id);
    return paramValue ? paramValue.value : '';
  };

  render(): React.ReactNode {
    return (
      <form className='form'>
        {this.#params.map(({ id, name, type }) => (
          <FormField
            key={id}
            label={name}
            value={this.#getParamValue(id)}
            type={type}
            onChange={(val) => this.#changeParamValue(id, val)}
          />
        ))}
      </form>
    );
  }
}

// Функциональные компоненты
const FormInput = ({ label, value, type, onChange }: FormFieldProps) => {
  const handleUpdateValue = (evt: ChangeEvent<HTMLInputElement>) => {
    onChange(evt.target.value);
  };
  switch (type) {
    case 'string':
      return (
        <input
          id={label}
          type='text'
          className='form__input'
          defaultValue={value}
          onChange={handleUpdateValue}
        />
      );
    default:
      return null;
  }
};

const FormField = (props: FormFieldProps) => {
  const { label } = props;
  return (
    <div className='form__field'>
      <label htmlFor={label} className='form__label'>
        {label}
      </label>
      <FormInput {...props} />
    </div>
  );
};

// Компонент приложения
const App = () => {
  const paramEditorRef = useRef<ParamEditor>(null);
  const [currentModel, setCurrentModel] = useState<Model | null>(null);
  const showModel = () => {
    if (paramEditorRef.current) {
      setCurrentModel(paramEditorRef.current.getModel());
    } else {
      setCurrentModel(null);
    }
  };

  return (
    <div className='app'>
      <div className='editor'>
        <h1 className='editor__title'>Редактор параметров</h1>
        <ParamEditor
          params={DEFAULT_PARAMS}
          model={DEFAULT_MODEL}
          ref={paramEditorRef}
        />
      </div>
      <div className='result'>
        <button className='result__button' onClick={showModel}>
          Показать модель
        </button>
        {currentModel && (
          <pre>
            <code className='result__info'>
              {JSON.stringify(currentModel, null, 2)}
            </code>
          </pre>
        )}
      </div>
    </div>
  );
};

export default App;
