import type { FC } from 'react';
import { useState } from 'react';
import { Input } from 'antd';
import styles from './index.less';

type Props = { content: string | number; onChange: (value: string) => void };

const InputToggle: FC<Props> = (props) => {
  const [inputVisible, setInputVisible] = useState(false);
  const { content, onChange } = props;
  return (
    <div className={styles.container}>
      {inputVisible ? (
        <Input
          value={content}
          onChange={(e) => {
            const { value } = e.target;
            onChange(value);
          }}
          onBlur={() => {
            setInputVisible(false);
          }}
        ></Input>
      ) : (
        <div
          className={styles.input}
          onClick={() => {
            setInputVisible(true);
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default InputToggle;
