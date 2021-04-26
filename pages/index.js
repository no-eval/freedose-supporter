import { Head } from "components/head";
import { Fragment } from "react";

export default function Home() {
  return (
    <Fragment>
      <Head title="Supporter / Freedose" />
      <p className="text-lg text-indigo-500">Welcome to the supporter's app!</p>
    </Fragment>
  );
}
