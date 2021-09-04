import { Pagination } from "../src";

export default {
  title: "Pagination",
  component: Pagination,
  parameters: {
    controls: { hideNoControlsWarning: true },
  },
};

export const basic = () => {
  return (
    <div className="flex space-x-2">
      <Pagination
        color="primary"
        onChange={console.log}
        current={3}
        total={25}
      />
    </div>
  );
};

export const solid = () => {
  return (
    <div className="flex space-x-2">
      <Pagination
        color="primary"
        onChange={console.log}
        total={100}
      />
    </div>
  );
};

export const light = () => {
  return (
    <div className="flex space-x-2">
      Light
    </div>
  );
};

export const size = () => {
  return (
    <div className="flex space-x-2">
      Sizes
    </div>
  );
};
