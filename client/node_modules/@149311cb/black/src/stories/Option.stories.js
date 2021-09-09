import React from "react";
import { Option, OptionGroup } from "../components/option/";

export default {
  title: "Option",
  component: Option,
};

const Template = (args) => (
  <OptionGroup>
    <Option {...args}></Option>
  </OptionGroup>
);

export const Default = Template.bind({});
Default.args = {
  children: "Default",
};
