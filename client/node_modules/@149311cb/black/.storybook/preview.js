export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    default: "pureblack",
    values: [
      {
        name: "pureblack",
        value: "black",
      },
      {
        name: "facebook",
        value: "#3b5998",
      },
    ],
  },
};

export const decorators = [
  (Story) => (
    <div style={{ fontFamily: `"Open Sans",sans-serif`, color: "white" }}>
      {Story()}
    </div>
  ),
];

