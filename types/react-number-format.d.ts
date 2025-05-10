declare module 'react-number-format' {
  import * as React from 'react';

  interface NumericFormatProps {
    value: string | number;
    displayType: 'text' | 'input';
    thousandSeparator?: boolean | string;
    decimalSeparator?: string;
    prefix?: string;
    suffix?: string;
    // Các props khác của NumericFormat
  }

  export class NumericFormat extends React.Component<NumericFormatProps> {}
}
