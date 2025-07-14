declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        src?: string;
        ar?: boolean;
        'camera-controls'?: boolean;
        style?: React.CSSProperties;
        children?: React.ReactNode;
      },
      HTMLElement
    >;
  }
}