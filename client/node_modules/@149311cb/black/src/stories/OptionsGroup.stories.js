import React from "react";
import { OptionGroup, Option } from "../components/option";

export default {
  title: "OptionGroup",
  component: OptionGroup,
};

const Template = (args) => <OptionGroup {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: "Group 1",
  direction: "column",
  children: (
    <>
      <Option>Hello</Option>
      <Option>Holla</Option>
      <Option>Bonjour</Option>
    </>
  ),
};

export const Row = Template.bind({});
Row.args = {
  name: "Group 2",
  direction: "row",
  children: (
    <>
      <Option>Hello</Option>
      <Option>Holla</Option>
      <Option>Bonjour</Option>
    </>
  ),
};

export const Grid = Template.bind({});
Grid.args = {
  name: "Group 2",
  direction: "grid",
  children: (
    <>
      <Option>Hello</Option>
      <Option>Holla</Option>
      <Option>Bonjour</Option>
    </>
  ),
};
